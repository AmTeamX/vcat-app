'use client';

import { Question } from '@/data/questions';
import { useEffect, useState } from 'react';
import ChoiceQuestion from './TestRunner/ChoiceQuestion';
import GridMatchQuestion from './TestRunner/GridMatchQuestion';
import HelpModal from './TestRunner/HelpModal';
import HintQuestion from './TestRunner/HintQuestion';
import InstructorModal from './TestRunner/InstructorModal';
import LoadingScreen from './TestRunner/LoadingScreen';
import ManualQuestion from './TestRunner/ManualQuestion';
import MultiChoiceQuestion from './TestRunner/MultiChoiceQuestion';
import OutroModal from './TestRunner/OutroModal';
import TestHeader from './TestRunner/TestHeader';
import ViewQuestion from './TestRunner/ViewQuestion';

interface TestRunnerProps {
    questions: Question[];
    sessionId: string;
    onComplete: (totalScore: number, duration: number) => void;
}

export default function TestRunner({ questions, sessionId, onComplete }: TestRunnerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime] = useState(Date.now());
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [viewTimer, setViewTimer] = useState<number | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [answersMap, setAnswersMap] = useState<Map<number, { answer: any; score: number; responseTime: number }>>(new Map());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [totalPausedTime, setTotalPausedTime] = useState(0);
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(Date.now()); // Initialize with current time since modal starts open
    const [isLoading, setIsLoading] = useState(false);
    const [showInstructor, setShowInstructor] = useState(true);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showOutro, setShowOutro] = useState(false);
    const [canGoBack, setCanGoBack] = useState(true); // Allow going back by default

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    // Track modal state and pause/resume timer
    useEffect(() => {
        const isModalOpen = showInstructor || showHelpModal || showOutro || isLoading;

        if (isModalOpen && pauseStartTime === null) {
            // Modal just opened - record pause start time
            setPauseStartTime(Date.now());
        } else if (!isModalOpen && pauseStartTime !== null) {
            // Modal just closed - add paused duration to total
            const pausedDuration = Date.now() - pauseStartTime;
            setTotalPausedTime(prev => prev + pausedDuration);
            setPauseStartTime(null);
        }
    }, [showInstructor, showHelpModal, showOutro, isLoading, pauseStartTime]);

    // Update elapsed time every second
    useEffect(() => {
        const interval = setInterval(() => {
            const currentPauseTime = pauseStartTime !== null ? (Date.now() - pauseStartTime) : 0;
            const actualElapsed = Math.floor((Date.now() - startTime - totalPausedTime - currentPauseTime) / 1000);
            setElapsedTime(actualElapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, totalPausedTime, pauseStartTime]);

    // Handle VIEW and MANUAL type timer
    useEffect(() => {
        if ((currentQuestion.type === 'view' || currentQuestion.type === 'manual') && currentQuestion.duration) {
            setViewTimer(currentQuestion.duration);

            const isModalOpen = showInstructor || showHelpModal || showOutro || isLoading;

            if (isModalOpen) {
                return; // Don't run timer when modal is open
            }

            const interval = setInterval(() => {
                setViewTimer((prev) => {
                    if (prev === null || prev <= 1) {
                        clearInterval(interval);
                        // For view type, auto-submit with 0 score
                        // For manual type, just let the timer reach 0 without auto-submit
                        if (currentQuestion.type === 'view') {
                            handleNext(0, 'viewed');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentIndex, showInstructor, showHelpModal, showOutro, isLoading]);

    const saveAnswer = async (score: number, answer: any) => {
        const responseTime = Math.floor((Date.now() - questionStartTime) / 1000);

        try {
            await fetch(`/api/test-sessions/${encodeURIComponent(sessionId)}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionIndex: currentIndex,
                    questionText: currentQuestion.title,
                    answer,
                    score,
                    responseTime,
                }),
            });
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handleNext = async (score: number, answer: any) => {
        // Show loading state
        setIsLoading(true);

        const responseTime = Math.floor((Date.now() - questionStartTime) / 1000);

        // Store answer in map
        const newAnswersMap = new Map(answersMap);
        newAnswersMap.set(currentIndex, { answer, score, responseTime });
        setAnswersMap(newAnswersMap);

        // Save answer to backend
        await saveAnswer(score, answer);

        // Calculate total score from all answers
        let newTotalScore = 0;
        newAnswersMap.forEach((ans) => {
            newTotalScore += ans.score;
        });
        setTotalScore(newTotalScore);

        // Hide loading
        setIsLoading(false);

        // Check if current question has outro videos
        if (currentQuestion.outroVideos && currentQuestion.outroVideos.length > 0 && !isLastQuestion) {
            // Show outro videos before moving to next question
            setShowOutro(true);
            return;
        }

        // Move to next question or complete test
        if (isLastQuestion) {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            onComplete(newTotalScore, duration);
        } else {
            proceedToNextQuestion();
        }
    };

    const proceedToNextQuestion = () => {
        setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
            setQuestionStartTime(Date.now());
            setViewTimer(null);
            setShowInstructor(true);
        }, 300);
    };

    const handleOutroClose = async (outroScore?: number) => {
        setShowOutro(false);

        // If outro scoring was provided, save it and add to total
        if (outroScore !== undefined && currentQuestion.outroScoreMax !== undefined) {
            await saveAnswer(outroScore, `Outro score: ${outroScore}`);

            // Add outro score to the current question's answer in the map
            const currentAnswer = answersMap.get(currentIndex);
            if (currentAnswer) {
                const newAnswersMap = new Map(answersMap);
                newAnswersMap.set(currentIndex, {
                    ...currentAnswer,
                    score: currentAnswer.score + outroScore
                });
                setAnswersMap(newAnswersMap);

                // Recalculate total score
                let newTotalScore = 0;
                newAnswersMap.forEach((ans) => {
                    newTotalScore += ans.score;
                });
                setTotalScore(newTotalScore);
            }
        }

        proceedToNextQuestion();
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setQuestionStartTime(Date.now());
            setViewTimer(null);
            setShowInstructor(false); // Don't show instructor again when going back
        }
    };

    const handleNavigateNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setQuestionStartTime(Date.now());
            setViewTimer(null);
            setShowInstructor(true);
        } else {
            // Last question - complete test
            const duration = Math.floor((Date.now() - startTime) / 1000);
            onComplete(totalScore, duration);
        }
    };

    const getCurrentAnswer = () => {
        return answersMap.get(currentIndex);
    };

    const handleChoiceAnswer = (optionId: string) => {
        // Simple scoring: if answer matches correctAnswer, give maxScore (default 1)
        const isCorrect = optionId === currentQuestion.correctAnswer;
        const score = isCorrect ? (currentQuestion.maxScore || 1) : 0;
        handleNext(score, optionId);
    };

    const handleManualScore = (score: number) => {
        // For manual scoring, accept the clinician's input directly
        // The score is pre-calculated based on the specific question's logic
        handleNext(score, `Manual score: ${score}`);
    };

    const handleGridMatch = (grid: boolean[][], score: number) => {
        handleNext(score, grid);
    };

    const handleMultiChoiceAnswer = (selectedIds: string[]) => {
        // Count how many selected answers are correct (1 point per correct answer)
        const correctAnswers = currentQuestion.correctAnswers || [];
        let score = 0;

        selectedIds.forEach(id => {
            if (correctAnswers.includes(id)) {
                score += 1; // 1 point per correct answer
            }
        });

        handleNext(score, selectedIds);
    };

    const handleHintComplete = (results: { itemId: string; usedHint: boolean; correct: boolean }[], totalScore: number) => {
        handleNext(totalScore, results);
    };

    const renderQuestion = () => {
        const currentAnswer = getCurrentAnswer();

        switch (currentQuestion.type) {
            case 'choice':
                return (
                    <ChoiceQuestion
                        question={currentQuestion}
                        onAnswer={handleChoiceAnswer}
                        selectedAnswer={currentAnswer?.answer}
                    />
                );
            case 'manual':
                return (
                    <ManualQuestion
                        question={currentQuestion}
                        onScore={handleManualScore}
                        currentScore={currentAnswer?.score}
                        viewTimer={viewTimer}
                    />
                );
            case 'view':
                return <ViewQuestion question={currentQuestion} viewTimer={viewTimer} />;
            case 'grid-match':
                return (
                    <GridMatchQuestion
                        question={currentQuestion}
                        onSubmit={handleGridMatch}
                        currentAnswer={currentAnswer?.answer}
                        viewTimer={viewTimer}
                    />
                );
            case 'multi-choice':
                return (
                    <MultiChoiceQuestion
                        question={currentQuestion}
                        onAnswer={handleMultiChoiceAnswer}
                        selectedAnswers={currentAnswer?.answer}
                        requiredCount={currentQuestion.requiredSelections || 3}
                    />
                );
            case 'hint-manual':
                return (
                    <HintQuestion
                        question={currentQuestion}
                        onComplete={handleHintComplete}
                        currentAnswer={currentAnswer?.answer}
                    />
                );
            default:
                return <div>Unknown question type</div>;
        }
    };

    return (
        <div className="min-h-screen bg-white w-screen">
            {showInstructor && currentQuestion.instructorVideo && (
                <InstructorModal
                    videoSrc={currentQuestion.instructorVideo}
                    onClose={() => setShowInstructor(false)}
                />
            )}

            {showHelpModal && currentQuestion.instructorVideo && (
                <HelpModal
                    videoSrc={currentQuestion.instructorVideo}
                    onClose={() => setShowHelpModal(false)}
                />
            )}

            {showOutro && currentQuestion.outroVideos && currentQuestion.outroVideos.length > 0 && (
                <OutroModal
                    videos={currentQuestion.outroVideos}
                    maxScore={currentQuestion.outroScoreMax}
                    onClose={handleOutroClose}
                />
            )}

            {isLoading && <LoadingScreen />}

            <TestHeader
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                elapsedTime={elapsedTime}
                hasInstructorVideo={!!currentQuestion.instructorVideo}
                onShowHelp={() => setShowHelpModal(true)}
                onPrevious={handlePrevious}
                onNext={handleNavigateNext}
                canGoBack={currentIndex > 0}
                canGoNext={answersMap.has(currentIndex)}
                answeredCount={answersMap.size}
                isLastQuestion={isLastQuestion}
            />

            <div className="w-screen mx-auto p-8">
                {renderQuestion()}
            </div>
        </div>
    );
}
