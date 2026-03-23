import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isAuthApi = req.nextUrl.pathname.startsWith('/api/auth');

  if (isAdminPage && !isAuthApi) {
    const auth = req.cookies.get('seri-auth');
    if (auth?.value !== 'true') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
