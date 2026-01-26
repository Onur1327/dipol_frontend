import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth';
import { getCorsHeaders } from '@/lib/cors';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const query: any = {};
    
    // Admin kullanıcıları için status filtresi yok, tüm ürünleri görebilirler
    // Normal kullanıcılar için sadece aktif ürünleri göster
    let user = null;
    try {
      user = await getCurrentUser(request);
    } catch {
      // Token yoksa veya hata varsa sadece aktif ürünleri göster
    }
    
    if (!user || user.role !== 'admin') {
      query.status = 'active';
    }

    if (category) {
      // Kategori ID'si veya slug'ı ile filtrele
      let categoryId: mongoose.Types.ObjectId | null = null;
      
      if (mongoose.Types.ObjectId.isValid(category)) {
        // Parametre geçerli bir ObjectId ise, doğrudan bunu kullan
        categoryId = new mongoose.Types.ObjectId(category);
      } else {
        // Geçerli bir ObjectId değilse, bunu slug olarak kabul et
        const cat = await Category.findOne({ slug: category }).lean();
        if (cat) {
          categoryId = cat._id;
        }
      }
      
      if (categoryId) {
        // Seçilen kategorinin alt kategorilerini bul
        const subCategories = await Category.find({ 
          parent: categoryId 
        }).select('_id').lean();
        
        // Alt kategori ID'lerini topla
        const categoryIds = [categoryId];
        subCategories.forEach(subCat => {
          categoryIds.push(subCat._id);
        });
        
        // Hem ana kategoriye hem de alt kategorilere atanmış ürünleri göster
        query.category = { $in: categoryIds };
      } else {
        // Kategori bulunamazsa hiç ürün döndürme
        query.category = new mongoose.Types.ObjectId('000000000000000000000000');
      }
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // colorSizeStock Map'lerini object'e dönüştür ve images array'ini kontrol et
    const processedProducts = products.map((product: any) => {
      // Images array'ini kontrol et ve düzelt
      if (!product.images || !Array.isArray(product.images)) {
        product.images = [];
      }
      
      // colorImages Map'ini object'e dönüştür
      if (product.colorImages && product.colorImages instanceof Map) {
        const colorImagesObj: { [color: string]: string[] } = {};
        product.colorImages.forEach((images: string[], color: string) => {
          colorImagesObj[color] = Array.isArray(images) ? images : [];
        });
        product.colorImages = colorImagesObj;
      } else if (product.colorImages && typeof product.colorImages === 'object' && !Array.isArray(product.colorImages)) {
        // Zaten object ise, array kontrolü yap
        Object.keys(product.colorImages).forEach((color: string) => {
          if (!Array.isArray(product.colorImages[color])) {
            product.colorImages[color] = [];
          }
        });
      }
      
      // colorSizeStock Map'ini object'e dönüştür
      if (product.colorSizeStock && product.colorSizeStock instanceof Map) {
        const colorSizeStockObj: { [color: string]: { [size: string]: number } } = {};
        product.colorSizeStock.forEach((sizeMap: Map<string, number>, color: string) => {
          if (sizeMap instanceof Map) {
            colorSizeStockObj[color] = Object.fromEntries(sizeMap);
          } else {
            colorSizeStockObj[color] = sizeMap;
          }
        });
        product.colorSizeStock = colorSizeStockObj;
      }
      return product;
    });

    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      products: processedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, {
      headers: getCorsHeaders(request),
    });
  } catch (error: any) {
    // Hatanın sebebini terminalde görebilmek için logla
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: error?.message || 'Ürünler getirilemedi' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'admin') {
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
    
    // Slug unique kontrolü ve otomatik slug oluşturma
    if (body.slug) {
      let baseSlug = body.slug.toLowerCase().trim();
      // Türkçe karakterleri değiştir ve özel karakterleri temizle
      baseSlug = baseSlug
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Slug unique kontrolü - eğer varsa sonuna sayı ekle
      let finalSlug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug: finalSlug })) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      body.slug = finalSlug;
    } else if (body.name) {
      // Slug yoksa name'den oluştur
      let baseSlug = body.name.toLowerCase().trim();
      baseSlug = baseSlug
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Slug unique kontrolü
      let finalSlug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug: finalSlug })) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      body.slug = finalSlug;
    }
    
    // colorImages'ı Map formatına dönüştür
    if (body.colorImages && typeof body.colorImages === 'object' && !(body.colorImages instanceof Map)) {
      const colorImagesMap = new Map();
      Object.entries(body.colorImages).forEach(([color, images]) => {
        colorImagesMap.set(color, images);
      });
      body.colorImages = colorImagesMap;
    }
    
    // colorSizeStock'u Map formatına dönüştür
    if (body.colorSizeStock && typeof body.colorSizeStock === 'object' && !(body.colorSizeStock instanceof Map)) {
      const colorSizeStockMap = new Map();
      Object.entries(body.colorSizeStock).forEach(([color, sizeMap]: [string, any]) => {
        if (sizeMap && typeof sizeMap === 'object') {
          const sizeMapObj = new Map();
          Object.entries(sizeMap).forEach(([size, stock]: [string, any]) => {
            sizeMapObj.set(size, stock);
          });
          colorSizeStockMap.set(color, sizeMapObj);
        }
      });
      body.colorSizeStock = colorSizeStockMap;
    }
    
    // Images array'ini kontrol et ve düzelt
    if (!body.images || !Array.isArray(body.images)) {
      body.images = [];
    } else {
      // Boş string'leri filtrele
      body.images = body.images.filter((img: string) => img && img.trim().length > 0);
    }
    
    // Eğer images boşsa ama colorImages varsa, ilk colorImages'dan bir görsel al
    if (body.images.length === 0 && body.colorImages && typeof body.colorImages === 'object') {
      const colorImagesObj = body.colorImages instanceof Map 
        ? Object.fromEntries(body.colorImages) 
        : body.colorImages;
      const firstColor = Object.keys(colorImagesObj)[0];
      if (firstColor && colorImagesObj[firstColor] && Array.isArray(colorImagesObj[firstColor]) && colorImagesObj[firstColor].length > 0) {
        body.images = [colorImagesObj[firstColor][0]];
      }
    }
    
    console.log('[PRODUCT CREATE] Images:', body.images);
    console.log('[PRODUCT CREATE] ColorImages:', body.colorImages);
    
    const product = await Product.create(body);

    return NextResponse.json(product, { 
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ürün oluşturulamadı' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

