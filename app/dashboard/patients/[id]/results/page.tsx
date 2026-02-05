'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TestSession {
    id: string;
    patient_id: string;
    status: string;
    total_score: number;
    duration: number;
    started_at: string;
    completed_at?: string;
}

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
}

export default function PatientResultsPage() {
    const params = useParams();
    const router = useRouter();
    const patientId = params.id as string;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [sessions, setSessions] = useState<TestSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (patientId) {
            fetchPatientAndResults();
        }
    }, [patientId]);

    const fetchPatientAndResults = async () => {
        try {
            // Fetch patient details
            const patientRes = await fetch(`/api/patients/${patientId}`);
            const patientData = await patientRes.json();

            if (!patientRes.ok) {
                setError(patientData.error || 'Failed to fetch patient');
                setLoading(false);
                return;
            }

            setPatient(patientData.patient);

            // Fetch test results
            const resultsRes = await fetch(`/api/patients/${patientId}/results`);
            const resultsData = await resultsRes.json();

            if (resultsRes.ok) {
                setSessions(resultsData.sessions || []);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th', {
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6 shadow-lg shadow-blue-100"></div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-400 animate-pulse">กำลังโหลดข้อมูล...</div>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-4xl shadow-xl p-8 sm:p-12 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูล</h1>
                    <p className="text-gray-500 mb-8">{error || 'ไม่พบข้อมูลผู้ป่วยในระบบ'}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-transform active:scale-95 shadow-lg shadow-gray-200"
                    >
                        กลับสู่หน้าหลัก
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Navigation Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm hidden sm:block">ย้อนกลับ</span>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">ประวัติการทดสอบ</h1>
                    <div className="w-20"></div> {/* Spacer for centering title */}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Patient Profile Card */}
                <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 mb-6 sm:mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-50 to-indigo-50 rounded-bl-[10rem] z-0 opacity-50" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
                            {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                {patient.name}
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                    {patient.gender}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                    อายุ {patient.age} ปี
                                </span>
                            </div>
                            {patient.notes && (
                                <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-2xl bg-gray-50/80 p-3 rounded-xl">
                                    {patient.notes}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => router.push(`/test?patientId=${patientId}`)}
                            className="w-full sm:w-auto mt-4 sm:mt-0 bg-pink-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-pink-600 transition-all active:scale-95 shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            เริ่มทดสอบใหม่
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 px-2">ประวัติย้อนหลัง ({sessions.length})</h3>

                    {sessions.length === 0 ? (
                        <div className="bg-white rounded-4xl p-12 text-center border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">ยังไม่มีประวัติการทดสอบ</h3>
                            <p className="text-gray-500 mb-6">เริ่มการทดสอบแรกเพื่อดูผลการประเมิน</p>
                            <button
                                onClick={() => router.push(`/test?patientId=${patientId}`)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                เริ่มทำแบบทดสอบตอนนี้
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => router.push(`/dashboard/results/${session.id}`)}
                                    className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer active:scale-[0.99] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-gray-50 to-transparent rounded-bl-[4rem] z-0 group-hover:from-blue-50/50 transition-colors" />

                                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex gap-4 items-start">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${session.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {session.status === 'completed' ? '✓' : '⚡'}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900 mb-1">
                                                    {formatDate(session.started_at)}
                                                </h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        {formatDuration(session.duration)} นาที
                                                    </span>
                                                    <span>•</span>
                                                    <span className={`${session.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                                        } font-medium`}>
                                                        {session.status === 'completed' ? 'เสร็จสมบูรณ์' : 'ยังไม่เสร็จ'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                                            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
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
