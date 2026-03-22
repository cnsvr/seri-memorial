# 🐾 Şeri Memorial

Şeri için yapılmış anı sayfası. Her gün farklı bir fotoğraf veya video gösterir.

## Kurulum

### 1. Cloudinary Hesabı (Ücretsiz)

1. https://cloudinary.com → Free hesap aç
2. Dashboard'dan şunları kopyala:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Environment Variables

`.env.example` dosyasını `.env.local` olarak kopyala ve doldur:

```bash
cp .env.example .env.local
```

Sonra `.env.local` dosyasını düzenle.

### 3. Local Çalıştırma

```bash
npm install
npm run dev
```

→ http://localhost:3000

### 4. Vercel Deploy (Ücretsiz)

1. Kodu GitHub'a push et
2. https://vercel.com → GitHub reposunu import et
3. Environment variables'ları Vercel dashboard'dan ekle
4. Deploy!

## Kullanım

- **Ana sayfa:** `/` — Günün anısı
- **Admin:** `/admin` — Fotoğraf/video yükle, sil

## Özellikler

- ✅ Her gün farklı bir medya (gün boyunca sabit)
- ✅ Fotoğraf ve video desteği
- ✅ Drag & drop yükleme
- ✅ Şifre korumalı admin
- ✅ Ücretsiz (Cloudinary + Vercel)
