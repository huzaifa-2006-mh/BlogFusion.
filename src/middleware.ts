import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware: Per-request CSP nonce injection
 *
 * Replaces `script-src 'unsafe-inline'` with a cryptographic nonce,
 * satisfying the Lighthouse / PageSpeed "Trust & Safety" CSP warning.
 *
 * The nonce is forwarded to the page via a response header
 * (`x-nonce`) so that server components can read it and add it
 * to any inline <script> tags they render.
 */
export function middleware(request: NextRequest) {
  // Skip static assets and Next.js internals — no CSP needed there
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|webp|svg|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next();
  }

  // Generate a fresh random nonce for every HTML response
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');

  const csp = [
    "default-src 'self'",
    // nonce covers Next.js inline scripts; host allowlist covers external GTM/GA
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com`,
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
  // Pass nonce to server components via a request header
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Set the nonce-based CSP on the response
  response.headers.set('Content-Security-Policy', csp);

  // Copy through other security headers (not duplicating what next.config sets,
  // but ensuring they are present on this response object too)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  // Run on all routes except static files and API routes that don't serve HTML
  matcher: [
    '/((?!_next/static|_next/image|favicon|api/|.*\\.(?:ico|png|jpg|jpeg|webp|svg|woff|woff2)).*)',
  ],
};
