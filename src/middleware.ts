import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const path = request.nextUrl.pathname;
  headers.set('x-portfolio-locale', path === '/ja' || path.startsWith('/ja/') ? 'ja' : 'en');
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/((?!api|_next|.*\\.).*)'] };
