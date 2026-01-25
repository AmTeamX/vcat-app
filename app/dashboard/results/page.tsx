'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function ResultsPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<TestSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/test-sessions');
            const data = await res.json();

            if (res.ok) {
                setSessions(data.sessions || []);
            } else {
                setError(data.error || 'Failed to fetch test results');
            }
        } catch (err) {
            console.error('Error fetching sessions:', err);
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
                <div className="text-4xl text-gray-600">Loading test results...</div>
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
                            <h1 className="text-5xl font-bold text-blue-600 mb-2">Test Results History</h1>
                            <p className="text-2xl text-gray-600">View all completed cognitive assessments</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-gray-500 text-white px-8 py-5 text-2xl font-bold rounded-2xl border-4 border-gray-600 hover:bg-gray-600 transition-all hover:scale-105 active:scale-95"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Results List */}
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="bg-red-100 border-4 border-red-300 rounded-3xl p-8 mb-8">
                        <p className="text-2xl text-red-700">⚠️ {error}</p>
                    </div>
                )}

                {sessions.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl p-12 border-4 border-gray-200 text-center">
                        <div className="text-8xl mb-6">📋</div>
                        <h2 className="text-4xl font-bold text-gray-700 mb-4">No Test Results Yet</h2>
                        <p className="text-2xl text-gray-600">Complete a test to see results here</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => router.push(`/dashboard/results/${session.id}`)}
                                className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-200 hover:border-blue-400 transition-all cursor-pointer hover:scale-[1.02]"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                                            {session.patient_name || 'Unknown Patient'}
                                        </h3>
                                        <p className="text-xl text-gray-600">
                                            📅 {formatDate(session.started_at)}
                                        </p>
                                        <p className="text-xl text-gray-600">
                                            ⏱️ Duration: {formatDuration(session.duration)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-6xl font-bold text-blue-600 mb-2">
                                            {session.total_score}
                                        </div>
                                        <p className="text-xl text-gray-600">Total Score</p>
                                        <div className={`mt-4 px-6 py-3 rounded-2xl text-xl font-bold ${session.status === 'completed'
                                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                            : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                                            }`}>
                                            {session.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
