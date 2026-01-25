/**
 * Specialized Manual Scoring Components
 * Components for specific VCAT question types with complex scoring logic
 */

import { useState } from 'react';

// ===== ITEM 3: Grid Copy with Time Tracking =====
interface GridCopyInputProps {
    onSubmit: (correctCells: number, timeSpent: number) => void;
}

export function GridCopyInput({ onSubmit }: GridCopyInputProps) {
    const [correctCells, setCorrectCells] = useState<number>(0);
    const [startTime] = useState(Date.now());

    const handleSubmit = () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onSubmit(correctCells, timeSpent);
    };

    return (
        <div className="space-y-4">
            <p className="text-xl font-semibold">
                Count correctly filled cells (max 6):
            </p>
            <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                        key={num}
                        onClick={() => setCorrectCells(num)}
                        className={`text-2xl font-bold h-16 rounded-xl border-4 transition-all ${correctCells === num
                            ? 'bg-blue-600 text-white border-blue-700 scale-110'
                            : 'bg-blue-100 text-gray-800 border-blue-400 hover:bg-blue-200'
                            }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 rounded-xl border-4 border-green-600"
            >
                ✓ Submit Score
            </button>
            <p className="text-sm text-gray-600 text-center">
                Time limit: 30 seconds (timer tracked automatically)
            </p>
        </div>
    );
}

// ===== ITEM 4: Cancellation Error Counter =====
interface CancellationInputProps {
    onSubmit: (errors: number) => void;
}

export function CancellationInput({ onSubmit }: CancellationInputProps) {
    const [errors, setErrors] = useState<number>(0);

    return (
        <div className="space-y-4">
            <p className="text-xl font-semibold">
                Count errors (missed targets or wrong selections):
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
                <button
                    onClick={() => setErrors(Math.max(0, errors - 1))}
                    className="bg-red-500 hover:bg-red-600 text-white text-4xl font-bold w-16 h-16 rounded-full border-4 border-red-600"
                >
                    −
                </button>
                <div className="bg-gray-100 border-4 border-gray-400 rounded-2xl px-8 py-4 min-w-30 text-center">
                    <span className="text-5xl font-bold text-gray-800">{errors}</span>
                    <p className="text-sm text-gray-600">errors</p>
                </div>
                <button
                    onClick={() => setErrors(errors + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-4xl font-bold w-16 h-16 rounded-full border-4 border-blue-600"
                >
                    +
                </button>
            </div>
            <button
                onClick={() => onSubmit(errors)}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 rounded-xl border-4 border-green-600"
            >
                ✓ Submit Score
            </button>
        </div>
    );
}

// ===== ITEM 9: Gears (Two Sub-tasks) =====
interface GearsInputProps {
    onSubmit: (taskA: boolean, taskB: boolean) => void;
}

export function GearsInput({ onSubmit }: GearsInputProps) {
    const [taskA, setTaskA] = useState<boolean | null>(null);
    const [taskB, setTaskB] = useState<boolean | null>(null);

    const canSubmit = taskA !== null && taskB !== null;

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 border-4 border-gray-300 rounded-2xl p-6">
                <p className="text-2xl font-bold mb-4">Task A:</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setTaskA(true)}
                        className={`flex-1 text-2xl font-bold py-4 rounded-xl border-4 transition-all ${taskA === true
                            ? 'bg-green-500 text-white border-green-600 scale-105'
                            : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300'
                            }`}
                    >
                        ✓ Correct
                    </button>
                    <button
                        onClick={() => setTaskA(false)}
                        className={`flex-1 text-2xl font-bold py-4 rounded-xl border-4 transition-all ${taskA === false
                            ? 'bg-red-500 text-white border-red-600 scale-105'
                            : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300'
                            }`}
                    >
                        ✗ Wrong
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 border-4 border-gray-300 rounded-2xl p-6">
                <p className="text-2xl font-bold mb-4">Task B:</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setTaskB(true)}
                        className={`flex-1 text-2xl font-bold py-4 rounded-xl border-4 transition-all ${taskB === true
                            ? 'bg-green-500 text-white border-green-600 scale-105'
                            : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300'
                            }`}
                    >
                        ✓ Correct
                    </button>
                    <button
                        onClick={() => setTaskB(false)}
                        className={`flex-1 text-2xl font-bold py-4 rounded-xl border-4 transition-all ${taskB === false
                            ? 'bg-red-500 text-white border-red-600 scale-105'
                            : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300'
                            }`}
                    >
                        ✗ Wrong
                    </button>
                </div>
            </div>

            <button
                onClick={() => taskA !== null && taskB !== null && onSubmit(taskA, taskB)}
                disabled={!canSubmit}
                className={`w-full text-2xl font-bold py-4 rounded-xl border-4 transition-all ${canSubmit
                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
                    : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                    }`}
            >
                ✓ Submit Score
            </button>
        </div>
    );
}

// ===== ITEM 14: Delayed Recall with Hint Tracking =====
interface DelayedRecallItem {
    name: 'chicken' | 'bench' | 'broom' | 'teapot';
    label: string;
}

interface DelayedRecallInputProps {
    onSubmit: (items: Array<{
        name: 'chicken' | 'bench' | 'broom' | 'teapot';
        correctWithoutHint: boolean;
        correctWithHint: boolean;
    }>) => void;
}

export function DelayedRecallInput({ onSubmit }: DelayedRecallInputProps) {
    const items: DelayedRecallItem[] = [
        { name: 'chicken', label: 'Chicken (ไก่)' },
        { name: 'bench', label: 'Bench (ม้านั่ง)' },
        { name: 'broom', label: 'Broom (ไม้กวาด)' },
        { name: 'teapot', label: 'Teapot (กาน้ำชา)' },
    ];

    const [results, setResults] = useState<Record<string, 'without' | 'with' | 'wrong' | null>>({
        chicken: null,
        bench: null,
        broom: null,
        teapot: null,
    });

    const handleResult = (name: string, result: 'without' | 'with' | 'wrong') => {
        setResults({ ...results, [name]: result });
    };

    const canSubmit = Object.values(results).every((r) => r !== null);

    const handleSubmit = () => {
        const formattedResults = items.map((item) => ({
            name: item.name,
            correctWithoutHint: results[item.name] === 'without',
            correctWithHint: results[item.name] === 'with',
        }));
        onSubmit(formattedResults);
    };

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.name} className="bg-gray-50 border-4 border-gray-300 rounded-2xl p-4">
                    <p className="text-xl font-bold mb-3">{item.label}</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => handleResult(item.name, 'without')}
                            className={`text-lg font-bold py-3 rounded-xl border-4 transition-all ${results[item.name] === 'without'
                                ? 'bg-green-600 text-white border-green-700 scale-105'
                                : 'bg-green-100 text-gray-800 border-green-400 hover:bg-green-200'
                                }`}
                        >
                            ✓ No Hint<br /><span className="text-sm">(2 pts)</span>
                        </button>
                        <button
                            onClick={() => handleResult(item.name, 'with')}
                            className={`text-lg font-bold py-3 rounded-xl border-4 transition-all ${results[item.name] === 'with'
                                ? 'bg-yellow-500 text-white border-yellow-600 scale-105'
                                : 'bg-yellow-100 text-gray-800 border-yellow-400 hover:bg-yellow-200'
                                }`}
                        >
                            ✓ With Hint<br /><span className="text-sm">(1 pt)</span>
                        </button>
                        <button
                            onClick={() => handleResult(item.name, 'wrong')}
                            className={`text-lg font-bold py-3 rounded-xl border-4 transition-all ${results[item.name] === 'wrong'
                                ? 'bg-red-500 text-white border-red-600 scale-105'
                                : 'bg-red-100 text-gray-800 border-red-400 hover:bg-red-200'
                                }`}
                        >
                            ✗ Wrong<br /><span className="text-sm">(0 pts)</span>
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full text-2xl font-bold py-4 rounded-xl border-4 transition-all ${canSubmit
                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
                    : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                    }`}
            >
                ✓ Submit Score
            </button>
        </div>
    );
}
