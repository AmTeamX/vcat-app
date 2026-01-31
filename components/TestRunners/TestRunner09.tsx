'use client';

import { Question } from '@/data/questions';
import { getVideoEmbedUrl } from '@/lib/youtube-utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TestRunner09Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
    viewTimer: number | null;
}

/**
 * TestRunner for Question 9: Gears Drawing
 * User draws arrows showing gear rotation directions
 * Has outro video with additional scoring
 */
export default function TestRunner09({ question, onNext, currentAnswer, viewTimer }: TestRunner09Props) {
    const maxScore = question.maxScore || 5;
    const currentScore = currentAnswer?.score;
    const contentRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1 = first image, 2 = second image
    const [selectedScore, setSelectedScore] = useState<number | undefined>(currentScore);
    const [showScoringModal, setShowScoringModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    // Auto-scroll to center content
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentStep]);

    const handleNextStep = () => {
        // Check if there's an instructor video to show
        if (question.outroinstructorVideoVideos2 && question.outroinstructorVideoVideos2[0]) {
            setShowVideoModal(true);
        } else {
            setCurrentStep(2);
        }
    };

    const handleCloseVideoModal = () => {
        setShowVideoModal(false);
        setCurrentStep(2);
    };

    const handleShowModal = () => {
        setShowScoringModal(true);
    };

    const handleScoreSelect = (score: number) => {
        setSelectedScore(score);
    };

    const handleSubmit = () => {
        setShowScoringModal(false);
        if (selectedScore !== undefined) {
            onNext(selectedScore, `Manual score: ${selectedScore}`);
        }
    };

    const currentImage = currentStep === 1 ? question.image : question.image2;
    const currentInstruction = currentStep === 1 ? question.instruction : question.instruction2;

    return (
        <div className="h-screen flex items-center justify-center p-4 md:p-6">
            <div ref={contentRef} className="w-full max-w-5xl">
                {/* Image */}
                <div className="bg-white mb-4 md:mb-8">
                    {currentInstruction &&
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
                            {currentInstruction}
                        </h2>
                    }

                    {currentImage && (
                        <div className="mb-4 md:mb-6">
                            <div className="relative w-full h-64 md:h-96 overflow-hidden">
                                <Image
                                    src={currentImage}
                                    alt={question.title}
                                    fill
                                    className="object-contain"
                                    unoptimized={currentImage.startsWith('/')}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-center">
                    {currentStep === 1 ? (
                        <button
                            onClick={handleNextStep}
                            className="px-8 py-4 md:px-12 md:py-6 text-2xl md:text-4xl font-bold rounded-xl md:rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            ➡️ ถัดไป
                        </button>
                    ) : (
                        <button
                            onClick={handleShowModal}
                            className="px-8 py-4 md:px-12 md:py-6 text-2xl md:text-4xl font-bold rounded-xl md:rounded-2xl bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            📝 ให้คะแนน
                        </button>
                    )}
                </div>
            </div>

            {/* Video Modal */}
            {showVideoModal && question.outroinstructorVideoVideos2 && question.outroinstructorVideoVideos2[0] && (
                <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 md:border-4 border-blue-400 max-w-2xl w-full">
                        <div className="text-center mb-4 md:mb-6">
                            <h2 className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">
                                วิดีโอคำแนะนำ
                            </h2>
                        </div>

                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 md:border-4 border-gray-300 mb-4 md:mb-6">
                            <iframe
                                src={getVideoEmbedUrl(question.outroinstructorVideoVideos2[0]) || ''}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media"
                            />
                        </div>

                        <button
                            onClick={handleCloseVideoModal}
                            className="w-full py-4 px-6 text-xl font-bold rounded-xl md:rounded-2xl bg-red-500 hover:bg-red-600 text-white border-2 md:border-4 border-red-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            ปิดและดำเนินการต่อ
                        </button>
                    </div>
                </div>
            )}

            {/* Scoring Modal */}
            {showScoringModal && (
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 md:border-4 border-gray-300 max-w-2xl w-full">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
                            🎯 ให้คะแนน
                        </h2>

                        {/* Instructions */}
                        {question.instruction3 && (
                            <div className="bg-yellow-50 border-2 md:border-4 border-yellow-300 rounded-xl md:rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
                                <div className="text-base md:text-lg text-gray-700">
                                    <strong className="text-lg md:text-xl">📋 คำแนะนำการให้คะแนน:</strong>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {question.instruction3.split('.').filter(s => s.trim()).map((item, idx) => (
                                            <li key={idx}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <p className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-700 text-center">
                            เลือกคะแนน:
                        </p>

                        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                            {[0, 1, 3].map((score) => {
                                const isSelected = selectedScore === score;
                                return (
                                    <button
                                        key={score}
                                        onClick={() => handleScoreSelect(score)}
                                        className={`text-2xl md:text-4xl font-bold h-16 md:h-24 rounded-xl md:rounded-2xl border-2 md:border-4 transition-all hover:scale-110 active:scale-95 shadow-lg ${isSelected
                                            ? 'bg-green-600 text-white border-green-700 ring-4 ring-green-300'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600'
                                            }`}
                                    >
                                        {isSelected && <span className="mr-2">✓</span>}
                                        {score}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-3 md:gap-4 justify-center">
                            <button
                                onClick={() => setShowScoringModal(false)}
                                className="px-4 py-2 md:px-8 md:py-4 text-lg md:text-2xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 bg-gray-400 hover:bg-gray-500 text-white border-gray-500 transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedScore === undefined}
                                className={`px-6 py-2 md:px-12 md:py-4 text-lg md:text-2xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 transition-all shadow-lg ${selectedScore !== undefined
                                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                                    : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                ✓ ยืนยันและไปหน้าต่อไป
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
