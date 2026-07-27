import { getSessionFromCookie } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function getDoctorFromSession(request: NextRequest) {
  try {
    const sessionToken = getSessionFromCookie(request.headers.get('cookie'));

    if (!sessionToken) {
      console.log('[Session] No session cookie found');
      return null;
    }

    const db = await getDB();
    const result: any = await db.query(
      'SELECT doctor_id FROM sessions WHERE session_token = $session_token',
      { session_token: sessionToken }
    );

    const sessions = result[0];
    if (!sessions || sessions.length === 0) {
      console.log('[Session] Session token not found in DB');
      return null;
    }

    console.log('[Session] Doctor found:', sessions[0].doctor_id);
    return sessions[0].doctor_id;
  } catch (error) {
    console.error('[Session] Error getting doctor from session:', error);
    throw error;
  }
}
