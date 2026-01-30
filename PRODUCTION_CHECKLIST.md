# 🚀 Production'a Geçiş Kontrol Listesi

## 📋 ÖN HAZIRLIK

### 1. Domain Ayarları
- [ ] `www.dipolbutik.com` domain'i Vercel'e bağlı mı?
- [ ] SSL sertifikası aktif mi? (Vercel otomatik yapar)
- [ ] DNS kayıtları doğru mu?

### 2. MongoDB Atlas (Production Database)
- [ ] MongoDB Atlas cluster oluşturuldu mu?
- [ ] Production database connection string hazır mı?
- [ ] Database adı: `dipol-butik`
- [ ] Network Access'te Vercel IP'leri izinli mi? (veya 0.0.0.0/0 - tüm IP'ler)
- [ ] Database User oluşturuldu mu? (username ve password)

---

## 🔧 BACKEND (Vercel) - Environment Variables

Vercel Dashboard → Backend Project → Settings → Environment Variables

### Zorunlu Değişkenler:
```env
# Database
database_url=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Secret (EN AZ 32 KARAKTER, GÜVENLİ BİR DEĞER)
JWT_SECRET=your-super-secure-random-string-at-least-32-characters-long

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (Production)
NEXT_PUBLIC_FRONTEND_URL=https://www.dipolbutik.com
FRONTEND_URL=https://www.dipolbutik.com

# Node Environment
NODE_ENV=production
```

### Önemli Notlar:
- ✅ `JWT_SECRET` mutlaka güvenli ve uzun olmalı (32+ karakter)
- ✅ `database_url` MongoDB Atlas connection string olmalı
- ✅ `SMTP_PASS` Gmail için App Password kullanılmalı (normal şifre değil)
- ✅ Tüm environment variable'lar **Production** environment'ına eklenmeli

---

## 🎨 FRONTEND (Vercel) - Environment Variables

Vercel Dashboard → Frontend Project → Settings → Environment Variables

### Zorunlu Değişkenler:
```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://dipol-backend.vercel.app

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=https://www.dipolbutik.com
```

### Önemli Notlar:
- ✅ `NEXT_PUBLIC_API_URL` backend'in Vercel URL'i olmalı
- ✅ Tüm environment variable'lar **Production** environment'ına eklenmeli

---

## 📦 DEPLOY ADIMLARI

### Backend Deploy:
1. [ ] Backend kodunu GitHub'a push edin
2. [ ] Vercel'de backend projesini açın
3. [ ] Environment Variables'ları ekleyin (yukarıdaki listeye göre)
4. [ ] Deploy butonuna tıklayın veya otomatik deploy bekleyin
5. [ ] Deploy başarılı mı kontrol edin
6. [ ] Backend URL'i not edin: `https://dipol-backend.vercel.app`

### Frontend Deploy:
1. [ ] Frontend kodunu GitHub'a push edin
2. [ ] Vercel'de frontend projesini açın
3. [ ] Environment Variables'ları ekleyin (yukarıdaki listeye göre)
4. [ ] Domain ayarlarını yapın: `www.dipolbutik.com`
5. [ ] Deploy butonuna tıklayın veya otomatik deploy bekleyin
6. [ ] Deploy başarılı mı kontrol edin

---

## ✅ DEPLOY SONRASI KONTROLLER

### 1. Backend Kontrolleri:
- [ ] `https://dipol-backend.vercel.app` açılıyor mu?
- [ ] API endpoint'leri çalışıyor mu? (`/api/products`, `/api/categories`)
- [ ] MongoDB bağlantısı başarılı mı? (Backend logs'da kontrol)
- [ ] JWT token oluşturma çalışıyor mu?

### 2. Frontend Kontrolleri:
- [ ] `https://www.dipolbutik.com` açılıyor mu?
- [ ] SSL sertifikası aktif mi? (https://)
- [ ] Backend API'ye bağlanıyor mu?
- [ ] Ürünler görünüyor mu?
- [ ] Kategoriler görünüyor mu?

### 3. Email Kontrolleri:
- [ ] Yeni kullanıcı kaydı yapın
- [ ] E-posta geliyor mu?
- [ ] E-posta linki `www.dipolbutik.com` gösteriyor mu?
- [ ] E-posta doğrulama çalışıyor mu?

### 4. Admin Panel Kontrolleri:
- [ ] Admin girişi yapılabiliyor mu?
- [ ] Ürün ekleme/düzenleme çalışıyor mu?
- [ ] Kategori yönetimi çalışıyor mu?
- [ ] Sipariş yönetimi çalışıyor mu?

---

## 🔐 GÜVENLİK KONTROLLERİ

- [ ] `JWT_SECRET` güvenli ve uzun mu? (32+ karakter)
- [ ] MongoDB connection string güvenli mi? (şifre içeriyor)
- [ ] SMTP şifresi App Password mu? (Gmail için)
- [ ] HTTPS zorunlu mu? (Vercel otomatik yapar)
- [ ] CORS ayarları doğru mu? (sadece frontend domain'i izinli)

---

## 🐛 SORUN GİDERME

### Backend çalışmıyor:
1. Vercel logs'u kontrol edin
2. Environment variables doğru mu?
3. MongoDB bağlantısı çalışıyor mu?

### Frontend çalışmıyor:
1. Vercel logs'u kontrol edin
2. Environment variables doğru mu?
3. Backend API'ye bağlanabiliyor mu?

### Email gönderilmiyor:
1. SMTP ayarları doğru mu?
2. Gmail App Password kullanılıyor mu?
3. Backend logs'da email hatası var mı?

---

## 📝 ÖNEMLİ NOTLAR

1. **JWT_SECRET**: Production'da mutlaka güvenli bir değer kullanın. Random string generator kullanabilirsiniz.
2. **MongoDB**: Production'da MongoDB Atlas kullanın, local MongoDB değil.
3. **Email**: Gmail kullanıyorsanız App Password oluşturun (normal şifre çalışmaz).
4. **Domain**: `www.dipolbutik.com` domain'i Vercel'e bağlı olmalı.
5. **Environment Variables**: Tüm değişkenler **Production** environment'ına eklenmeli.

---

## 🚀 HIZLI DEPLOY KOMUTLARI

### Backend:
```bash
cd dipol_backend
git add .
git commit -m "Production deploy"
git push origin main
```

### Frontend:
```bash
cd dipol_frontend
git add .
git commit -m "Production deploy"
git push origin main
```

Vercel otomatik olarak deploy edecektir.

---

## ✅ SON KONTROL

Tüm adımları tamamladıktan sonra:
- [ ] Site `www.dipolbutik.com` adresinde çalışıyor
- [ ] Tüm özellikler test edildi
- [ ] Email sistemi çalışıyor
- [ ] Admin paneli çalışıyor
- [ ] Güvenlik kontrolleri yapıldı

**🎉 Production'a geçiş tamamlandı!**

