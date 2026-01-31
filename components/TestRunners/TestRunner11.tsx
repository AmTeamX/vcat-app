'use client';

import { Question } from '@/data/questions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TestRunner11Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
    viewTimer: number | null;
}

/**
 * TestRunner for Question 11: Memorize Images
 * User memorizes 4 images for 40 seconds (chicken, bench, broom, teapot)
 */
export default function TestRunner11({ question, onNext, currentAnswer, viewTimer }: TestRunner11Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(question.duration || 40);

    // Auto-scroll to center content
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!isTimerStarted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerStarted, timeLeft]);

    const handleStartTimer = () => {
        setIsTimerStarted(true);
    };

    const handleNext = () => {
        onNext(0, 'viewed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
            <div ref={contentRef} className="w-full max-w-5xl">
                <div className="bg-white p-4 md:p-8 rounded-3xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
                        {question.title}
                    </h2>

                    {question.image && (
                        <div className="mb-4 md:mb-6">
                            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
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

                    <div className="rounded-2xl p-4 md:p-8">
                        {!isTimerStarted ? (
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleStartTimer}
                                    className="px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    ▶ เริ่มจับเวลา
                                </button>
                            </div>
                        ) : timeLeft > 0 ? (
                            <div>
                                <div className="text-4xl md:text-6xl font-bold text-purple-600 mb-4 text-center">
                                    ⏱️ {timeLeft}s
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    ➡️ ข้อต่อไป
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
