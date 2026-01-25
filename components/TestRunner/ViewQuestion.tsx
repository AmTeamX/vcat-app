import { Question } from '@/data/questions';
import Image from 'next/image';

interface ViewQuestionProps {
    question: Question;
    viewTimer: number | null;
}

export default function ViewQuestion({ question, viewTimer }: ViewQuestionProps) {
    return (
        <div className="">
            {/* LEFT PANEL: Question Content */}
            <div className="bg-white shadow-2xl p-8 ">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    {question.title}
                </h2>

                {question.image && (
                    <div className="mb-6">
                        <div className="relative w-full h-125 rounded-2xl overflow-hidden">
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

                <div className="bg-purple-50 border-4 border-purple-300 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-purple-600 mb-4 text-center">
                        {viewTimer}s
                    </div>
                    <p className="text-3xl text-gray-700 text-center">
                        ดูแล้วจดจำรูปภาพ...
                    </p>
                </div>
            </div>

        </div>
    );
}
