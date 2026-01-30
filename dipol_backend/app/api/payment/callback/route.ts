import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getCorsHeaders } from '@/lib/cors';
import Order from '@/models/Order';
import crypto from 'crypto';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

// İyzico callback signature doğrulama
function verifyIyzicoSignature(
  signature: string,
  randomString: string,
  requestString: string,
  secretKey: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(randomString + requestString)
    .digest('base64');
  
  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      paymentId,
      paymentStatus,
      conversationId, // basketId (orderId)
      status,
      errorMessage,
      // İyzico callback'den gelen diğer alanlar
    } = body;

    // Signature doğrulama (iyzico callback'den gelen header'lar)
    const signature = request.headers.get('x-iyzi-signature');
    const randomString = request.headers.get('x-iyzi-rnd');
    const requestString = JSON.stringify(body);
    const secretKey = process.env.IYZICO_SECRET_KEY || '';

    if (signature && randomString && secretKey) {
      const isValid = verifyIyzicoSignature(signature, randomString, requestString, secretKey);
      if (!isValid) {
        console.error('İyzico callback signature doğrulama başarısız');
        return NextResponse.json(
          { error: 'Geçersiz signature' },
          { 
            status: 401,
            headers: getCorsHeaders(request),
          }
        );
      }
    }

    // Siparişi bul
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Sipariş ID bulunamadı' },
        { 
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    const order = await Order.findById(conversationId);
    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { 
          status: 404,
          headers: getCorsHeaders(request),
        }
      );
    }

    // Ödeme durumunu güncelle
    if (status === 'success' || paymentStatus === 'SUCCESS') {
      await Order.findByIdAndUpdate(conversationId, {
        paymentStatus: 'paid',
        orderStatus: 'processing',
        paymentId: paymentId,
        paymentDetails: body, // İyzico'dan gelen tüm detayları sakla
      });
    } else {
      await Order.findByIdAndUpdate(conversationId, {
        paymentStatus: 'failed',
        paymentId: paymentId,
        paymentDetails: body,
        paymentError: errorMessage || 'Ödeme başarısız',
      });
    }

    return NextResponse.json(
      { success: true, message: 'Callback işlendi' },
      { 
        headers: getCorsHeaders(request),
      }
    );
  } catch (error: any) {
    console.error('İyzico callback hatası:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Callback işlenemedi',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

