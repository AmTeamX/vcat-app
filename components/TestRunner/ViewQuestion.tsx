import { Question } from '@/data/questions';
import Image from 'next/image';

interface ViewQuestionProps {
    question: Question;
    viewTimer: number | null;
}

export default function ViewQuestion({ question, viewTimer }: ViewQuestionProps) {
    return (
        <div className="h-full">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white shadow-2xl p-4 md:p-6 rounded-3xl h-full flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-4 md:mb-6 w-full max-w-4xl">
                        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden">
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

                <div className="bg-purple-50 border-2 md:border-4 border-purple-300 rounded-2xl p-6 md:p-8 w-full max-w-md">
                    <div className="text-4xl md:text-6xl font-bold text-purple-600 mb-2 md:mb-4 text-center">
                        {viewTimer}s
                    </div>
                    <p className="text-xl md:text-3xl text-gray-700 text-center">
                        ดูแล้วจดจำรูปภาพ...
                    </p>
                </div>
            </div>

        </div>
    );
}
