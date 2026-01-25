import { generateSessionToken, serializeSessionCookie, verifyPassword } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const db = await getDB();

        // Find doctor by email
        const result: any = await db.query(
            'SELECT * FROM doctors WHERE email = $email',
            { email }
        );

        const doctors = result[0];

        if (!doctors || doctors.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const doctor = doctors[0];

        // Verify password
        const isValid = await verifyPassword(password, doctor.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        const sessionToken = generateSessionToken();

        await db.create('sessions', {
            doctor_id: doctor.id,
            session_token: sessionToken,
        });

        // Set session cookie
        const cookie = serializeSessionCookie(sessionToken);

        // Return doctor info (without password)
        const { password_hash, ...doctorData } = doctor;

        return NextResponse.json(
            { doctor: doctorData },
            {
                status: 200,
                headers: {
                    'Set-Cookie': cookie,
                },
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
