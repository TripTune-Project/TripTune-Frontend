import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API 경로만 처리하고 나머지는 그대로 통과
  if (pathname.startsWith('/apis')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/apis/:path*'],
}; 