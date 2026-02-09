import { getVideoEmbedUrl, needsIframeEmbed } from '@/lib/youtube-utils';
import { useRef, useState } from 'react';

interface InstructorModalProps {
    videoSrc: string;
    questionNumber: number;
    questionTitle: string;
    onClose: () => void;
}

export default function InstructorModal({ videoSrc, questionNumber, questionTitle, onClose }: InstructorModalProps) {
    const useIframe = needsIframeEmbed(videoSrc);
    const embedUrl = getVideoEmbedUrl(videoSrc);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Play video and enter fullscreen
    const handlePlayClick = async () => {
        if (videoRef.current) {
            try {
                // Play the video first
                await videoRef.current.play();
                setIsPlaying(true);

                // Then request fullscreen
                if (videoRef.current.requestFullscreen) {
                    await videoRef.current.requestFullscreen();
                }
            } catch (err) {
                console.log('Play or fullscreen request failed:', err);
                setIsPlaying(true); // Still set playing even if fullscreen fails
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full border-2 md:border-4 border-purple-400 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                        คำอธิบายการทำแบบทดสอบ
                    </h2>
                    <p className="text-base md:text-lg text-gray-600">
                        ดูคำอธิบายแล้วกดปุ่มด้านล่างเพื่อเริ่มทำแบบทดสอบ
                    </p>
                    <p className="text-xl md:text-xl font-bold text-gray-800 mt-2">
                        ข้อที่ {questionTitle}
                    </p>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 md:border-4 border-gray-300 mb-4 md:mb-6">
                    {useIframe ? (
                        <iframe
                            src={embedUrl || ''}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="relative w-full h-full">
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                controls={isPlaying}
                                className="w-full h-full object-cover"
                                onEnded={() => setIsPlaying(false)}
                            >
                                Your browser does not support the video tag.
                            </video>

                            {!isPlaying && (
                                <div
                                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group z-10"
                                    onClick={handlePlayClick}
                                >
                                    <div className="bg-purple-600 group-hover:bg-purple-700 rounded-full p-6 md:p-8 transition-all transform group-hover:scale-110 shadow-2xl">
                                        <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <p className="text-white text-sm md:text-base font-semibold bg-black/50 inline-block px-4 py-2 rounded-full">
                                            กดเพื่อเล่นและขยายเต็มจอ
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 text-xl md:text-2xl font-bold rounded-2xl border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                    ▶️ เริ่มทำแบบทดสอบ
                </button>
            </div>
        </div>
    );
}
