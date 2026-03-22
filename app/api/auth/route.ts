import { NextRequest, NextResponse } from 'next/server';
import { checkPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (checkPassword(password)) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('seri-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return res;
  }
  return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('seri-auth');
  return res;
}
