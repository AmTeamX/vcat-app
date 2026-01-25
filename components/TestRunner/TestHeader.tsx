interface TestHeaderProps {
    currentIndex: number;
    totalQuestions: number;
    elapsedTime: number;
    hasInstructorVideo: boolean;
    onShowHelp: () => void;
    onPrevious: () => void;
    onNext: () => void;
    canGoBack: boolean;
    canGoNext: boolean;
    answeredCount: number;
    isLastQuestion: boolean;
}

export default function TestHeader({
    currentIndex,
    totalQuestions,
    elapsedTime,
    hasInstructorVideo,
    onShowHelp,
    onPrevious,
    onNext,
    canGoBack,
    canGoNext,
    answeredCount,
    isLastQuestion
}: TestHeaderProps) {
    return (
        <div className="w-screen mx-auto border-b-2 border-gray-300 shadow-sm">
            <div className="bg-white p-4">
                <div className="flex justify-between items-center mb-4">
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center gap-4 mb-4">
                        <button
                            onClick={onPrevious}
                            disabled={!canGoBack}
                            className={`text-3xl pl-4 ${!canGoBack
                                ? ' text-gray-500 border-gray-400 cursor-not-allowed'
                                : ' text-black hover:scale-105 active:scale-95'
                                }`}
                        >
                            ←
                        </button>
                        <div className="text-3xl font-bold text-gray-800">
                            Question {currentIndex + 1} / {totalQuestions}
                        </div>
                        <div className="flex items-center gap-4">
                            {hasInstructorVideo && (
                                <button
                                    onClick={onShowHelp}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 w-8 h-8 text-8 font-bold rounded-full border-4 border-yellow-500 transition-all hover:scale-110 active:scale-95 shadow-lg"
                                    title="Watch instructor video"
                                >
                                    ?
                                </button>
                            )}
                            <div className="text-xl text-gray-600">
                                ⏱️ {elapsedTime}s
                            </div>
                        </div>
                    </div>



                    <div className="text-lg text-gray-600 font-semibold">
                        {answeredCount} / {totalQuestions} answered
                    </div>

                    <button
                        onClick={onNext}
                        disabled={!canGoNext}
                        className={`px-6 py-3 text-xl font-bold rounded-xl border-4 transition-all ${!canGoNext
                            ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                            : isLastQuestion
                                ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                                : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600 hover:scale-105 active:scale-95'
                            }`}
                    >
                        {isLastQuestion ? '✓ Complete' : 'Next →'}
                    </button>
                </div>

                <div className="bg-gray-200 rounded-full h-4 border-2 border-gray-300">
                    <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
