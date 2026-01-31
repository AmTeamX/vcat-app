import { getVideoEmbedUrl, needsIframeEmbed } from '@/lib/youtube-utils';

interface HelpModalProps {
    videoSrc: string;
    onClose: () => void;
}

export default function HelpModal({ videoSrc, onClose }: HelpModalProps) {
    const useIframe = needsIframeEmbed(videoSrc);
    const embedUrl = getVideoEmbedUrl(videoSrc);

    return (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full border-2 md:border-4 border-blue-400">
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                        คำอธิบายการทำข้อสอบ
                    </h2>
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
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 text-xl md:text-2xl font-bold rounded-2xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                    ปิด
                </button>
            </div>
        </div>
    );
}
