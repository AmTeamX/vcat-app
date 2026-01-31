export type QuestionType = 'choice' | 'manual' | 'view' | 'grid-match' | 'multi-choice' | 'hint-manual';

export interface ChoiceOption {
    id: string;
    label: string;
    image: string;
}

export interface HintItem {
    id: string;
    label: string;
    hintImage?: string; // Image shown when hint is revealed
}

export interface Question {
    type: QuestionType;
    title: string;
    image: string;
    image2?: string; // Second image for multi-step questions
    options?: ChoiceOption[];
    correctAnswer?: string;
    correctAnswers?: string[]; // For multi-choice questions
    instruction?: string;
    instruction2?: string; // Second instruction for multi-step questions
    instruction3?: string; // Second instruction for multi-step questions
    duration?: number; // For VIEW type questions (in seconds)
    maxScore?: number; // For MANUAL type questions
    instructorVideo?: string; // Sign language instructor video URL (shown before question)
    outroinstructorVideoVideos2?: string[]; // Sign language outro videos (for multi-step questions)
    hintInstructorVideo?: string; // Video explaining hint system (for hint-manual questions)
    outroVideos?: string[]; // Videos shown after completing the question (before next question)
    outroScoreMax?: number; // Max score for manual scoring after outro videos (if needed)
    gridPattern?: boolean[][]; // For GRID-MATCH type questions (6x4 grid)
    requiredSelections?: number; // For multi-choice questions (how many items to select)
    hintItems?: HintItem[]; // For hint-manual questions (items with hints)
}
