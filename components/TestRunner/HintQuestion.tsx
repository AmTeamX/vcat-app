import { Question } from '@/data/questions';
import { getVideoEmbedUrl } from '@/lib/youtube-utils';
import Image from 'next/image';
import { useState } from 'react';

interface HintQuestionProps {
    question: Question;
    onComplete: (results: { itemId: string; usedHint: boolean; correct: boolean }[], totalScore: number) => void;
    currentAnswer?: { itemId: string; usedHint: boolean; correct: boolean }[];
}

export default function HintQuestion({ question, onComplete, currentAnswer }: HintQuestionProps) {
    const items = question.hintItems || [];
    const [results, setResults] = useState<Map<string, { usedHint: boolean; correct: boolean }>>(
        new Map(currentAnswer?.map(r => [r.itemId, { usedHint: r.usedHint, correct: r.correct }]) || [])
    );
    const [revealedHints, setRevealedHints] = useState<Set<string>>(
        new Set(currentAnswer?.filter(r => r.usedHint).map(r => r.itemId) || [])
    );
    const [showHintModal, setShowHintModal] = useState(false);
    const [currentHintImage, setCurrentHintImage] = useState<string>('');
    const [showHintInstructorModal, setShowHintInstructorModal] = useState(!!question.hintInstructorVideo);

    const handleShowHint = (itemId: string, hintImage: string) => {
        setRevealedHints(new Set([...revealedHints, itemId]));
        setCurrentHintImage(hintImage);
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

        onComplete(resultsArray, totalScore);
    };

    const allAnswered = items.every(item => results.has(item.id));

    return (
        <>
            {/* Hint Instructor Modal */}
            {showHintInstructorModal && question.hintInstructorVideo && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-6xl max-h-[90vh] overflow-auto relative">
                        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
                            💡 คำแนะนำเกี่ยวกับคำใบ้
                        </h2>
                        <div className="mb-6 bg-yellow-50 border-4 border-yellow-400 rounded-2xl p-6">
                            <p className="text-2xl font-bold text-yellow-800 text-center">
                                ⚠️ การใช้คำใบ้จะลดคะแนนของคุณ
                            </p>
                            <p className="text-xl text-gray-700 text-center mt-2">
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
                            className="mt-6 w-full px-8 py-6 text-3xl font-bold rounded-2xl bg-blue-500 hover:bg-blue-600 text-white border-4 border-blue-600"
                        >
                            เริ่มทำข้อสอบ
                        </button>
                    </div>
                </div>
            )}

            {/* Hint Modal */}
            {showHintModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 min-w-2xl max-w-3xl max-h-[90vh] overflow-auto relative">
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="absolute top-4 right-4 text-4xl font-bold text-gray-600 hover:text-gray-800 w-12 h-12 flex items-center justify-center"
                        >
                            ×
                        </button>
                        <h2 className="text-3xl font-bold mb-6 text-center">คำใบ้</h2>
                        <div className="relative w-full h-96">
                            <Image
                                src={currentHintImage}
                                alt="Hint"
                                fill
                                className="object-contain"
                                unoptimized={currentHintImage.startsWith('/')}
                            />
                        </div>
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="mt-6 w-full px-8 py-4 text-2xl font-bold rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}

            <div className="p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
                    <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                        {question.title}
                    </h2>

                    {question.image && (
                        <div className="mb-8">
                            <div className="relative w-full h-96 rounded-2xl overflow-hidden border-4 border-gray-300">
                                <Image
                                    src={question.image}
                                    alt={question.title}
                                    fill
                                    className="object-contain"
                                    unoptimized={question.image.startsWith('/')}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {items.map((item, index) => {
                            const result = results.get(item.id);
                            const hasHint = revealedHints.has(item.id);

                            return (
                                <div key={item.id} className="bg-gray-50 rounded-2xl p-6 border-4 border-gray-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {index + 1}. {item.label}
                                        </h3>
                                        {item.hintImage && (
                                            <button
                                                onClick={() => handleShowHint(item.id, item.hintImage!)}
                                                disabled={hasHint}
                                                className={`px-6 py-3 text-xl font-bold rounded-xl border-4 ${hasHint
                                                    ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-yellow-500 hover:scale-105'
                                                    }`}
                                            >
                                                {hasHint ? '✓ ดูคำใบ้แล้ว' : '💡 ดูคำใบ้'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleScore(item.id, true)}
                                            className={`flex-1 px-6 py-4 text-2xl font-bold rounded-xl border-4 transition-all ${result?.correct === true
                                                ? 'bg-green-500 text-white border-green-600 ring-4 ring-green-300'
                                                : 'bg-gray-200 hover:bg-green-100 border-gray-400 hover:border-green-500'
                                                }`}
                                        >
                                            ✓ ตอบถูก
                                            {hasHint && result?.correct === true && (
                                                <span className="block text-sm mt-1">(+1 คะแนน - ใช้คำใบ้)</span>
                                            )}
                                            {!hasHint && result?.correct === true && (
                                                <span className="block text-sm mt-1">(+2 คะแนน)</span>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleScore(item.id, false)}
                                            className={`flex-1 px-6 py-4 text-2xl font-bold rounded-xl border-4 transition-all ${result?.correct === false
                                                ? 'bg-red-500 text-white border-red-600 ring-4 ring-red-300'
                                                : 'bg-gray-200 hover:bg-red-100 border-gray-400 hover:border-red-500'
                                                }`}
                                        >
                                            × ตอบผิด
                                            {hasHint && result?.correct === false && (
                                                <span className="block text-sm mt-1">(0 คะแนน - ใช้คำใบ้)</span>
                                            )}
                                            {!hasHint && result?.correct === false && (
                                                <span className="block text-sm mt-1">(0 คะแนน)</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={`px-12 py-6 text-3xl font-bold rounded-2xl border-4 transition-all ${allAnswered
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
