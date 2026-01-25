import { getDB } from '@/lib/db';
import { getDoctorFromSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

// Route: /api/test-sessions/[id]/answers
// GET: Fetch all answers for a test session
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

        // Verify session belongs to doctor
        const sessionResult: any = await db.query(
            'SELECT * FROM $sqSessionId',
            { sqSessionId }
        );


        if (!sessionResult[0] || sessionResult[0].length === 0) {
            return NextResponse.json({ error: 'Test session not found' }, { status: 404 });
        }

        // Fetch all answers for this session
        const answers = await db.query(
            `SELECT * FROM test_answers 
            WHERE session_id = $sqSessionId 
            ORDER BY question_index ASC`,
            { sqSessionId }
        );


        return NextResponse.json({ answers: answers[0] || [] });
    } catch (error) {
        console.error('Error fetching test answers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Save individual answer
export async function POST(
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

        const { id: rawSessionId } = await params;
        const sessionId = new RecordId(rawSessionId.split(':')[0], rawSessionId.split(':')[1]);

        const { questionIndex, questionText, answer, score, responseTime } = await request.json();

        const db = await getDB();

        // First, check if session exists at all
        const checkSession: any = await db.query(
            'SELECT * FROM test_sessions WHERE id = $sessionId',
            { sessionId }
        );

        // Verify session exists and belongs to doctor
        const sessionResult: any = await db.query(
            'SELECT * FROM $sessionId WHERE doctor_id = $doctorId',
            { sessionId, doctorId }
        );

        if (!sessionResult[0] || sessionResult[0].length === 0) {
            return NextResponse.json(
                { error: 'Test session not found' },
                { status: 404 }
            );
        }

        // Save answer
        const testAnswer = await db.create('test_answers', {
            session_id: sessionId,
            question_index: questionIndex,
            question_text: questionText,
            answer: JSON.stringify(answer),
            score: score || 0,
            response_time: responseTime || 0,
        });

        return NextResponse.json({ answer: testAnswer }, { status: 201 });
    } catch (error) {
        console.error('Save answer error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
