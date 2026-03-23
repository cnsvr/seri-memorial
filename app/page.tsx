'use client';

import { useEffect, useState } from 'react';
import type { MediaItem } from '@/lib/cloudinary';

export default function HomePage() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data) => {
        setMedia(data.daily ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] z-10" />

      {/* Media */}
      <div className="relative w-full max-w-3xl mx-auto px-4 flex flex-col items-center z-20">
        {loading && (
          <div className="w-full aspect-[4/3] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && !media && (
          <div className="text-center text-[#8a7a6a] py-24">
            <p className="text-lg font-[family-name:var(--font-playfair)]">
              Henüz fotoğraf ya da video yüklenmedi.
            </p>
          </div>
        )}

        {!loading && media && (
          <div className="w-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(201,169,110,0.15)] border border-[#2a2520]">
            {media.resource_type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.secure_url}
                alt="Şeri"
                className="w-full object-cover max-h-[75vh]"
              />
            ) : (
              <video
                src={media.secure_url}
                controls
                autoPlay
                loop
                playsInline
                className="w-full max-h-[75vh] object-cover"
              />
            )}
          </div>
        )}

        {/* Name & Date */}
        <div className="mt-8 text-center space-y-2">
          <h1 className="text-5xl font-[family-name:var(--font-playfair)] text-[#c9a96e] tracking-wide">
            Şeri
          </h1>
          <p className="text-[#7a6e62] text-sm tracking-widest uppercase font-[family-name:var(--font-inter)]">
            {today}
          </p>
          <p className="text-[#5a5048] text-xs mt-3 italic font-[family-name:var(--font-playfair)]">
            Her gün seninle 🐾
          </p>
        </div>
      </div>

      {/* Subtle footer link to admin */}
      <a
        href="/admin"
        className="fixed bottom-4 right-4 z-30 text-[#3a3530] text-xs hover:text-[#c9a96e] transition-colors duration-300"
      >
        ···
      </a>
    </main>
  );
}
