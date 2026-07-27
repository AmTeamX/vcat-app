import { generateSessionToken, hashPassword, serializeSessionCookie } from '@/lib/auth';
import { getDB, createRecord } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, registrationCode } = await request.json();

        if (!name || !email || !password || !registrationCode) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' },
                { status: 400 }
            );
        }

        const db = await getDB();

        // Check if registration code exists and has remaining uses
        const codeResult: any = await db.query(
            'SELECT * FROM registration_codes WHERE code = $code AND current_uses < max_uses',
            { code: registrationCode }
        );

        const codes = codeResult[0];

        if (!codes || codes.length === 0) {
            return NextResponse.json(
                { error: 'รหัสลงทะเบียนไม่ถูกต้องหรือถูกใช้งานครบแล้ว' },
                { status: 400 }
            );
        }

        const registrationCodeRecord = codes[0];

        // Check if email already exists
        const emailCheckResult: any = await db.query(
            'SELECT * FROM doctors WHERE email = $email',
            { email }
        );

        const existingDoctors = emailCheckResult[0];

        if (existingDoctors && existingDoctors.length > 0) {
            return NextResponse.json(
                { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create doctor account
        const newDoctorResult: any = await createRecord('doctors', {
            name,
            email,
            password_hash: passwordHash,
        });

        const newDoctor = Array.isArray(newDoctorResult) ? newDoctorResult[0] : newDoctorResult;

        // Increment registration code usage count
        await db.query(
            'UPDATE $codeId SET current_uses += 1, is_used = (current_uses + 1 >= max_uses), used_by = $doctorId, used_at = time::now()',
            {
                codeId: registrationCodeRecord.id,
                doctorId: newDoctor.id,
            }
        );

        // Create session
        const sessionToken = generateSessionToken();

        await createRecord('sessions', {
            doctor_id: newDoctor.id,
            session_token: sessionToken,
        });

        // Set session cookie
        const cookie = serializeSessionCookie(sessionToken);

        // Return doctor info (without password)
        const { password_hash, ...doctorData } = newDoctor;

        return NextResponse.json(
            {
                message: 'ลงทะเบียนสำเร็จ',
                doctor: doctorData
            },
            {
                status: 201,
                headers: {
                    'Set-Cookie': cookie,
                },
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
            { status: 500 }
        );
    }
}
