import { Question } from '@/data/questions';
import Image from 'next/image';

interface ManualQuestionProps {
    question: Question;
    onScore: (score: number) => void;
    currentScore?: number;
    viewTimer?: number | null;
}

export default function ManualQuestion({ question, onScore, currentScore, viewTimer }: ManualQuestionProps) {
    const maxScore = question.maxScore || 5;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-full">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-4 md:mb-6">
                        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl">
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



            </div>

            {/* RIGHT PANEL: Scoring Options */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm overflow-y-auto">
                {viewTimer !== null && viewTimer !== undefined && (
                    <div className="bg-purple-50 border-2 md:border-4 border-purple-300 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                        <div className="text-3xl md:text-5xl font-bold text-purple-600 text-center">
                            ⏱️ {viewTimer}s
                        </div>
                    </div>
                )}

                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                    Score the Response:
                </h3>

                <div>
                    <p className="text-lg md:text-2xl font-semibold mb-4 md:mb-6 text-gray-700 text-center">
                        Select score (0-{maxScore}):
                    </p>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {Array.from({ length: maxScore + 1 }, (_, i) => {
                            const isSelected = currentScore === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => onScore(i)}
                                    className={`text-2xl md:text-4xl font-bold h-16 md:h-24 rounded-xl md:rounded-2xl border-2 md:border-4 transition-all hover:scale-105 active:scale-95 ${isSelected
                                        ? 'bg-green-600 text-white border-green-700 ring-4 ring-green-300'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600'
                                        }`}
                                >
                                    {isSelected && <span className="mr-2">✓</span>}
                                    {i}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {question.instruction && (
                    <div className="bg-yellow-50 border-2 md:border-4 border-yellow-300 rounded-xl md:rounded-2xl p-4 md:p-6 mt-4">
                        <p className="text-lg md:text-2xl text-gray-700">
                            📋 <strong>Instructions:</strong> {question.instruction}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
