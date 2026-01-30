# Dipol Butik - Frontend

Kadın giyim e-ticaret sitesi için Next.js tabanlı frontend uygulaması.

## Özellikler

- Modern ve responsive tasarım
- Ürün listeleme ve detay sayfaları
- Sepet yönetimi
- Kullanıcı authentication
- Admin paneli
- Kategori filtreleme
- Arama özelliği

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.local` dosyasını oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

3. Development server'ı başlatın:
```bash
npm run dev
```

Frontend `http://localhost:3001` adresinde çalışacaktır.

## Proje Yapısı

- `app/` - Next.js App Router sayfaları
- `components/` - React componentleri
- `contexts/` - React Context API (Auth, Cart)
- `lib/` - Yardımcı fonksiyonlar ve API client

## Sayfalar

- `/` - Ana sayfa
- `/urunler` - Ürün listesi
- `/urunler/[slug]` - Ürün detay
- `/kategoriler` - Kategori listesi
- `/sepet` - Sepet
- `/giris` - Giriş
- `/kayit` - Kayıt
- `/hesabim` - Kullanıcı hesabı
- `/siparisler` - Siparişler
- `/admin` - Admin paneli

## Teknolojiler

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 3.4.1
- React Context API
