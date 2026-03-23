import { NextRequest, NextResponse } from 'next/server';
import { checkPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('seri-auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('seri-auth');
  return res;
}
