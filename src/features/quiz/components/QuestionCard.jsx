import React, { memo } from 'react';
import DOMPurify from 'dompurify';
import { CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence } from 'framer-motion';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function QuestionCardImpl({
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
      <div
        key={currentIdx}
        className="w-100 d-flex flex-column align-items-center pb-5 position-relative anim-fade-in"
      >
        <div className="bg-white border-brutal w-100 p-4 p-md-5 mb-4 position-relative text-center text-black shadow-hard">
          <h2 className="font-headline text-3xl font-black leading-relaxed mb-0 text-black" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentQ.question || "") }} />
          {currentQ.question_image && <img src={currentQ.question_image} alt="Question" className="img-fluid mx-auto mt-4 border-2 border-black" style={{ maxHeight: '280px', objectFit: 'contain' }} />}
        </div>

        {isLocked && (
          <div className="position-absolute top-0 end-0 p-3 opacity-75 d-flex align-items-center gap-2">
            <div className="spinner-border spinner-border-sm text-black" role="status"></div>
            <span className="text-uppercase font-bold text-black font-mono" style={{ fontSize: '0.75rem' }}>PROCESSING</span>
          </div>
        )}

        <div className="row g-3 w-100 font-mono">
          {currentQ.displayOptions.map((opt, i) => {
            let statusClass = "neo-option-default";
            let showCorrectIcon = false;
            let showWrongIcon = false;

            const optTextClean = (opt.text || '').toString().trim();
            const answerClean = (currentQ.answer || '').toString().trim();
            const userAnsClean = (userAnswer || '').toString().trim();

            if (isLocked) {
              if (isTestMode) {
                if (optTextClean === userAnsClean) {
                  statusClass = "neo-option-checked";
                } else {
                  statusClass = "neo-option-inactive";
                }
              } else {
                if (optTextClean === answerClean || (optTextClean && answerClean && optTextClean.toLowerCase() === answerClean.toLowerCase())) {
                  statusClass = "neo-option-correct";
                  showCorrectIcon = true;
                } else if (optTextClean === userAnsClean) {
                  statusClass = "neo-option-wrong";
                  showWrongIcon = true;
                } else {
                  statusClass = "neo-option-inactive";
                }
              }
            }

            return (
              <div key={`${currentIdx}-${i}`} className="col-12 col-md-6">
                <button
                  className={`neo-option-btn d-flex align-items-center justify-content-between w-100 p-3.5 border-brutal text-start ${statusClass}`}
                  style={{
                    minHeight: '74px',
                    cursor: isLocked ? 'default' : 'pointer'
                  }}
                  onClick={() => handleAnswer(opt.text)}
                  disabled={isLocked}
                >
                  <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                    <span
                      className="flex-shrink-0 d-inline-flex align-items-center justify-content-center border-2 border-black bg-black text-brand font-headline font-black text-sm"
                      style={{
                        width: '36px',
                        height: '36px'
                      }}
                    >
                      {LETTERS[i] || (i + 1)}
                    </span>
                    <div className="flex-grow-1 min-w-0">
                      {opt.text && <span className="block text-base leading-relaxed font-bold text-black" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(opt.text) }} />}
                      {opt.img && <img src={opt.img} alt={`Option ${i + 1}`} className="img-fluid border-2 border-black my-2" style={{ maxHeight: '120px', objectFit: 'contain' }} />}
                    </div>
                  </div>

                  {showCorrectIcon && <CheckCircle2 className="flex-shrink-0 ms-3 text-emerald-600" size={24} />}
                  {showWrongIcon && <XCircle className="flex-shrink-0 ms-3 text-rose-600" size={24} />}
                </button>
              </div>
            );
          })}
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          .neo-option-btn {
            font-family: var(--font-mono);
            border: 4px solid #000000 !important;
            transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .neo-option-default {
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          .neo-option-default:hover:not(:disabled) {
            background: var(--brand) !important;
            color: #000000 !important;
            transform: translate(-4px, -4px);
            box-shadow: 6px 6px 0px 0px #000000 !important;
          }

          .neo-option-checked {
            background: var(--brand) !important;
            color: #000000 !important;
            box-shadow: 4px 4px 0px 0px #000000 !important;
          }

          .neo-option-correct {
            background: #D1FAE5 !important;
            color: #065F46 !important;
            border-color: #059669 !important;
          }

          .neo-option-wrong {
            background: #FFE4E6 !important;
            color: #9F1239 !important;
            border-color: #E11D48 !important;
          }

          .neo-option-inactive {
            opacity: 0.55;
            background: #F1F5F9 !important;
          }
        `}} />
      </div>
    </AnimatePresence>
  );
}

export default memo(QuestionCardImpl, (prev, next) => {
  if (prev.currentIdx !== next.currentIdx) return false;
  if (prev.isLocked !== next.isLocked) return false;
  if (prev.userAnswer !== next.userAnswer) return false;
  if (prev.isBookmarked !== next.isBookmarked) return false;
  if (prev.currentQ?.answer !== next.currentQ?.answer) return false;
  if (prev.currentQ?.question !== next.currentQ?.question) return false;
  if ((prev.currentQ?.displayOptions || []).length !== (next.currentQ?.displayOptions || []).length) return false;
  return true;
});
