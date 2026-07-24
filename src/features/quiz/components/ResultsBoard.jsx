import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Repeat, Home, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function ResultsBoard({ engine }) {
  const navigate = useNavigate();
  const { firstAttemptQuestions, firstAttemptAnswers, firstAttemptCorrect, isTestMode, repeatWrong } = engine;

  const total = firstAttemptQuestions.length;
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
    <div className="container py-4 position-relative text-white" style={{ maxWidth: '900px' }}>
      
      {/* Massive Background Glow */}
      <div className="position-absolute top-50 start-50 translate-middle rounded-circle pointer-events-none animate-pulse" style={{ width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(200, 172, 214, 0.03) 0%, rgba(67, 61, 143, 0.05) 50%, transparent 100%)', filter: 'blur(100px)', zIndex: -1 }}></div>

      <div className="d-flex flex-column align-items-center">
        <h1 className="display-5 font-bold text-white tracking-tight mb-4 text-center uppercase">
          Assessment Results
        </h1>
        
        <div 
          className="w-100 p-4 p-md-5 rounded-5 border mb-5 position-relative overflow-hidden" 
          style={{ 
            maxWidth: '560px', 
            backgroundColor: 'rgba(46, 42, 98, 0.45)', 
            backdropFilter: 'blur(20px)', 
            borderColor: 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="position-absolute top-0 start-0 end-0" style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(200, 172, 214, 0.3), transparent)' }}></div>

          <div className="d-flex flex-column gap-3 mb-4">
            <div className="d-flex justify-content-between align-items-center p-3 px-4 rounded-4 border" style={{ backgroundColor: 'rgba(23, 21, 59, 0.5)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
              <span className="text-uppercase tracking-wider font-bold text-secondary" style={{ fontSize: '0.75rem' }}>Total Questions</span>
              <span className="h3 font-black text-white m-0 tracking-wider">{total}</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center p-3 px-4 rounded-4 border" style={{ backgroundColor: 'rgba(23, 21, 59, 0.5)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
              <span className="text-uppercase tracking-wider font-bold text-secondary" style={{ fontSize: '0.75rem' }}>Correct Answers</span>
              <span className="h3 font-black text-success m-0 tracking-wider">{correct}</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center p-3 px-4 rounded-4 border" style={{ backgroundColor: 'rgba(23, 21, 59, 0.5)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
              <span className="text-uppercase tracking-wider font-bold text-secondary" style={{ fontSize: '0.75rem' }}>Accuracy</span>
              <span className="h2 font-black text-theme-highlight m-0 tracking-wider">{accuracy}%</span>
            </div>
          </div>
          
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <button 
                className="btn btn-outline-light border-theme-accent text-secondary hover-lavender-text py-3 w-100 font-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: '12px', fontSize: '0.9rem' }}
                onClick={() => window.location.reload()}
              >
                <Repeat size={18} /> Retry Sprint
              </button>
            </div>
            <div className="col-12 col-sm-6">
              <button 
                className="btn btn-theme-highlight text-theme-base py-3 w-100 font-bold text-uppercase tracking-wider d-flex align-items-center justify-content-center gap-2 shadow-highlight-glow"
                style={{ borderRadius: '12px', fontSize: '0.9rem' }}
                onClick={() => navigate("/")}
              >
                <Home size={18} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 w-100">
        <div className="d-flex align-items-center gap-3 my-5">
          <div className="flex-grow-1" style={{ height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(200, 172, 214, 0.35))' }}></div>
          <h2 className="h4 font-bold text-white text-center tracking-wider text-uppercase m-0">Review Answers</h2>
          <div className="flex-grow-1" style={{ height: '1.5px', background: 'linear-gradient(-90deg, transparent, rgba(200, 172, 214, 0.35))' }}></div>
        </div>
        
        <div className="d-flex flex-column gap-4">
          {firstAttemptAnswers.map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 p-md-5 rounded-5 border position-relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(46, 42, 98, 0.45)', 
                backdropFilter: 'blur(20px)', 
                borderColor: 'rgba(255, 255, 255, 0.05)',
                borderLeft: `5px solid ${item.isCorrect ? '#198754' : '#dc3545'}`
              }}
            >
              <div className="position-absolute top-0 start-0 end-0" style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(200, 172, 214, 0.2), transparent)' }}></div>
              
              <div className="d-flex align-items-start gap-3 mb-4">
                <span 
                  className="d-flex align-items-center justify-content-center rounded-3 font-bold text-sm text-theme-highlight border flex-shrink-0" 
                  style={{ width: '32px', height: '32px', backgroundColor: 'rgba(23, 21, 59, 0.5)', borderColor: 'rgba(255, 255, 255, 0.04)' }}
                >
                  {idx + 1}
                </span>
                <h3 className="h5 text-white font-medium leading-relaxed m-0 pt-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.questionObj.question) }} />
              </div>

              {item.questionObj.question_image && (
                <div className="mb-4 ps-md-5">
                  <img src={item.questionObj.question_image} alt="Question" className="img-fluid rounded-4 border border-secondary shadow-sm" style={{ maxWidth: '400px', objectFit: 'contain' }} />
                </div>
              )}
              
              <div className="row g-3 ps-md-5">
                <div className="col-12 col-md-6">
                  <div className={`p-3 rounded-4 d-flex align-items-center gap-3 border h-100 ${item.isCorrect ? 'bg-success-glow border-success-subtle' : 'bg-danger-glow border-danger-subtle'}`}>
                    {item.isCorrect ? <CheckCircle2 size={22} className="text-success flex-shrink-0" /> : <XCircle size={22} className="text-danger flex-shrink-0" />}
                    <div>
                      <span className="d-block text-uppercase tracking-wider text-secondary mb-1" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>Your Answer</span>
                      <span className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.userAnswer || "Skipped / Timeout") }} />
                    </div>
                  </div>
                </div>
                
                {!item.isCorrect && (
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-4 d-flex align-items-center gap-3 border border-success-subtle bg-success-glow h-100">
                      <CheckCircle2 size={22} className="text-success flex-shrink-0" />
                      <div>
                        <span className="d-block text-uppercase tracking-wider text-secondary mb-1" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>Correct Answer</span>
                        <span className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.questionObj.answer) }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-success-glow {
          background-color: rgba(25, 135, 84, 0.15) !important;
          border-color: rgba(25, 135, 84, 0.3) !important;
        }
        .bg-danger-glow {
          background-color: rgba(220, 53, 69, 0.15) !important;
          border-color: rgba(220, 53, 69, 0.3) !important;
        }
        .hover-lavender-text:hover {
          color: var(--color-lavender) !important;
          border-color: var(--color-lavender) !important;
        }
      `}} />
    </div>
  );
}
