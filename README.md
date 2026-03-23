# Şeri Memorial 🐾

Şeri için yapılmış anı sitesi. Her gün rastgele bir fotoğraf veya video gösterir.

## Kurulum

### 1. Cloudinary hesabı aç (ücretsiz)
1. [cloudinary.com](https://cloudinary.com) → Sign up
2. Dashboard'dan şunları kopyala:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. `.env.local` dosyasını düzenle
```
CLOUDINARY_CLOUD_NAME=buraya_yaz
CLOUDINARY_API_KEY=buraya_yaz
CLOUDINARY_API_SECRET=buraya_yaz
ADMIN_PASSWORD=istedigin_sifre
```

### 3. Lokal çalıştır
```bash
npm install
npm run dev
```
→ http://localhost:3000

---

## Deploy (Vercel — Ücretsiz)

### 1. GitHub'a yükle
```bash
git init
git add .
git commit -m "Şeri memorial"
git remote add origin https://github.com/KULLANICI/seri-memorial.git
git push -u origin main
```

### 2. Vercel'e bağla
1. [vercel.com](https://vercel.com) → New Project → GitHub repoyu seç
2. **Environment Variables** kısmına `.env.local` içindeki 4 değişkeni gir
3. Deploy et → Site hazır!

---

## Kullanım

| Sayfa | Ne yapar |
|-------|----------|
| `/` | Ana sayfa — günün medyasını gösterir |
| `/admin` | Fotoğraf/video yükle, sil |
| `/login` | Admin girişi |

### Admin sayfası
- Sürükle-bırak veya tıklayarak yükle
- Birden fazla dosya aynı anda yüklenebilir
- Fotoğraf ve video desteklenir
- Hover yapınca "Sil" butonu çıkar

### Günlük medya seçimi
- Her gün tarih bazlı deterministik rastgele seçim yapılır
- Gün içinde her girişte aynı medya gösterilir
- Gece yarısı yeni güne geçince medya değişir
