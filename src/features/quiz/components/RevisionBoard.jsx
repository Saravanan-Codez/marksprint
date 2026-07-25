import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function RevisionBoard({ engine }) {
  const { quizQuestions, setQuizMode } = engine;

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

  const optionLetter = (idx) => String.fromCharCode(65 + idx);

  return (
    <div className="container py-4 position-relative" style={{ maxWidth: '900px' }}>
      <div className="d-flex flex-column align-items-center">
        <h1 className="text-h1 mb-4 text-center">
          Revision - All Questions
        </h1>
        
        <div className="surface p-4 p-md-5 mb-5 w-100" style={{ maxWidth: '560px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="text-uppercase tracking-wider font-bold text-muted mb-1" style={{ fontSize: '0.75rem' }}>Total Questions</p>
              <p className="text-h2 font-bold m-0" style={{ color: 'var(--primary)' }}>{quizQuestions.length}</p>
            </div>
          </div>
          
          <button 
            className="btn btn-outline w-100"
            onClick={() => setQuizMode("setup")}
          >
            <ArrowLeft size={18} /> Back to Filters
          </button>
        </div>
      </div>

      <div className="w-100">
        <div className="d-flex align-items-center gap-3 my-5">
          <div className="flex-grow-1" style={{ height: '1px', background: 'var(--ink-100)' }}></div>
          <h2 className="text-h3 text-center m-0">Questions &amp; Answers</h2>
          <div className="flex-grow-1" style={{ height: '1px', background: 'var(--ink-100)' }}></div>
        </div>
        
        <div className="d-flex flex-column gap-4">
          {quizQuestions.map((item, idx) => (
            <div key={idx} className="surface p-4 p-md-5">
              <div className="d-flex align-items-start gap-3 mb-4">
                <span className="badge-num badge-num-primary flex-shrink-0">
                  {idx + 1}
                </span>
                <h3 className="text-h5 font-medium leading-relaxed m-0 pt-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.question) }} />
              </div>

              {item.question_image && (
                <div className="mb-4 ps-md-5">
                  <img src={item.question_image} alt="Question" className="img-fluid rounded-lg border" style={{ maxWidth: '400px', objectFit: 'contain', borderColor: 'var(--ink-100)' }} />
                </div>
              )}
              
              <div className="row g-3 ps-md-5 mb-4">
                {item.displayOptions && item.displayOptions.map((option, optIdx) => {
                  const isAnswer = option.text === item.answer;
                  return (
                    <div key={optIdx} className="col-12 col-md-6">
                      <div 
                        className="p-3 rounded-xl d-flex align-items-start gap-3 h-100"
                        style={{ background: isAnswer ? 'var(--success-100)' : 'var(--surface-2)' }}
                      >
                        <span 
                          className="badge-num flex-shrink-0 mt-0.5"
                          style={{ 
                            background: isAnswer ? 'var(--success)' : 'var(--surface-3)',
                            color: isAnswer ? '#FFFFFF' : 'var(--ink-700)',
                            borderColor: 'transparent',
                            minWidth: '1.75rem',
                            height: '1.75rem',
                            padding: '0 0.5rem',
                            fontSize: '0.8rem'
                          }}
                        >
                          {optionLetter(optIdx)}
                        </span>
                        <div className="flex-grow-1">
                          {option.img && <img src={option.img} alt="Option" className="img-fluid rounded-3 mb-2 border" style={{ maxHeight: '100px', objectFit: 'contain', borderColor: 'var(--ink-100)' }} />}
                          <div className="d-flex align-items-start gap-2">
                            {isAnswer && <CheckCircle2 size={20} style={{ color: 'var(--success)', marginTop: '2px' }} className="flex-shrink-0" />}
                            <span className="font-semibold block text-base" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(option.text) }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl" style={{ background: 'var(--primary-100)', marginLeft: '48px' }}>
                <span className="d-block text-uppercase tracking-wider mb-1" style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--primary)' }}>Correct Answer</span>
                <span className="font-semibold text-base" style={{ color: 'var(--primary-600)' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 d-flex justify-content-center">
          <button 
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            style={{ maxWidth: '300px', width: '100%' }}
            onClick={() => setQuizMode("setup")}
          >
            <ArrowLeft size={18} /> Back to Filters
          </button>
        </div>
      </div>
    </div>
  );
}
