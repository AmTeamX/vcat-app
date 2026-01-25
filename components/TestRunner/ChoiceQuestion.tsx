import { Question } from '@/data/questions';
import Image from 'next/image';

interface ChoiceQuestionProps {
    question: Question;
    onAnswer: (optionId: string) => void;
    selectedAnswer?: string;
}

export default function ChoiceQuestion({ question, onAnswer, selectedAnswer }: ChoiceQuestionProps) {
    return (
        <div className="grid grid-cols-2 ">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white p-8 ">
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
                                style={{ objectFit: "contain" }}
                                className="object-cover"
                                unoptimized={question.image.startsWith('/')}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT PANEL: Answer Options */}
            <div className="bg-white   p-8 ">
                <h3 className="text-3xl font-bold mb-6 text-gray-800">
                    Select Your Answer:
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    {question.options?.map((option) => {
                        const isSelected = selectedAnswer === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => onAnswer(option.id)}
                                className={`border-4 rounded-3xl p-6 transition-all hover:scale-105 active:scale-95 flex items-center gap-6 ${isSelected
                                    ? 'bg-green-200 border-green-600 ring-4 ring-green-300'
                                    : 'bg-blue-100 hover:bg-blue-200 border-blue-400'
                                    }`}
                            >
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={option.image}
                                        alt={option.label}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="object-cover"
                                        unoptimized={option.image.startsWith('/')}
                                    />
                                </div>
                                <div className="text-3xl font-bold text-gray-800 text-left flex items-center gap-3">
                                    {isSelected && <span className="text-green-600">✓</span>}
                                    {option.id}. {option.label}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
