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
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full pt-4 md:pt-8 px-2 md:px-4">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-6">
        
        <div className="flex flex-col flex-1 bg-[rgba(11,31,42,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-3 md:p-4 shadow-lg min-w-[140px]">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-widest uppercase">Progress</span>
            <span className="text-lg md:text-2xl font-black text-white tracking-wider tabular-nums">{currentIdx + 1} <span className="text-gray-500 text-sm">/ {firstAttemptQuestions.length}</span></span>
          </div>
          <div className="w-full h-2 md:h-3 bg-[rgba(0,0,0,0.4)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/30 blur-[4px]"></div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-4 ml-auto">
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
