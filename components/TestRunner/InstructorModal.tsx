import { getVideoEmbedUrl, needsIframeEmbed } from '@/lib/youtube-utils';

interface InstructorModalProps {
    videoSrc: string;
    onClose: () => void;
}

export default function InstructorModal({ videoSrc, onClose }: InstructorModalProps) {
    const useIframe = needsIframeEmbed(videoSrc);
    const embedUrl = getVideoEmbedUrl(videoSrc);

    return (
        <div className="fixed inset-0 bg-white/90  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full border-2 md:border-4 border-purple-400">
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                        คำอธิบายการทำข้อสอบ
                    </h2>
                    <p className="text-base md:text-lg text-gray-600">
                        ดูคำอธิบายแล้วกดปุ่มด้านล่างเพื่อเริ่มทำข้อสอบ
                    </p>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 md:border-4 border-gray-300 mb-4 md:mb-6">
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
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 text-xl md:text-2xl font-bold rounded-2xl border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                    ▶️ เริ่มทำข้อสอบ
                </button>
            </div>
        </div>
    );
}
