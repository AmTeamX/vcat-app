import { getDB, createRecord } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

// GET: Fetch all test sessions for the authenticated doctor
export async function GET(request: NextRequest) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDB();

        // Fetch all test sessions with patient information
        const sessions = await db.query<any[]>(
            `SELECT 
                id,
                patient_id,
                status,
                total_score,
                duration,
                started_at,
                completed_at,
                patient_id.name AS patient_name
            FROM test_sessions 
            WHERE doctor_id = $doctorId 
            AND status = 'completed'
            ORDER BY started_at DESC`,
            { doctorId }
        );

        return NextResponse.json({ sessions: sessions[0] || [] });
    } catch (error) {
        console.error('Error fetching test sessions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create new test session
export async function POST(request: NextRequest) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { patientId } = await request.json();

        if (!patientId) {
            return NextResponse.json(
                { error: 'Patient ID is required' },
                { status: 400 }
            );
        }
        const stringPatientId = new RecordId(patientId.split(":")[0], patientId.split(":")[1]);


        const db = await getDB();

        // Verify patient exists and belongs to doctor
        const patientResult: any = await db.query(
            'SELECT * FROM patients WHERE id = $stringPatientId AND doctor_id = $doctorId',
            { stringPatientId, doctorId }
        );

        if (!patientResult[0] || patientResult[0].length === 0) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        // Create test session
        const session = await createRecord('test_sessions', {
            patient_id: stringPatientId,
            doctor_id: doctorId,
            status: 'in_progress',
            total_score: 0,
            duration: 0,
        });

        return NextResponse.json({ session }, { status: 201 });
    } catch (error) {
        console.error('Create test session error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
