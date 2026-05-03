import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { Timer, Repeat, CheckCircle2, XCircle, Home, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";

import Galaxy from "./components/Galaxy";
import ClickSpark from "./components/ClickSpark";
import MagicRings from "./components/MagicRings";
import "./App.css";
import "./styles/Quiz.css";

const QuizPage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  
  // Quiz Configuration State
  const [quizMode, setQuizMode] = useState("setup");
  const [quizType, setQuizType] = useState("full");
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState("all");
  const [repeatWrong, setRepeatWrong] = useState(true);
  const [shuffleQ, setShuffleQ] = useState(true);
  const [shuffleOpt, setShuffleOpt] = useState(true);
  const [timerLimit, setTimerLimit] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // Quiz Execution State
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // First Attempt Tracking (for final results)
  const [firstAttemptQuestions, setFirstAttemptQuestions] = useState([]);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const [firstAttemptWrong, setFirstAttemptWrong] = useState(0);
  const [firstAttemptAnswers, setFirstAttemptAnswers] = useState([]);
  
  // Repeat Loop Tracking
  const [currentRoundWrong, setCurrentRoundWrong] = useState([]);
  const [isInRepeatMode, setIsInRepeatMode] = useState(false);
  
  // Quiz Timing
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRings, setShowRings] = useState(false);
  const [dark, setDark] = useState(true);

  // Load subject-specific CSV
  const [availableVolumes, setAvailableVolumes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const csvFile = `/${subject}.csv`;
        const response = await fetch(csvFile);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${csvFile}`);
        }
        
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: (results) => {
            const filtered = results.data.filter(q => (q.question && q.question.trim()) || q.question_image);
            setAllQuestions(filtered);
            
            // Extract unique lessons
            const lessons = [...new Set(filtered.map(q => q.lesson))].filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b));
            setAvailableLessons(lessons);

            // Extract unique volumes
            const volumes = [...new Set(filtered.map(q => q.vol))].filter(Boolean).sort();
            setAvailableVolumes(volumes);

            setLoading(false);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading questions:", error);
        setLoading(false);
      }
    };
    
    if (subject) {
      loadData();
    }
  }, [subject]);

  // Trigger MathJax rendering after content updates
  useEffect(() => {
    const renderMath = async () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          // Clear previous typeset to avoid duplication or stale content
          await window.MathJax.typesetPromise();
        } catch (err) {
          console.log("MathJax error:", err);
        }
      }
    };
    
    // Multiple attempts to ensure rendering after DOM updates
    const timer1 = setTimeout(renderMath, 100);
    const timer2 = setTimeout(renderMath, 500);
    const timer3 = setTimeout(renderMath, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [quizMode, currentIdx, quizQuestions, isLocked]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (quizMode === "active" && timerLimit > 0 && !isLocked) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizMode, timerLimit, isLocked, currentIdx]);

  const startQuiz = () => {
    if (allQuestions.length === 0) {
      alert("No questions available for this subject");
      return;
    }

    let filtered = [...allQuestions];

    if (quizType === "volume" && selectedVolume !== "all") {
      filtered = filtered.filter(q => q.vol === selectedVolume);
    }

    if (quizType === "lesson" && selectedLessons.length > 0) {
      filtered = filtered.filter(q => selectedLessons.includes(q.lesson));
    }
    
    if (shuffleQ) {
      filtered.sort(() => Math.random() - 0.5);
    }

    // Limit Count
    if (questionCount > 0 && questionCount < filtered.length) {
      filtered = filtered.slice(0, parseInt(questionCount));
    }

    // Prepare options with image support and shuffle
    filtered = filtered.map(q => {
      const options = [
        { text: q.option_1, img: q.option_1_image },
        { text: q.option_2, img: q.option_2_image },
        { text: q.option_3, img: q.option_3_image },
        { text: q.option_4, img: q.option_4_image }
      ].filter(o => o.text || o.img);

      if (shuffleOpt) {
        options.sort(() => Math.random() - 0.5);
      }
      return { ...q, displayOptions: options };
    });

    setFirstAttemptQuestions(filtered);
    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setFirstAttemptCorrect(0);
    setFirstAttemptWrong(0);
    setFirstAttemptAnswers([]);
    setUserAnswer(null);
    setIsLocked(false);
    setIsInRepeatMode(false);
    setCurrentRoundWrong([]);
    setQuizMode("active");
    setStartTime(Date.now());
    if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
  };

  const handleAnswer = (optionText) => {
    if (isLocked || !quizQuestions[currentIdx]) return;
    
    const currentQ = quizQuestions[currentIdx];
    setUserAnswer(optionText);
    setIsLocked(true);

    const isCorrect = optionText === currentQ.answer;

    // Track first attempt stats only in the very first round
    if (!isInRepeatMode) {
      const newAnswers = [...firstAttemptAnswers, { question: currentQ.sno, answer: optionText, correct: isCorrect }];
      setFirstAttemptAnswers(newAnswers);
      
      if (isCorrect) {
        setFirstAttemptCorrect(prev => prev + 1);
      } else {
        setFirstAttemptWrong(prev => prev + 1);
      }
    }

    // If wrong, add to the list for the NEXT round
    let updatedWrong = [...currentRoundWrong];
    if (!isCorrect && repeatWrong) {
      updatedWrong.push(currentQ);
      setCurrentRoundWrong(updatedWrong);
    }

    setTimeout(() => {
      if (currentIdx < quizQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setUserAnswer(null);
        setIsLocked(false);
        if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
      } else {
        // End of current round
        // Use the updatedWrong list to ensure the last question is included
        if (repeatWrong && updatedWrong.length > 0) {
          // Start next round with wrong questions
          setQuizQuestions(updatedWrong);
          setCurrentRoundWrong([]); // Reset for the new round
          setCurrentIdx(0);
          setUserAnswer(null);
          setIsLocked(false);
          setIsInRepeatMode(true);
          if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
        } else {
          // All questions correct or repeat disabled
          finishQuiz();
        }
      }
    }, 1500);
  };

  const finishQuiz = () => {
    setEndTime(Date.now());
    setShowRings(true);
    setQuizMode("result");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const CreatorSection = () => (
    <div className="creator-footer">
      <span className="creator-text">CREATOR : S.K.SREEHARI</span>
      <button 
        className="portfolio-btn" 
        onClick={() => window.open("#", "_blank")}
      >
        PORTFOLIO <ExternalLink size={14} />
      </button>
    </div>
  );

  if (quizMode === "setup") {
    return (
      <ClickSpark isDark={dark}>
        <div className={dark ? "app dark" : "app light"}>
          <Galaxy isDark={dark} />
          <div className="header">
            <button className="back-btn" onClick={() => navigate("/")}><Home size={20} /></button>
            <div className="logo">MARKSPRINT</div>
            <div className="toggle" onClick={() => setDark(!dark)}>
              {dark ? "🌙" : "☀️"}
            </div>
          </div>

          <div className="setup-container">
            <h2 className="subject-title">{subject?.toUpperCase()}</h2>
            <div className="config-card">
              <section>
                <h4>QUIZ TYPE</h4>
                <div className="button-group">
                  {["lesson", "volume", "full"].map(t => (
                    <button key={t} className={quizType === t ? "active" : ""} onClick={() => setQuizType(t)}>{t.toUpperCase()}</button>
                  ))}
                </div>
              </section>

              {quizType === "lesson" && (
                <section>
                  <h4>SELECT LESSONS</h4>
                  <div className="button-group scrollable-group">
                    {availableLessons.map(lesson => (
                      <button 
                        key={lesson}
                        className={selectedLessons.includes(lesson) ? "active" : ""}
                        onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                      >
                        Lesson {lesson}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {quizType === "volume" && (
                <section>
                  <h4>SELECT VOLUME</h4>
                  <div className="button-group">
                    {availableVolumes.map(vol => (
                      <button 
                        key={vol}
                        className={selectedVolume === vol ? "active" : ""}
                        onClick={() => setSelectedVolume(vol)}
                      >
                        Volume {vol}
                      </button>
                    ))}
                    <button 
                      className={selectedVolume === "all" ? "active" : ""}
                      onClick={() => setSelectedVolume("all")}
                    >
                      All Volumes
                    </button>
                  </div>
                </section>
              )}

              <section className="toggles">
                <div className="toggle-item">
                  <span>Repeat Wrong Answers</span>
                  <input type="checkbox" checked={repeatWrong} onChange={e => setRepeatWrong(e.target.checked)} />
                </div>
                <div className="toggle-item">
                  <span>Shuffle Questions</span>
                  <input type="checkbox" checked={shuffleQ} onChange={e => setShuffleQ(e.target.checked)} />
                </div>
                <div className="toggle-item">
                  <span>Shuffle Options</span>
                  <input type="checkbox" checked={shuffleOpt} onChange={e => setShuffleOpt(e.target.checked)} />
                </div>
              </section>

              <section>
                <h4>TIMER PER QUESTION</h4>
                <div className="button-group">
                  {[0, 5, 10, 15].map(t => (
                    <button 
                      key={t} 
                      className={timerLimit === t ? "active" : ""} 
                      onClick={() => setTimerLimit(t)}
                    >
                      {t === 0 ? "OFF" : `${t}s`}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h4>NUMBER OF QUESTIONS</h4>
                <div className="button-group">
                  {[0, 15, 20].map(n => (
                    <button 
                      key={n} 
                      className={questionCount === n ? "active" : ""} 
                      onClick={() => setQuestionCount(n)}
                    >
                      {n === 0 ? "ALL" : n}
                    </button>
                  ))}
                </div>
              </section>

              <button className="start-btn" onClick={startQuiz}>START SPRINT</button>
            </div>
          </div>
          <CreatorSection />
        </div>
      </ClickSpark>
    );
  }

  if (quizMode === "active" && quizQuestions.length > 0) {
    const currentQ = quizQuestions[currentIdx];
    
    return (
      <ClickSpark isDark={dark}>
        <div className={`${dark ? "app dark" : "app light"} quiz-active`}>
          <Galaxy isDark={dark} />
          <div className="quiz-header">
            <div className="header-item">
              <span className="header-label">Question</span>
              <span className="header-value">{currentIdx + 1} / {firstAttemptQuestions.length}</span>
            </div>
            {timerLimit > 0 && (
              <div className="header-item">
                <span className="header-label">Time</span>
                <span className={`header-value ${timeLeft < 5 ? "warning" : ""}`}>{timeLeft}s</span>
              </div>
            )}
          </div>

          <div className="question-container">
            <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQ?.question || "" }} />
            {currentQ?.question_image && <img src={currentQ.question_image} alt="Question" className="q-image" />}
            
            <div className="options-grid">
              {currentQ.displayOptions.map((opt, i) => {
                let status = "";
                if (isLocked) {
                  if (opt.text === currentQ.answer) status = "correct";
                  else if (opt.text === userAnswer) status = "wrong";
                }
                
                return (
                  <button 
                    key={`${currentIdx}-${i}`}
                    className={`option-btn ${status}`}
                    onClick={() => handleAnswer(opt.text)}
                    disabled={isLocked}
                  >
                    {opt.text && <span dangerouslySetInnerHTML={{ __html: opt.text }} />}
                    {opt.img && <img src={opt.img} alt={`Option ${i+1}`} className="opt-image" />}
                    {status === "correct" && <CheckCircle2 className="icon" />}
                    {status === "wrong" && <XCircle className="icon" />}
                  </button>
                );
              })}
            </div>
          </div>
          <CreatorSection />
        </div>
      </ClickSpark>
    );
  }

  if (quizMode === "result") {
    const total = firstAttemptQuestions.length;
    // If repeatWrong was on, they only reach here when all are correct
    const correct = repeatWrong ? total : firstAttemptCorrect;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <ClickSpark isDark={dark}>
        <div className={`${dark ? "app dark" : "app light"} result-page`}>
          <Galaxy isDark={dark} />
          {showRings && <MagicRings />}
          <div className="result-wrapper">
            <h1 className="result-title">THE RESULT</h1>
            <div className="result-card">
              <div className="result-stats">
                <div className="stat-row"><span className="stat-label">Total</span><span className="stat-value">{total}</span></div>
                <div className="stat-row"><span className="stat-label">Correct</span><span className="stat-value correct-text">{correct}</span></div>
                <div className="stat-row"><span className="stat-label">Accuracy</span><span className="stat-value accuracy-text">{accuracy}%</span></div>
              </div>
              <div className="result-actions">
                <button className="retry-btn" onClick={() => window.location.reload()}><Repeat size={20} /> RETRY</button>
                <button className="home-btn" onClick={() => navigate("/")}><Home size={20} /> HOME</button>
              </div>
            </div>
          </div>
          <CreatorSection />
        </div>
      </ClickSpark>
    );
  }

  return null;
};

export default QuizPage;
