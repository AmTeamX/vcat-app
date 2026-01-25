import { Question } from '@/data/questions';
import { useEffect, useState } from 'react';

interface GridMatchQuestionProps {
    question: Question;
    onSubmit: (selectedCells: boolean[][], score: number) => void;
    currentAnswer?: boolean[][];
    viewTimer?: number | null;
}

export default function GridMatchQuestion({ question, onSubmit, currentAnswer, viewTimer }: GridMatchQuestionProps) {
    // Initialize user grid (6x4 = 24 cells)
    const [userGrid, setUserGrid] = useState<boolean[][]>(
        currentAnswer || Array(4).fill(null).map(() => Array(6).fill(false))
    );
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);

    const targetGrid = question.gridPattern || Array(4).fill(null).map(() => Array(6).fill(false));

    // Track elapsed time
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

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

        onSubmit(userGrid, score);
    };

    const isOverTime = elapsedTime > 30;

    const renderGrid = (grid: boolean[][], isTarget: boolean) => {
        return (
            <div className="relative inline-block">
                {/* Circle container */}
                <div className="w-96 h-96 rounded-full border-8 border-gray-800 bg-white flex items-center justify-center overflow-hidden">
                    {/* Grid inside circle */}
                    <div className="grid grid-cols-6 gap-0.5 ">
                        {grid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => !isTarget && handleCellClick(rowIndex, colIndex)}
                                    disabled={isTarget}
                                    className={`w-15 h-24 border-2 transition-all ${cell
                                        ? 'bg-black border-black'
                                        : 'bg-white border-gray-400'
                                        } ${!isTarget ? 'hover:scale-110 cursor-pointer active:scale-95' : 'cursor-default'
                                        }`}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    {question.title}
                </h2>

                {/* Timer Display */}
                <div className={`mb-6 text-center p-4 rounded-2xl border-4 ${isOverTime
                        ? 'bg-red-100 border-red-400'
                        : elapsedTime > 20
                            ? 'bg-yellow-100 border-yellow-400'
                            : 'bg-blue-100 border-blue-400'
                    }`}>
                    <div className="text-5xl font-bold mb-2">
                        ⏱️ {elapsedTime}s / 30s
                    </div>
                    {isOverTime && (
                        <p className="text-2xl font-bold text-red-600">
                            ⚠️ เกินเวลา! (0 คะแนน)
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-12 mb-8">
                    {/* LEFT: Target Pattern */}
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-6 text-gray-700">
                            ตัวอย่าง (ดูและจำ)
                        </h3>
                        {renderGrid(targetGrid, true)}
                    </div>

                    {/* RIGHT: User Input */}
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-6 text-gray-700">
                            คลิกเพื่อทำให้เหมือนด้านซ้าย
                        </h3>
                        {renderGrid(userGrid, false)}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-6 text-3xl font-bold rounded-2xl border-4 bg-green-500 hover:bg-green-600 text-white border-green-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        ส่งคำตอบ
                    </button>
                </div>
            </div>
        </div>
    );
}
