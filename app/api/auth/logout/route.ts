import { clearSessionCookie, getSessionFromCookie } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const sessionToken = getSessionFromCookie(request.headers.get('cookie'));

        if (sessionToken) {
            const db = await getDB();

            // Delete session from database
            await db.query('DELETE FROM sessions WHERE token = $session_token', {
                session_token: sessionToken,
            });
        }

        // Clear session cookie
        const cookie = clearSessionCookie();

        return NextResponse.json(
            { message: 'Logged out successfully' },
            {
                status: 200,
                headers: {
                    'Set-Cookie': cookie,
                },
            }
        );
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
