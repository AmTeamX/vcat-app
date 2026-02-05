'use client';

import { Question } from '@/data/questions';
import { getVideoEmbedUrl, needsIframeEmbed } from '@/lib/youtube-utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface TestRunner01Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    onComplete: (totalScore: number, duration: number) => void;
    currentAnswer?: any;
    viewTimer: number | null;
}

type ViewState = 'viewing' | 'outro1-video' | 'outro1-image' | 'outro2-video' | 'outro2-image' | 'scoring';

/**
 * TestRunner for Question 1: View Scene
 * Displays a scene that the user must memorize for 1 minute
 * Custom outro: Show video 1 with image, then video 2
 */
export default function TestRunner01({ question, onNext, onComplete, currentAnswer, viewTimer }: TestRunner01Props) {
    const router = useRouter();
    const [state, setState] = useState<ViewState>('viewing');
    const [timer, setTimer] = useState<number>(question.duration || 60);
    const [timerActive, setTimerActive] = useState(false);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const readyRef = useRef<HTMLDivElement>(null);
    const viewingRef = useRef<HTMLDivElement>(null);
    const outro1VideoRef = useRef<HTMLDivElement>(null);
    const outro1ImageRef = useRef<HTMLDivElement>(null);
    const outro2VideoRef = useRef<HTMLDivElement>(null);
    const outro2ImageRef = useRef<HTMLDivElement>(null);
    const scoringRef = useRef<HTMLDivElement>(null);

    const outroVideos = question.outroVideos || [];
    const itemsToCheck = ['สุนัข', 'ต้นมะพร้าว', 'ว่าว', 'ผู้หญิง', 'กระดูก'];

    // Timer countdown
    useEffect(() => {
        if (!timerActive) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive]);

    // Auto move to outro when timer reaches 0
    useEffect(() => {
        if (timer === 0 && !timerActive && state === 'viewing') {
            if (question.outroVideos && question.outroVideos[0]) {
                setState('outro1-video');
            } else {
                onNext(0, 'viewed');
            }
        }
    }, [timer, timerActive, state, question.outroVideos, onNext]);

    // Auto scroll when state changes
    useEffect(() => {
        setTimeout(() => {
            if (state === 'viewing') {
                viewingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (state === 'outro1-video') {
                outro1VideoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (state === 'outro1-image') {
                outro1ImageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (state === 'outro2-video') {
                outro2VideoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (state === 'outro2-image') {
                outro2ImageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (state === 'scoring') {
                scoringRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }, [state]);

    const handleStartTimer = () => {
        setTimerActive(true);
    };

    const handleOutro1ShowImage = () => {
        setState('outro1-image');
    };

    const handleOutro1ImageNext = () => {
        if (outroVideos[1]) {
            setState('outro2-video');
        } else {
            onNext(0, 'viewed');
        }
    };

    const handleOutro2ShowImage = () => {
        setState('outro2-image');
    };

    const handleOutro2ImageNext = () => {
        setState('scoring');
    };

    // Viewing state - show image with timer or start button or start button
    if (state === 'viewing') {
        return (
            <div ref={viewingRef} className="w-full min-h-screen flex items-center justify-center px-4 py-4">
                <div className="bg-white p-3 md:p-4 max-w-6xl w-full rounded-3xl">
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800 text-center">
                        {question.title}
                    </h2>

                    {question.image && (
                        <div className="mb-2 md:mb-3">
                            <div className="relative w-full max-h-[calc(100vh-200px)] aspect-[4/3] rounded-2xl overflow-hidden">
                                <Image
                                    src={question.image}
                                    alt={question.title}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    className="object-contain"
                                    unoptimized={question.image.startsWith('/')}
                                    priority

                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        {!timerActive ? (
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleStartTimer}
                                    className="px-4 py-2 md:px-6 md:py-3 text-base md:text-lg font-bold rounded-xl border-2 bg-green-500 hover:bg-green-600 text-white border-green-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    ▶️ เริ่มจับเวลา
                                </button>
                            </div>
                        ) : (
                            <div className="text-2xl md:text-3xl font-bold text-purple-600 text-center">
                                ⏱️ {timer}s
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Outro 1 Video - Show video 1 with button to show image
    if (state === 'outro1-video' && outroVideos[0]) {
        const useIframe = needsIframeEmbed(outroVideos[0]);
        const embedUrl = getVideoEmbedUrl(outroVideos[0]);

        return (
            <div ref={outro1VideoRef} className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 max-w-2xl w-full border-2 md:border-4 border-blue-400">
                    <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                            บอกชื่อตําแหน่ง
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600">
                            บอกชื่อตําแหน่งที่ปรากฏในภาพ
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
                                src={outroVideos[0]}
                                controls
                                autoPlay
                                className="w-full h-full object-cover"
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>

                    <button
                        onClick={handleOutro1ShowImage}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 border-purple-600 transition-all hover:scale-105 active:scale-95"
                    >
                        👁️ ดูภาพ
                    </button>
                </div>
            </div>
        );
    }

    // Outro 1 Image - Show image with button to next
    if (state === 'outro1-image') {
        return (
            <div ref={outro1ImageRef} className="w-full min-h-screen flex items-center justify-center px-4 py-4">
                <div className="bg-white p-3 md:p-4 max-w-6xl w-full rounded-3xl">
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800 text-center">
                        บอกตําแหน่งของภาพนี้
                    </h2>

                    {question.image && (
                        <div className="mb-2 md:mb-3">
                            <div className="relative w-full max-h-[calc(100vh-200px)] aspect-[4/3] rounded-2xl overflow-hidden">
                                <Image
                                    src={question.image}
                                    alt={question.title}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    className="object-contain"
                                    unoptimized={question.image.startsWith('/')}
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleOutro1ImageNext}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 text-lg md:text-xl font-bold rounded-xl border-2 border-blue-600 transition-all hover:scale-105 active:scale-95"
                    >
                        ▶️ ถัดไป
                    </button>
                </div>
            </div>
        );
    }

    // Outro 2 Video - Show video 2 with button to show image
    if (state === 'outro2-video' && outroVideos[1]) {
        const useIframe = needsIframeEmbed(outroVideos[1]);
        const embedUrl = getVideoEmbedUrl(outroVideos[1]);

        return (
            <div ref={outro2VideoRef} className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 max-w-2xl w-full border-2 md:border-4 border-blue-400">
                    <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                            บอกชื่อสิ่งของในภาพ
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600">
                            บอกสิ่งของในภาพที่คุณเห็น
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
                                src={outroVideos[1]}
                                controls
                                autoPlay
                                className="w-full h-full object-cover"
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>

                    <button
                        onClick={handleOutro2ShowImage}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 border-purple-600 transition-all hover:scale-105 active:scale-95"
                    >
                        👁️ ดูภาพ
                    </button>
                </div>
            </div>
        );
    }

    // Outro 2 Image - Show image with button to next question
    if (state === 'outro2-image') {
        return (
            <div ref={outro2ImageRef} className="w-full min-h-screen flex items-center justify-center px-4 py-4">
                <div className="bg-white p-3 md:p-4 max-w-6xl w-full rounded-3xl">
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800 text-center">
                        บอกชื่อสิ่งของในภาพนี้
                    </h2>

                    {question.image && (
                        <div className="mb-2 md:mb-3">
                            <div className="relative w-full max-h-[calc(100vh-200px)] aspect-[4/3] rounded-2xl overflow-hidden">
                                <Image
                                    src={question.image}
                                    alt={question.title}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    className="object-contain"
                                    unoptimized={question.image.startsWith('/')}
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleOutro2ImageNext}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 text-lg md:text-xl font-bold rounded-xl border-2 border-green-600 transition-all hover:scale-105 active:scale-95"
                    >
                        ไปข้อถัดไป ➡️
                    </button>
                </div>
            </div>
        );
    }

    // Scoring state - Check items seen in the image
    if (state === 'scoring') {
        const handleToggleItem = (item: string) => {
            setCheckedItems(prev => {
                if (prev.includes(item)) {
                    return prev.filter(i => i !== item);
                } else {
                    return [...prev, item];
                }
            });
        };

        const handleSubmitScore = () => {
            if (checkedItems.length === 0) {
                // No items checked - end test and return to dashboard WITHOUT saving to database
                router.push('/dashboard');
            } else if (checkedItems.length >= 1) {
                // At least 1 item checked - proceed with score
                const score = checkedItems.length;
                onNext(score, { checkedItems });
            }
        };

        const canProceed = checkedItems.length === 0 || checkedItems.length >= 1;

        return (
            <div ref={scoringRef} className="w-full min-h-screen flex items-center justify-center px-4 py-8">
                <div className="bg-white p-6 md:p-8 max-w-2xl w-full rounded-3xl shadow-lg border-2 border-purple-300">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center">
                        การให้คะแนน
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 text-center mb-6">
                        เลือกสิ่งที่ผู้ที่ทำแบบทดสอบเห็นในภาพ
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {itemsToCheck.map((item) => (
                            <label
                                key={item}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${checkedItems.includes(item)
                                    ? 'bg-purple-100 border-purple-500'
                                    : 'bg-gray-50 border-gray-300 hover:border-purple-300'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checkedItems.includes(item)}
                                    onChange={() => handleToggleItem(item)}
                                    className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="ml-4 text-lg md:text-xl font-semibold text-gray-800">
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>



                    <button
                        onClick={handleSubmitScore}
                        disabled={!canProceed}
                        className={`w-full px-6 py-4 text-xl md:text-2xl font-bold rounded-xl border-2 transition-all ${canProceed
                            ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {checkedItems.length === 0 ? 'สิ้นสุดการประเมิน' : 'ส่งคำตอบและไปต่อ ➡️'}
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
