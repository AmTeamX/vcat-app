import { getVideoEmbedUrl, needsIframeEmbed } from '@/lib/youtube-utils';
import { useState } from 'react';

interface OutroModalProps {
    videos: string[];
    maxScore?: number;
    onClose: (score?: number) => void;
}

export default function OutroModal({ videos, maxScore, onClose }: OutroModalProps) {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [showScoring, setShowScoring] = useState(false);
    const [selectedScore, setSelectedScore] = useState<number | null>(null);

    const currentVideo = videos[currentVideoIndex];
    const isLastVideo = currentVideoIndex === videos.length - 1;
    const useIframe = needsIframeEmbed(currentVideo);
    const embedUrl = getVideoEmbedUrl(currentVideo);
    const needsScoring = maxScore !== undefined && maxScore > 0;

    const handleNext = () => {
        if (!isLastVideo) {
            // Move to next video
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else if (needsScoring) {
            // Show scoring interface
            setShowScoring(true);
        } else {
            // No scoring needed, proceed
            onClose();
        }
    };

    const handleScoreSubmit = () => {
        if (selectedScore !== null) {
            onClose(selectedScore);
        }
    };

    if (showScoring && needsScoring) {
        return (
            <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full border-2 md:border-4 border-orange-400">
                    <div className="text-center mb-4 md:mb-6">
                        <div className="text-4xl md:text-6xl mb-2 md:mb-4">📝</div>
                        <h2 className="text-2xl md:text-4xl font-bold text-orange-600 mb-2">
                            Score the Performance
                        </h2>
                        <p className="text-base md:text-xl text-gray-600">
                            Rate based on what you observed
                        </p>
                    </div>

                    <div className="mb-4 md:mb-6">
                        <p className="text-lg md:text-2xl font-semibold mb-4 md:mb-6 text-gray-700 text-center">
                            Select score (0-{maxScore}):
                        </p>
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {Array.from({ length: (maxScore || 0) + 1 }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedScore(i)}
                                    className={`text-xl md:text-3xl font-bold py-4 md:py-6 rounded-2xl border-2 md:border-4 transition-all ${selectedScore === i
                                        ? 'bg-orange-600 text-white border-orange-700 scale-110'
                                        : 'bg-orange-100 text-gray-800 border-orange-400 hover:bg-orange-200'
                                        }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleScoreSubmit}
                        disabled={selectedScore === null}
                        className={`w-full px-6 py-4 text-xl md:text-2xl font-bold rounded-2xl border-b-4 transition-all active:border-b-0 active:translate-y-1 ${selectedScore !== null
                            ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                            }`}
                    >
                        ✓ Submit Score & Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full border-2 md:border-4 border-green-400">
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                        {videos.length > 1 ? `Video ${currentVideoIndex + 1} of ${videos.length}` : 'Great Job!'}
                    </h2>
                    <p className="text-base md:text-xl text-gray-600">
                        {isLastVideo && needsScoring
                            ? 'Watch carefully - you will score this performance next'
                            : isLastVideo
                                ? 'Watch this before moving to the next question'
                                : 'Watch and continue to the next video'}
                    </p>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 md:border-4 border-gray-300 mb-4 md:mb-6">
                    {useIframe ? (
                        <iframe
                            key={currentVideo}
                            src={embedUrl || ''}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    ) : (
                        <video
                            key={currentVideo}
                            src={currentVideo}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                <button
                    onClick={handleNext}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 text-xl md:text-2xl font-bold rounded-2xl border-b-4 border-green-700 transition-all active:border-b-0 active:translate-y-1"
                >
                    {!isLastVideo
                        ? '▶️ Next Video'
                        : needsScoring
                            ? '▶️ Continue to Scoring'
                            : '▶️ Continue to Next Question'}
                </button>
            </div>
        </div>
    );
}
