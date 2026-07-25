import React, { useEffect, useCallback } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';
import { useToast } from '../../../context/ToastContext.jsx';

export default function QuizActive({ engine }) {
  const {
    quizQuestions, currentIdx, firstAttemptQuestions, firstAttemptCorrect, firstAttemptAnswers,
    timerLimit, timeLeft, setTimeLeft,
    globalTimerLimit, globalTimeLeft, setGlobalTimeLeft,
    handleAnswer, isLocked, userAnswer, isTestMode, finishQuiz,
    setQuizMode, saveProgressNow, isBookmarked, toggleBookmark, isInRepeatMode, currentRoundWrong
  } = engine;

  const toast = useToast();

  useEffect(() => {
    const renderMath = async () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (err) {
          console.log("MathJax error:", err);
        }
      }
    };
    const timer1 = setTimeout(renderMath, 100);
    const timer2 = setTimeout(renderMath, 500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [currentIdx, isLocked]);

  const currentQ = quizQuestions[currentIdx];

  const handleTimeout = () => {
    if (!isLocked) {
      handleAnswer(null);
    }
  };

  const handleGlobalTimeout = () => {
    finishQuiz();
  };

  const handleToggleBookmark = useCallback(() => {
    const added = toggleBookmark(currentQ);
    if (added) {
      toast.success('Question bookmarked for later review');
    } else {
      toast.info('Bookmark removed');
    }
  }, [toggleBookmark, currentQ, toast]);

  const handleBackToSetup = useCallback(() => {
    try {
      saveProgressNow({
        quizQuestions,
        currentIdx,
        firstAttemptQuestions,
        firstAttemptCorrect,
        firstAttemptAnswers,
        isInRepeatMode,
        currentRoundWrong,
        timeLeft: timerLimit > 0 ? timeLeft : 0,
        globalTimeLeft: globalTimerLimit > 0 ? globalTimeLeft : 0
      });
      toast.success('Progress saved. Resume anytime from this subject\'s setup screen.');
    } catch {
      toast.warning('Could not save progress snapshot before exiting.');
    }
    setQuizMode('setup');
  }, [saveProgressNow, quizQuestions, currentIdx, firstAttemptQuestions, firstAttemptCorrect, firstAttemptAnswers, isInRepeatMode, currentRoundWrong, timerLimit, timeLeft, globalTimerLimit, globalTimeLeft, setQuizMode, toast]);

  const progressPercentage = firstAttemptQuestions.length > 0
    ? Math.min(100, Math.round(((currentIdx + 1) / firstAttemptQuestions.length) * 100))
    : 0;

  return (
    <div className="container py-4 position-relative" style={{ maxWidth: '800px' }}>

      <div className="d-flex flex-column gap-3 mb-4">

        {/* Header Row: Back button (left) + Timers (right) */}
        <div className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-3">
          <button
            className="btn-soft text-primary font-bold text-uppercase d-inline-flex align-items-center gap-2"
            style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}
            onClick={handleBackToSetup}
            title="Save progress and return to setup"
          >
            &larr; Back to Filters
          </button>

          {/* Timer Pills */}
          <div className="d-flex flex-row align-items-center gap-2">
            {globalTimerLimit > 0 && (
              <Timer
                timeLeft={globalTimeLeft}
                setTimeLeft={setGlobalTimeLeft}
                isActive={true}
                onTimeout={handleGlobalTimeout}
                label="Total Time"
                warningThreshold={60}
              />
            )}

            {timerLimit > 0 && (
              <Timer
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                isActive={!isLocked}
                onTimeout={handleTimeout}
                label="Question Time"
                warningThreshold={5}
              />
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="surface p-4 rounded-4 border shadow-sm">
          <div className="d-flex flex-row justify-content-between align-items-center mb-3">
            <span className="text-uppercase tracking-wider font-bold text-slate-500" style={{ fontSize: '0.75rem' }}>Progress</span>
            <span className="h3 font-black text-slate-900 m-0 tracking-wider">
              Q {currentIdx + 1} <span className="text-slate-400" style={{ fontSize: '0.9rem' }}>/ {firstAttemptQuestions.length}</span>
            </span>
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center mb-2">
            <span className="small text-slate-500"></span>
            <span className="font-bold text-primary" style={{ fontSize: '0.9rem' }}>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="progress" style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '10px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #4f46e5, #14b8a6)',
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>

      <QuestionCard
        currentQ={currentQ}
        currentIdx={currentIdx}
        handleAnswer={handleAnswer}
        isLocked={isLocked}
        userAnswer={userAnswer}
        isTestMode={isTestMode}
        isBookmarked={isBookmarked(currentQ)}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}
