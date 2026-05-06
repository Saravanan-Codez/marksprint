import React from 'react';
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({ 
  currentQ, 
  currentIdx, 
  handleAnswer, 
  isLocked, 
  userAnswer, 
  isTestMode 
}) {
  if (!currentQ) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentIdx}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -30, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center flex-1 pb-16"
      >
        <div className="w-full bg-[rgba(11,31,42,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 md:p-10 mb-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl md:text-3xl leading-relaxed text-gray-100 font-medium" dangerouslySetInnerHTML={{ __html: currentQ.question || "" }} />
          {currentQ.question_image && <img src={currentQ.question_image} alt="Question" className="max-w-full max-h-64 object-contain mx-auto mt-6 rounded-lg border border-[rgba(255,255,255,0.1)] shadow-lg" />}
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {currentQ.displayOptions.map((opt, i) => {
            let statusClasses = "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.05)] text-gray-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.1)] hover:text-white";
            let showCorrectIcon = false;
            let showWrongIcon = false;

            if (isLocked) {
              if (isTestMode) {
                if (opt.text === userAnswer) {
                  statusClasses = "bg-[rgba(0,210,255,0.1)] border-[#00d2ff] text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]";
                }
              } else {
                if (opt.text === currentQ.answer) {
                  statusClasses = "bg-[rgba(34,197,94,0.15)] border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                  showCorrectIcon = true;
                } else if (opt.text === userAnswer) {
                  statusClasses = "bg-[rgba(239,68,68,0.15)] border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                  showWrongIcon = true;
                } else {
                  statusClasses = "bg-[rgba(0,0,0,0.2)] border-[rgba(255,255,255,0.02)] text-gray-600 opacity-50";
                }
              }
            }
            
            return (
              <button 
                key={`${currentIdx}-${i}`}
                className={`flex items-center w-full min-h-[4rem] px-6 py-4 rounded-2xl border transition-all duration-300 ${!isLocked ? 'hover:scale-[1.02] active:scale-95 cursor-pointer' : 'cursor-default'} ${statusClasses}`}
                onClick={() => handleAnswer(opt.text)}
                disabled={isLocked}
              >
                {opt.text && <span className="text-left w-full block text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: opt.text }} />}
                {opt.img && <img src={opt.img} alt={`Option ${i+1}`} className="max-w-full max-h-32 object-contain rounded my-2" />}
                
                {showCorrectIcon && <CheckCircle2 className="shrink-0 ml-4 text-green-400" size={24} />}
                {showWrongIcon && <XCircle className="shrink-0 ml-4 text-red-400" size={24} />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
