'use client';

import { Question } from '@/data/questions';
import { getVideoEmbedUrl } from '@/lib/youtube-utils';
import Image from 'next/image';
import { useState } from 'react';

interface TestRunner14Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
}

/**
 * TestRunner for Question 14: Delayed Recall with Hints
 * User recalls the 4 images from Question 11 (with optional hints)
 */
export default function TestRunner14({ question, onNext, currentAnswer }: TestRunner14Props) {
    const items = question.hintItems || [];
    const [results, setResults] = useState<Map<string, { usedHint: boolean; correct: boolean }>>(
        new Map(currentAnswer?.map((r: any) => [r.itemId, { usedHint: r.usedHint, correct: r.correct }]) || [])
    );
    const [revealedHints, setRevealedHints] = useState<Set<string>>(
        new Set(currentAnswer?.filter((r: any) => r.usedHint).map((r: any) => r.itemId) || [])
    );
    const [showHintModal, setShowHintModal] = useState(false);
    const [currentHintImage, setCurrentHintImage] = useState<string>('');
    const [showHintInstructorModal, setShowHintInstructorModal] = useState(false);
    const [hintViewMode, setHintViewMode] = useState<'video' | 'image'>('video'); // 'video' = แสดงวิดีโอ, 'image' = แสดงรูป

    const handleShowHint = (itemId: string, hintImage: string) => {
        // บันทึกว่าเคยใช้คำใบ้แล้ว (จะลดคะแนน)
        setRevealedHints(new Set([...revealedHints, itemId]));
        setCurrentHintImage(hintImage);
        setHintViewMode('video'); // เริ่มต้นที่วิดีโอ
        setShowHintModal(true);
    };

    const handleScore = (itemId: string, correct: boolean) => {
        const newResults = new Map(results);
        newResults.set(itemId, {
            usedHint: revealedHints.has(itemId),
            correct
        });
        setResults(newResults);
    };

    const handleSubmit = () => {
        let totalScore = 0;
        const resultsArray: { itemId: string; usedHint: boolean; correct: boolean }[] = [];

        items.forEach(item => {
            const result = results.get(item.id);
            if (result) {
                resultsArray.push({
                    itemId: item.id,
                    usedHint: result.usedHint,
                    correct: result.correct
                });

                if (result.correct && !result.usedHint) {
                    totalScore += 2; // ตอบถูกไม่ใช้คำใบ้ = 2 คะแนน
                } else if (result.correct && result.usedHint) {
                    totalScore += 1; // ตอบถูกใช้คำใบ้ = 1 คะแนน (ลด 1)
                } else if (!result.correct && result.usedHint) {
                    totalScore += 0; // ตอบผิดใช้คำใบ้ = 0 คะแนน (ลด 2)
                } else {
                    totalScore += 0; // ตอบผิดไม่ใช้คำใบ้ = 0 คะแนน
                }
            }
        });

        onNext(totalScore, resultsArray);
    };

    const allAnswered = items.every(item => results.has(item.id));

    return (
        <>
            {/* Hint Instructor Modal */}
            {showHintInstructorModal && question.hintInstructorVideo && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-800">
                            💡 คำแนะนำเกี่ยวกับคำใบ้
                        </h2>
                        <div className="mb-4 md:mb-6 bg-yellow-50 border-2 md:border-4 border-yellow-400 rounded-2xl p-4 md:p-6">
                            <p className="text-xl md:text-2xl font-bold text-yellow-800 text-center">
                                ⚠️ การใช้คำใบ้จะลดคะแนนของคุณ
                            </p>
                            <p className="text-lg md:text-xl text-gray-700 text-center mt-2">
                                ตอบถูกไม่ใช้คำใบ้ = 2 คะแนน | ตอบถูกใช้คำใบ้ = 1 คะแนน
                            </p>
                        </div>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden">
                            <iframe
                                src={getVideoEmbedUrl(question.hintInstructorVideo) || ''}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </div>
                        <button
                            onClick={() => setShowHintInstructorModal(false)}
                            className="mt-6 w-full px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-2xl bg-blue-500 hover:bg-blue-600 text-white border-4 border-blue-600"
                        >
                            เริ่มทำข้อสอบ
                        </button>
                    </div>
                </div>
            )}

            {/* Hint Modal */}
            {showHintModal && (
                <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-auto relative border-2 md:border-4 border-gray-300">
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="absolute top-2 right-2 md:top-4 md:right-4 text-3xl md:text-5xl font-bold text-gray-600 hover:text-gray-800 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center z-10"
                        >
                            ×
                        </button>

                        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-gray-800">💡 คำใบ้</h2>

                        {hintViewMode === 'video' ? (
                            /* Video View */
                            <div>
                                {question.hintInstructorVideo && (
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 md:border-4 border-gray-300 mb-6 md:mb-8">
                                        <iframe
                                            src={getVideoEmbedUrl(question.hintInstructorVideo) || ''}
                                            className="w-full h-full"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={() => setHintViewMode('image')}
                                    className="w-full px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl bg-blue-500 hover:bg-blue-600 text-white border-2 md:border-4 border-blue-600 transition-all hover:scale-105 shadow-lg"
                                >
                                    ➡️ ดูรูปคำใบ้
                                </button>
                            </div>
                        ) : (
                            /* Image View */
                            <div>
                                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden border-2 md:border-4 border-gray-300 bg-white mb-6 md:mb-8">
                                    <Image
                                        src={currentHintImage}
                                        alt="Hint"
                                        fill
                                        className="object-contain"
                                        unoptimized={currentHintImage.startsWith('/')}
                                    />
                                </div>
                                <button
                                    onClick={() => setHintViewMode('video')}
                                    className="w-full px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl bg-purple-500 hover:bg-purple-600 text-white border-2 md:border-4 border-purple-600 transition-all hover:scale-105 shadow-lg"
                                >
                                    ⬅️ กลับไปดูวิดีโอ
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setShowHintModal(false)}
                            className="mt-6 md:mt-8 w-full px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl bg-gray-400 hover:bg-gray-500 text-white border-2 md:border-4 border-gray-500 transition-all hover:scale-105 shadow-lg"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}

            <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 border-2 md:border-4 border-gray-200 max-w-5xl w-full mx-auto">
                    <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-800 text-center">
                        {question.title}
                    </h2>

                    <div className="space-y-4 md:space-y-8">
                        {items.map((item, index) => {
                            const result = results.get(item.id);
                            const hasHint = revealedHints.has(item.id);

                            return (
                                <div key={item.id} className="bg-gray-50 rounded-2xl p-4 md:p-8 border-2 md:border-4 border-gray-300">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                                        <h3 className="text-xl md:text-3xl font-bold text-gray-800">
                                            {index + 1}. {item.label}
                                        </h3>
                                        {item.hintImage && (
                                            <button
                                                onClick={() => handleShowHint(item.id, item.hintImage!)}
                                                className="px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl font-bold rounded-xl border-2 md:border-4 bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-yellow-500 hover:scale-105 transition-all shadow-lg"
                                            >
                                                {hasHint ? '💡 ดูคำใบ้อีกครั้ง' : '💡 ดูคำใบ้'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-4 md:gap-6">
                                        <button
                                            onClick={() => handleScore(item.id, true)}
                                            className={`flex-1 px-4 py-3 md:px-8 md:py-6 text-xl md:text-3xl font-bold rounded-xl border-2 md:border-4 transition-all shadow-lg ${result?.correct === true
                                                ? 'bg-green-500 text-white border-green-600 ring-2 md:ring-4 ring-green-300'
                                                : 'bg-gray-200 hover:bg-green-100 border-gray-400 hover:border-green-500'
                                                }`}
                                        >
                                            ✓ ตอบถูก

                                        </button>

                                        <button
                                            onClick={() => handleScore(item.id, false)}
                                            className={`flex-1 px-4 py-3 md:px-8 md:py-6 text-xl md:text-3xl font-bold rounded-xl border-2 md:border-4 transition-all shadow-lg ${result?.correct === false
                                                ? 'bg-red-500 text-white border-red-600 ring-2 md:ring-4 ring-red-600'
                                                : 'bg-gray-200 hover:bg-red-100 border-gray-400 hover:border-red-500'
                                                }`}
                                        >
                                            × ตอบผิด
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 md:mt-10 text-center">
                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={`px-8 py-4 md:px-16 md:py-8 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 transition-all shadow-lg ${allAnswered
                                ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                                : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {allAnswered ? 'ส่งคำตอบ' : 'ให้คะแนนทุกข้อก่อนส่ง'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
