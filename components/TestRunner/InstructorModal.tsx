import { getVideoEmbedUrl, needsIframeEmbed } from '@/lib/youtube-utils';

interface InstructorModalProps {
    videoSrc: string;
    onClose: () => void;
}

export default function InstructorModal({ videoSrc, onClose }: InstructorModalProps) {
    const useIframe = needsIframeEmbed(videoSrc);
    const embedUrl = getVideoEmbedUrl(videoSrc);

    return (
        <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full border-4 border-purple-400">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold text-purple-600 mb-2">
                        Sign Language Instructor
                    </h2>
                    <p className="text-xl text-gray-600">
                        Watch the instruction before starting the question
                    </p>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-gray-300 mb-6">
                    {useIframe ? (
                        <iframe
                            src={embedUrl || ''}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    ) : (
                        <video
                            src={videoSrc}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-3xl font-bold rounded-2xl border-4 border-purple-600 transition-all hover:scale-105 active:scale-95"
                >
                    ▶️ Start Question
                </button>
            </div>
        </div>
    );
}
