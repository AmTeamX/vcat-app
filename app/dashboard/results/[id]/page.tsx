'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TestAnswer {
    id: string;
    question_index: number;
    question_text: string;
    answer: string;
    score: number;
    response_time: number;
}

interface TestSession {
    id: string;
    patient_id: string;
    patient_name: string[];
    status: string;
    total_score: number;
    duration: number;
    started_at: string;
    completed_at?: string;
}

export default function ResultDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [session, setSession] = useState<TestSession | null>(null);
    const [answers, setAnswers] = useState<TestAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sessionId) {
            fetchSessionDetails();
        }
    }, [sessionId]);

    const fetchSessionDetails = async () => {
        try {
            // Fetch session details
            const sessionRes = await fetch(`/api/test-sessions/${sessionId}`);
            const sessionData = await sessionRes.json();

            if (!sessionRes.ok) {
                setError(sessionData.error || 'Failed to fetch test session');
                setLoading(false);
                return;
            }

            setSession(sessionData.session);

            // Fetch answers
            const answersRes = await fetch(`/api/test-sessions/${sessionId}/answers`);
            const answersData = await answersRes.json();

            if (answersRes.ok) {
                setAnswers(answersData.answers || []);
            }
        } catch (err) {
            console.error('Error fetching session details:', err);
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-4xl text-gray-600">Loading test details...</div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full border-4 border-red-300">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-2xl text-gray-700 mb-8">{error || 'Test session not found'}</p>
                        <button
                            onClick={() => router.push('/dashboard/results')}
                            className="bg-blue-500 text-white px-8 py-5 text-2xl font-bold rounded-2xl border-4 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                        >
                            ← Back to Results
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-5xl font-bold text-blue-600 mb-2">Test Result Details</h1>
                            <p className="text-2xl text-gray-600">
                                Patient: {session.patient_name || 'Unknown'}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/results')}
                            className="bg-gray-500 text-white px-8 py-5 text-2xl font-bold rounded-2xl border-4 border-gray-600 hover:bg-gray-600 transition-all hover:scale-105 active:scale-95"
                        >
                            ← Back to Results
                        </button>
                    </div>
                </div>
            </div>

            {/* Session Summary */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-300">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Test Summary</h2>
                    <div className="grid grid-cols-4 gap-6">
                        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                            <p className="text-xl text-gray-600 mb-2">Total Score</p>
                            <p className="text-5xl font-bold text-blue-600">{session.total_score}</p>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                            <p className="text-xl text-gray-600 mb-2">Duration</p>
                            <p className="text-5xl font-bold text-purple-600">{formatDuration(session.duration)}</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                            <p className="text-xl text-gray-600 mb-2">Started</p>
                            <p className="text-2xl font-bold text-green-600">{formatDate(session.started_at)}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                            <p className="text-xl text-gray-600 mb-2">Status</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {session.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Question-by-Question Breakdown */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Question-by-Question Breakdown</h2>

                    {answers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-2xl text-gray-600">No answers recorded yet</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {answers.map((answer, index) => (
                                <div
                                    key={answer.id}
                                    className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                Question {answer.question_index + 1}
                                            </h3>
                                            <p className="text-xl text-gray-700">{answer.question_text}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-bold text-blue-600 mb-1">
                                                {answer.score}
                                            </div>
                                            <p className="text-sm text-gray-600">points</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <p className="text-sm text-gray-600 mb-1">Answer</p>
                                            <p className="text-lg font-semibold text-gray-800">{answer.answer}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <p className="text-sm text-gray-600 mb-1">Response Time</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {answer.response_time}s
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
