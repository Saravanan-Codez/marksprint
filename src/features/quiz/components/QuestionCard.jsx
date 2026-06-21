import React from 'react';
import DOMPurify from 'dompurify';
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
        className="w-100 d-flex flex-column align-items-center pb-5 position-relative"
      >
        <div 
          className="w-100 p-4 p-md-5 rounded-5 border mb-4 position-relative overflow-hidden text-center" 
          style={{ 
            backgroundColor: 'rgba(46, 42, 98, 0.45)', 
            backdropFilter: 'blur(20px)', 
            borderColor: 'rgba(255, 255, 255, 0.05)' 
          }}
        >
          <div className="position-absolute top-0 start-0 end-0" style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(200, 172, 214, 0.3), transparent)' }}></div>
          <h2 className="h4 leading-relaxed text-white font-semibold mb-0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentQ.question || "") }} />
          {currentQ.question_image && <img src={currentQ.question_image} alt="Question" className="img-fluid mx-auto mt-4 rounded-4 border border-secondary shadow-lg" style={{ maxHeight: '280px', objectFit: 'contain' }} />}
        </div>
        
        {isLocked && (
          <div className="position-absolute top-0 end-0 p-3 opacity-75 d-flex align-items-center gap-2 text-theme-highlight">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: 'var(--color-lavender)' }}></div>
            <span className="text-uppercase font-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>Processing</span>
          </div>
        )}

        <div className="row g-3 w-100">
          {currentQ.displayOptions.map((opt, i) => {
            let statusClass = "btn-option-default";
            let showCorrectIcon = false;
            let showWrongIcon = false;

            if (isLocked) {
              if (isTestMode) {
                if (opt.text === userAnswer) {
                  statusClass = "btn-option-checked";
                } else {
                  statusClass = "btn-option-inactive";
                }
              } else {
                if (opt.text === currentQ.answer) {
                  statusClass = "btn-option-correct";
                  showCorrectIcon = true;
                } else if (opt.text === userAnswer) {
                  statusClass = "btn-option-wrong";
                  showWrongIcon = true;
                } else {
                  statusClass = "btn-option-inactive";
                }
              }
            }
            
            return (
              <div key={`${currentIdx}-${i}`} className="col-12 col-md-6">
                <button 
                  className={`btn d-flex align-items-center justify-content-between w-100 p-4 rounded-4 border transition-all text-start ${statusClass}`}
                  style={{ 
                    minHeight: '85px', 
                    cursor: isLocked ? 'default' : 'pointer'
                  }}
                  onClick={() => handleAnswer(opt.text)}
                  disabled={isLocked}
                >
                  <div className="flex-grow-1">
                    {opt.text && <span className="text-left block text-base leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(opt.text) }} />}
                    {opt.img && <img src={opt.img} alt={`Option ${i+1}`} className="img-fluid rounded-3 my-2" style={{ maxHeight: '120px', objectFit: 'contain' }} />}
                  </div>
                  
                  {showCorrectIcon && <CheckCircle2 className="flex-shrink-0 ms-3 text-success" size={24} style={{ filter: 'drop-shadow(0 0 5px rgba(25, 135, 84, 0.6))' }} />}
                  {showWrongIcon && <XCircle className="flex-shrink-0 ms-3 text-danger" size={24} style={{ filter: 'drop-shadow(0 0 5px rgba(220, 53, 69, 0.6))' }} />}
                </button>
              </div>
            );
          })}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .btn-option-default {
            background-color: rgba(46, 42, 98, 0.3) !important;
            border-color: rgba(255, 255, 255, 0.05) !important;
            color: #cbd5e1 !important;
          }
          .btn-option-default:hover {
            background-color: rgba(46, 42, 98, 0.6) !important;
            border-color: var(--color-lavender) !important;
            color: #ffffff !important;
            box-shadow: 0 0 15px rgba(200, 172, 214, 0.15) !important;
            transform: translateY(-2px);
          }
          .btn-option-checked {
            background-color: rgba(67, 61, 143, 0.6) !important;
            border-color: var(--color-lavender) !important;
            color: #ffffff !important;
            box-shadow: 0 0 20px rgba(200, 172, 214, 0.25) !important;
          }
          .btn-option-correct {
            background-color: rgba(25, 135, 84, 0.2) !important;
            border-color: #198754 !important;
            color: #ffffff !important;
            box-shadow: 0 0 20px rgba(25, 135, 84, 0.35) !important;
          }
          .btn-option-wrong {
            background-color: rgba(220, 53, 69, 0.2) !important;
            border-color: #dc3545 !important;
            color: #ffffff !important;
            box-shadow: 0 0 20px rgba(220, 53, 69, 0.35) !important;
          }
          .btn-option-inactive {
            background-color: rgba(23, 21, 59, 0.5) !important;
            border-color: rgba(255, 255, 255, 0.02) !important;
            color: #6c757d !important;
            opacity: 0.75;
          }
        `}} />
      </motion.div>
    </AnimatePresence>
  );
}
