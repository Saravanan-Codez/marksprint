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

            <div className="d-flex align-items-center justify-content-between gap-2 p-3 px-4" style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '14px' }}>
              <div className="d-flex align-items-center gap-2" style={{ color: '#EAB308', fontWeight: '800' }}>
                <Zap size={20} />
                <span>+ {earnedXp} XP Earned</span>
              </div>

              <div className="d-flex align-items-center gap-1 font-bold" style={{ color: '#F97316' }}>
                <Flame size={20} />
                <span>{currentStreak} Day Streak!</span>
              </div>
            </div>
          </div>

          {syncedDrive && (
            <div 
              className="p-2.5 mb-4 d-flex align-items-center justify-content-center gap-2 font-semibold"
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', fontSize: '0.82rem', borderRadius: '12px' }}
            >
              <Cloud size={16} />
              Results Auto-Synced to Google Drive
            </div>
          )}
          
          <div className="d-flex flex-column flex-sm-row gap-3">
            <button 
              className="btn btn-outline flex-grow-1"
              onClick={() => engine.setQuizMode('setup')}
            >
              <Repeat size={18} /> Retry Sprint
            </button>
            <button 
              className="btn btn-primary flex-grow-1"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard size={18} /> View Dashboard
            </button>
            <button 
              className="btn btn-outline flex-grow-1"
              onClick={() => navigate("/")}
            >
              <Home size={18} /> Home
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
