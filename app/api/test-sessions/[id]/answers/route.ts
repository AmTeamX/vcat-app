import { getDB, createRecord } from '@/lib/db';
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

        // Fetch all answers for this session ordered by question and time (latest first)
        const answersResult = await db.query(
            `SELECT * FROM test_answers 
            WHERE session_id = $sqSessionId 
            ORDER BY question_index ASC, answered_at DESC;`,
            { sqSessionId }
        );

        const allAnswers = answersResult[0] || [];

        // Group by question_index and take only the latest answer for each question
        const latestAnswersMap = new Map<number, any>();

        if (Array.isArray(allAnswers)) {
            for (const answer of allAnswers) {
                // Only add if we haven't seen this question yet (first one is the latest due to DESC order)
                if (!latestAnswersMap.has(answer.question_index)) {
                    latestAnswersMap.set(answer.question_index, answer);
                }
            }
        }

        // Convert map to array and sort by question_index
        const latestAnswers = Array.from(latestAnswersMap.values()).sort(
            (a, b) => a.question_index - b.question_index
        );

        return NextResponse.json({ answers: latestAnswers });
    } catch (error) {
        console.error('Error fetching test answers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update answer score
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctorId = await getDoctorFromSession(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { answerId, score } = await request.json();
        const db = await getDB();

        // Update answer score
        const sqAnswerId = new RecordId(answerId.split(':')[0], answerId.split(':')[1]);

        await db.query(
          'UPDATE $sqAnswerId MERGE { score: $score }',
          { sqAnswerId, score }
        );

        return NextResponse.json({ success: true, message: 'Score updated' });
    } catch (error) {
        console.error('Error updating answer score:', error);
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
        const testAnswer = await createRecord('test_answers', {
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
