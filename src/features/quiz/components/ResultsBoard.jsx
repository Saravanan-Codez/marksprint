import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Repeat, Home, CheckCircle2, XCircle, Cloud, LayoutDashboard, Flame, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { saveTestResult } from "../../../services/resultsStorage";
import { 
  getLocalGamificationData, 
  saveGamificationData, 
  calculateXpForQuiz, 
  calculateStreakUpdate,
  updateQuestsOnSprintComplete,
  syncGamificationToFirestore
} from "../../../services/gamificationService";
import { 
  saveRecordBookToDrive, 
  saveSubjectTelemetryToDrive 
} from "../../../services/driveOrganizerService";

export default function ResultsBoard({ engine }) {
  const navigate = useNavigate();
  const { user, googleAccessToken, userProfile } = useAuth();
  const { firstAttemptQuestions, firstAttemptAnswers, firstAttemptCorrect, selectedSubject } = engine;
  const [syncedDrive, setSyncedDrive] = useState(false);

  const total = firstAttemptQuestions.length;
  const correct = firstAttemptCorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const gamification = getLocalGamificationData();
  const earnedXp = calculateXpForQuiz(correct, total, firstAttemptAnswers || []);
  const streakInfo = calculateStreakUpdate(gamification.lastStreakDate, gamification.streakDays, gamification.streakShieldActive);
  const currentStreak = streakInfo.streak;

  useEffect(() => {
    if (accuracy >= 80) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (total > 0) {
      const subjectName = selectedSubject || 'General';

      const newXp = (gamification.xp || 0) + earnedXp;

      let updatedGamification = {
        ...gamification,
        xp: newXp,
        streakDays: streakInfo.streak,
        lastStreakDate: streakInfo.lastDate,
        streakShieldActive: streakInfo.shieldUsed ? false : gamification.streakShieldActive
      };

      // Update Daily Quests
      updatedGamification = updateQuestsOnSprintComplete(updatedGamification, correct, total, earnedXp);

      saveGamificationData(updatedGamification);
      syncGamificationToFirestore(user, updatedGamification);

      // 2. Format detailed telemetry
      const detailedTelemetry = (firstAttemptAnswers || []).map((ans, idx) => ({
        questionIndex: idx + 1,
        questionText: ans.questionObj?.question || '',
        userAnswer: ans.userAnswer,
        correctAnswer: ans.questionObj?.answer,
        isCorrect: ans.isCorrect,
        secondsSpent: ans.secondsSpent || 0,
      }));

      // 3. Save locally & sync master record_book + subject details to Google Drive
      saveTestResult(
        {
          subject: subjectName,
          score: correct,
          totalQuestions: total,
          accuracy,
          telemetry: detailedTelemetry,
        },
        googleAccessToken,
        userProfile
      )
        .then(() => {
          if (googleAccessToken) {
            setSyncedDrive(true);
            saveRecordBookToDrive(googleAccessToken, {
              app: 'MarkSprint by Falkon Labs',
              version: '1.0',
              lastUpdated: new Date().toISOString(),
              studentProfile: {
                displayName: userProfile?.displayName || 'Student',
                email: userProfile?.email || 'N/A',
              },
              summary: {
                totalXp: newXp,
                streakDays: streakInfo.streak,
              },
            }).catch(() => {});

            saveSubjectTelemetryToDrive(googleAccessToken, subjectName, detailedTelemetry).catch(() => {});
          }
        })
        .catch((err) => console.warn('Auto save test result notice:', err));
    }
  }, [accuracy, correct, total, selectedSubject, googleAccessToken, userProfile, firstAttemptAnswers, earnedXp, gamification, streakInfo.lastDate, streakInfo.streak]);

  return (
    <div className="w-100 py-4 font-mono d-flex flex-column gap-5 anim-fade-in mx-auto" style={{ maxWidth: '950px' }}>
      
      {/* Top Banner */}
      <div className="bg-brand border-brutal p-4 text-black text-center shadow-hard">
        <h1 className="font-headline text-5xl font-black uppercase italic m-0">
          ASSESSMENT DEBRIEF_
        </h1>
        <p className="font-mono text-xs font-bold uppercase m-0 mt-1">
          SPRINT TELEMETRY & PERFORMANCE BREAKDOWN
        </p>
      </div>
      
      {/* Results Summary Box */}
      <div className="bg-white border-brutal p-4 p-md-5 text-black shadow-hard mx-auto w-100" style={{ maxWidth: '650px' }}>
        <div className="d-flex flex-column gap-3 mb-4">
          <div className="d-flex justify-content-between align-items-center p-3 border-2 border-black bg-slate-100">
            <span className="font-headline text-xs font-black uppercase text-black">TOTAL QUESTIONS</span>
            <span className="font-headline text-3xl font-black text-black">{total}</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center p-3 border-2 border-black bg-emerald-100">
            <span className="font-headline text-xs font-black uppercase text-emerald-900">CORRECT ANSWERS</span>
            <span className="font-headline text-3xl font-black text-emerald-900">{correct}</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center p-3 border-2 border-black bg-brand">
            <span className="font-headline text-xs font-black uppercase text-black">ACCURACY</span>
            <span className="font-headline text-4xl font-black text-black">{accuracy}%</span>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-2 p-3 border-2 border-black bg-black text-brand">
            <div className="d-flex align-items-center gap-2 font-headline font-black text-lg">
              <Zap size={22} className="text-brand" />
              <span>+{earnedXp} XP EARNED</span>
            </div>

            <div className="d-flex align-items-center gap-1 font-headline font-black text-lg text-brand">
              <Flame size={22} />
              <span>{currentStreak}D STREAK</span>
            </div>
          </div>
        </div>

        {syncedDrive && (
          <div className="p-3 mb-4 text-center bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-mono font-bold text-xs uppercase d-flex align-items-center justify-content-center gap-2">
            <Cloud size={18} />
            RESULTS AUTO-SYNCED TO GOOGLE DRIVE
          </div>
        )}
        
        <div className="d-flex flex-column flex-sm-row gap-3">
          <button 
            className="bg-white text-black border-2 border-black p-3 font-headline font-black uppercase hover:bg-black hover:text-white transition-all shadow-hard-sm flex-grow-1"
            onClick={() => engine.setQuizMode('setup')}
          >
            RETRY SPRINT
          </button>
          <button 
            className="bg-brand text-black border-2 border-black p-3 font-headline font-black uppercase hover:bg-black hover:text-brand transition-all shadow-hard-sm flex-grow-1"
            onClick={() => navigate("/dashboard")}
          >
            DASHBOARD
          </button>
          <button 
            className="bg-black text-white border-2 border-black p-3 font-headline font-black uppercase hover:bg-brand hover:text-black transition-all shadow-hard-sm flex-grow-1"
            onClick={() => navigate("/")}
          >
            HOME
          </button>
        </div>
      </div>

      {/* Review Answers List */}
      <div className="w-100">
        <div className="d-flex align-items-center gap-3 my-4">
          <hr className="flex-grow-1 border-2 border-black m-0" />
          <h2 className="font-headline text-3xl font-black uppercase italic m-0 text-white">REVIEW ANSWERS_</h2>
          <hr className="flex-grow-1 border-2 border-black m-0" />
        </div>
        
        <div className="d-flex flex-column gap-4">
          {firstAttemptAnswers.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white border-brutal p-4 p-md-5 text-black shadow-hard-sm position-relative ${item.isCorrect ? 'border-l-8 border-emerald-500' : 'border-l-8 border-rose-500'}`}
            >
              <div className="d-flex align-items-start gap-3 mb-3">
                <span className="w-8 h-8 bg-black text-brand border-2 border-black d-inline-flex align-items-center justify-content-center font-headline font-black text-sm flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                  #{idx + 1}
                </span>
                <h3 className="font-headline text-xl font-black leading-relaxed m-0 text-black" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.questionObj.question) }} />
              </div>

              {item.questionObj.question_image && (
                <div className="mb-3">
                  <img src={item.questionObj.question_image} alt="Question" className="img-fluid border-2 border-black" style={{ maxWidth: '400px', objectFit: 'contain' }} />
                </div>
              )}
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className={`p-3 border-2 border-black font-bold text-xs uppercase d-flex align-items-center gap-2 ${item.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                    {item.isCorrect ? <CheckCircle2 size={20} className="flex-shrink-0 text-emerald-700" /> : <XCircle size={20} className="flex-shrink-0 text-rose-700" />}
                    <div>
                      <span className="d-block font-mono text-[10px] opacity-75">YOUR ANSWER</span>
                      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.userAnswer || "SKIPPED / TIMEOUT") }} />
                    </div>
                  </div>
                </div>
                
                {!item.isCorrect && (
                  <div className="col-12 col-md-6">
                    <div className="p-3 border-2 border-black bg-emerald-100 text-emerald-900 font-bold text-xs uppercase d-flex align-items-center gap-2">
                      <CheckCircle2 size={20} className="flex-shrink-0 text-emerald-700" />
                      <div>
                        <span className="d-block font-mono text-[10px] opacity-75">CORRECT ANSWER</span>
                        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.questionObj.answer) }} />
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
