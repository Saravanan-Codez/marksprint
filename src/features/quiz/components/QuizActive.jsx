import React, { useEffect } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';

export default function QuizActive({ engine }) {
  const {
    quizQuestions, currentIdx, firstAttemptQuestions, 
    timerLimit, timeLeft, setTimeLeft,
    globalTimerLimit, globalTimeLeft, setGlobalTimeLeft,
    handleAnswer, isLocked, userAnswer, isTestMode, finishQuiz
  } = engine;

  // Trigger MathJax rendering after content updates
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
      handleAnswer(null); // submit null answer on timeout
    }
  };

  const handleGlobalTimeout = () => {
    finishQuiz();
  };

  const progressPercentage = ((currentIdx) / firstAttemptQuestions.length) * 100;

  return (
    <div className="container py-4 position-relative text-white" style={{ maxWidth: '800px' }}>
      
      {/* Background glow for the active quiz */}
      <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle pointer-events-none" style={{ width: '800px', height: '300px', background: 'rgba(200, 172, 214, 0.05)', filter: 'blur(100px)', zIndex: -1 }}></div>

      <div className="d-flex flex-column gap-3 mb-4">
        
        {/* Back to Setup Button */}
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-outline-light border-theme-accent text-secondary hover-lavender-text font-bold text-uppercase"
            style={{ borderRadius: '12px', fontSize: '0.75rem', letterSpacing: '0.12em' }}
            onClick={() => {
              if (window.confirm('Are you sure you want to go back to filters? Your progress will be lost.')) {
                window.location.reload();
              }
            }}
          >
            ← Back to Filters
          </button>
        </div>
        
        {/* Timers Row */}
        <div className="d-flex flex-column align-items-center align-items-md-end gap-2 mb-2">
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

        {/* Progress Bar Container */}
        <div 
          className="p-4 rounded-5 border mb-2 position-relative overflow-hidden" 
          style={{ 
            backgroundColor: 'rgba(46, 42, 98, 0.45)', 
            backdropFilter: 'blur(20px)', 
            borderColor: 'rgba(255, 255, 255, 0.05)' 
          }}
        >
          <div className="position-absolute top-0 start-0 end-0" style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(200, 172, 214, 0.3), transparent)' }}></div>
          <div className="d-flex justify-content-between align-items-end mb-3">
            <span className="text-uppercase tracking-wider font-bold text-secondary" style={{ fontSize: '0.75rem' }}>Progress</span>
            <span className="h3 font-black text-white m-0 tracking-wider">
              {currentIdx + 1} <span className="text-secondary" style={{ fontSize: '0.9rem' }}>/ {firstAttemptQuestions.length}</span>
            </span>
          </div>
          <div className="progress" style={{ height: '16px', backgroundColor: 'var(--color-base-dark)', borderRadius: '12px', border: '1px solid rgba(67, 61, 143, 0.4)' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: `${progressPercentage}%`, 
                background: 'linear-gradient(90deg, var(--color-accent-dark), var(--color-lavender))',
                boxShadow: '0 0 10px rgba(200, 172, 214, 0.4)',
                borderRadius: '12px',
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
      />
    </div>
  );
}
