import { getDB } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

// GET: Fetch all test sessions for a specific patient
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: patientId } = await params;
        const db = await getDB();

        const sqPatientId = new RecordId(patientId.split(':')[0], patientId.split(':')[1]);



        const patientResult: any = await db.query(
            'SELECT * FROM patients WHERE id = $sqPatientId',
            { sqPatientId }
        );


        if (!patientResult[0] || patientResult[0].length === 0) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // Fetch all test sessions for this patient
        const sessions = await db.query<any[]>(
            `SELECT 
                id,
                patient_id,
                status,
                total_score,
                duration,
                started_at,
                completed_at
            FROM test_sessions 
            WHERE patient_id = $sqPatientId
            AND status = 'completed'
            ORDER BY started_at DESC`,
            { sqPatientId }
        );

        return NextResponse.json({ sessions: sessions[0] || [] });
    } catch (error) {
        console.error('Error fetching patient test sessions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
