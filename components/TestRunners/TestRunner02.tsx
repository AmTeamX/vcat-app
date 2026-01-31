'use client';

import { Question } from '@/data/questions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TestRunner02Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
}

/**
 * TestRunner for Question 2: Paper Folding Choice
 * User selects which folded paper matches the target
 */
export default function TestRunner02({ question, onNext, currentAnswer }: TestRunner02Props) {
    const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    // Map between a,b,c,d and ฟ,ข,ค,ง
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
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 min-h-screen py-4">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white p-4 md:p-6 overflow-auto flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-4">
                        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl">
                            <Image
                                src={question.image}
                                alt={question.title}
                                fill
                                style={{ objectFit: "contain" }}
                                className="object-contain"
                                unoptimized={question.image.startsWith('/')}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT PANEL: Answer Options */}
            <div className="bg-white p-4 md:p-6 overflow-auto flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 text-center md:text-left">
                    เลือกคำตอบที่ถูกต้อง:
                </h3>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 w-full md:w-fit mx-auto">
                    {question.options?.map((option) => {
                        const isSelected = selectedOption === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleChoiceSelect(option.id)}
                                className={`p-2 md:p-4 w-full md:w-fit transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 rounded-xl border-2 md:border-4 ${isSelected ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'
                                    }`}
                            >
                                <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-lg md:rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={option.image}
                                        alt={option.label}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="object-cover"
                                        unoptimized={option.image.startsWith('/')}
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
                        className={`px-10 py-5 text-2xl font-bold rounded-2xl border-4 transition-all shadow-lg ${selectedOption
                            ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                            }`}
                    >
                        ยืนยันคำตอบ
                    </button>
                </div>
            </div>
        </div>
    );
}
