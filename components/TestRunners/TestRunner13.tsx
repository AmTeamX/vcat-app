'use client';

import { Question } from '@/data/questions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TestRunner13Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
}

/**
 * TestRunner for Question 13: Pattern Matching
 * User selects which shape completes the pattern
 */
export default function TestRunner13({ question, onNext, currentAnswer }: TestRunner13Props) {
    const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    // Map between A,B,C,D and ก,ข,ค,ง
    const idMap: { [key: string]: string } = {
        'A': 'ก',
        'B': 'ข',
        'C': 'ค',
        'D': 'ง'
    };

    const handleChoiceSelect = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const handleSubmit = () => {
        if (selectedOption) {
            const isCorrect = selectedOption === question.correctAnswer;
            const score = isCorrect ? (question.maxScore || 1) : 0;
            onNext(score, selectedOption);
        }
    };

    return (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white p-4 md:p-6 overflow-auto flex flex-col justify-center">
                <h2 className="text-xl md:text-3xl font-bold mb-4 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-4">
                        <div className="relative w-full h-64 md:h-100 overflow-hidden rounded-xl">
                            <Image
                                src={question.image}
                                alt={question.title}
                                fill
                                style={{ objectFit: "contain" }}
                                className="object-contain"
                                unoptimized={question.image.startsWith('/')}
                                priority
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT PANEL: Answer Options */}
            <div className="bg-white p-4 md:p-6 overflow-auto flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                    เลือกคำตอบที่ถูกต้อง:
                </h3>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 w-full max-w-lg mx-auto">
                    {question.options?.map((option) => {
                        const isSelected = selectedOption === option.id;
                        const displayId = idMap[option.id] || option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleChoiceSelect(option.id)}
                                className={`p-2 md:p-4 transition-all hover:scale-105 active:scale-95 flex flex-col md:flex-row items-center gap-2 md:gap-4 rounded-xl border-2 md:border-4 ${isSelected ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'
                                    }`}
                            >
                                <div className={`text-xl md:text-2xl font-bold text-left flex items-center gap-2 ${isSelected ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    {displayId}. {option.label}
                                </div>
                                <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={option.image}
                                        alt={option.label}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="object-cover"
                                        unoptimized={option.image.startsWith('/')}
                                        priority
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className={`px-8 py-4 md:px-10 md:py-5 text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 transition-all shadow-lg ${selectedOption
                            ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                            }`}
                    >
                        ✓ ยืนยันคำตอบ
                    </button>
                </div>
            </div>
        </div>
    );
}
