'use client';

import { Question } from '@/data/questions';
import { JSX, useEffect, useState } from 'react';
import HelpModal from './TestRunner/HelpModal';
import InstructorModal from './TestRunner/InstructorModal';
import LoadingScreen from './TestRunner/LoadingScreen';
import OutroModal from './TestRunner/OutroModal';
import TestHeader from './TestRunner/TestHeader';

// Import individual TestRunner components
import TestRunner01 from './TestRunners/TestRunner01';
import TestRunner02 from './TestRunners/TestRunner02';
import TestRunner03 from './TestRunners/TestRunner03';
import TestRunner04 from './TestRunners/TestRunner04';
import TestRunner05 from './TestRunners/TestRunner05';
import TestRunner06 from './TestRunners/TestRunner06';
import TestRunner07 from './TestRunners/TestRunner07';
import TestRunner08 from './TestRunners/TestRunner08';
import TestRunner09 from './TestRunners/TestRunner09';
import TestRunner10 from './TestRunners/TestRunner10';
import TestRunner11 from './TestRunners/TestRunner11';
import TestRunner12 from './TestRunners/TestRunner12';
import TestRunner13 from './TestRunners/TestRunner13';
import TestRunner14 from './TestRunners/TestRunner14';

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
    const [timerStarted, setTimerStarted] = useState(false); // Track if timer should be running
    const [totalScore, setTotalScore] = useState(0);
    const [answersMap, setAnswersMap] = useState<Map<number, { answer: any; score: number; responseTime: number; id?: string }>>(new Map());
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
    // Skip Question 1 (index 0) and Question 6 (index 5) and Question 11 (index 10) as they manage their own timers
    useEffect(() => {
        if (currentIndex === 0 || currentIndex === 5 || currentIndex === 10) {
            // Question 1, Question 6, and Question 11 manage their own timers
            return;
        }

        if ((currentQuestion.type === 'view' || currentQuestion.type === 'manual') && currentQuestion.duration) {
            // For Question 4 (index 3) and Question 8 (index 7), only start timer when timerStarted is true
            if ((currentIndex === 3 || currentIndex === 7) && !timerStarted) {
                setViewTimer(currentQuestion.duration); // Set initial timer but don't start countdown
                return;
            }

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
    }, [currentIndex, showInstructor, showHelpModal, showOutro, isLoading, timerStarted]);

    const saveAnswer = async (score: number, answer: any) => {
        const responseTime = Math.floor((Date.now() - questionStartTime) / 1000);

        try {
            // Check if answer already exists for this question
            const existingAnswer = answersMap.get(currentIndex);

            if (existingAnswer && existingAnswer.id) {
                // Update existing answer
                await fetch(`/api/test-sessions/${encodeURIComponent(sessionId)}/answers`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        answerId: existingAnswer.id,
                        score,
                    }),
                });
            } else {
                // Create new answer
                const response = await fetch(`/api/test-sessions/${encodeURIComponent(sessionId)}/answers`, {
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

                // Get the created answer ID and store it in answersMap
                if (response.ok) {
                    const data = await response.json();
                    if (data.answer && data.answer.id) {
                        const newAnswersMap = new Map(answersMap);
                        const currentAnswer = newAnswersMap.get(currentIndex);
                        if (currentAnswer) {
                            newAnswersMap.set(currentIndex, {
                                ...currentAnswer,
                                id: data.answer.id,
                            });
                            setAnswersMap(newAnswersMap);
                        }
                    }
                }
            }
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
        // Skip for Question 1 (index 0) as it handles its own outro videos
        if (currentIndex !== 0 && currentQuestion.outroVideos && currentQuestion.outroVideos.length > 0 && !isLastQuestion) {
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
            setTimerStarted(false); // Reset timer started flag
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
            setTimerStarted(false); // Reset timer started flag
            setShowInstructor(false); // Don't show instructor again when going back
        }
    };

    const handleNavigateNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setQuestionStartTime(Date.now());
            setViewTimer(null);
            setTimerStarted(false); // Reset timer started flag
            setShowInstructor(true);
        } else {
            // Last question - complete test
            const duration = Math.floor((Date.now() - startTime) / 1000);
            // Recalculate total score from all answers
            let finalTotalScore = 0;
            answersMap.forEach((ans) => {
                finalTotalScore += ans.score;
            });
            onComplete(finalTotalScore, duration);
        }
    };

    const getCurrentAnswer = () => {
        return answersMap.get(currentIndex);
    };

    const renderQuestion = () => {
        const currentAnswer = getCurrentAnswer();
        const questionNumber = currentIndex + 1;

        // Map question index to specific TestRunner component
        const testRunners: Record<number, JSX.Element> = {
            1: <TestRunner01 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} viewTimer={viewTimer} />,
            2: <TestRunner02 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} />,
            3: <TestRunner03 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} viewTimer={viewTimer} />,
            4: <TestRunner04
                question={currentQuestion}
                onNext={handleNext}
                currentAnswer={currentAnswer}
                viewTimer={viewTimer}
                onStartTimer={() => setTimerStarted(true)}
            />,
            5: <TestRunner05 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} />,
            6: <TestRunner06 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} viewTimer={viewTimer} />,
            7: <TestRunner07 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer} viewTimer={viewTimer} />,
            8: <TestRunner08
                question={currentQuestion}
                onNext={handleNext}
                currentAnswer={currentAnswer}
                viewTimer={viewTimer}
                onStartTimer={() => setTimerStarted(true)}
            />,
            9: <TestRunner09 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer} viewTimer={viewTimer} />,
            10: <TestRunner10 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer} viewTimer={viewTimer} />,
            11: <TestRunner11 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} viewTimer={viewTimer} />,
            12: <TestRunner12 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer} viewTimer={viewTimer} />,
            13: <TestRunner13 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} />,
            14: <TestRunner14 question={currentQuestion} onNext={handleNext} currentAnswer={currentAnswer?.answer} />,
        };

        return testRunners[questionNumber] || <div>Question {questionNumber} not found</div>;
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
