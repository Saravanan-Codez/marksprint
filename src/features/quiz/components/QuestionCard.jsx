import React, { memo } from 'react';
import DOMPurify from 'dompurify';
import { CheckCircle2, XCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { AnimatePresence } from 'framer-motion';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function QuestionCardImpl({
  currentQ,
  currentIdx,
  handleAnswer,
  isLocked,
  userAnswer,
  isTestMode,
  isBookmarked = false,
  onToggleBookmark
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
        <div className="surface w-100 p-4 p-md-5 mb-4 position-relative text-center">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(currentQ); }}
              className="position-absolute top-3 end-3 border-0 p-2 rounded-2 transition-all"
              style={{
                background: isBookmarked ? 'var(--warning-100)' : 'var(--surface-4)',
                color: isBookmarked ? 'var(--warning)' : 'var(--ink-400)',
                zIndex: 5,
                borderRadius: 'var(--radius-full)',
                width: '38px',
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark for later'}
            >
              {isBookmarked
                ? <BookmarkCheck size={18} fill={isBookmarked ? 'var(--warning)' : 'none'} />
                : <Bookmark size={18} />
              }
            </button>
          )}
          <h2 className="text-h3 leading-relaxed mb-0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentQ.question || "") }} />
          {currentQ.question_image && <img src={currentQ.question_image} alt="Question" className="img-fluid mx-auto mt-4 rounded-3 border" style={{ maxHeight: '280px', objectFit: 'contain', borderColor: 'var(--ink-100)' }} />}
        </div>

        {isLocked && (
          <div className="position-absolute top-0 end-0 p-3 opacity-75 d-flex align-items-center gap-2">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: 'var(--primary)' }}></div>
            <span className="text-uppercase font-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: '700' }}>Processing</span>
          </div>
        )}

        <div className="row g-3 w-100">
          {currentQ.displayOptions.map((opt, i) => {
            let statusClass = "option-default";
            let showCorrectIcon = false;
            let showWrongIcon = false;

            if (isLocked) {
              if (isTestMode) {
                if (opt.text === userAnswer) {
                  statusClass = "option-checked";
                } else {
                  statusClass = "option-inactive";
                }
              } else {
                if (opt.text === currentQ.answer) {
                  statusClass = "option-correct";
                  showCorrectIcon = true;
                } else if (opt.text === userAnswer) {
                  statusClass = "option-wrong";
                  showWrongIcon = true;
                } else {
                  statusClass = "option-inactive";
                }
              }
            }

            return (
              <div key={`${currentIdx}-${i}`} className="col-12 col-md-6">
                <button
                  className={`option-btn d-flex align-items-center justify-content-between w-100 p-3 rounded-3 border text-start ${statusClass}`}
                  style={{
                    minHeight: '72px',
                    cursor: isLocked ? 'default' : 'pointer'
                  }}
                  onClick={() => handleAnswer(opt.text)}
                  disabled={isLocked}
                >
                  <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                    <span
                      className="flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--surface-3)',
                        color: 'var(--ink-700)',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        border: '1px solid var(--ink-100)'
                      }}
                    >
                      {LETTERS[i] || (i + 1)}
                    </span>
                    <div className="flex-grow-1 min-w-0">
                      {opt.text && <span className="block text-base leading-relaxed font-medium" style={{ display: 'block', color: 'inherit' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(opt.text) }} />}
                      {opt.img && <img src={opt.img} alt={`Option ${i + 1}`} className="img-fluid rounded-2 my-2" style={{ maxHeight: '120px', objectFit: 'contain' }} />}
                    </div>
                  </div>

                  {showCorrectIcon && <CheckCircle2 className="flex-shrink-0 ms-3" size={22} style={{ color: 'var(--success)' }} />}
                  {showWrongIcon && <XCircle className="flex-shrink-0 ms-3" size={22} style={{ color: 'var(--danger)' }} />}
                </button>
              </div>
            );
          })}
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          .option-btn {
            font-family: var(--font-sans);
            border: 1px solid;
            transition: transform .2s cubic-bezier(.2,.7,.2,1), background-color .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease;
          }
          .option-btn:active:not(:disabled) { transform: translateY(1px); }
          .option-btn:focus-visible { outline: none; box-shadow: var(--ring); }

          .option-default {
            background: var(--surface) !important;
            border-color: var(--ink-200) !important;
            color: var(--ink-800) !important;
            box-shadow: var(--shadow-xs) !important;
          }
          .option-default:hover:not(:disabled) {
            background: var(--surface-2) !important;
            border-color: var(--primary) !important;
            color: var(--ink-900) !important;
            transform: translateY(-2px);
            box-shadow: var(--shadow-md) !important;
          }

          .option-checked {
            background: var(--primary-50) !important;
            border-color: var(--primary) !important;
            color: var(--ink-900) !important;
            box-shadow: var(--shadow-sm) !important;
          }

          .option-correct {
            background: var(--success-100) !important;
            border-color: var(--success) !important;
            color: var(--ink-900) !important;
            box-shadow: var(--shadow-sm) !important;
          }

          .option-wrong {
            background: var(--danger-100) !important;
            border-color: var(--danger) !important;
            color: var(--ink-900) !important;
            box-shadow: var(--shadow-sm) !important;
          }

          .option-inactive {
            background: var(--surface-2) !important;
            border-color: var(--ink-100) !important;
            color: var(--ink-400) !important;
            opacity: 0.8;
          }
        `
        }} />
      </motion.div>
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
