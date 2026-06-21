import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function RevisionBoard({ engine }) {
  const { quizQuestions, setQuizMode } = engine;

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
  }, [quizQuestions]);

  return (
    <div className="container py-4 position-relative text-white" style={{ maxWidth: '900px' }}>
      
      {/* Massive Background Glow */}
      <div className="position-absolute top-50 start-50 translate-middle rounded-circle pointer-events-none animate-pulse" style={{ width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(200, 172, 214, 0.03) 0%, rgba(67, 61, 143, 0.05) 50%, transparent 100%)', filter: 'blur(100px)', zIndex: -1 }}></div>

      <div className="d-flex flex-column align-items-center">
        <h1 className="display-5 font-bold text-white tracking-tight mb-4 text-center uppercase">
          Revision - All Questions
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

          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <div>
              <p className="text-uppercase tracking-wider font-bold text-secondary mb-1" style={{ fontSize: '0.75rem' }}>Total Questions</p>
              <p className="display-6 font-bold text-theme-highlight m-0">{quizQuestions.length}</p>
            </div>
          </div>
          
          <button 
            className="btn btn-outline-light border-theme-accent text-secondary hover-lavender-text py-3 w-100 font-semibold d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: '12px', fontSize: '0.9rem' }}
            onClick={() => setQuizMode("setup")}
          >
            <ArrowLeft size={18} /> Back to Filters
          </button>
        </div>
      </div>

      <div className="w-100">
        <div className="d-flex align-items-center gap-3 my-5">
          <div className="flex-grow-1" style={{ height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(200, 172, 214, 0.35))' }}></div>
          <h2 className="h4 font-bold text-white text-center tracking-wider text-uppercase m-0">Questions & Answers</h2>
          <div className="flex-grow-1" style={{ height: '1.5px', background: 'linear-gradient(-90deg, transparent, rgba(200, 172, 214, 0.35))' }}></div>
        </div>
        
        <div className="d-flex flex-column gap-4">
          {quizQuestions.map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 p-md-5 rounded-5 border position-relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(46, 42, 98, 0.45)', 
                backdropFilter: 'blur(20px)', 
                borderColor: 'rgba(255, 255, 255, 0.05)'
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
                <h3 className="h5 text-white font-medium leading-relaxed m-0 pt-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.question) }} />
              </div>

              {item.question_image && (
                <div className="mb-4 ps-md-5">
                  <img src={item.question_image} alt="Question" className="img-fluid rounded-4 border border-secondary shadow-sm" style={{ maxWidth: '400px', objectFit: 'contain' }} />
                </div>
              )}
              
              <div className="row g-3 ps-md-5 mb-4">
                {item.displayOptions && item.displayOptions.map((option, optIdx) => {
                  const isAnswer = option.text === item.answer;
                  return (
                    <div key={optIdx} className="col-12 col-md-6">
                      <div 
                        className={`p-3 rounded-4 d-flex align-items-start gap-3 border h-100 transition-all ${
                          isAnswer ? 'bg-success-glow border-success-subtle' : 'bg-option-item border-transparent'
                        }`}
                      >
                        {isAnswer && <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-0.5" />}
                        <div className="flex-grow-1">
                          {option.img && <img src={option.img} alt="Option" className="img-fluid rounded-3 mb-2 border" style={{ maxHeight: '100px', objectFit: 'contain' }} />}
                          <span className="text-white font-semibold block text-base" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(option.text) }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-4 border border-theme-accent" style={{ backgroundColor: 'rgba(67, 61, 143, 0.2)', marginLeft: '48px' }}>
                <span className="d-block text-uppercase tracking-wider text-secondary mb-1" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>Correct Answer</span>
                <span className="text-theme-highlight font-semibold text-base" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 d-flex justify-content-center">
          <button 
            className="btn btn-theme-highlight text-theme-base py-3 px-5 font-bold text-uppercase tracking-wider d-flex align-items-center justify-content-center gap-2 shadow-highlight-glow"
            style={{ borderRadius: '12px', fontSize: '0.9rem', maxWidth: '300px', width: '100%' }}
            onClick={() => setQuizMode("setup")}
          >
            <ArrowLeft size={18} /> Back to Filters
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-success-glow {
          background-color: rgba(25, 135, 84, 0.15) !important;
          border-color: rgba(25, 135, 84, 0.3) !important;
        }
        .bg-option-item {
          background-color: rgba(23, 21, 59, 0.4) !important;
          border-color: rgba(25, 255, 255, 0.02) !important;
          color: #a1a1aa !important;
        }
        .hover-lavender-text:hover {
          color: var(--color-lavender) !important;
          border-color: var(--color-lavender) !important;
        }
      `}} />
    </div>
  );
}
