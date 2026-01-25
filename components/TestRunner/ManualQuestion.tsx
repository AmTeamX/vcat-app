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
        <div className="grid grid-cols-2 gap-8">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white ">
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-6">
                        <div className="relative w-full h-125  overflow-hidden ">
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
            <div className="bg-white ">
                {viewTimer !== null && viewTimer !== undefined && (
                    <div className="bg-purple-50 border-4 border-purple-300 rounded-2xl p-6 mb-6">
                        <div className="text-5xl font-bold text-purple-600 text-center">
                            ⏱️ {viewTimer}s
                        </div>
                    </div>
                )}

                <h3 className="text-3xl font-bold mb-6 text-gray-800">
                    Score the Response:
                </h3>

                <div>
                    <p className="text-2xl font-semibold mb-6 text-gray-700 text-center">
                        Select score (0-{maxScore}):
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: maxScore + 1 }, (_, i) => {
                            const isSelected = currentScore === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => onScore(i)}
                                    className={`text-4xl font-bold h-24 rounded-2xl border-4 transition-all hover:scale-110 active:scale-95 ${isSelected
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
                    <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-6 mt-4">
                        <p className="text-2xl text-gray-700">
                            📋 <strong>Instructions:</strong> {question.instruction}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
