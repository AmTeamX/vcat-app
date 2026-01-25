import { getDB } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

// GET: Fetch test session details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: sessionId } = await params;
        const db = await getDB();

        const sqSessionId = new RecordId(sessionId.split(':')[0], sessionId.split(':')[1]);

        // Fetch session with patient information
        const sessionResult = await db.query<any[]>(
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
            WHERE id = $sqSessionId;`,
            { sqSessionId }
        );


        if (!sessionResult[0] || sessionResult[0].length === 0) {
            return NextResponse.json({ error: 'Test session not found' }, { status: 404 });
        }

        return NextResponse.json({ session: sessionResult[0][0] });
    } catch (error) {
        console.error('Error fetching test session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Complete test session
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

        const { id: sessionId } = await params;
        const { totalScore, duration } = await request.json();

        const db = await getDB();

        const sqSessionId = new RecordId(sessionId.split(':')[0], sessionId.split(':')[1]);

        // Verify session exists and belongs to doctor
        const sessionResult: any = await db.query(
            'SELECT * FROM test_sessions WHERE id = $sqSessionId',
            { sqSessionId, doctorId }
        );


        if (!sessionResult[0] || sessionResult[0].length === 0) {
            return NextResponse.json(
                { error: 'Test session not found' },
                { status: 404 }
            );
        }

        // Update session
        const session = await db.merge(sqSessionId, {
            status: 'completed',
            total_score: totalScore,
            duration: duration,
            completed_at: new Date(),
        });

        return NextResponse.json({ session }, { status: 200 });
    } catch (error) {
        console.error('Complete test session error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
