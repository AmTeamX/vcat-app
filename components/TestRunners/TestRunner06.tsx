'use client';

import { Question } from '@/data/questions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TestRunner06Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
    viewTimer: number | null;
}

/**
 * TestRunner for Question 6: View Shapes
 * User memorizes 4 shapes for 10 seconds
 */
export default function TestRunner06({ question, onNext, currentAnswer, viewTimer }: TestRunner06Props) {
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(question.duration || 10);
    const contentRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to center content
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Timer countdown (only when started)
    useEffect(() => {
        if (!isTimerStarted) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerStarted]);

    const handleStartTimer = () => {
        setIsTimerStarted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
            <div ref={contentRef} className="bg-white p-4 md:p-8 max-w-4xl w-full rounded-3xl">
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
                                style={{ objectFit: "contain" }}
                                className="object-cover"
                                unoptimized={question.image.startsWith('/')}
                                priority
                            />
                        </div>
                    </div>
                )}

                <div className="rounded-2xl p-4">
                    {!isTimerStarted ? (
                        <div className="flex justify-center">
                            <button
                                onClick={handleStartTimer}
                                className="px-8 py-4 md:px-12 md:py-6 text-2xl md:text-4xl font-bold rounded-2xl bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                ▶ เริ่มจับเวลา
                            </button>
                        </div>
                    ) : (
                        <>
                            {timeLeft > 0 ? (
                                <>
                                    <div className="text-4xl md:text-6xl font-bold text-purple-600 text-center">
                                        {timeLeft}s
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => onNext(0, 'viewed')}
                                        className="px-8 py-4 md:px-12 md:py-6 text-2xl md:text-4xl font-bold rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                                    >
                                        ➡️ ข้อต่อไป
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
