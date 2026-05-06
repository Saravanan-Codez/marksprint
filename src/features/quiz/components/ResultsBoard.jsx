import React, { useEffect } from 'react';
import { Repeat, Home, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function ResultsBoard({ engine }) {
  const navigate = useNavigate();
  const { firstAttemptQuestions, firstAttemptAnswers, firstAttemptCorrect, isTestMode, repeatWrong } = engine;

  const total = firstAttemptQuestions.length;
  // If repeatWrong was on and it's not test mode, they repeated until all correct.
  // Actually, to be strictly accurate, we should score based on firstAttemptCorrect.
  const correct = firstAttemptCorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  useEffect(() => {
    if (accuracy >= 80) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [accuracy]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-20 pt-8 md:pt-12 px-4">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] tracking-[0.2em] mb-8 drop-shadow-lg text-center">
          THE RESULT
        </h1>
        
        <div className="w-full max-w-lg bg-[rgba(11,31,42,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between items-center bg-[rgba(0,0,0,0.3)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Total</span>
              <span className="text-2xl font-black text-white tabular-nums">{total}</span>
            </div>
            
            <div className="flex justify-between items-center bg-[rgba(0,0,0,0.3)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Correct</span>
              <span className="text-2xl font-black text-[#4caf50] tabular-nums drop-shadow-[0_0_8px_rgba(76,175,80,0.5)]">{correct}</span>
            </div>
            
            <div className="flex justify-between items-center bg-[rgba(0,0,0,0.3)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Accuracy</span>
              <span className="text-3xl font-black text-[#00d2ff] tabular-nums drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]">{accuracy}%</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white font-bold tracking-widest rounded-xl transition-all duration-300 active:scale-95 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              onClick={() => window.location.reload()}
            >
              <Repeat size={20} /> RETRY
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] text-white font-bold tracking-widest rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-[rgba(255,255,255,0.2)]"
              onClick={() => navigate("/")}
            >
              <Home size={20} /> HOME
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#00d2ff]">Review Answers</h2>
        <div className="flex flex-col gap-4">
          {firstAttemptAnswers.map((item, idx) => (
            <div key={idx} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg text-white mb-4" dangerouslySetInnerHTML={{ __html: item.questionObj.question }} />
              {item.questionObj.question_image && <img src={item.questionObj.question_image} alt="Question" className="max-w-[200px] mb-4 rounded-lg" />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg flex items-center gap-3 ${item.isCorrect ? 'bg-[rgba(76,175,80,0.2)] border border-[#4caf50] text-[#4caf50]' : 'bg-[rgba(244,67,54,0.2)] border border-[#f44336] text-[#f44336]'}`}>
                  {item.isCorrect ? <CheckCircle2 /> : <XCircle />}
                  <div>
                    <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">Your Answer</span>
                    <span dangerouslySetInnerHTML={{ __html: item.userAnswer || "Skipped / Timeout" }} />
                  </div>
                </div>
                
                {!item.isCorrect && (
                  <div className="p-4 rounded-lg flex items-center gap-3 bg-[rgba(76,175,80,0.2)] border border-[#4caf50] text-[#4caf50]">
                    <CheckCircle2 />
                    <div>
                      <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">Correct Answer</span>
                      <span dangerouslySetInnerHTML={{ __html: item.questionObj.answer }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
