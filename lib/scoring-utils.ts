/**
 * VCAT Assessment Scoring Utilities
 * Helper functions for calculating scores
 */

import { VCAT_MAX_SCORE, VCAT_SCORING_CONFIG } from './scoring-config';

export interface AnswerData {
    questionId: number;
    questionIndex: number;
    inputData: any;
    responseTime?: number;
}

export interface ScoringResult {
    score: number;
    maxScore: number;
    passed: boolean;
    reasoning?: string;
}

/**
 * Calculate score for a single question
 * @param questionId - The VCAT question number (1-14)
 * @param inputData - The answer data provided by user or clinician
 * @returns ScoringResult with score and reasoning
 */
export function calculateQuestionScore(
    questionId: number,
    inputData: any
): ScoringResult {
    const rule = VCAT_SCORING_CONFIG[questionId];

    if (!rule) {
        throw new Error(`No scoring rule found for question ID: ${questionId}`);
    }

    try {
        const score = rule.scoringLogic(inputData);

        return {
            score,
            maxScore: rule.maxScore,
            passed: rule.type === 'screening' ? inputData.passed : score > 0,
            reasoning: `${rule.questionName}: ${score}/${rule.maxScore} points`,
        };
    } catch (error) {
        console.error(`Error calculating score for question ${questionId}:`, error);
        return {
            score: 0,
            maxScore: rule.maxScore,
            passed: false,
            reasoning: 'Error in calculation',
        };
    }
}

/**
 * Calculate total score from all answers
 * @param answers - Array of all answer data
 * @returns Total score and breakdown
 */
export function calculateTotalScore(answers: AnswerData[]): {
    totalScore: number;
    maxScore: number;
    breakdown: ScoringResult[];
    assessmentStopped: boolean;
    stoppedAtQuestion?: number;
} {
    const breakdown: ScoringResult[] = [];
    let totalScore = 0;
    let assessmentStopped = false;
    let stoppedAtQuestion: number | undefined;

    for (const answer of answers) {
        const result = calculateQuestionScore(answer.questionId, answer.inputData);
        breakdown.push(result);

        // Add to total score (excluding screening questions)
        totalScore += result.score;

        // Check for Item 1 screening failure
        if (answer.questionId === 1 && !result.passed) {
            assessmentStopped = true;
            stoppedAtQuestion = 1;
            break;
        }
    }

    return {
        totalScore,
        maxScore: VCAT_MAX_SCORE,
        breakdown,
        assessmentStopped,
        stoppedAtQuestion,
    };
}

/**
 * Validate input data for a specific question
 * @param questionId - The VCAT question number
 * @param inputData - The data to validate
 * @returns Validation result
 */
export function validateQuestionInput(
    questionId: number,
    inputData: any
): { valid: boolean; error?: string } {
    const rule = VCAT_SCORING_CONFIG[questionId];

    if (!rule) {
        return { valid: false, error: 'Invalid question ID' };
    }

    // Type-specific validation
    switch (questionId) {
        case 1: // Screening
            if (typeof inputData.passed !== 'boolean') {
                return { valid: false, error: 'Missing "passed" boolean' };
            }
            break;

        case 2: // Cube choice
        case 13: // Category choice
            if (!inputData.answer || typeof inputData.answer !== 'string') {
                return { valid: false, error: 'Missing "answer" string' };
            }
            break;

        case 3: // Grid copy
            if (
                typeof inputData.correctCells !== 'number' ||
                typeof inputData.timeSpent !== 'number'
            ) {
                return { valid: false, error: 'Missing "correctCells" or "timeSpent"' };
            }
            break;

        case 4: // Cancellation
            if (typeof inputData.errors !== 'number') {
                return { valid: false, error: 'Missing "errors" number' };
            }
            break;

        case 5: // Scene objects recall
            if (!Array.isArray(inputData.selectedItems)) {
                return { valid: false, error: 'Missing "selectedItems" array' };
            }
            break;

        case 7: // Naming
            if (typeof inputData.correctNames !== 'number') {
                return { valid: false, error: 'Missing "correctNames" number' };
            }
            break;

        case 8: // Fluency
            if (typeof inputData.wordCount !== 'number') {
                return { valid: false, error: 'Missing "wordCount" number' };
            }
            break;

        case 9: // Gears
            if (
                typeof inputData.taskA !== 'boolean' ||
                typeof inputData.taskB !== 'boolean'
            ) {
                return { valid: false, error: 'Missing "taskA" or "taskB" boolean' };
            }
            break;

        case 10: // Shapes recall
            if (typeof inputData.correctShapes !== 'number') {
                return { valid: false, error: 'Missing "correctShapes" number' };
            }
            break;

        case 12: // Pattern
            if (
                typeof inputData.squareCorrect !== 'boolean' ||
                typeof inputData.diamondCorrect !== 'boolean'
            ) {
                return {
                    valid: false,
                    error: 'Missing "squareCorrect" or "diamondCorrect" boolean',
                };
            }
            break;

        case 14: // Delayed recall with hints
            if (!Array.isArray(inputData.items) || inputData.items.length !== 4) {
                return { valid: false, error: 'Missing "items" array with 4 elements' };
            }
            break;

        case 6: // View only
        case 11: // View only
            // No validation needed for view-only questions
            break;

        default:
            return { valid: false, error: 'Unknown question type' };
    }

    return { valid: true };
}

/**
 * Get interpretation of total score
 * @param totalScore - The calculated total score
 * @returns Interpretation category
 */
export function interpretScore(totalScore: number): {
    category: 'Normal' | 'Mild Impairment' | 'Moderate Impairment' | 'Severe Impairment';
    recommendation: string;
} {
    // These thresholds may need adjustment based on official guidelines
    if (totalScore >= 24) {
        return {
            category: 'Normal',
            recommendation: 'No cognitive impairment detected.',
        };
    } else if (totalScore >= 18) {
        return {
            category: 'Mild Impairment',
            recommendation: 'Consider follow-up assessment.',
        };
    } else if (totalScore >= 12) {
        return {
            category: 'Moderate Impairment',
            recommendation: 'Further evaluation recommended.',
        };
    } else {
        return {
            category: 'Severe Impairment',
            recommendation: 'Immediate clinical attention recommended.',
        };
    }
}
