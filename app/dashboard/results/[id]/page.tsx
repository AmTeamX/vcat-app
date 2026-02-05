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

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
    medical_conditions?: string;
}

// Test items configuration
const TEST_ITEMS = [
    { no: 1, domain: 'Memory', item: 'ภาพเหตุการณ์', maxScore: 0 },
    { no: 2, domain: 'Visuospatial', item: 'ลูกบาศก์', maxScore: 1 },
    { no: 3, domain: 'Visuospatial', item: 'ตาราง', maxScore: 2 },
    { no: 4, domain: 'Attention/Working Memory', item: 'กากบาททับรูปร่าง', maxScore: 3 },
    { no: 5, domain: 'Delayed Recall', item: 'ภาพเหตุการณ์', maxScore: 3 },
    { no: 6, domain: 'Memory', item: 'รูปร่าง', maxScore: 0 },
    { no: 7, domain: 'Language', item: 'บอกชื่อ', maxScore: 3 },
    { no: 8, domain: 'Language', item: 'ความคล่องแคล่วทางภาษา', maxScore: 2 },
    { no: 9, domain: 'Executive Function', item: 'เฟือง', maxScore: 3 },
    { no: 10, domain: 'Delayed Recall', item: 'รูปร่าง', maxScore: 2 },
    { no: 11, domain: 'Memory', item: 'ชื่อภาพ', maxScore: 0 }, // ไม่มีคะแนน - ใช้สำหรับจำเพื่อตอบข้อ 14
    { no: 12, domain: 'Executive Function', item: 'รูปแบบ', maxScore: 2 },
    { no: 13, domain: 'Executive Function', item: 'หมวดหมู่', maxScore: 1 },
    { no: 14, domain: 'Delayed Memory', item: 'ชื่อภาพ', maxScore: 8 },
];

export default function ResultDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [session, setSession] = useState<TestSession | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [answers, setAnswers] = useState<TestAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnswers, setEditedAnswers] = useState<TestAnswer[]>([]);
    const [isSaving, setIsSaving] = useState(false);

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

            // Fetch patient details
            const patientRes = await fetch(`/api/patients/${sessionData.session.patient_id}`);
            const patientData = await patientRes.json();
            if (patientRes.ok) {
                setPatient(patientData.patient);
            }

            // Fetch answers
            const answersRes = await fetch(`/api/test-sessions/${sessionId}/answers`);
            const answersData = await answersRes.json();

            if (answersRes.ok) {
                const fetchedAnswers = answersData.answers || [];
                setAnswers(fetchedAnswers);
                setEditedAnswers(fetchedAnswers);
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
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleEditScore = (answerId: string, newScore: number, maxScore: number) => {
        // Cap the score at the maximum value
        const cappedScore = Math.min(Math.max(0, newScore), maxScore);
        setEditedAnswers(prev =>
            prev.map(answer =>
                answer.id === answerId ? { ...answer, score: cappedScore } : answer
            )
        );
    };

    const handleSaveScores = async () => {
        setIsSaving(true);
        try {
            // Update each answer
            for (const answer of editedAnswers) {
                await fetch(`/api/test-sessions/${sessionId}/answers`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        answerId: answer.id,
                        score: answer.score,
                    }),
                });
            }

            // Calculate new total score - only from questions with maxScore > 0
            const newTotalScore = editedAnswers.reduce((sum, answer) => {
                const testItem = TEST_ITEMS.find(item => item.no === answer.question_index + 1);
                if (testItem && testItem.maxScore > 0) {
                    return sum + answer.score;
                }
                return sum;
            }, 0);

            // Update session total score
            await fetch(`/api/test-sessions/${sessionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total_score: newTotalScore,
                }),
            });

            // Refresh data
            await fetchSessionDetails();
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving scores:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกคะแนน');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedAnswers(answers);
        setIsEditing(false);
    };

    const getCurrentTotalScore = () => {
        if (isEditing) {
            // Calculate from edited answers, only counting questions with maxScore > 0
            return editedAnswers.reduce((sum, answer) => {
                const testItem = TEST_ITEMS.find(item => item.no === answer.question_index + 1);
                if (testItem && testItem.maxScore > 0) {
                    return sum + answer.score;
                }
                return sum;
            }, 0);
        } else {
            // Calculate from original answers, only counting questions with maxScore > 0
            return answers.reduce((sum, answer) => {
                const testItem = TEST_ITEMS.find(item => item.no === answer.question_index + 1);
                if (testItem && testItem.maxScore > 0) {
                    return sum + answer.score;
                }
                return sum;
            }, 0);
        }
    };

    const getInterpretation = (score: number) => {
        if (score >= 25 && score <= 30) {
            return { text: 'ปกติ (Normal)', color: 'text-green-600', bg: 'bg-green-50' };
        } else if (score >= 20 && score <= 24) {
            return { text: 'ภาวะบกพร่องการรู้คิดเล็กน้อย (MCI)', color: 'text-yellow-600', bg: 'bg-yellow-50' };
        } else if (score >= 0 && score <= 19) {
            return { text: 'ภาวะสมองเสื่อมในระดับน้อย (Mild Dementia)', color: 'text-red-600', bg: 'bg-red-50' };
        } else {
            return { text: 'เกิดข้อผิดพลาดในการประเมินผล กรุณาตรวจสอบคะแนนอีกครั้ง', color: 'text-red-600', bg: 'bg-red-50' };
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSave = async () => {
        alert('บันทึกข้อมูลเรียบร้อยแล้ว');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
                    <div className="text-4xl text-gray-600 animate-pulse">กำลังโหลดรายงานผล...</div>
                </div>
            </div>
        );
    }

    if (error || !session || !patient) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full border-4 border-red-300">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-2xl text-gray-700 mb-8">{error || 'ไม่พบข้อมูลการทดสอบ'}</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-blue-500 text-white px-8 py-5 text-2xl font-bold rounded-2xl border-4 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                        >
                            ← กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalScore = getCurrentTotalScore();
    const interpretation = getInterpretation(totalScore);

    return (
        <div className="min-h-screen bg-gray-50 p-4 print:p-8">
            {/* Saving Popup */}
            {isSaving && (
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">กำลังบันทึกคะแนน...</h2>
                        <p className="text-xl text-gray-600">กรุณารอสักครู่</p>
                    </div>
                </div>
            )}

            {/* Action Buttons - Hidden when printing */}
            <div className="max-w-5xl mx-auto mb-3 print:hidden">
                <div className="flex justify-end gap-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-orange-600 transition-all"
                            >
                                ✏️ แก้ไขคะแนน
                            </button>
                            <button
                                onClick={handlePrint}
                                className="bg-blue-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-blue-600 transition-all"
                            >
                                🖨️ Print
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveScores}
                                disabled={isSaving}
                                className="bg-green-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                            >
                                {isSaving ? '💾 กำลังบันทึก...' : '💾 บันทึก'}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                ❌ ยกเลิก
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => router.push(`/dashboard/patients/${session.patient_id}/results`)}
                        className="bg-gray-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-600 transition-all"
                    >
                        ← กลับ
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="max-w-5xl mx-auto bg-white shadow-lg print:shadow-none">
                {/* Header */}
                <div className="border-b-4 border-blue-600 p-6 print:p-8">
                    <h1 className="text-center text-2xl font-bold text-blue-600 mb-4 print:text-xl">
                        รายงานผลการคัดกรองภาวะสมองเสื่อม
                    </h1>
                    <h2 className="text-center text-xl font-bold mb-2 print:text-lg">
                        ด้วยแบบประเมิน Visual Cognitive Assessment Test (VCAT)
                    </h2>
                    <h3 className="text-center text-lg text-gray-700 print:text-base">
                        ฉบับภาษาไทยสำหรับผู้พิการทางการได้ยิน
                    </h3>
                </div>

                {/* Patient Information */}
                <div className="p-6 print:p-8">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                            <label className="font-bold w-32 print:text-sm">ชื่อ-นามสกุล:</label>
                            <span className="flex-1 border-b-2 border-gray-300 px-2 print:text-sm">{patient.name}</span>
                        </div>
                        <div className="flex items-center">
                            <label className="font-bold w-24 print:text-sm">เพศ:</label>
                            <span className="flex-1 border-b-2 border-gray-300 px-2 print:text-sm">{patient.gender}</span>
                        </div>
                        <div className="flex items-center">
                            <label className="font-bold w-32 print:text-sm">อายุ:</label>
                            <span className="flex-1 border-b-2 border-gray-300 px-2 print:text-sm">{patient.age} ปี</span>
                        </div>
                        <div className="flex items-center">
                            <label className="font-bold w-24 print:text-sm">วันที่ทดสอบ:</label>
                            <span className="flex-1 border-b-2 border-gray-300 px-2 print:text-sm">{formatDate(session.started_at)}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <label className="font-bold w-32 print:text-sm">การวินิจฉัย:</label>
                            <span className="flex-1 border-b-2 border-gray-300 px-2 print:text-sm">
                                {patient.medical_conditions || '-'}
                            </span>
                        </div>
                    </div>

                    {/* Assessment Table */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-4 print:text-lg">ผลการประเมิน</h3>
                        <table className="w-full border-collapse border-2 border-gray-400">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="border border-gray-400 px-3 py-2 text-center w-16 print:text-sm">ข้อที่</th>
                                    <th className="border border-gray-400 px-3 py-2 text-left print:text-sm">Test Domain</th>
                                    <th className="border border-gray-400 px-3 py-2 text-left print:text-sm">Test Item</th>
                                    <th className="border border-gray-400 px-3 py-2 text-center w-24 print:text-sm">คะแนน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TEST_ITEMS.map((item) => {
                                    const answer = (isEditing ? editedAnswers : answers).find(
                                        a => a.question_index === item.no - 1
                                    );
                                    const score = answer?.score || 0;

                                    return (
                                        <tr key={item.no} className={isEditing ? 'bg-orange-50' : ''}>
                                            <td className="border border-gray-400 px-3 py-2 text-center print:text-sm">{item.no}</td>
                                            <td className="border border-gray-400 px-3 py-2 print:text-sm">{item.domain}</td>
                                            <td className="border border-gray-400 px-3 py-2 print:text-sm">{item.item}</td>
                                            <td className="border border-gray-400 px-3 py-2 text-center print:text-sm">
                                                {isEditing && answer && item.maxScore > 0 ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={score}
                                                            onChange={(e) => handleEditScore(answer.id, parseInt(e.target.value) || 0, item.maxScore)}
                                                            className="w-16 text-center border-2 border-orange-400 rounded px-1 py-1 text-lg font-semibold"
                                                            min="0"
                                                            max={item.maxScore}
                                                        />
                                                        <span className="text-gray-600 font-semibold">/ {item.maxScore}</span>
                                                    </div>
                                                ) : (
                                                    <span>{item.maxScore > 0 ? `${score} / ${item.maxScore}` : '-'}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* Total Score Row */}
                                <tr className={`font-bold text-lg ${interpretation.bg}`}>
                                    <td colSpan={3} className="border border-gray-400 px-3 py-3 text-right print:text-base">
                                        คะแนนรวม (Total Score):
                                    </td>
                                    <td className="border border-gray-400 px-3 py-3 text-center print:text-base">
                                        {totalScore} / 30
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Interpretation */}
                    <div className={`${interpretation.bg} border-2 border-gray-400 rounded-lg p-6 print:p-4`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold print:text-lg">แปลผล (Interpretation):</h3>
                            <span className={`text-2xl font-bold ${interpretation.color} print:text-xl`}>
                                {interpretation.text}
                            </span>
                        </div>
                        <div className="mt-4 text-sm text-gray-700 print:text-xs">
                            <p>เกณฑ์การแปลผล:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>25-30 คะแนน: ปกติ (Normal)</li>
                                <li>20-24 คะแนน: ภาวะบกพร่องการรู้คิดเล็กน้อย (MCI - Mild Cognitive Impairment)</li>
                                <li>0-19 คะแนน: ภาวะสมองเสื่อมในระดับน้อย (Mild Dementia)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-8 grid grid-cols-2 gap-8 print:mt-12">
                        <div>
                            <p className="mb-12 print:text-sm">ผู้ประเมิน: _________________________</p>
                            <p className="print:text-sm">วันที่: _________________________</p>
                        </div>
                        <div>
                            <p className="mb-12 print:text-sm">ผู้ตรวจสอบ: _________________________</p>
                            <p className="print:text-sm">วันที่: _________________________</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
