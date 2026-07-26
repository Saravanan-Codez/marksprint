import React, { useCallback, useMemo } from 'react';
import { BarChart3, Clock } from 'lucide-react';
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
    statistics
  } = engine;

  const toast = useToast();

  const subjectStats = useMemo(() => {
    const key = SUBJECT_KEYS[subject] || subject;
    return statistics?.bySubject?.[key] || null;
  }, [statistics, subject]);

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

  const formatSavedAt = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="w-100 py-4 font-mono d-flex flex-column gap-4 anim-fade-in mx-auto" style={{ maxWidth: '850px' }}>

      {/* Header */}
      <div className="bg-brand border-brutal p-4 text-black text-center shadow-hard-sm">
        <h2 className="font-headline text-5xl font-black uppercase italic m-0">
          {subject} SPRINT_
        </h2>
        <p className="font-mono text-xs font-bold uppercase m-0 mt-1">
          CONFIGURE SECTOR PARAMETERS & TIMERS BEFORE DEPLOYMENT
        </p>
      </div>

      {engine.loadError && (
        <div className="p-3 bg-rose-100 border-2 border-rose-500 text-rose-900 font-bold text-xs text-center">
          ⚠️ OPERATING OFFLINE: {engine.loadError}
        </div>
      )}

      {/* Resume Saved Progress Banner */}
      {savedProgress && savedProgress.quizQuestions && (
        <div className="bg-white border-brutal p-4 text-black shadow-hard-sm">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="w-12 h-12 bg-black text-brand border-2 border-black flex items-center justify-center font-bold" style={{ width: '48px', height: '48px' }}>
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-headline text-xl font-black uppercase m-0 text-black">UNFINISHED SPRINT DETECTED</h4>
                <p className="font-mono text-xs font-bold text-slate-700 m-0">
                  SAVED ON {formatSavedAt(savedProgress.savedAt).toUpperCase()} — {savedProgress.quizQuestions?.length ?? 0} QUESTIONS IN PROGRESS.
                </p>
              </div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button
                className="bg-white text-black border-2 border-black px-3 py-2 font-headline font-black text-xs uppercase hover:bg-rose-500 hover:text-white transition-all"
                onClick={doDiscardSaved}
              >
                DISCARD
              </button>
              <button
                className="bg-brand text-black border-2 border-black px-4 py-2 font-headline font-black text-xs uppercase hover:bg-black hover:text-brand transition-all shadow-hard-sm"
                onClick={doResumeSaved}
              >
                RESUME SPRINT →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Stats Overview */}
      {(subjectStats || statistics) && (
        <div className="bg-white border-brutal p-4 text-black shadow-hard-sm">
          <div className="d-flex align-items-center gap-2 mb-3 border-b-2 border-black pb-2">
            <BarChart3 size={18} className="text-black" />
            <h4 className="font-headline text-lg font-black uppercase m-0 text-black">
              SECTOR TELEMETRY & OVERVIEW
            </h4>
          </div>
          <div className="row g-3">
            <div className="col-4">
              <div className="bg-brand border-2 border-black p-3 text-center">
                <div className="text-3xl font-headline font-black">{subjectStats?.attempts ?? 0}</div>
                <div className="text-xs font-bold uppercase">ATTEMPTS</div>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white border-2 border-black p-3 text-center">
                <div className="text-3xl font-headline font-black">{subjectStats?.bestScore ?? 0}%</div>
                <div className="text-xs font-bold uppercase">BEST SCORE</div>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white border-2 border-black p-3 text-center">
                <div className="text-3xl font-headline font-black">{subjectStats?.avgScore ?? 0}%</div>
                <div className="text-xs font-bold uppercase">AVG SCORE</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-brutal p-4 p-md-5 text-black shadow-hard d-flex flex-column gap-4">

        {/* Assessment Scope Selection */}
        <section className="text-center">
          <h4 className="font-headline text-sm font-black uppercase text-black mb-2">ASSESSMENT SCOPE</h4>
          <div className="d-flex border-2 border-black bg-black p-1">
            {["lesson", "volume", "full"].map(t => (
              <button
                key={t}
                className="flex-grow-1 py-2.5 font-headline font-black text-sm uppercase transition-all border-0"
                style={{
                  background: quizType === t ? 'var(--brand)' : 'transparent',
                  color: quizType === t ? '#000000' : '#FFFFFF'
                }}
                onClick={() => setQuizType(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Scope Detail: Lesson list */}
        {quizType === "lesson" && (
          <section className="animate-fade-in">
            <h4 className="font-headline text-xs font-black uppercase text-black mb-2 text-center">SELECT LESSONS</h4>
            <div className="d-flex flex-wrap gap-2 justify-content-center p-3 border-2 border-black bg-slate-100">
              {availableLessons.map(lesson => (
                <button
                  key={lesson}
                  className="font-mono font-bold text-xs uppercase border-2 border-black px-3 py-2 transition-all"
                  style={{
                    background: selectedLessons.includes(lesson) ? 'var(--brand)' : '#FFFFFF',
                    color: '#000000'
                  }}
                  onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                >
                  LESSON {lesson}
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
        <div className="row g-4 mt-1">

          <div className="col-12 col-md-6 col-lg-4">
            <h4 className="font-headline text-xs font-black uppercase text-black mb-2">QUESTION TIMER</h4>
            <div className="d-flex border-2 border-black bg-black p-1">
              {[0, 5, 10, 15].map(t => (
                <button
                  key={t}
                  className="flex-grow-1 py-2 font-headline font-black text-xs uppercase border-0"
                  style={{
                    background: timerLimit === t ? 'var(--brand)' : 'transparent',
                    color: timerLimit === t ? '#000000' : '#FFFFFF'
                  }}
                  onClick={() => setTimerLimit(t)}
                >
                  {t === 0 ? "OFF" : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <h4 className="font-headline text-xs font-black uppercase text-black mb-2">GLOBAL TIMER</h4>
            <div className="d-flex border-2 border-black bg-black p-1">
              {[0, 5, 10, 30].map(t => (
                <button
                  key={t}
                  className="flex-grow-1 py-2 font-headline font-black text-xs uppercase border-0"
                  style={{
                    background: globalTimerLimit === t ? 'var(--brand)' : 'transparent',
                    color: globalTimerLimit === t ? '#000000' : '#FFFFFF'
                  }}
                  onClick={() => setGlobalTimerLimit(t)}
                >
                  {t === 0 ? "OFF" : `${t}m`}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <h4 className="font-headline text-xs font-black uppercase text-black mb-2">QUESTION COUNT</h4>
            <div className="d-flex border-2 border-black bg-black p-1">
              {[0, 15, 20].map(n => (
                <button
                  key={n}
                  className="flex-grow-1 py-2 font-headline font-black text-xs uppercase border-0"
                  style={{
                    background: questionCount === n ? 'var(--brand)' : 'transparent',
                    color: questionCount === n ? '#000000' : '#FFFFFF'
                  }}
                  onClick={() => setQuestionCount(n)}
                >
                  {n === 0 ? "ALL" : n}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Start Sprint Actions */}
        <div className="pt-3 d-flex flex-column flex-sm-row gap-3">
          <button
            className="flex-grow-1 bg-white text-black border-2 border-black p-4 font-headline text-xl font-black uppercase hover:bg-black hover:text-white transition-all shadow-hard-sm"
            onClick={doStartRevision}
          >
            START REVISION
          </button>
          <button
            className="flex-grow-1 bg-brand text-black border-2 border-black p-4 font-headline text-2xl font-black uppercase hover:bg-black hover:text-brand transition-all shadow-hard"
            onClick={doStartQuiz}
          >
            EXECUTE SPRINT →
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
