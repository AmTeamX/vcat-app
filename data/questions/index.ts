import { Question } from './types';

// Import all question files
import { question as q01 } from './question-01';
import { question as q02 } from './question-02';
import { question as q03 } from './question-03';
import { question as q04 } from './question-04';
import { question as q05 } from './question-05';
import { question as q06 } from './question-06';
import { question as q07 } from './question-07';
import { question as q08 } from './question-08';
import { question as q09 } from './question-09';
import { question as q10 } from './question-10';
import { question as q11 } from './question-11';
import { question as q12 } from './question-12';
import { question as q13 } from './question-13';
import { question as q14 } from './question-14';

// Export all questions as an array
export const questions: Question[] = [
    q01,
    q02,
    q03,
    q04,
    q05,
    q06,
    q07,
    q08,
    q09,
    q10,
    q11,
    q12,
    q13,
    q14,
];

// Re-export types for convenience
export type { ChoiceOption, HintItem, Question, QuestionType } from './types';

