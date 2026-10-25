import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy (replaces deprecated middleware in Next.js 16+)
 * 
 * 1. Auth Guard: Redirects unauthenticated users away from /dashboard
 * 2. CSP Nonce: Injects cryptographic per-request nonces for all HTML pages,
 *    satisfying the PageSpeed / Lighthouse Trust & Safety CSP requirements.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Auth guard ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('auth_session');
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ── Skip static assets & Next.js internals ──────────────────────────────
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|webp|svg|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next();
  }

  // ── Generate cryptographic nonce for HTML responses ─────────────────────
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.google-analytics.com https://*.googletagmanager.com https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https:",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "require-trusted-types-for 'script'",
    "trusted-types default 'allow-duplicates'",
    "upgrade-insecure-requests",
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Next.js 16 supports default export or named export `proxy`
export default proxy;

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon|api/|.*\\.(?:ico|png|jpg|jpeg|webp|svg|woff|woff2)).*)',
  ],
};
