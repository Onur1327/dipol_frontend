import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { getCorsHeaders } from '@/lib/cors';
import { initializePayment } from '@/lib/iyzipay';
import Order from '@/models/Order';
import Product from '@/models/Product';
import crypto from 'crypto';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { 
          status: 401,
          headers: getCorsHeaders(request),
        }
      );
    }

    await connectDB();

    const body = await request.json();
    const { 
      items, 
      shippingAddress, 
      contactInfo, 
      paymentCard,
      totalPrice, 
      shippingCost 
    } = body;

    // Stok kontrolü ve toplam fiyat hesaplama
    let calculatedTotal = 0;
    const basketItems: any[] = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Ürün bulunamadı: ${item.product}` },
          { 
            status: 404,
            headers: getCorsHeaders(request),
          }
        );
      }

      // Stok kontrolü
      if (item.color && item.size && product.colorSizeStock) {
        const colorStock = product.colorSizeStock instanceof Map 
          ? product.colorSizeStock.get(item.color)
          : (product.colorSizeStock as any)[item.color];
        
        if (colorStock) {
          const sizeStock = colorStock instanceof Map
            ? colorStock.get(item.size)
            : (colorStock as any)[item.size];
            
          if (sizeStock === undefined || sizeStock < item.quantity) {
            return NextResponse.json(
              { error: `${product.name} (${item.color}, ${item.size}) için yeterli stok yok` },
              { 
                status: 400,
                headers: getCorsHeaders(request),
              }
            );
          }
        }
      } else if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} için yeterli stok yok` },
          { 
            status: 400,
            headers: getCorsHeaders(request),
          }
        );
      }

      calculatedTotal += product.price * item.quantity;

      // Basket items oluştur
      basketItems.push({
        id: product._id.toString(),
        name: product.name,
        category1: 'Giyim',
        itemType: 'PHYSICAL',
        price: (product.price * item.quantity).toFixed(2),
      });
    }

    const finalTotal = (totalPrice || calculatedTotal) + (shippingCost || 0);

    // Geçici sipariş oluştur (pending durumunda)
    const tempOrder = await Order.create({
      user: user.userId,
      items: items.map((item: any) => ({
        product: item.product,
        name: item.name,
        image: item.image || '',
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shippingAddress,
      contactInfo,
      paymentMethod: 'credit-card',
      totalPrice: finalTotal,
      shippingCost: shippingCost || 0,
      orderStatus: 'pending',
      paymentStatus: 'pending',
    });

    // İyzico ödeme başlatma
    const paymentData = {
      price: finalTotal.toFixed(2),
      paidPrice: finalTotal.toFixed(2),
      currency: 'TRY',
      basketId: tempOrder._id.toString(),
      paymentCard: {
        cardHolderName: paymentCard.cardHolderName,
        cardNumber: paymentCard.cardNumber.replace(/\s/g, ''),
        expireMonth: paymentCard.expireMonth,
        expireYear: paymentCard.expireYear,
        cvc: paymentCard.cvc,
        registerCard: 0,
      },
      buyer: {
        id: user.userId,
        name: shippingAddress.name.split(' ')[0] || shippingAddress.name,
        surname: shippingAddress.name.split(' ').slice(1).join(' ') || '',
        gsmNumber: contactInfo.phone.replace(/\D/g, ''),
        email: contactInfo.email,
        identityNumber: '11111111111', // TC Kimlik No (test için)
        registrationAddress: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country || 'Türkiye',
        zipCode: shippingAddress.postalCode,
      },
      shippingAddress: {
        contactName: shippingAddress.name,
        city: shippingAddress.city,
        country: shippingAddress.country || 'Türkiye',
        address: shippingAddress.address,
        zipCode: shippingAddress.postalCode,
      },
      billingAddress: {
        contactName: shippingAddress.name,
        city: shippingAddress.city,
        country: shippingAddress.country || 'Türkiye',
        address: shippingAddress.address,
        zipCode: shippingAddress.postalCode,
      },
      basketItems,
    };

    const paymentResult: any = await initializePayment(paymentData);

    if (paymentResult.status === 'success') {
      // Ödeme başarılı - sipariş durumunu güncelle
      await Order.findByIdAndUpdate(tempOrder._id, {
        paymentStatus: 'paid',
        orderStatus: 'processing',
      });

      // Stok güncelleme
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        if (item.color && item.size && product.colorSizeStock) {
          if (product.colorSizeStock instanceof Map) {
            const colorStock = product.colorSizeStock.get(item.color);
            if (colorStock) {
              const currentStock = colorStock.get(item.size) || 0;
              colorStock.set(item.size, Math.max(0, currentStock - item.quantity));
              product.colorSizeStock.set(item.color, colorStock);
              await product.save();
            }
          } else {
            const colorStock = (product.colorSizeStock as any)[item.color];
            if (colorStock) {
              const currentStock = colorStock[item.size] || 0;
              colorStock[item.size] = Math.max(0, currentStock - item.quantity);
              (product.colorSizeStock as any)[item.color] = colorStock;
              await product.save();
            }
          }
        } else {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      const populatedOrder = await Order.findById(tempOrder._id)
        .populate('user', 'name email')
        .populate('items.product', 'name images')
        .lean();

      return NextResponse.json({
        success: true,
        order: populatedOrder,
        payment: paymentResult,
      }, {
        headers: getCorsHeaders(request),
      });
    } else {
      // Ödeme başarısız - siparişi iptal et
      await Order.findByIdAndUpdate(tempOrder._id, {
        paymentStatus: 'failed',
      });

      return NextResponse.json(
        { 
          error: paymentResult.errorMessage || 'Ödeme işlemi başarısız',
          details: paymentResult,
        },
        { 
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }
  } catch (error: any) {
    console.error('Ödeme başlatma hatası:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Ödeme işlemi başlatılamadı',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

