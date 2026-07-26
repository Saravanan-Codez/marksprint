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
    <div className="w-100 py-4 font-mono d-flex flex-column gap-4 anim-fade-in mx-auto" style={{ maxWidth: '850px' }}>

      <div className="d-flex flex-column gap-3 mb-2">

        {/* Header Row */}
        <div className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-3">
          <button
            className="bg-black text-brand border-2 border-black px-4 py-2 font-headline text-xs font-black uppercase hover:bg-white hover:text-black transition-all"
            onClick={handleBackToSetup}
            title="Save progress and return to setup"
          >
            ← BACK TO SETUP
          </button>

          {/* Timer Pills */}
          <div className="d-flex flex-row align-items-center gap-2">
            {globalTimerLimit > 0 && (
              <Timer
                timeLeft={globalTimeLeft}
                setTimeLeft={setGlobalTimeLeft}
                isActive={true}
                onTimeout={handleGlobalTimeout}
                label="TOTAL"
                warningThreshold={60}
              />
            )}

            {timerLimit > 0 && (
              <Timer
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                isActive={!isLocked}
                onTimeout={handleTimeout}
                label="Q-TIME"
                warningThreshold={5}
              />
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white border-brutal p-4 text-black shadow-hard-sm">
          <div className="d-flex flex-row justify-content-between align-items-center mb-2">
            <span className="font-headline text-xs font-black uppercase text-black">SPRINT PROGRESS</span>
            <span className="font-headline text-2xl font-black text-black">
              Q {currentIdx + 1} / {firstAttemptQuestions.length}
            </span>
          </div>

          <div className="w-100 border-2 border-black bg-black p-0.5" style={{ height: '18px' }}>
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'var(--brand)',
                transition: 'width 0.4s ease'
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
