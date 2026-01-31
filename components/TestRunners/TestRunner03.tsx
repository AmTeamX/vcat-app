'use client';

import { Question } from '@/data/questions';
import { useEffect, useRef, useState } from 'react';

interface TestRunner03Props {
    question: Question;
    onNext: (score: number, answer: any) => void;
    currentAnswer?: any;
    viewTimer: number | null;
}

/**
 * TestRunner for Question 3: Grid Copy Task
 * User copies a pattern into a grid within 30 seconds
 */
export default function TestRunner03({ question, onNext, currentAnswer, viewTimer }: TestRunner03Props) {
    // Initialize user grid (6x4 = 24 cells)
    const [userGrid, setUserGrid] = useState<boolean[][]>(
        currentAnswer || Array(4).fill(null).map(() => Array(6).fill(false))
    );
    const [isStarted, setIsStarted] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const targetGrid = question.gridPattern || Array(4).fill(null).map(() => Array(6).fill(false));

    // Auto-scroll to center content
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Track elapsed time (only when started)
    useEffect(() => {
        if (!isStarted || !startTime) return;

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [isStarted, startTime]);

    const handleStart = () => {
        setIsStarted(true);
        setStartTime(Date.now());
    };

    const handleCellClick = (row: number, col: number) => {
        const newGrid = userGrid.map((r, rIndex) =>
            r.map((cell, cIndex) => {
                if (rIndex === row && cIndex === col) {
                    return !cell;
                }
                return cell;
            })
        );
        setUserGrid(newGrid);
    };

    const handleSubmit = () => {
        const timeSpent = elapsedTime;

        // Count how many filled cells match the target (only count the 6 target black cells)
        let correctBlackCells = 0;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                // Only count cells that should be black (true in target)
                if (targetGrid[row][col] === true && userGrid[row][col] === true) {
                    correctBlackCells++;
                }
            }
        }

        // Apply scoring rules
        let score = 0;

        if (timeSpent > 30) {
            // Over time limit = 0 points
            score = 0;
        } else if (correctBlackCells === 6) {
            // All 6 correct = 2 points
            score = 2;
        } else if (correctBlackCells >= 4 && correctBlackCells <= 5) {
            // 4-5 correct = 1 point
            score = 1;
        } else {
            // 0-3 correct = 0 points
            score = 0;
        }

        onNext(score, userGrid);
    };

    const renderGrid = (grid: boolean[][], isTarget: boolean) => {
        return (
            <div className="relative inline-block">
                {/* Circle container */}
                <div className="w-[80vw] h-[80vw] md:w-96 md:h-96 max-w-87.5 max-h-87.5 rounded-full border-4 md:border-8 border-gray-800 bg-white flex items-center justify-center overflow-hidden">
                    {/* Grid inside circle */}
                    <div className="grid grid-cols-6 gap-0.5">
                        {grid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => !isTarget && handleCellClick(rowIndex, colIndex)}
                                    disabled={isTarget}
                                    className={`w-10 h-16 md:w-14 md:h-24 border-2 transition-all ${cell
                                        ? 'bg-black border-black'
                                        : 'bg-white border-gray-400'
                                        } ${!isTarget ? 'hover:scale-110 cursor-pointer active:scale-95' : 'cursor-default'}`}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
            <div ref={contentRef} className="bg-white max-w-5xl w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center w-full md:w-5/6 mx-auto">
                    {question.title}
                </h2>

                {!isStarted ? (
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            className="px-8 py-4 md:px-12 md:py-6 text-2xl md:text-4xl font-bold rounded-2xl md:rounded-3xl border-2 md:border-4 bg-green-500 hover:bg-green-600 text-white border-green-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            ▶️ เริ่มทำข้อสอบ
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
                            {/* LEFT: Target Pattern */}
                            <div className="text-center">
                                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-700">
                                    ตัวอย่าง
                                </h3>
                                {renderGrid(targetGrid, true)}
                            </div>

                            {/* RIGHT: User Input */}
                            <div className="text-center">
                                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-700">
                                    คลิกเพื่อทำให้เหมือนด้านซ้าย
                                </h3>
                                {renderGrid(userGrid, false)}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-4 md:px-12 md:py-6 text-xl md:text-3xl font-bold rounded-xl md:rounded-2xl border-2 md:border-4 bg-green-500 hover:bg-green-600 text-white border-green-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                ส่งคำตอบ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
