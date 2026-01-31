import { Question } from '@/data/questions';
import Image from 'next/image';

interface ChoiceQuestionProps {
    question: Question;
    onAnswer: (optionId: string) => void;
    selectedAnswer?: string;
}

export default function ChoiceQuestion({ question, onAnswer, selectedAnswer }: ChoiceQuestionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white p-4 md:p-6 ">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-4 md:mb-6">
                        <div className="relative w-full h-64 md:h-96 overflow-hidden">
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
            <div className="bg-white p-4 md:p-6 overflow-y-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
                    Select Your Answer:
                </h3>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {question.options?.map((option) => {
                        const isSelected = selectedAnswer === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => onAnswer(option.id)}
                                className={`p-3 md:p-6 transition-all hover:scale-105 active:scale-95 flex flex-col md:flex-row items-center gap-3 md:gap-6 border-2 rounded-xl h-full justify-center ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                            >
                                <div className="text-xl md:text-3xl font-bold text-gray-800 text-left flex items-center gap-3">
                                    {isSelected && <span className="text-green-600">✓</span>}
                                    {option.id}. {option.label}
                                </div>
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
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
            </div>
        </div>
    );
}
