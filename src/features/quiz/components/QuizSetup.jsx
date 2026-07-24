import React from 'react';

export default function QuizSetup({ engine, subject }) {
  const {
    quizType, setQuizType,
    selectedLessons, setSelectedLessons, availableLessons,
    selectedVolume, setSelectedVolume, availableVolumes,
    repeatWrong, setRepeatWrong,
    shuffleQ, setShuffleQ,
    shuffleOpt, setShuffleOpt,
    timerLimit, setTimerLimit,
    globalTimerLimit, setGlobalTimerLimit,
    questionCount, setQuestionCount,
    isTestMode, setIsTestMode,
    startQuiz, startRevision
  } = engine;

  return (
    <div className="container py-4 position-relative text-white" style={{ maxWidth: '800px' }}>
      
      {/* Background Glows */}
      <div className="position-absolute top-0 end-0 rounded-circle pointer-events-none" style={{ width: '400px', height: '400px', background: 'rgba(200, 172, 214, 0.05)', filter: 'blur(100px)', zIndex: -1 }} />
      <div className="position-absolute bottom-0 start-0 rounded-circle pointer-events-none" style={{ width: '400px', height: '400px', background: 'rgba(67, 61, 143, 0.08)', filter: 'blur(100px)', zIndex: -1 }} />

      <div className="text-center mb-5">
        <h2 className="display-4 font-bold text-white uppercase tracking-tight">
          {subject}
        </h2>
        <p className="text-theme-slate font-light mt-2" style={{ fontSize: '0.95rem' }}>Configure your assessment parameters before starting the sprint.</p>
      </div>
      
      <div 
        className="p-4 p-md-5 rounded-5 border shadow-lg position-relative overflow-hidden d-flex flex-column gap-4" 
        style={{ 
          backgroundColor: 'rgba(46, 42, 98, 0.45)', 
          backdropFilter: 'blur(20px)', 
          borderColor: 'rgba(255, 255, 255, 0.05)' 
        }}
      >
        
        {/* Subtle internal top glow line */}
        <div className="position-absolute top-0 start-0 end-0" style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(200, 172, 214, 0.3), transparent)' }}></div>

        {/* Assessment Scope Selection */}
        <section className="text-center">
          <h4 className="text-uppercase tracking-wider font-bold text-theme-highlight mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.25em' }}>Assessment Scope</h4>
          <div className="row g-2 p-2 rounded-4 border mt-2" style={{ backgroundColor: 'rgba(23, 21, 59, 0.5)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
            {["lesson", "volume", "full"].map(t => (
              <div key={t} className="col-4">
                <button 
                  className={`btn w-100 py-2.5 rounded-3 font-bold text-sm tracking-wider transition-all border-0 ${
                    quizType === t 
                      ? 'bg-theme-highlight text-theme-base shadow-highlight-glow' 
                      : 'btn-link text-decoration-none text-secondary hover-white'
                  }`}
                  onClick={() => setQuizType(t)}
                >
                  {t.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Scope Detail: Lesson list */}
        {quizType === "lesson" && (
          <section className="text-center animate-fade-in">
            <h4 className="text-uppercase tracking-wider font-bold text-secondary mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>Select Lessons</h4>
            <div 
              className="d-flex flex-wrap gap-2 justify-content-center p-3 rounded-4 border" 
              style={{ 
                maxHeight: '220px', 
                overflowY: 'auto', 
                backgroundColor: 'rgba(23, 21, 59, 0.4)', 
                borderColor: 'rgba(255, 255, 255, 0.04)' 
              }}
            >
              {availableLessons.map(lesson => (
                <button 
                  key={lesson}
                  className={`btn font-semibold text-sm transition-all border ${
                    selectedLessons.includes(lesson) 
                      ? 'bg-theme-accent text-theme-highlight border-theme-highlight' 
                      : 'btn-outline-light text-secondary border-transparent hover-white'
                  }`}
                  style={{ minWidth: '95px', borderRadius: '12px', padding: '8px 12px' }}
                  onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                >
                  Lesson {lesson}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Scope Detail: Volume list */}
        {quizType === "volume" && (
          <section className="text-center animate-fade-in">
            <h4 className="text-uppercase tracking-wider font-bold text-secondary mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>Select Volume</h4>
            <div 
              className="d-flex flex-wrap gap-2 justify-content-center p-3 rounded-4 border" 
              style={{ 
                backgroundColor: 'rgba(23, 21, 59, 0.4)', 
                borderColor: 'rgba(255, 255, 255, 0.04)' 
              }}
            >
              {availableVolumes.map(vol => (
                <button 
                  key={vol}
                  className={`btn font-semibold text-sm transition-all border ${
                    selectedVolume === vol 
                      ? 'bg-theme-accent text-theme-highlight border-theme-highlight' 
                      : 'btn-outline-light text-secondary border-transparent hover-white'
                  }`}
                  style={{ minWidth: '100px', borderRadius: '12px', padding: '8px 12px' }}
                  onClick={() => setSelectedVolume(vol)}
                >
                  Volume {vol}
                </button>
              ))}
              <button 
                className={`btn font-semibold text-sm transition-all border ${
                  selectedVolume === "all" 
                    ? 'bg-theme-accent text-theme-highlight border-theme-highlight' 
                    : 'btn-outline-light text-secondary border-transparent hover-white'
                }`}
                style={{ minWidth: '110px', borderRadius: '12px', padding: '8px 12px' }}
                onClick={() => setSelectedVolume("all")}
              >
                All Volumes
              </button>
            </div>
          </section>
        )}

        {/* Settings Toggle Options */}
        <section className="d-flex flex-column rounded-4 border mt-2 overflow-hidden animate-fade-in" style={{ backgroundColor: 'rgba(23, 21, 59, 0.4)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
          <div className="d-flex justify-content-between align-items-center p-3 px-4 hover-row">
            <span className="font-semibold text-white flex-grow-1">
              Practice Mode 
              <small className="d-block text-secondary font-light" style={{ fontSize: '0.75rem' }}>Instant feedback on answers</small>
            </span>
            <div className="form-check form-switch m-0 p-0">
              <input 
                type="checkbox" 
                className="form-check-input" 
                role="switch" 
                checked={!isTestMode} 
                onChange={() => setIsTestMode(prev => !prev)} 
                style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px' }}
              />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }} />
          
          {!isTestMode && (
            <>
              <div className="d-flex justify-content-between align-items-center p-3 px-4 hover-row">
                <span className="font-semibold text-white flex-grow-1">
                  Repeat Wrong Answers 
                  <small className="d-block text-secondary font-light" style={{ fontSize: '0.75rem' }}>Require correct answers before finishing</small>
                </span>
                <div className="form-check form-switch m-0 p-0">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    role="switch" 
                    checked={repeatWrong} 
                    onChange={() => setRepeatWrong(prev => !prev)} 
                    style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px' }}
                  />
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }} />
            </>
          )}
          
          <div className="d-flex justify-content-between align-items-center p-3 px-4 hover-row">
            <span className="font-semibold text-white">Shuffle Questions</span>
            <div className="form-check form-switch m-0 p-0">
              <input 
                type="checkbox" 
                className="form-check-input" 
                role="switch" 
                checked={shuffleQ} 
                onChange={() => setShuffleQ(prev => !prev)} 
                style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px' }}
              />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }} />
          
          <div className="d-flex justify-content-between align-items-center p-3 px-4 hover-row">
            <span className="font-semibold text-white">Shuffle Options</span>
            <div className="form-check form-switch m-0 p-0">
              <input 
                type="checkbox" 
                className="form-check-input" 
                role="switch" 
                checked={shuffleOpt} 
                onChange={() => setShuffleOpt(prev => !prev)} 
                style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px' }}
              />
            </div>
          </div>
        </section>

        {/* Configurations Parameters */}
        <div className="row g-4 mt-2">
          
          <div className="col-12 col-md-6 col-lg-4">
            <h4 className="text-uppercase tracking-wider font-bold text-secondary mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Question Timer</h4>
            <div className="row g-2">
              {[0, 5, 10, 15].map(t => (
                <div key={t} className="col-3">
                  <button 
                    className={`btn w-100 py-3 font-semibold text-xs transition-all border ${
                      timerLimit === t 
                        ? 'bg-theme-accent text-theme-highlight border-theme-highlight' 
                        : 'btn-outline-light text-secondary border-transparent hover-white'
                    }`}
                    style={{ borderRadius: '12px' }}
                    onClick={() => setTimerLimit(t)}
                  >
                    {t === 0 ? "OFF" : `${t}s`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <h4 className="text-uppercase tracking-wider font-bold text-secondary mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Global Timer</h4>
            <div className="row g-2">
              {[0, 5, 10, 30].map(t => (
                <div key={t} className="col-3">
                  <button 
                    className={`btn w-100 py-3 font-semibold text-xs transition-all border ${
                      globalTimerLimit === t 
                        ? 'bg-theme-accent text-theme-highlight border-theme-highlight' 
                        : 'btn-outline-light text-secondary border-transparent hover-white'
                    }`}
                    style={{ borderRadius: '12px' }}
                    onClick={() => setGlobalTimerLimit(t)}
                  >
                    {t === 0 ? "OFF" : `${t}m`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <h4 className="text-uppercase tracking-wider font-bold text-secondary mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Questions Count</h4>
            <div className="row g-2">
              {[0, 15, 20].map(n => (
                <div key={n} className="col-4">
                  <button 
                    className={`btn w-100 py-3 font-semibold text-xs transition-all border ${
                      questionCount === n 
                        ? 'bg-theme-accent text-theme-highlight border-theme-highlight' 
                        : 'btn-outline-light text-secondary border-transparent hover-white'
                    }`}
                    style={{ borderRadius: '12px' }}
                    onClick={() => setQuestionCount(n)}
                  >
                    {n === 0 ? "ALL" : n}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Start Sprint Actions */}
        <div className="pt-3 d-flex flex-column gap-3">
          <button 
            className="btn btn-outline-light border-theme-accent text-white py-3 font-bold tracking-widest text-uppercase hover-lavender-text" 
            style={{ borderRadius: '16px', fontSize: '1rem', border: '1px solid rgba(200, 172, 214, 0.2)' }}
            onClick={startRevision}
          >
            Start Revision
          </button>
          <button 
            className="btn btn-theme-highlight text-theme-base py-3 font-extrabold tracking-widest text-uppercase shadow-highlight-glow" 
            style={{ borderRadius: '16px', fontSize: '1rem' }}
            onClick={startQuiz}
          >
            Start Assessment
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-row:hover {
          background-color: rgba(255, 255, 255, 0.01) !important;
        }
        .hover-white:hover {
          color: white !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .hover-lavender-text:hover {
          color: var(--color-lavender) !important;
          border-color: var(--color-lavender) !important;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
