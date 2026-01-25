/**
 * VCAT Scoring System - Usage Examples
 * 
 * This file demonstrates how to use the scoring system for each question type.
 */

import { calculateQuestionScore, calculateTotalScore, validateQuestionInput } from './scoring-utils';

// ===== EXAMPLE 1: Auto-scored Multiple Choice (Item 2 - Cube) =====
const item2Example = () => {
    const result = calculateQuestionScore(2, { answer: 'B' });
    console.log(result);
    // Output: { score: 1, maxScore: 1, passed: true, reasoning: "Visuospatial (Cube): 1/1 points" }
};

// ===== EXAMPLE 2: Manual Score with Time Constraint (Item 3 - Grid) =====
const item3Example = () => {
    // Patient filled 5 cells correctly in 25 seconds
    const result = calculateQuestionScore(3, {
        correctCells: 5,
        timeSpent: 25,
    });
    console.log(result); // { score: 1, maxScore: 2, ... }

    // Patient filled 6 cells but took 35 seconds
    const resultTimeout = calculateQuestionScore(3, {
        correctCells: 6,
        timeSpent: 35,
    });
    console.log(resultTimeout); // { score: 0, maxScore: 2, ... } - Time limit exceeded!
};

// ===== EXAMPLE 3: Error Counting (Item 4 - Cancellation) =====
const item4Example = () => {
    // Patient made 1 error
    const result = calculateQuestionScore(4, { errors: 1 });
    console.log(result); // { score: 3, maxScore: 3, ... }

    // Patient made 2 errors
    const result2 = calculateQuestionScore(4, { errors: 2 });
    console.log(result2); // { score: 1, maxScore: 3, ... }

    // Patient made 5 errors
    const result3 = calculateQuestionScore(4, { errors: 5 });
    console.log(result3); // { score: 0, maxScore: 3, ... }
};

// ===== EXAMPLE 4: Multi-select (Item 5 - Delayed Recall) =====
const item5Example = () => {
    // Patient selected all correct items
    const result = calculateQuestionScore(5, {
        selectedItems: ['shark', 'shovel', 'sailboat'],
    });
    console.log(result); // { score: 3, maxScore: 3, ... }

    // Patient selected 2 correct and 1 wrong
    const result2 = calculateQuestionScore(5, {
        selectedItems: ['shark', 'shovel', 'umbrella'],
    });
    console.log(result2); // { score: 2, maxScore: 3, ... }
};

// ===== EXAMPLE 5: All-or-None Logic (Item 9 - Gears) =====
const item9Example = () => {
    // Both tasks correct
    const bothCorrect = calculateQuestionScore(9, {
        taskA: true,
        taskB: true,
    });
    console.log(bothCorrect); // { score: 3, maxScore: 3, ... }

    // Only one correct
    const oneCorrect = calculateQuestionScore(9, {
        taskA: true,
        taskB: false,
    });
    console.log(oneCorrect); // { score: 1, maxScore: 3, ... }

    // Both wrong
    const bothWrong = calculateQuestionScore(9, {
        taskA: false,
        taskB: false,
    });
    console.log(bothWrong); // { score: 0, maxScore: 3, ... }
};

// ===== EXAMPLE 6: Hint Penalty (Item 14 - Delayed Recall with Hints) =====
const item14Example = () => {
    const result = calculateQuestionScore(14, {
        items: [
            { name: 'chicken', correctWithoutHint: true, correctWithHint: false },  // 2 points
            { name: 'bench', correctWithoutHint: false, correctWithHint: true },    // 1 point
            { name: 'broom', correctWithoutHint: false, correctWithHint: true },    // 1 point
            { name: 'teapot', correctWithoutHint: false, correctWithHint: false },  // 0 points
        ],
    });
    console.log(result); // { score: 4, maxScore: 8, ... }
};

// ===== EXAMPLE 7: Calculate Total Score =====
const calculateTotalExample = () => {
    const allAnswers = [
        { questionId: 1, questionIndex: 0, inputData: { passed: true } },
        { questionId: 2, questionIndex: 1, inputData: { answer: 'B' } },
        { questionId: 3, questionIndex: 2, inputData: { correctCells: 6, timeSpent: 25 } },
        { questionId: 4, questionIndex: 3, inputData: { errors: 1 } },
        { questionId: 5, questionIndex: 4, inputData: { selectedItems: ['shark', 'shovel', 'sailboat'] } },
        { questionId: 6, questionIndex: 5, inputData: {} },
        { questionId: 7, questionIndex: 6, inputData: { correctNames: 3 } },
        { questionId: 8, questionIndex: 7, inputData: { wordCount: 12 } },
        { questionId: 9, questionIndex: 8, inputData: { taskA: true, taskB: true } },
        { questionId: 10, questionIndex: 9, inputData: { correctShapes: 4 } },
        { questionId: 11, questionIndex: 10, inputData: {} },
        { questionId: 12, questionIndex: 11, inputData: { squareCorrect: true, diamondCorrect: true } },
        { questionId: 13, questionIndex: 12, inputData: { answer: 'B' } },
        {
            questionId: 14,
            questionIndex: 13,
            inputData: {
                items: [
                    { name: 'chicken', correctWithoutHint: true, correctWithHint: false },
                    { name: 'bench', correctWithoutHint: true, correctWithHint: false },
                    { name: 'broom', correctWithoutHint: false, correctWithHint: true },
                    { name: 'teapot', correctWithoutHint: true, correctWithHint: false },
                ],
            },
        },
    ];

    const result = calculateTotalScore(allAnswers);
    console.log(result);
    // Output: { totalScore: 27, maxScore: 30, breakdown: [...], assessmentStopped: false }
};

// ===== EXAMPLE 8: Screening Failure (Item 1) =====
const screeningFailureExample = () => {
    const allAnswers = [
        { questionId: 1, questionIndex: 0, inputData: { passed: false } },
        // Assessment stops here - no further questions
    ];

    const result = calculateTotalScore(allAnswers);
    console.log(result);
    // Output: { totalScore: 0, assessmentStopped: true, stoppedAtQuestion: 1 }
};

// ===== EXAMPLE 9: Input Validation =====
const validationExample = () => {
    // Valid input
    const valid = validateQuestionInput(3, {
        correctCells: 5,
        timeSpent: 28,
    });
    console.log(valid); // { valid: true }

    // Invalid input - missing field
    const invalid = validateQuestionInput(3, {
        correctCells: 5,
        // timeSpent is missing
    });
    console.log(invalid); // { valid: false, error: "Missing 'correctCells' or 'timeSpent'" }
};

export {
    calculateTotalExample, item14Example, item2Example,
    item3Example,
    item4Example,
    item5Example,
    item9Example, screeningFailureExample,
    validationExample
};

