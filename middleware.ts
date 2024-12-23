import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/apis')) {
    return NextResponse.next();
  }

  return NextResponse.rewrite('/404');
}

export const config = {
  matcher: ['/((?!apis).*)'],
};
