import { getDB } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

// GET: Fetch single patient
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const patientId = new RecordId(id.split(":")[0], id.split(":")[1]);
        const db = await getDB();

        const result: any = await db.query(
            'SELECT * FROM patients WHERE id = $patientId',
            { patientId }
        );

        if (!result[0] || result[0].length === 0) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ patient: result[0][0] });
    } catch (error) {
        console.error('Get patient error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update patient
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const patientId = new RecordId(id.split(":")[0], id.split(":")[1]);
        const { name, age, gender, notes, medicalConditions } = await request.json();

        if (!name || !age || !gender) {
            return NextResponse.json(
                { error: 'Name, age, and gender are required' },
                { status: 400 }
            );
        }

        const db = await getDB();


        const checkResult: any = await db.query(
            'SELECT * FROM patients WHERE id = $patientId AND doctor_id = $doctorId',
            { patientId, doctorId }
        );

        if (!checkResult[0] || checkResult[0].length === 0) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        // Update patient
        const patient = await db.merge(patientId, {
            name,
            age: Number(age),
            gender,
            notes: notes || '',
            medical_conditions: medicalConditions || '',
        });

        return NextResponse.json({ patient }, { status: 200 });
    } catch (error) {
        console.error('Update patient error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Remove patient
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const db = await getDB();

        // Ensure we construct a valid RecordId
        const patientId = new RecordId(id.split(":")[0], id.split(":")[1]);

        // Verify patient belongs to doctor
        const checkResult: any = await db.query(
            'SELECT * FROM patients WHERE id = $patientId AND doctor_id = $doctorId',
            { patientId, doctorId }
        );

        if (!checkResult[0] || checkResult[0].length === 0) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        // Delete related test answers first
        await db.query(
            'DELETE test_answers WHERE session_id IN (SELECT id FROM test_sessions WHERE patient_id = $patientId)',
            { patientId }
        );

        // Delete related test sessions
        await db.query(
            'DELETE test_sessions WHERE patient_id = $patientId',
            { patientId }
        );

        // Delete patient
        await db.delete(patientId);

        return NextResponse.json(
            { message: 'Patient deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete patient error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
