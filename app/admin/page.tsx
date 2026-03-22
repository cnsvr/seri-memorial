'use client';

import { useState, useCallback, useEffect } from 'react';
import type { MediaItem } from '@/lib/cloudinary';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const loadMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const r = await fetch('/api/media/all');
      if (r.status === 401) { setAuthed(false); return; }
      const data = await r.json();
      setMedia(data.media || []);
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    // Check if already authed
    fetch('/api/media/all').then((r) => {
      if (r.ok) { setAuthed(true); r.json().then((d) => setMedia(d.media || [])); }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const r = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setAuthLoading(false);
    if (r.ok) { setAuthed(true); loadMedia(); }
    else setAuthError('Şifre yanlış.');
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
    setMedia([]);
    setPassword('');
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    setUploading(true);
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      setUploadProgress(`Yükleniyor: ${file.name} (${i + 1}/${arr.length})`);
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/upload', { method: 'POST', body: fd });
    }
    setUploading(false);
    setUploadProgress('');
    loadMedia();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`"${item.public_id}" silinsin mi?`)) return;
    await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: item.public_id, resource_type: item.resource_type }),
    });
    loadMedia();
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-sm px-6">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-[#f5f0e8]">Şeri</h1>
            <p className="text-xs tracking-widest text-[#6b6259] mt-1">admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="şifre"
              className="w-full bg-[#111] border border-[#2a2520] rounded-lg px-4 py-3 text-[#f5f0e8] placeholder-[#4a4238] focus:outline-none focus:border-[#5a5048] transition-colors text-sm"
            />
            {authError && <p className="text-red-400/80 text-xs text-center">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#2a2520] hover:bg-[#3a3530] text-[#d5cfc8] py-3 rounded-lg text-sm tracking-widest transition-colors disabled:opacity-50"
            >
              {authLoading ? '...' : 'giriş'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-[#4a4238] hover:text-[#6b6259] transition-colors">
              ← ana sayfaya dön
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8] pb-20">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-5 border-b border-[#1a1510]">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs text-[#4a4238] hover:text-[#6b6259] transition-colors">←</a>
          <h1 className="text-lg font-light tracking-[0.3em] uppercase">Şeri / Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-[#4a4238] hover:text-[#8a7f72] transition-colors tracking-widest"
        >
          çıkış
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-8">
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
            dragOver ? 'border-[#5a5048] bg-[#1a1510]' : 'border-[#2a2520] bg-[#0f0e0c]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-3">
              <div className="w-6 h-6 border border-[#8a7f72] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-[#8a7f72]">{uploadProgress}</p>
            </div>
          ) : (
            <>
              <p className="text-4xl mb-3">🐾</p>
              <p className="text-[#8a7f72] text-sm mb-1">Fotoğraf veya video sürükle & bırak</p>
              <p className="text-[#4a4238] text-xs mb-4">JPG, PNG, GIF, MP4, MOV, vb.</p>
              <label className="cursor-pointer bg-[#2a2520] hover:bg-[#3a3530] text-[#d5cfc8] px-6 py-2.5 rounded-lg text-sm tracking-wider transition-colors inline-block">
                Dosya seç
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {/* Media grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm tracking-[0.2em] uppercase text-[#8a7f72]">
              Anılar ({media.length})
            </h2>
            {loadingMedia && (
              <div className="w-4 h-4 border border-[#8a7f72] border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {media.length === 0 && !loadingMedia && (
            <p className="text-center text-[#4a4238] py-12 text-sm">Henüz hiç anı yok.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((item) => (
              <div
                key={item.public_id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-[#111]"
              >
                {item.resource_type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.secure_url}
                    alt="Şeri"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.secure_url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-900/80 text-red-200 px-3 py-1.5 rounded-lg text-xs"
                  >
                    sil
                  </button>
                </div>
                {/* Video badge */}
                {item.resource_type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/60 text-[#8a7f72] text-xs px-1.5 py-0.5 rounded">
                    ▶
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
