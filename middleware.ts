import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith('/api') && !/\/api\//.test(pathname)) {
    return NextResponse.rewrite('/404');
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
