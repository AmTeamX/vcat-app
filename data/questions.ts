/**
 * Questions Module
 * 
 * This file re-exports all questions and types from the questions folder.
 * Each question is now defined in its own file (question-01.ts, question-02.ts, etc.)
 * for easier customization and maintenance.
 * 
 * To customize a question:
 * 1. Go to data/questions/question-XX.ts
 * 2. Edit the question object
 * 3. Changes will be automatically reflected in the app
 * 
 * To add a new question:
 * 1. Create a new file: data/questions/question-XX.ts
 * 2. Import and add it to the questions array in data/questions/index.ts
 */

export { questions } from './questions/index';
export type { ChoiceOption, HintItem, Question, QuestionType } from './questions/types';

