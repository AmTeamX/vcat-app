import { Question } from '@/data/questions';
import Image from 'next/image';
import { useState } from 'react';

interface MultiChoiceQuestionProps {
    question: Question;
    onAnswer: (selectedIds: string[]) => void;
    selectedAnswers?: string[];
    requiredCount?: number; // How many items must be selected
}

export default function MultiChoiceQuestion({
    question,
    onAnswer,
    selectedAnswers,
    requiredCount = 3
}: MultiChoiceQuestionProps) {
    const [selected, setSelected] = useState<Set<string>>(
        new Set(selectedAnswers || [])
    );

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
            onAnswer(Array.from(selected));
        }
    };

    const isComplete = selected.size === requiredCount;

    return (
        <div className="grid grid-cols-2 gap-8">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-6">
                        <div className="relative w-full h-125 rounded-2xl overflow-hidden border-4 border-gray-300">
                            <Image
                                src={question.image}
                                alt={question.title}
                                fill
                                className="object-cover"
                                unoptimized={question.image.startsWith('/')}
                            />
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6">
                    <p className="text-2xl font-bold text-blue-800 text-center">
                        เลือก {requiredCount} รูป
                    </p>
                    <p className="text-xl text-gray-700 text-center mt-2">
                        เลือกแล้ว: {selected.size} / {requiredCount}
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL: Answer Options */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
                <h3 className="text-3xl font-bold mb-6 text-gray-800">
                    เลือกรูปที่ไม่ปรากฏในภาพ:
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {question.options?.map((option) => {
                        const isSelected = selected.has(option.id);
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleToggle(option.id)}
                                className={`border-4 rounded-2xl p-4 transition-all hover:scale-105 active:scale-95 ${isSelected
                                        ? 'bg-green-200 border-green-600 ring-4 ring-green-300'
                                        : 'bg-blue-100 hover:bg-blue-200 border-blue-400'
                                    }`}
                            >
                                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
                                    <Image
                                        src={option.image}
                                        alt={option.label}
                                        fill
                                        className="object-cover"
                                        unoptimized={option.image.startsWith('/')}
                                    />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
                                    {isSelected && <span className="text-green-600 text-3xl">✓</span>}
                                    {option.id}. {option.label}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className={`w-full px-8 py-6 text-3xl font-bold rounded-2xl border-4 transition-all ${isComplete
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
