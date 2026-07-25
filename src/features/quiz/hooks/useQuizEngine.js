import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import CryptoJS from 'crypto-js';
import { useToast } from '../../../context/ToastContext.jsx';

import physicsCsv from '../../../data/physics.csv?url';
import chemistryCsv from '../../../data/chemistry.csv?url';
import mathsCsv from '../../../data/maths.csv?url';
import csCsv from '../../../data/cs.csv?url';
import biologyCsv from '../../../data/biology.csv?url';
import englishCsv from '../../../data/english.csv?url';
import tamilCsv from '../../../data/tamil.csv?url';

const CSV_MAP = {
  physics: physicsCsv,
  chemistry: chemistryCsv,
  maths: mathsCsv,
  cs: csCsv,
  computer: csCsv,
  biology: biologyCsv,
  english: englishCsv,
  tamil: tamilCsv
};

const SUBJECT_MAP = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  maths: 'Maths',
  cs: 'Computer Science',
  computer: 'Computer Science',
  biology: 'Biology',
  english: 'English',
  tamil: 'Tamil'
};

const STORAGE_KEYS = {
  BOOKMARKS: 'ms_bookmarks_v1',
  PROGRESS: 'ms_progress_v1',
  STATS: 'ms_stats_v1'
};

function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to read storage key', key, e);
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Failed to write storage key', key, e);
    return false;
  }
}

function getBookmarks() {
  return new Set(safeGet(STORAGE_KEYS.BOOKMARKS) || []);
}

function saveBookmarks(set) {
  return safeSet(STORAGE_KEYS.BOOKMARKS, Array.from(set));
}

function getProgressKey(subject) {
  return `${STORAGE_KEYS.PROGRESS}:${subject}`;
}

function buildQuestionId(q) {
  const base = `${q.subject || 'x'}:${q.lesson || '0'}:${q.vol || q.volume || '0'}`;
  const text = (q.question || '').toString().slice(0, 80);
  return `${base}:${btoa(unescape(encodeURIComponent(text))).slice(0, 32)}`;
}

export function useQuizEngine(subject) {
  const toast = useToast();

  // Quiz Configuration State
  const [quizMode, setQuizMode] = useState("setup"); // "setup", "active", "result", "revision"
  const [quizType, setQuizType] = useState("full");
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState("all");
  const [repeatWrong, setRepeatWrong] = useState(true);
  const [shuffleQ, setShuffleQ] = useState(true);
  const [shuffleOpt, setShuffleOpt] = useState(true);
  const [timerLimit, setTimerLimit] = useState(0); // per question timer
  const [globalTimerLimit, setGlobalTimerLimit] = useState(0); // per quiz timer
  const [questionCount, setQuestionCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false); // false = Practice, true = Test

  // Quiz Execution State
  const [allQuestions, setAllQuestions] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // per question
  const [globalTimeLeft, setGlobalTimeLeft] = useState(0); // per quiz
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
  
  // First Attempt Tracking (for final results & review)
  const [firstAttemptQuestions, setFirstAttemptQuestions] = useState([]);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const [firstAttemptAnswers, setFirstAttemptAnswers] = useState([]); // { questionObj, userAnswer, isCorrect }
  
  // Repeat Loop Tracking
  const [currentRoundWrong, setCurrentRoundWrong] = useState([]);
  const [isInRepeatMode, setIsInRepeatMode] = useState(false);

  // Feature: Bookmarking
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  // Feature: Saved progress (resume quiz)
  const [savedProgress, setSavedProgress] = useState(() => subject ? safeGet(getProgressKey(subject)) : null);

  // Feature: Stats
  const [statistics, setStatistics] = useState(() => safeGet(STORAGE_KEYS.STATS) || { bySubject: {}, attempts: 0 });

  // Persist bookmarks whenever they change
  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Reload saved progress if subject changes
  useEffect(() => {
    setSavedProgress(subject ? safeGet(getProgressKey(subject)) : null);
  }, [subject]);

  const isBookmarked = useCallback((question) => {
    if (!question) return false;
    return bookmarks.has(buildQuestionId(question));
  }, [bookmarks]);

  const toggleBookmark = useCallback((question) => {
    if (!question) return;
    const id = buildQuestionId(question);
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    return !bookmarks.has(id);
  }, [bookmarks]);

  const recordQuizStats = useCallback(({ subjectName, correct, total, config }) => {
    const stats = safeGet(STORAGE_KEYS.STATS) || { bySubject: {}, attempts: 0 };
    stats.attempts = (stats.attempts || 0) + 1;
    const pct = total > 0 ? Math.round((correct / total) * 10000) / 100 : 0;
    const subj = subjectName || 'unknown';
    const prev = stats.bySubject[subj] || { attempts: 0, bestScore: 0, avgScore: 0, totalCorrect: 0, totalQuestions: 0, lastAt: null };
    const newAttempts = prev.attempts + 1;
    const newTotalCorrect = prev.totalCorrect + correct;
    const newTotalQ = prev.totalQuestions + total;
    stats.bySubject[subj] = {
      attempts: newAttempts,
      bestScore: Math.max(prev.bestScore || 0, pct),
      avgScore: newTotalQ > 0 ? Math.round((newTotalCorrect / newTotalQ) * 10000) / 100 : 0,
      totalCorrect: newTotalCorrect,
      totalQuestions: newTotalQ,
      lastAt: new Date().toISOString(),
      lastScore: pct,
      config: {
        mode: config?.isTestMode ? 'test' : 'practice',
        repeatWrong: config?.repeatWrong,
        shuffle: config?.shuffleQ
      }
    };
    safeSet(STORAGE_KEYS.STATS, stats);
    setStatistics(stats);
    return stats;
  }, []);

  const saveProgressNow = useCallback((stateSnapshot) => {
    if (!subject || !stateSnapshot) return;
    safeSet(getProgressKey(subject), {
      savedAt: new Date().toISOString(),
      ...stateSnapshot
    });
    setSavedProgress(safeGet(getProgressKey(subject)));
  }, [subject]);

  const clearSavedProgress = useCallback(() => {
    if (!subject) return;
    try { localStorage.removeItem(getProgressKey(subject)); } catch (e) { /* ignore storage errors */ void e; }
    setSavedProgress(null);
  }, [subject]);

  // Load CSV Data and merge with localStorage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const properSubjectName = SUBJECT_MAP[subject?.toLowerCase()] || subject;
        
        const storedData = localStorage.getItem('contentManagerData');
        let localQuestions = [];
        if (storedData) {
          try {
            const storageKey = import.meta.env.VITE_CONTENT_MANAGER_STORAGE_KEY || null;
            if (storageKey) {
              try {
                const bytes = CryptoJS.AES.decrypt(storedData, storageKey);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                const parsed = JSON.parse(decrypted);
                localQuestions = parsed.questions || [];
              } catch {
                console.warn('Failed to decrypt contentManagerData with provided storage key; falling back to plaintext parse.');
                const parsed = JSON.parse(storedData);
                localQuestions = parsed.questions || [];
              }
            } else {
              console.warn('No VITE_CONTENT_MANAGER_STORAGE_KEY configured; reading contentManagerData as plaintext.');
              const parsed = JSON.parse(storedData);
              localQuestions = parsed.questions || [];
            }
          } catch (e) {
            console.error('Error parsing contentManagerData:', e);
          }
        }

        const csvFile = CSV_MAP[subject?.toLowerCase()];
        if (!csvFile) {
          throw new Error(`Subject dataset '${subject}' is not found.`);
        }
        const response = await fetch(csvFile);
        if (!response.ok) throw new Error(`Failed to fetch dataset for ${subject} (HTTP ${response.status})`);
        
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: (results) => {
            let filtered = results.data.filter(q => (q.question && q.question.trim()) || q.question_image);
            
            let mergedQuestions = filtered.map(q => ({
              ...q,
              id: `csv-${subject}-${q.question}-${q.lesson}-${q.vol}`,
              isFromCSV: true,
              subject: properSubjectName
            }));

            const localSubjectQuestions = localQuestions.filter(q => q.subject === properSubjectName);
            localSubjectQuestions.forEach(localQ => {
              const csvIndex = mergedQuestions.findIndex(q => 
                q.question === localQ.question && 
                q.lesson === localQ.lesson && 
                q.vol === (localQ.volume || localQ.vol)
              );
              
              if (csvIndex !== -1) {
                mergedQuestions[csvIndex] = {
                  ...localQ,
                  subject: properSubjectName,
                  volume: localQ.volume || localQ.vol,
                  vol: localQ.volume || localQ.vol,
                  isFromCSV: false
                };
              } else {
                mergedQuestions.push({
                  ...localQ,
                  subject: properSubjectName,
                  volume: localQ.volume || localQ.vol,
                  vol: localQ.volume || localQ.vol,
                  isFromCSV: false
                });
              }
            });

            setAllQuestions(mergedQuestions);
            const lessons = [...new Set(mergedQuestions.map(q => q.lesson))].filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b));
            setAvailableLessons(lessons);
            const volumes = [...new Set(mergedQuestions.map(q => q.vol || q.volume))].filter(Boolean).sort();
            setAvailableVolumes(volumes);
            setLoading(false);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setLoadError(`Failed to parse ${subject} questions dataset.`);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading questions:", error);
        setLoadError(error.message || `Failed to load ${subject} dataset.`);
        setLoading(false);
      }
    };
    if (subject) loadData();
  }, [subject]);

  const buildQuestionPool = useCallback((sourceOverride) => {
    const pool = sourceOverride || allQuestions;
    let filtered = [...pool];
    if (quizType === "volume" && selectedVolume !== "all") {
      filtered = filtered.filter(q => (q.vol || q.volume) === selectedVolume);
    }
    if (quizType === "lesson" && selectedLessons.length > 0) {
      filtered = filtered.filter(q => selectedLessons.includes(q.lesson));
    }
    if (shuffleQ) {
      filtered.sort(() => Math.random() - 0.5);
    }
    if (questionCount > 0 && questionCount < filtered.length) {
      filtered = filtered.slice(0, parseInt(questionCount));
    }

    filtered = filtered.map(q => {
      const options = [
        { text: q.option_1, img: q.option_1_image },
        { text: q.option_2, img: q.option_2_image },
        { text: q.option_3, img: q.option_3_image },
        { text: q.option_4, img: q.option_4_image }
      ].filter(o => o.text || o.img);
      if (shuffleOpt) options.sort(() => Math.random() - 0.5);
      return { ...q, displayOptions: options };
    });
    return filtered;
  }, [allQuestions, quizType, selectedVolume, selectedLessons, shuffleQ, questionCount, shuffleOpt]);

  // Start Quiz
  const startQuiz = useCallback((opts = {}) => {
    if (allQuestions.length === 0) {
      toast.error("No questions available for this subject");
      return;
    }

    // If resume requested, restore saved state
    if (opts.resume && savedProgress && savedProgress.quizQuestions) {
      const sp = savedProgress;
      setFirstAttemptQuestions(sp.firstAttemptQuestions || sp.quizQuestions);
      setQuizQuestions(sp.quizQuestions);
      setCurrentIdx(sp.currentIdx || 0);
      setFirstAttemptCorrect(sp.firstAttemptCorrect || 0);
      setFirstAttemptAnswers(sp.firstAttemptAnswers || []);
      setUserAnswer(null);
      setIsLocked(false);
      setIsInRepeatMode(sp.isInRepeatMode || false);
      setCurrentRoundWrong(sp.currentRoundWrong || []);
      setQuizMode("active");
      if (timerLimit > 0) setTimeLeft(sp.timeLeft ?? parseInt(timerLimit));
      if (globalTimerLimit > 0) setGlobalTimeLeft(sp.globalTimeLeft ?? parseInt(globalTimerLimit) * 60);
      clearSavedProgress();
      return;
    }

    const filtered = buildQuestionPool();
    if (filtered.length === 0) {
      toast.error("No questions match the current filter (lesson/volume/count).");
      return;
    }

    setFirstAttemptQuestions(filtered);
    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setFirstAttemptCorrect(0);
    setFirstAttemptAnswers([]);
    setUserAnswer(null);
    setIsLocked(false);
    setIsInRepeatMode(false);
    setCurrentRoundWrong([]);
    setQuestionStartTime(Date.now());
    setQuizMode("active");
    if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
    if (globalTimerLimit > 0) setGlobalTimeLeft(parseInt(globalTimerLimit) * 60);
  }, [allQuestions, buildQuestionPool, savedProgress, timerLimit, globalTimerLimit, clearSavedProgress, toast]);

  // Handle Answer Submission
  const handleAnswer = useCallback((optionText) => {
    if (isLocked || !quizQuestions[currentIdx]) return;
    
    const currentQ = quizQuestions[currentIdx];
    setUserAnswer(optionText);
    setIsLocked(true);

    const secondsSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    const optClean = (optionText || '').toString().trim();
    const ansClean = (currentQ.answer || '').toString().trim();
    const isCorrect = optClean === ansClean || (optClean !== '' && ansClean !== '' && optClean.toLowerCase() === ansClean.toLowerCase());

    if (!isInRepeatMode) {
      setFirstAttemptAnswers(prev => [...prev, { 
        questionObj: currentQ, 
        userAnswer: optionText, 
        isCorrect,
        secondsSpent
      }]);
      if (isCorrect) setFirstAttemptCorrect(prev => prev + 1);
    }

    let updatedWrong = [...currentRoundWrong];
    if (!isCorrect && repeatWrong && !isTestMode) {
      updatedWrong.push(currentQ);
      setCurrentRoundWrong(updatedWrong);
    }

    const moveToNext = () => {
      if (currentIdx < quizQuestions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        setUserAnswer(null);
        setIsLocked(false);
        setQuestionStartTime(Date.now());
        if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
        // Autosave progress after each answer
        saveProgressNow({
          quizQuestions,
          currentIdx: nextIdx,
          firstAttemptQuestions,
          firstAttemptCorrect: !isInRepeatMode && isCorrect ? firstAttemptCorrect + 1 : firstAttemptCorrect,
          firstAttemptAnswers: !isInRepeatMode ? [...firstAttemptAnswers, { questionObj: currentQ, userAnswer: optionText, isCorrect }] : firstAttemptAnswers,
          isInRepeatMode,
          currentRoundWrong: updatedWrong,
          timeLeft: timerLimit > 0 ? parseInt(timerLimit) : 0,
          globalTimeLeft
        });
      } else {
        if (repeatWrong && updatedWrong.length > 0 && !isTestMode) {
          setQuizQuestions(updatedWrong);
          setCurrentRoundWrong([]);
          setCurrentIdx(0);
          setUserAnswer(null);
          setIsLocked(false);
          setIsInRepeatMode(true);
          if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
        } else {
          const totalQ = firstAttemptQuestions.length || 1;
          const totalCorrect = firstAttemptCorrect + (!isInRepeatMode && isCorrect ? 1 : 0);
          const subjectName = SUBJECT_MAP[subject?.toLowerCase()] || subject;
          try {
            recordQuizStats({
              subjectName,
              correct: totalCorrect,
              total: totalQ,
              config: { isTestMode, repeatWrong, shuffleQ }
            });
          } catch (e) { /* ignore stats write errors */ void e; }
          clearSavedProgress();
          setQuizMode("result");
        }
      }
    };

    if (isTestMode) {
      moveToNext();
    } else {
      setTimeout(moveToNext, 1500);
    }
  }, [isLocked, quizQuestions, currentIdx, isInRepeatMode, repeatWrong, currentRoundWrong, isTestMode, timerLimit, saveProgressNow, firstAttemptQuestions, firstAttemptCorrect, firstAttemptAnswers, globalTimeLeft, subject, recordQuizStats, clearSavedProgress, shuffleQ, questionStartTime]);

  // Finish quiz manually (e.g timeout)
  const finishQuiz = useCallback(() => {
    const subjectName = SUBJECT_MAP[subject?.toLowerCase()] || subject;
    try {
      recordQuizStats({
        subjectName,
        correct: firstAttemptCorrect,
        total: firstAttemptQuestions.length || 1,
        config: { isTestMode, repeatWrong, shuffleQ }
      });
    } catch (e) { /* ignore stats write errors */ void e; }
    clearSavedProgress();
    setQuizMode("result");
  }, [subject, firstAttemptCorrect, firstAttemptQuestions, isTestMode, repeatWrong, shuffleQ, recordQuizStats, clearSavedProgress]);

  // Start Revision Mode
  const startRevision = useCallback(() => {
    if (allQuestions.length === 0) {
      toast.error("No questions available for this subject");
      return;
    }

    const filtered = buildQuestionPool();
    if (filtered.length === 0) {
      toast.error("No questions match the current filter (lesson/volume/count).");
      return;
    }

    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setQuizMode("revision");
  }, [allQuestions, buildQuestionPool, toast]);

  const hasBookmarkedQuestions = useCallback(() => {
    const list = allQuestions || [];
    for (let i = 0; i < list.length; i++) {
      if (bookmarks.has(buildQuestionId(list[i]))) return true;
    }
    return false;
  }, [allQuestions, bookmarks]);

  const startBookmarkedQuiz = useCallback(() => {
    const bookmarkedList = (allQuestions || []).filter(q => bookmarks.has(buildQuestionId(q)));
    if (bookmarkedList.length === 0) {
      toast.warning("No bookmarked questions in this subject. Tap the bookmark icon on questions to save them for later.");
      return;
    }
    const filtered = buildQuestionPool(bookmarkedList);
    setFirstAttemptQuestions(filtered);
    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setFirstAttemptCorrect(0);
    setFirstAttemptAnswers([]);
    setUserAnswer(null);
    setIsLocked(false);
    setIsInRepeatMode(false);
    setCurrentRoundWrong([]);
    setQuizMode("active");
    if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
    if (globalTimerLimit > 0) setGlobalTimeLeft(parseInt(globalTimerLimit) * 60);
  }, [allQuestions, bookmarks, buildQuestionPool, timerLimit, globalTimerLimit, toast]);

  return {
    // Config state
    quizMode, setQuizMode,
    quizType, setQuizType,
    selectedLessons, setSelectedLessons,
    selectedVolume, setSelectedVolume,
    repeatWrong, setRepeatWrong,
    shuffleQ, setShuffleQ,
    shuffleOpt, setShuffleOpt,
    timerLimit, setTimerLimit,
    globalTimerLimit, setGlobalTimerLimit,
    questionCount, setQuestionCount,
    isTestMode, setIsTestMode,
    
    // Data state
    availableLessons, availableVolumes, loading, loadError, allQuestions,
    
    // Active Quiz State
    quizQuestions, currentIdx, userAnswer, isLocked,
    timeLeft, setTimeLeft, globalTimeLeft, setGlobalTimeLeft,
    firstAttemptQuestions, firstAttemptCorrect, firstAttemptAnswers,
    isInRepeatMode,
    
    // Actions
    startQuiz, handleAnswer, finishQuiz, startRevision, buildQuestionPool,

    // Feature: Bookmarks
    bookmarks, isBookmarked, toggleBookmark, startBookmarkedQuiz, hasBookmarkedQuestions,

    // Feature: Resume Progress
    savedProgress, clearSavedProgress, saveProgressNow,

    // Feature: Statistics
    statistics, recordQuizStats
  };
}
