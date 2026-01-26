import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
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
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Doğrulama token\'ı bulunamadı' },
        { 
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    // Token ile kullanıcıyı bul
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: new Date() }, // Token süresi dolmamış olmalı
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz veya süresi dolmuş doğrulama token\'ı' },
        { 
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    // Email'i doğrula
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'E-posta adresiniz başarıyla doğrulandı' },
      {
        headers: getCorsHeaders(request),
      }
    );
  } catch (error: any) {
    console.error('Email doğrulama hatası:', error);
    return NextResponse.json(
      { error: error.message || 'E-posta doğrulanamadı' },
      { 
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

