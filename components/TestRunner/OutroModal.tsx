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
            <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full border-4 border-orange-400">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-4xl font-bold text-orange-600 mb-2">
                            Score the Performance
                        </h2>
                        <p className="text-xl text-gray-600">
                            Rate based on what you observed
                        </p>
                    </div>

                    <div className="mb-6">
                        <p className="text-2xl font-semibold mb-6 text-gray-700 text-center">
                            Select score (0-{maxScore}):
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: (maxScore || 0) + 1 }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedScore(i)}
                                    className={`text-3xl font-bold py-6 rounded-2xl border-4 transition-all ${selectedScore === i
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
                        className={`w-full px-8 py-6 text-3xl font-bold rounded-2xl border-4 transition-all ${selectedScore !== null
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
        <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full border-4 border-green-400">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold text-green-600 mb-2">
                        {videos.length > 1 ? `Video ${currentVideoIndex + 1} of ${videos.length}` : 'Great Job!'}
                    </h2>
                    <p className="text-xl text-gray-600">
                        {isLastVideo && needsScoring
                            ? 'Watch carefully - you will score this performance next'
                            : isLastVideo
                                ? 'Watch this before moving to the next question'
                                : 'Watch and continue to the next video'}
                    </p>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-gray-300 mb-6">
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
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-3xl font-bold rounded-2xl border-4 border-green-600 transition-all hover:scale-105 active:scale-95"
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
