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
        <div className="w-screen mx-auto border-b border-gray-300 shadow-sm">
            <div className="bg-white p-3 md:p-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onPrevious}
                                disabled={!canGoBack}
                                className={`text-2xl md:text-3xl ${!canGoBack
                                    ? ' text-gray-300 cursor-not-allowed'
                                    : ' text-black hover:scale-105 active:scale-95'
                                    }`}
                            >
                                ←
                            </button>
                            <div className="text-lg md:text-2xl font-bold text-gray-800 whitespace-nowrap">
                                Q {currentIndex + 1} / {totalQuestions}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto md:ml-4">
                            {hasInstructorVideo && (
                                <button
                                    onClick={onShowHelp}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 w-8 h-8 flex items-center justify-center font-bold rounded-full border-2 border-yellow-500 transition-all hover:scale-110 active:scale-95 shadow-lg text-lg"
                                    title="Watch instructor video"
                                >
                                    ?
                                </button>
                            )}
                            <div className="text-base md:text-xl text-gray-600 whitespace-nowrap">
                                ⏱️ {elapsedTime}s
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <div className="text-sm md:text-base text-gray-600 font-semibold whitespace-nowrap">
                            {answeredCount} / {totalQuestions} answered
                        </div>

                        <button
                            onClick={onNext}
                            disabled={!canGoNext}
                            className={`px-4 py-2 md:px-6 md:py-3 text-base md:text-xl font-bold rounded-xl border-b-4 transition-all active:border-b-0 active:translate-y-1 ${!canGoNext
                                ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                : isLastQuestion
                                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600 hover:scale-105 active:scale-95'
                                }`}
                        >
                            {isLastQuestion ? '✓ Complete' : 'Next →'}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-200 rounded-full h-3 md:h-4 border border-gray-300">
                    <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
