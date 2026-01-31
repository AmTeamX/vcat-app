'use client';

import TestRunner from '@/components/TestRunner';
import { questions } from '@/data/questions';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function TestPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [finalDuration, setFinalDuration] = useState(0);

    useEffect(() => {
        console.log('useEffect triggered, patientId:', patientId);
        if (!patientId) {
            setError('No patient selected');
            setLoading(false);
            return;
        }

        // Create test session
        createTestSession();
    }, []);

    const createTestSession = async () => {
        try {
            console.log('Creating test session for patient:', patientId);
            const res = await fetch('/api/test-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId }),
            });

            const data = await res.json();
            console.log('Test session response:', data);

            if (res.ok) {
                // Handle both array and object response
                const session = Array.isArray(data.session) ? data.session[0] : data.session;
                console.log('Session ID:', session?.id);
                setSessionId(session?.id || null);
                setLoading(false);
            } else {
                setError(data.error || 'Failed to create test session');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error creating test session:', err);
            setError('An error occurred');
            setLoading(false);
        }
    };

    const handleTestComplete = async (totalScore: number, duration: number) => {
        if (!sessionId) return;

        try {
            // Update session with final results
            await fetch(`/api/test-sessions/${encodeURIComponent(sessionId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalScore, duration }),
            });

            setFinalScore(totalScore);
            setFinalDuration(duration);
            setCompleted(true);
        } catch (error) {
            console.error('Error completing test:', error);
        }
    };

    const handleBackToDashboard = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="relative inline-block mb-8">
                        <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-24 h-24 border-8 border-transparent border-b-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                    </div>
                    <div className="text-4xl font-bold text-gray-800 mb-4 animate-pulse">
                        กำลังเตรียมแบบทดสอบ...
                    </div>
                    <div className="mt-6 flex justify-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full border-4 border-red-300">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-2xl text-gray-700 mb-8">{error}</p>
                        <button
                            onClick={handleBackToDashboard}
                            className="bg-blue-500 text-white px-8 py-5 text-2xl font-bold rounded-2xl border-4 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (completed) {
        const maxScore = 30;

        const percentage = Math.round((finalScore / maxScore) * 100);

        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl w-full border-4 border-green-300">
                    <div className="text-center">
                        <div className="text-8xl mb-6">🎉</div>
                        <h1 className="text-5xl font-bold text-green-600 mb-8">ทำแบบทดสอบเสร็จสิ้น</h1>

                        <button
                            onClick={handleBackToDashboard}
                            className="bg-blue-500 text-white px-12 py-6 text-3xl font-bold rounded-2xl border-4 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                        >
                            ← กลับไปที่หน้าแรก
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return sessionId ? (
        <TestRunner
            questions={questions}
            sessionId={sessionId}
            onComplete={handleTestComplete}
        />
    ) : null;
}

export default function TestPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <div className="text-4xl font-bold text-gray-800 animate-pulse">กำลังโหลด...</div>
                </div>
            </div>
        }>
            <TestPageContent />
        </Suspense>
    );
}
