import { getSessionFromCookie } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function getDoctorFromSession(request: NextRequest) {
    const sessionToken = getSessionFromCookie(request.headers.get('cookie'));

    if (!sessionToken) {
        return null;
    }

    const db = await getDB();
    const result: any = await db.query(
        'SELECT doctor_id FROM sessions WHERE session_token = $session_token',
        { session_token: sessionToken }
    );

    const sessions = result[0];
    if (!sessions || sessions.length === 0) {
        return null;
    }

    return sessions[0].doctor_id;
}
