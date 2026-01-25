/**
 * VCAT Assessment Scoring Configuration
 * Official scoring manual implementation
 */

export interface ScoringRule {
    questionId: number;
    questionName: string;
    type: 'screening' | 'auto' | 'manual' | 'view';
    maxScore: number;
    scoringLogic: (inputData: any) => number;
    description: string;
}

export const VCAT_SCORING_CONFIG: Record<number, ScoringRule> = {
    // ===== ITEM 1: Memory (Scene) =====
    1: {
        questionId: 1,
        questionName: 'Memory (Scene)',
        type: 'screening',
        maxScore: 0,
        description: 'Screening question - Pass/Fail gatekeeper',
        scoringLogic: (inputData: { passed: boolean }) => {
            // This is a screening question - no points awarded
            // But if failed, assessment should stop
            return 0;
        },
    },

    // ===== ITEM 2: Visuospatial (Cube) =====
    2: {
        questionId: 2,
        questionName: 'Visuospatial (Cube)',
        type: 'auto',
        maxScore: 1,
        description: 'Multiple choice - Correct answer is "B"',
        scoringLogic: (inputData: { answer: string }) => {
            return inputData.answer === 'B' ? 1 : 0;
        },
    },

    // ===== ITEM 3: Visuospatial (Grid Copy) =====
    3: {
        questionId: 3,
        questionName: 'Visuospatial (Grid Copy)',
        type: 'manual',
        maxScore: 2,
        description: 'Manual scoring with time constraint (30 seconds)',
        scoringLogic: (inputData: { correctCells: number; timeSpent: number }) => {
            // Time limit check
            if (inputData.timeSpent > 30) {
                return 0;
            }

            // Score based on correctly filled cells
            if (inputData.correctCells === 6) {
                return 2;
            } else if (inputData.correctCells >= 4 && inputData.correctCells <= 5) {
                return 1;
            } else {
                return 0;
            }
        },
    },

    // ===== ITEM 4: Attention (Cancellation) =====
    4: {
        questionId: 4,
        questionName: 'Attention (Cancellation)',
        type: 'manual',
        maxScore: 3,
        description: 'Count errors - Target: Heart and Inverted Triangle',
        scoringLogic: (inputData: { errors: number }) => {
            if (inputData.errors <= 1) {
                return 3;
            } else if (inputData.errors === 2) {
                return 1;
            } else {
                return 0;
            }
        },
    },

    // ===== ITEM 5: Delayed Recall (Scene Objects) =====
    5: {
        questionId: 5,
        questionName: 'Delayed Recall (Scene Objects)',
        type: 'auto',
        maxScore: 3,
        description: 'Select 3 correct images: Shark, Shovel, Sailboat',
        scoringLogic: (inputData: { selectedItems: string[] }) => {
            const correctAnswers = ['shark', 'shovel', 'sailboat'];
            let score = 0;

            // Normalize input to lowercase for comparison
            const normalizedSelections = inputData.selectedItems.map((item: string) =>
                item.toLowerCase()
            );

            // Award 1 point for each correct selection
            correctAnswers.forEach((correct) => {
                if (normalizedSelections.includes(correct)) {
                    score += 1;
                }
            });

            return score;
        },
    },

    // ===== ITEM 6: Memory (Shapes) =====
    6: {
        questionId: 6,
        questionName: 'Memory (Shapes)',
        type: 'view',
        maxScore: 0,
        description: 'View only - Preparation for Q10 (No score)',
        scoringLogic: () => {
            return 0; // No scoring at this stage
        },
    },

    // ===== ITEM 7: Language (Naming) =====
    7: {
        questionId: 7,
        questionName: 'Language (Naming)',
        type: 'manual',
        maxScore: 3,
        description: 'Name objects: Paperclip, Bicycle, Light bulb',
        scoringLogic: (inputData: { correctNames: number }) => {
            // 1 point for each correct name (max 3)
            return Math.min(inputData.correctNames, 3);
        },
    },

    // ===== ITEM 8: Language (Fluency - Vegetables) =====
    8: {
        questionId: 8,
        questionName: 'Language (Fluency - Vegetables)',
        type: 'manual',
        maxScore: 2,
        description: 'Count vegetable words in 1 minute',
        scoringLogic: (inputData: { wordCount: number }) => {
            if (inputData.wordCount > 10) {
                return 2;
            } else if (inputData.wordCount >= 8 && inputData.wordCount <= 10) {
                return 1;
            } else {
                return 0;
            }
        },
    },

    // ===== ITEM 9: Executive Function (Gears) =====
    9: {
        questionId: 9,
        questionName: 'Executive Function (Gears)',
        type: 'manual',
        maxScore: 3,
        description: 'Two sub-tasks (A) and (B) - All-or-partial logic',
        scoringLogic: (inputData: { taskA: boolean; taskB: boolean }) => {
            const correctCount = (inputData.taskA ? 1 : 0) + (inputData.taskB ? 1 : 0);

            if (correctCount === 2) {
                return 3;
            } else if (correctCount === 1) {
                return 1;
            } else {
                return 0;
            }
        },
    },

    // ===== ITEM 10: Delayed Recall (Shapes from Q6) =====
    10: {
        questionId: 10,
        questionName: 'Delayed Recall (Shapes)',
        type: 'manual',
        maxScore: 2,
        description: 'Recall shapes from Q6 - Check shape and position',
        scoringLogic: (inputData: { correctShapes: number }) => {
            if (inputData.correctShapes === 4) {
                return 2;
            } else if (inputData.correctShapes >= 2 && inputData.correctShapes <= 3) {
                return 1;
            } else {
                return 0;
            }
        },
    },

    // ===== ITEM 11: Memory (4 Images) =====
    11: {
        questionId: 11,
        questionName: 'Memory (4 Images)',
        type: 'view',
        maxScore: 0,
        description: 'View only - Preparation for Q14 (No score)',
        scoringLogic: () => {
            return 0; // No scoring at this stage
        },
    },

    // ===== ITEM 12: Executive Function (Pattern) =====
    12: {
        questionId: 12,
        questionName: 'Executive Function (Pattern)',
        type: 'manual',
        maxScore: 2,
        description: 'Draw patterns: Square and Diamond',
        scoringLogic: (inputData: { squareCorrect: boolean; diamondCorrect: boolean }) => {
            return (inputData.squareCorrect ? 1 : 0) + (inputData.diamondCorrect ? 1 : 0);
        },
    },

    // ===== ITEM 13: Executive Function (Category) =====
    13: {
        questionId: 13,
        questionName: 'Executive Function (Category)',
        type: 'auto',
        maxScore: 1,
        description: 'Multiple choice - Correct answer is "B"',
        scoringLogic: (inputData: { answer: string }) => {
            return inputData.answer === 'B' ? 1 : 0;
        },
    },

    // ===== ITEM 14: Delayed Recall (4 Images from Q11) =====
    14: {
        questionId: 14,
        questionName: 'Delayed Recall (4 Images)',
        type: 'manual',
        maxScore: 8,
        description: 'Recall 4 items with hint penalty: Chicken, Bench, Broom, Teapot',
        scoringLogic: (inputData: {
            items: Array<{
                name: 'chicken' | 'bench' | 'broom' | 'teapot';
                correctWithoutHint: boolean;
                correctWithHint: boolean;
            }>;
        }) => {
            let totalScore = 0;

            inputData.items.forEach((item) => {
                if (item.correctWithoutHint) {
                    totalScore += 2;
                } else if (item.correctWithHint) {
                    totalScore += 1;
                }
                // Otherwise: 0 points
            });

            return totalScore;
        },
    },
};

// Total maximum possible score
export const VCAT_MAX_SCORE = Object.values(VCAT_SCORING_CONFIG).reduce(
    (sum, rule) => sum + rule.maxScore,
    0
);
