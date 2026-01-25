import { getSessionFromCookie } from '@/lib/auth';
import { getDB } from '@/lib/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public access to login page and API routes
    if (pathname === '/login' || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Check for session cookie
    const sessionToken = getSessionFromCookie(request.headers.get('cookie'));

    if (!sessionToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // Verify session exists in database
        const db = await getDB();
        const result: any = await db.query(
            'SELECT * FROM sessions WHERE session_token = $session_token',
            { session_token: sessionToken }
        );

        const sessions = result[0];

        if (!sessions || sessions.length === 0) {
            // Invalid session, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Session is valid, allow access
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
