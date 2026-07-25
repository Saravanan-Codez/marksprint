import React, { useCallback, useMemo } from 'react';
import { Bookmark, BarChart3, Trophy, Target, Trash2, Play, Clock } from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';

const SUBJECT_KEYS = {
  Physics: 'Physics',
  Chemistry: 'Chemistry',
  Maths: 'Maths',
  'Computer Science': 'Computer Science',
  Biology: 'Biology',
  English: 'English',
  Tamil: 'Tamil'
};

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
    startQuiz, startRevision,
    allQuestions, buildQuestionPool,
    savedProgress, clearSavedProgress,
    startBookmarkedQuiz, hasBookmarkedQuestions,
    statistics, isBookmarked
  } = engine;

  const toast = useToast();

  const subjectStats = useMemo(() => {
    const key = SUBJECT_KEYS[subject] || subject;
    return statistics?.bySubject?.[key] || null;
  }, [statistics, subject]);

  const hasBookmarks = useMemo(() => hasBookmarkedQuestions(), [hasBookmarkedQuestions]);

  const bookmarkCount = useMemo(() => {
    if (!allQuestions || !isBookmarked) return 0;
    let count = 0;
    for (let i = 0; i < allQuestions.length; i++) {
      if (isBookmarked(allQuestions[i])) count++;
    }
    return count;
  }, [allQuestions, isBookmarked]);

  const doStartQuiz = useCallback(() => {
    if (!allQuestions || allQuestions.length === 0) {
      toast.error('No questions available for this subject yet.');
      return;
    }
    const pool = buildQuestionPool ? buildQuestionPool() : null;
    if (pool && pool.length === 0) {
      toast.error('No questions match the current filter (lesson / volume / count).');
      return;
    }
    startQuiz();
  }, [allQuestions, buildQuestionPool, startQuiz, toast]);

  const doStartRevision = useCallback(() => {
    if (!allQuestions || allQuestions.length === 0) {
      toast.error('No questions available for this subject yet.');
      return;
    }
    const pool = buildQuestionPool ? buildQuestionPool() : null;
    if (pool && pool.length === 0) {
      toast.error('No questions match the current filter (lesson / volume / count).');
      return;
    }
    startRevision();
  }, [allQuestions, buildQuestionPool, startRevision, toast]);

  const doResumeSaved = useCallback(() => {
    if (!savedProgress) {
      toast.warning('No saved progress to resume for this subject.');
      return;
    }
    toast.success(`Resuming quiz saved on ${new Date(savedProgress.savedAt).toLocaleString()}`);
    startQuiz({ resume: true });
  }, [savedProgress, startQuiz, toast]);

  const doDiscardSaved = useCallback(() => {
    clearSavedProgress();
    toast.info('Saved progress discarded.');
  }, [clearSavedProgress, toast]);

  const doStartBookmarked = useCallback(() => {
    if (!hasBookmarks) {
      toast.warning('No bookmarked questions in this subject yet. Tap the star icon on questions to save them for later.');
      return;
    }
    startBookmarkedQuiz();
    toast.success('Starting bookmarked questions session!');
  }, [hasBookmarks, startBookmarkedQuiz, toast]);

  const formatSavedAt = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="container py-4 position-relative" style={{ maxWidth: '800px' }}>

      <div className="text-center mb-5">
        <h2 className="display-4 font-bold text-slate-900 uppercase tracking-tight">
          {subject}
        </h2>
        <p className="text-slate-500 font-light mt-2" style={{ fontSize: '0.95rem' }}>Configure your assessment parameters before starting the sprint.</p>
      </div>

      {/* Resume Saved Progress Banner */}
      {savedProgress && savedProgress.quizQuestions && (
        <div
          className="mb-4 p-4 rounded-4 border surface-3 shadow-sm animate-fade-in"
          role="region"
          aria-label="Saved progress available"
        >
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-start gap-3">
              <div className="chip-primary rounded-4 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                <Clock size={22} className="text-white" />
              </div>
              <div className="text-start">
                <h4 className="h6 font-bold text-slate-900 m-0">Unfinished session detected</h4>
                <p className="text-slate-500 m-0 mt-1" style={{ fontSize: '0.85rem' }}>
                  Saved on {formatSavedAt(savedProgress.savedAt)} &mdash; {savedProgress.quizQuestions?.length ?? 0} questions in progress.
                </p>
              </div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button
                className="btn-outline text-slate-700 py-2 px-4 font-bold text-uppercase tracking-wider d-inline-flex align-items-center gap-2"
                style={{ fontSize: '0.8rem' }}
                onClick={doDiscardSaved}
                title="Discard saved progress"
              >
                <Trash2 size={14} /> Discard
              </button>
              <button
                className="btn-primary text-white py-2 px-4 font-extrabold text-uppercase tracking-wider d-inline-flex align-items-center gap-2"
                style={{ fontSize: '0.8rem' }}
                onClick={doResumeSaved}
                title="Resume saved quiz"
              >
                <Play size={14} /> Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Summary Cards */}
      {(subjectStats || statistics) && (
        <div className="mb-4 p-4 rounded-4 border surface shadow-sm animate-fade-in">
          <div className="d-flex align-items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-primary" />
            <h4 className="text-uppercase tracking-wider font-bold text-slate-500 m-0" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
              Performance Overview
            </h4>
          </div>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="surface-3 p-3 rounded-4 text-center border">
                <div className="d-flex justify-content-center mb-1"><Target size={16} className="text-primary" /></div>
                <div className="h3 font-black m-0 text-slate-900">{subjectStats?.attempts ?? 0}</div>
                <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Attempts</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="surface-3 p-3 rounded-4 text-center border">
                <div className="d-flex justify-content-center mb-1"><Trophy size={16} style={{ color: '#f59e0b' }} /></div>
                <div className="h3 font-black m-0 text-slate-900">{subjectStats?.bestScore ?? 0}<small className="text-slate-500" style={{ fontSize: '0.9rem' }}>%</small></div>
                <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Best Score</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="surface-3 p-3 rounded-4 text-center border">
                <div className="d-flex justify-content-center mb-1"><BarChart3 size={16} className="text-teal-600" /></div>
                <div className="h3 font-black m-0 text-slate-900">{subjectStats?.avgScore ?? 0}<small className="text-slate-500" style={{ fontSize: '0.9rem' }}>%</small></div>
                <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Avg Score</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="surface-3 p-3 rounded-4 text-center border">
                <div className="d-flex justify-content-center mb-1"><Bookmark size={16} className="text-primary" /></div>
                <div className="h3 font-black m-0 text-slate-900">{bookmarkCount}</div>
                <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Bookmarked</div>
              </div>
            </div>
          </div>
          {subjectStats?.lastAt && (
            <div className="mt-3 text-center text-slate-500" style={{ fontSize: '0.75rem' }}>
              Last attempt: {formatSavedAt(subjectStats.lastAt)} &middot; scored {subjectStats.lastScore}%
            </div>
          )}
        </div>
      )}

      <div className="surface p-4 p-md-5 rounded-4 border shadow-sm d-flex flex-column gap-4">

        {/* Assessment Scope Selection */}
        <section className="text-center">
          <h4 className="text-uppercase tracking-wider font-bold text-primary mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.25em' }}>Assessment Scope</h4>
          <div className="d-flex flex-row rounded-4 border surface-2 p-1 gap-1">
            {["lesson", "volume", "full"].map(t => (
              <button
                key={t}
                className={`flex-grow-1 py-2.5 rounded-3 font-bold text-sm tracking-wider transition-all border-0 ${
                  quizType === t
                    ? 'chip-primary active text-white shadow-sm'
                    : 'chip-outline text-slate-600'
                }`}
                onClick={() => setQuizType(t)}
                aria-pressed={quizType === t}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Scope Detail: Lesson list */}
        {quizType === "lesson" && (
          <section className="animate-fade-in">
            <h4 className="text-uppercase tracking-wider font-bold text-slate-500 mb-3 text-center" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>Select Lessons</h4>
            <div
              className="d-flex flex-wrap gap-2 justify-content-center p-3 rounded-4 border surface-2"
              style={{
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              {availableLessons.map(lesson => (
                <button
                  key={lesson}
                  className={`font-semibold text-sm transition-all border px-3 py-2 ${
                    selectedLessons.includes(lesson)
                      ? 'chip-primary active text-white'
                      : 'chip-outline text-slate-600'
                  }`}
                  style={{ borderRadius: '12px', minWidth: '95px' }}
                  onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                  aria-pressed={selectedLessons.includes(lesson)}
                >
                  Lesson {lesson}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Scope Detail: Volume list */}
        {quizType === "volume" && (
          <section className="animate-fade-in">
            <h4 className="text-uppercase tracking-wider font-bold text-slate-500 mb-3 text-center" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>Select Volume</h4>
            <div
              className="d-flex flex-wrap gap-2 justify-content-center p-3 rounded-4 border surface-2"
            >
              {availableVolumes.map(vol => (
                <button
                  key={vol}
                  className={`font-semibold text-sm transition-all border px-3 py-2 ${
                    selectedVolume === vol
                      ? 'chip-primary active text-white'
                      : 'chip-outline text-slate-600'
                  }`}
                  style={{ borderRadius: '12px', minWidth: '100px' }}
                  onClick={() => setSelectedVolume(vol)}
                  aria-pressed={selectedVolume === vol}
                >
                  Volume {vol}
                </button>
              ))}
              <button
                className={`font-semibold text-sm transition-all border px-3 py-2 ${
                  selectedVolume === "all"
                    ? 'chip-primary active text-white'
                    : 'chip-outline text-slate-600'
                }`}
                style={{ borderRadius: '12px', minWidth: '110px' }}
                onClick={() => setSelectedVolume("all")}
                aria-pressed={selectedVolume === "all"}
              >
                All Volumes
              </button>
            </div>
          </section>
        )}

        {/* Settings Toggle Options */}
        <section className="d-flex flex-column rounded-4 border overflow-hidden animate-fade-in">
          <div className="d-flex justify-content-between align-items-center p-3 px-4 surface-2">
            <span className="font-semibold text-slate-900 flex-grow-1">
              Practice Mode
              <small className="d-block text-slate-500 font-light" style={{ fontSize: '0.75rem' }}>Instant feedback on answers</small>
            </span>
            <div className="form-check form-switch m-0 p-0">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                checked={!isTestMode}
                onChange={() => setIsTestMode(prev => !prev)}
                style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px', '--bs-form-switch-checked-color': '#4f46e5' }}
                aria-label="Toggle practice mode"
              />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.05)' }} />

          {!isTestMode && (
            <>
              <div className="d-flex justify-content-between align-items-center p-3 px-4 surface-2">
                <span className="font-semibold text-slate-900 flex-grow-1">
                  Repeat Wrong Answers
                  <small className="d-block text-slate-500 font-light" style={{ fontSize: '0.75rem' }}>Require correct answers before finishing</small>
                </span>
                <div className="form-check form-switch m-0 p-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    role="switch"
                    checked={repeatWrong}
                    onChange={() => setRepeatWrong(prev => !prev)}
                    style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px', '--bs-form-switch-checked-color': '#4f46e5' }}
                    aria-label="Toggle repeat wrong answers"
                  />
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.05)' }} />
            </>
          )}

          <div className="d-flex justify-content-between align-items-center p-3 px-4 surface-2">
            <span className="font-semibold text-slate-900 flex-grow-1">
              Shuffle Questions
              <small className="d-block text-slate-500 font-light" style={{ fontSize: '0.75rem' }}>Randomize question order</small>
            </span>
            <div className="form-check form-switch m-0 p-0">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                checked={shuffleQ}
                onChange={() => setShuffleQ(prev => !prev)}
                style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px', '--bs-form-switch-checked-color': '#4f46e5' }}
                aria-label="Toggle question shuffling"
              />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.05)' }} />

          <div className="d-flex justify-content-between align-items-center p-3 px-4 surface-2">
            <span className="font-semibold text-slate-900 flex-grow-1">
              Shuffle Options
              <small className="d-block text-slate-500 font-light" style={{ fontSize: '0.75rem' }}>Randomize answer options order</small>
            </span>
            <div className="form-check form-switch m-0 p-0">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                checked={shuffleOpt}
                onChange={() => setShuffleOpt(prev => !prev)}
                style={{ cursor: 'pointer', transform: 'scale(1.3)', marginRight: '8px', '--bs-form-switch-checked-color': '#4f46e5' }}
                aria-label="Toggle option shuffling"
              />
            </div>
          </div>
        </section>

        {/* Configurations Parameters */}
        <div className="row g-4 mt-2">

          <div className="col-12 col-md-6 col-lg-4">
            <h4 className="text-uppercase tracking-wider font-bold text-slate-500 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Question Timer</h4>
            <div className="d-flex flex-row rounded-4 p-1 gap-1">
              {[0, 5, 10, 15].map(t => (
                <button
                  key={t}
                  className={`flex-grow-1 py-3 font-semibold text-xs transition-all border rounded-3 ${
                    timerLimit === t
                      ? 'chip-primary active text-white shadow-sm'
                      : 'chip-outline text-slate-600'
                  }`}
                  onClick={() => setTimerLimit(t)}
                  aria-pressed={timerLimit === t}
                >
                  {t === 0 ? "OFF" : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <h4 className="text-uppercase tracking-wider font-bold text-slate-500 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Global Timer</h4>
            <div className="d-flex flex-row rounded-4 p-1 gap-1">
              {[0, 5, 10, 30].map(t => (
                <button
                  key={t}
                  className={`flex-grow-1 py-3 font-semibold text-xs transition-all border rounded-3 ${
                    globalTimerLimit === t
                      ? 'chip-primary active text-white shadow-sm'
                      : 'chip-outline text-slate-600'
                  }`}
                  onClick={() => setGlobalTimerLimit(t)}
                  aria-pressed={globalTimerLimit === t}
                >
                  {t === 0 ? "OFF" : `${t}m`}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <h4 className="text-uppercase tracking-wider font-bold text-slate-500 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Questions Count</h4>
            <div className="d-flex flex-row rounded-4 p-1 gap-1">
              {[0, 15, 20].map(n => (
                <button
                  key={n}
                  className={`flex-grow-1 py-3 font-semibold text-xs transition-all border rounded-3 ${
                    questionCount === n
                      ? 'chip-primary active text-white shadow-sm'
                      : 'chip-outline text-slate-600'
                  }`}
                  onClick={() => setQuestionCount(n)}
                  aria-pressed={questionCount === n}
                >
                  {n === 0 ? "ALL" : n}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Start Sprint Actions */}
        <div className="pt-3 d-flex flex-column gap-3">
          {hasBookmarks && (
            <button
              className="btn-soft py-3 font-bold tracking-widest text-uppercase animate-fade-in d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
              style={{
                borderRadius: '16px',
                fontSize: '0.9rem',
                color: '#b45309',
                backgroundColor: '#fff7ed',
                border: '1px solid #fdba74'
              }}
              onClick={doStartBookmarked}
            >
              <Bookmark size={16} fill="currentColor" />
              Start Bookmarked Quiz
            </button>
          )}
          <button
            className="btn-outline text-slate-700 py-3 font-bold tracking-widest text-uppercase"
            style={{ borderRadius: '16px', fontSize: '1rem' }}
            onClick={doStartRevision}
          >
            Start Revision
          </button>
          <button
            className="btn-primary text-white py-3 font-extrabold tracking-widest text-uppercase"
            style={{
              borderRadius: '16px',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #14b8a6 100%)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
            }}
            onClick={doStartQuiz}
          >
            Start Assessment
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-check-input:checked {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
        }
      `}} />
    </div>
  );
}
