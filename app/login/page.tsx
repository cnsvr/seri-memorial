'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      const from = params.get('from') || '/admin';
      router.push(from);
    } else {
      setError('Şifre yanlış.');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-[family-name:var(--font-playfair)] text-[#c9a96e] text-center mb-8">
          Şeri Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full bg-[#161412] border border-[#2a2520] rounded-lg px-4 py-3 text-[#f5f0e8] placeholder:text-[#4a4540] focus:outline-none focus:border-[#c9a96e] transition-colors"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a96e] text-[#0a0a0a] font-semibold py-3 rounded-lg hover:bg-[#d4b97e] transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş...' : 'Giriş Yap'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/" className="text-[#4a4540] text-sm hover:text-[#c9a96e] transition-colors">
            ← Ana sayfa
          </a>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
