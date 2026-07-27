import { getSessionFromCookie } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public access to login, register pages and API routes
    if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Allow static assets and public files
    if (pathname.startsWith('/_next') || pathname.startsWith('/public') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // Check for session cookie (no DB call — Edge Runtime compatible)
    // Actual session validation is done by API routes (/api/auth/me)
    const sessionToken = getSessionFromCookie(request.headers.get('cookie'));

    if (!sessionToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
