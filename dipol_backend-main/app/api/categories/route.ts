import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth';
import { getCorsHeaders } from '@/lib/cors';

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const parentOnly = searchParams.get('parentOnly') === 'true';
    const parentId = searchParams.get('parentId');
    const ids = searchParams.get('ids');

    // Admin kullanıcıları için tüm kategorileri göster, normal kullanıcılar için sadece aktifleri
    let user = null;
    try {
      user = await getCurrentUser(request);
    } catch {
      // Token yoksa veya hata varsa sadece aktif kategorileri göster
    }
    
    const query: any = {};
    
    // Admin değilse sadece aktif kategorileri göster
    if (!user || user.role !== 'admin') {
      query.active = { $ne: false };
    }
    
    if (ids) {
      // IDs parametresi varsa, virgülle ayrılmış ID'leri kullan
      const idArray = ids.split(',').map((id: string) => id.trim()).filter(Boolean);
      if (idArray.length > 0) {
        query._id = { $in: idArray };
      }
    } else if (parentOnly) {
      query.parent = { $exists: false };
    } else if (parentId) {
      query.parent = parentId;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ order: 1, name: 1 })
      .lean();
    
    return NextResponse.json({ categories }, {
      headers: getCorsHeaders(request),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kategoriler getirilemedi' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
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
    
    // parent boş string ise null yap
    if (body.parent === '' || body.parent === null || body.parent === undefined) {
      body.parent = null;
    }
    
    const category = await Category.create(body);

    return NextResponse.json(category, { 
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kategori oluşturulamadı' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

