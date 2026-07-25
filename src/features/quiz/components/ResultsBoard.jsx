import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Repeat, Home, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function ResultsBoard({ engine }) {
  const navigate = useNavigate();
  const { firstAttemptQuestions, firstAttemptAnswers, firstAttemptCorrect } = engine;

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
    <div className="container py-4 position-relative" style={{ maxWidth: '900px' }}>
      <div className="d-flex flex-column align-items-center">
        <h1 className="text-h1 mb-4 text-center">
          Assessment Results
        </h1>
        
        <div className="surface p-4 p-md-5 mb-5 w-100" style={{ maxWidth: '560px' }}>
          <div className="d-flex flex-column gap-3 mb-4">
            <div className="d-flex justify-content-between align-items-center p-3 px-4 rounded-4" style={{ background: 'var(--surface-3)' }}>
              <span className="text-uppercase tracking-wider font-bold text-muted" style={{ fontSize: '0.75rem' }}>Total Questions</span>
              <span className="text-h3 font-bold m-0">{total}</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center p-3 px-4 rounded-4" style={{ background: 'var(--surface-3)' }}>
              <span className="text-uppercase tracking-wider font-bold text-muted" style={{ fontSize: '0.75rem' }}>Correct Answers</span>
              <span className="text-h3 font-bold m-0" style={{ color: 'var(--success)' }}>{correct}</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center p-3 px-4 rounded-4" style={{ background: 'var(--surface-3)' }}>
              <span className="text-uppercase tracking-wider font-bold text-muted" style={{ fontSize: '0.75rem' }}>Accuracy</span>
              <span className="text-h2 font-black m-0" style={{ color: 'var(--primary)' }}>{accuracy}%</span>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-sm-row gap-3">
            <button 
              className="btn btn-outline flex-grow-1"
              onClick={() => window.location.reload()}
            >
              <Repeat size={18} /> Retry Sprint
            </button>
            <button 
              className="btn btn-primary flex-grow-1"
              onClick={() => navigate("/")}
            >
              <Home size={18} /> Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 w-100">
        <div className="d-flex align-items-center gap-3 my-5">
          <div className="flex-grow-1" style={{ height: '1px', background: 'var(--ink-100)' }}></div>
          <h2 className="text-h3 text-center m-0">Review Answers</h2>
          <div className="flex-grow-1" style={{ height: '1px', background: 'var(--ink-100)' }}></div>
        </div>
        
        <div className="d-flex flex-column gap-4">
          {firstAttemptAnswers.map((item, idx) => (
            <div 
              key={idx} 
              className="surface p-4 p-md-5 position-relative"
              style={{ borderLeft: `5px solid ${item.isCorrect ? 'var(--success)' : 'var(--danger)'}` }}
            >
              <div className="d-flex align-items-start gap-3 mb-4">
                <span className="badge-num badge-num-primary flex-shrink-0">
                  {idx + 1}
                </span>
                <h3 className="text-h5 font-medium leading-relaxed m-0 pt-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.questionObj.question) }} />
              </div>

              {item.questionObj.question_image && (
                <div className="mb-4 ps-md-5">
                  <img src={item.questionObj.question_image} alt="Question" className="img-fluid rounded-lg border" style={{ maxWidth: '400px', objectFit: 'contain', borderColor: 'var(--ink-100)' }} />
                </div>
              )}
              
              <div className="row g-3 ps-md-5">
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded-xl d-flex align-items-center gap-3 h-100" style={{ background: item.isCorrect ? 'var(--success-100)' : 'var(--danger-100)' }}>
                    {item.isCorrect ? <CheckCircle2 size={22} style={{ color: 'var(--success)' }} className="flex-shrink-0" /> : <XCircle size={22} style={{ color: 'var(--danger)' }} className="flex-shrink-0" />}
                    <div>
                      <span className="d-block text-uppercase tracking-wider mb-1" style={{ fontSize: '0.65rem', fontWeight: 'bold', color: item.isCorrect ? 'var(--success)' : 'var(--danger)' }}>Your Answer</span>
                      <span className="font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.userAnswer || "Skipped / Timeout") }} />
                    </div>
                  </div>
                </div>
                
                {!item.isCorrect && (
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-xl d-flex align-items-center gap-3 h-100" style={{ background: 'var(--success-100)' }}>
                      <CheckCircle2 size={22} style={{ color: 'var(--success)' }} className="flex-shrink-0" />
                      <div>
                        <span className="d-block text-uppercase tracking-wider mb-1" style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--success)' }}>Correct Answer</span>
                        <span className="font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.questionObj.answer) }} />
                      </div>
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
