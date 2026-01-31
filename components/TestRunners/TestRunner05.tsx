'use client';

import { Question } from '@/data/questions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TestRunner05Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
}

/**
 * TestRunner for Question 5: Multi-Choice - Missing Items
 * User selects 3 items that were NOT in the scene from Question 1
 */
export default function TestRunner05({ question, onNext, currentAnswer }: TestRunner05Props) {
    const requiredCount = question.requiredSelections || 3;
    const [selected, setSelected] = useState<Set<string>>(
        new Set(currentAnswer || [])
    );
    const contentRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to center content
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Map between a,b,c,d,e,f and ก,ข,ค,ง,จ,ฉ
    const idMap: { [key: string]: string } = {
        'A': 'ก',
        'B': 'ข',
        'C': 'ค',
        'D': 'ง',
        'E': 'จ',
        'F': 'ฉ'
    };

    const handleToggle = (optionId: string) => {
        const newSelected = new Set(selected);
        if (newSelected.has(optionId)) {
            newSelected.delete(optionId);
        } else {
            newSelected.add(optionId);
        }
        setSelected(newSelected);
    };

    const handleSubmit = () => {
        if (selected.size === requiredCount) {
            const selectedIds = Array.from(selected);
            const correctAnswers = question.correctAnswers || [];
            let score = 0;

            selectedIds.forEach(id => {
                if (correctAnswers.includes(id)) {
                    score += 1; // 1 point per correct answer
                }
            });

            onNext(score, selectedIds);
        }
    };

    const isComplete = selected.size === requiredCount;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
            <div ref={contentRef} className="bg-white p-4 md:p-8 max-w-5xl w-full rounded-3xl">
                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                    5. Delayed Recall (ภาพเหตุการณ์): จงเลือกรูปทั้ง 3 รูป
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                    {question.options?.map((option) => {
                        const isSelected = selected.has(option.id);
                        const displayId = idMap[option.id] || option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleToggle(option.id)}
                                className={`border-2 md:border-4 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all hover:scale-105 active:scale-95 ${isSelected
                                    ? 'bg-blue-500 border-blue-600 ring-2 md:ring-4 ring-blue-300'
                                    : 'bg-white hover:bg-gray-100 border-gray-400'
                                    }`}
                            >
                                <div className="relative w-full h-24 md:h-36 rounded-lg md:rounded-xl overflow-hidden mb-2">
                                    <Image
                                        src={option.image}
                                        alt={option.label}
                                        fill
                                        className="object-contain"
                                        unoptimized={option.image.startsWith('/')}
                                    />
                                </div>
                                <div className={`text-xl md:text-2xl font-bold text-center flex items-center justify-center gap-2 ${isSelected ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    {displayId}. {option.label}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className={`w-full px-6 py-4 md:px-8 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 transition-all ${isComplete
                        ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                        : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isComplete ? 'ส่งคำตอบ' : `เลือกอีก ${requiredCount - selected.size} รูป`}
                </button>
            </div>
        </div>
    );
}
