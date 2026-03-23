'use client';

import { useEffect, useState, useRef, DragEvent } from 'react';
import type { MediaItem } from '@/lib/cloudinary';

export default function AdminPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchMedia() {
    setLoading(true);
    const res = await fetch('/api/media/all');
    if (res.ok) {
      const data = await res.json();
      setMedia(data.media ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMedia();
  }, []);

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    setUploading(true);
    setMessage('');
    let successCount = 0;
    for (const file of fileArray) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) successCount++;
    }
    setUploading(false);
    setMessage(`${successCount} dosya yüklendi ✓`);
    fetchMedia();
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteMedia(item: MediaItem) {
    if (!confirm(`"${item.public_id}" silinsin mi?`)) return;
    const res = await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: item.public_id, resource_type: item.resource_type }),
    });
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m.public_id !== item.public_id));
    }
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/';
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-playfair)] text-[#c9a96e]">
            Şeri Admin
          </h1>
          <p className="text-[#5a5048] text-sm mt-1">{media.length} medya dosyası</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            className="px-4 py-2 text-sm border border-[#2a2520] rounded-lg text-[#8a7a6a] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
          >
            Ana sayfa
          </a>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm border border-[#2a2520] rounded-lg text-[#8a7a6a] hover:border-red-800 hover:text-red-400 transition-colors"
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-8 ${
          dragOver
            ? 'border-[#c9a96e] bg-[#c9a96e10]'
            : 'border-[#2a2520] hover:border-[#4a4038] bg-[#111008]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-[#c9a96e]">
            <div className="w-5 h-5 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
            <span>Yükleniyor...</span>
          </div>
        ) : (
          <>
            <p className="text-4xl mb-3">📸</p>
            <p className="text-[#8a7a6a]">
              Fotoğraf veya video yükle
            </p>
            <p className="text-[#4a4540] text-sm mt-1">
              Sürükle bırak veya tıkla — birden fazla dosya desteklenir
            </p>
          </>
        )}
      </div>

      {message && (
        <p className="text-green-400 text-sm text-center mb-6">{message}</p>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <p className="text-center text-[#4a4540] py-16">Henüz medya yok.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {media.map((item) => (
            <div
              key={item.public_id}
              className="group relative rounded-xl overflow-hidden bg-[#161412] border border-[#1e1a16] aspect-square"
            >
              {item.resource_type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.secure_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.secure_url}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => deleteMedia(item)}
                  className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sil
                </button>
              </div>
              {/* Video badge */}
              {item.resource_type === 'video' && (
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  ▶
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
