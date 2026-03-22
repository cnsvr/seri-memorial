'use client';

import { useEffect, useState } from 'react';
import type { MediaItem } from '@/lib/cloudinary';

export default function Home() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data) => {
        setMedia(data.daily || null);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-[#f5f0e8] relative overflow-hidden">
      {/* Soft vignette */}
      <div className="pointer-events-none fixed inset-0 bg-radial-gradient" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)'
      }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-20">
        <div>
          <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-[#f5f0e8]">Şeri</h1>
          <p className="text-xs tracking-widest text-[#8a7f72] mt-0.5">2008 — 2024</p>
        </div>
        <p className="text-sm text-[#6b6259] tracking-wider">{today}</p>
      </header>

      {/* Media area */}
      <div className="relative w-full max-w-3xl mx-auto px-4 flex items-center justify-center min-h-screen">
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border border-[#8a7f72] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#6b6259] tracking-widest">yükleniyor...</p>
          </div>
        )}

        {!loading && (error || !media) && (
          <div className="text-center space-y-4">
            <p className="text-4xl">🐾</p>
            <p className="text-[#8a7f72] tracking-wider">
              {error ? 'Bir hata oluştu.' : 'Henüz hiç anı yüklenmemiş.'}
            </p>
            <a href="/admin" className="text-xs text-[#6b6259] hover:text-[#8a7f72] transition-colors underline underline-offset-4">
              Admin sayfasına git →
            </a>
          </div>
        )}

        {!loading && media && (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {media.resource_type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.secure_url}
                  alt="Şeri"
                  className="w-full h-auto max-h-[75vh] object-contain bg-[#111]"
                />
              ) : (
                <video
                  src={media.secure_url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-auto max-h-[75vh] bg-[#111]"
                  playsInline
                />
              )}
            </div>
            <p className="text-xs text-[#4a4238] tracking-[0.2em] uppercase">
              bugünün anısı
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-20">
        <a
          href="/admin"
          className="text-xs text-[#3a3530] hover:text-[#6b6259] transition-colors tracking-widest"
        >
          ···
        </a>
      </footer>
    </main>
  );
}
