import { getDB, createRecord } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all patients for logged-in doctor
export async function GET(request: NextRequest) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const db = await getDB();
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');

        let query = 'SELECT * FROM patients WHERE doctor_id = $doctorId';
        const params: any = { doctorId };

        if (search) {
            query += ' AND string::lowercase(name) CONTAINS string::lowercase($search)';
            params.search = search;
        }

        query += ' ORDER BY created_at DESC';

        const result: any = await db.query(query, params);
        const patients = result[0] || [];

        return NextResponse.json({ patients }, { status: 200 });
    } catch (error) {
        console.error('Get patients error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Create new patient
export async function POST(request: NextRequest) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { name, age, gender, notes, medicalConditions } = await request.json();

        if (!name || !age || !gender) {
            return NextResponse.json(
                { error: 'Name, age, and gender are required' },
                { status: 400 }
            );
        }

        const db = await getDB();

        const patient = await createRecord('patients', {
            doctor_id: doctorId,
            name,
            age: Number(age),
            gender,
            notes: notes || '',
            medical_conditions: medicalConditions || '',
        });

        return NextResponse.json({ patient }, { status: 201 });
    } catch (error) {
        console.error('Create patient error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
