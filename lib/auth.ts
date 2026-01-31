import bcrypt from 'bcryptjs';
import { parse, serialize } from 'cookie';
import { nanoid } from 'nanoid';

const SALT_ROUNDS = 10;
const SESSION_COOKIE_NAME = 'vcat_session';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
    return nanoid(32);
}

export function serializeSessionCookie(sessionId: string): string {
    return serialize(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 5, // 5 days
        path: '/',
    });
}

export function clearSessionCookie(): string {
    return serialize(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
}

export function getSessionFromCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    const cookies = parse(cookieHeader);
    return cookies[SESSION_COOKIE_NAME] || null;
}
