import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trophy, Target, Clock, Zap, Cloud, CloudOff, RefreshCw, Download,
  BookOpen, User, Flame, ArrowRight, ShieldCheck, CheckCircle2,
  FolderCheck, Code, Settings, Award, Eye, Lock, BarChart2, Shield, Gift, Check
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import { getLocalTestHistory, syncWithCloud } from '../services/resultsStorage';
import { getLocalGamificationData, getLevelInfo, getDivisionInfo, saveGamificationData } from '../services/gamificationService';
import AccountSettingsModal from '../components/AccountSettingsModal';
import FriendsLeaderboard from '../components/FriendsLeaderboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, userProfile, googleAccessToken } = useAuth();

  const [history, setHistory] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');
  const [showInspector, setShowInspector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gamification, setGamification] = useState(() => getLocalGamificationData());

  useEffect(() => {
    const localData = getLocalTestHistory();
    setHistory(localData);

    if (googleAccessToken) {
      setSyncing(true);
      syncWithCloud(googleAccessToken, userProfile)
        .then((merged) => setHistory(merged))
        .catch((err) => console.warn('Auto-sync notice:', err))
        .finally(() => setSyncing(false));
    }
  }, [googleAccessToken, userProfile]);

  // ── Derived metrics ────────────────────────────────────────────────────────
  const totalSprints = history.length;
  const totalQuestions = history.reduce((acc, h) => acc + (h.totalQuestions || 0), 0);
  const totalCorrect = history.reduce((acc, h) => acc + (h.score || 0), 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalTimeSeconds = history.reduce((acc, h) => acc + (h.timeTakenSeconds || 0), 0);
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeSeconds / totalQuestions) : 0;

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student';
  const userRole = userProfile?.role || 'student';
  const isGuestUser = user?.uid === 'guest_student_demo' || user?.isAnonymous;

  const currentDivision = getDivisionInfo(gamification.xp || 0);

  // ── Claim quest reward ───────────────────────────────────────────────────
  const handleClaimQuest = (questId, rewardXp) => {
    const updatedQuests = {
      ...gamification.dailyQuests,
      list: gamification.dailyQuests.list.map(q => 
        q.id === questId ? { ...q, claimed: true } : q
      )
    };
    const newXp = (gamification.xp || 0) + rewardXp;
    const updated = {
      ...gamification,
      xp: newXp,
      dailyQuests: updatedQuests
    };
    setGamification(updated);
    saveGamificationData(updated);
    toast.success(`Claimed +${rewardXp} XP bonus! 🎉`);
  };

  // ── Subject proficiency ────────────────────────────────────────────────────
  const subjectStats = {};
  history.forEach((item) => {
    const sub = item.subject || 'General';
    if (!subjectStats[sub]) subjectStats[sub] = { correct: 0, total: 0, count: 0 };
    subjectStats[sub].correct += item.score || 0;
    subjectStats[sub].total += item.totalQuestions || 0;
    subjectStats[sub].count += 1;
  });

  // ── Export payload ────────────────────────────────────────────────────────
  const structuredExportPayload = {
    app: 'MarkSprint by Falkon Labs',
    version: '2.0',
    schema: 'structured_student_record_v2',
    lastSynced: new Date().toISOString(),
    studentProfile: {
      displayName,
      email: user?.email || 'N/A',
      leagueDivision: currentDivision.name
    },
    summary: { totalSprints, totalQuestions, totalCorrect, overallAccuracy, avgSpeedSeconds: avgTimePerQuestion },
    testHistory: history,
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(structuredExportPayload, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `marksprint_data_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleManualSync = async () => {
    if (!googleAccessToken) {
      setSyncNotice('Sign in with Google to enable Drive sync.');
      setTimeout(() => setSyncNotice(''), 4000);
      return;
    }
    try {
      setSyncing(true);
      const merged = await syncWithCloud(googleAccessToken, userProfile);
      setHistory(merged);
      setSyncNotice('✓ Synced to /MarkSprint/ on your Google Drive!');
    } catch {
      setSyncNotice('Sync completed locally.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncNotice(''), 4000);
    }
  };

  const levelInfo = getLevelInfo(gamification.xp || 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container py-4 py-md-5">

      {/* ── Profile / Gamification Banner ─────────────────────────────────── */}
      <div className="glass-card-cosmic p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ borderRadius: '24px' }}>
        <div className="position-relative z-2 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">

          {/* Avatar + name + streak + division */}
          <div className="d-flex align-items-center gap-3.5">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
              style={{ width: '68px', height: '68px', background: 'linear-gradient(135deg, #6366F1, #06B6D4)', border: `2px solid ${currentDivision.color}`, boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)', borderRadius: '20px' }}
            >
              {gamification.customAvatarUrl || user?.photoURL ? (
                <img src={gamification.customAvatarUrl || user.photoURL} alt="Profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
              ) : (
                <User size={36} color="#fff" />
              )}
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h1 className="font-extrabold text-white mb-0" style={{ fontSize: '1.65rem', letterSpacing: '-0.02em' }}>
                  {displayName}
                </h1>
                <span 
                  className="px-2.5 py-0.5 font-bold text-uppercase d-inline-flex align-items-center gap-1" 
                  style={{ fontSize: '0.68rem', background: currentDivision.bg, color: currentDivision.color, border: `1px solid ${currentDivision.border}`, borderRadius: '9999px' }}
                >
                  <span>{currentDivision.icon}</span> {currentDivision.name}
                </span>
                <span className="px-2.5 py-0.5 font-bold text-uppercase d-inline-flex align-items-center gap-1" style={{ fontSize: '0.68rem', background: gamification.privacyMode === 'private' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: gamification.privacyMode === 'private' ? '#F87171' : '#34D399', border: gamification.privacyMode === 'private' ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(52,211,153,0.3)', borderRadius: '9999px' }}>
                  {gamification.privacyMode === 'private' ? <Lock size={10} /> : <Eye size={10} />}
                  {gamification.privacyMode || 'public'}
                </span>
              </div>

              {/* Streak + level bar + shield */}
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="font-extrabold d-inline-flex align-items-center gap-1" style={{ color: '#F97316', fontSize: '0.88rem' }}>
                  <Flame size={18} /> {gamification.streakDays || 1} Day Streak
                </span>
                {gamification.streakShieldActive && (
                  <span className="font-bold d-inline-flex align-items-center gap-1" style={{ color: '#38BDF8', fontSize: '0.78rem' }} title="Streak Protected for Missed Days">
                    <Shield size={14} /> Shield Protected
                  </span>
                )}
                <div className="d-flex align-items-center gap-2" style={{ minWidth: '200px' }}>
                  <span className="font-bold text-white" style={{ fontSize: '0.8rem' }}>Lvl {levelInfo.level}</span>
                  <div className="flex-grow-1" style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${levelInfo.percent}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #06B6D4)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{(gamification.xp || 0).toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-outline px-3.5 py-2 font-semibold d-flex align-items-center gap-2"
              style={{ fontSize: '0.88rem' }}
            >
              <Settings size={16} /> Account Settings
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary px-4 py-2 font-bold d-flex align-items-center gap-2"
              style={{ fontSize: '0.9rem' }}
            >
              <Zap size={16} /> Start Sprint
            </button>
          </div>
        </div>
      </div>

      {/* ── Daily Quests Section ────────────────────────────────────────── */}
      {gamification.dailyQuests?.list && (
        <div className="glass-card-cosmic p-4 mb-4" style={{ borderRadius: '20px' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <Gift size={20} className="text-cyan-400" />
              <h3 className="font-bold card-title-text m-0" style={{ fontSize: '1.1rem' }}>Daily Sprint Quests</h3>
            </div>
            <span className="text-subtext" style={{ fontSize: '0.78rem' }}>Resets Daily</span>
          </div>

          <div className="row g-3">
            {gamification.dailyQuests.list.map(q => {
              const percent = Math.min(100, Math.round((q.current / q.target) * 100));

              return (
                <div key={q.id} className="col-12 col-md-4">
                  <div className="card-item-nested p-3.5 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="font-bold card-title-text" style={{ fontSize: '0.9rem' }}>{q.icon} {q.title}</span>
                        <span className="font-bold font-mono" style={{ color: '#EAB308', fontSize: '0.8rem' }}>+{q.reward} XP</span>
                      </div>
                      <p className="m-0 mb-2 text-subtext" style={{ fontSize: '0.8rem' }}>{q.desc}</p>
                    </div>

                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-1 text-subtext" style={{ fontSize: '0.76rem' }}>
                        <span>Progress</span>
                        <span>{q.current} / {q.target}</span>
                      </div>
                      <div className="w-100 mb-2.5" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: q.completed ? '#10B981' : '#06B6D4', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                      </div>

                      {q.completed ? (
                        q.claimed ? (
                          <div className="text-center py-1 font-bold text-success" style={{ fontSize: '0.78rem' }}>
                            <Check size={14} className="me-1 d-inline" /> Claimed
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimQuest(q.id, q.reward)}
                            className="btn btn-accent btn-sm w-100 font-bold"
                            style={{ fontSize: '0.8rem' }}
                          >
                            Claim +{q.reward} XP
                          </button>
                        )
                      ) : (
                        <div className="text-center py-1 font-semibold text-muted" style={{ fontSize: '0.78rem' }}>
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Stats Grid ────────────────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          { icon: <Trophy size={22} />, color: '#818CF8', bg: 'rgba(99,102,241,0.15)', value: totalSprints, label: 'Sprints Completed' },
          { icon: <Target size={22} />, color: '#34D399', bg: 'rgba(16,185,129,0.15)', value: `${overallAccuracy}%`, label: 'Overall Accuracy' },
          { icon: <CheckCircle2 size={22} />, color: '#38BDF8', bg: 'rgba(56,189,248,0.15)', value: `${totalCorrect}/${totalQuestions}`, label: 'Questions Solved' },
          { icon: <Clock size={22} />, color: '#FB923C', bg: 'rgba(251,146,60,0.15)', value: `${avgTimePerQuestion}s`, label: 'Avg Speed / Q' },
        ].map(({ icon, color, bg, value, label }, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="glass-card-cosmic p-4 text-center h-100" style={{ borderRadius: '18px' }}>
              <div className="d-flex align-items-center justify-content-center mx-auto mb-2.5" style={{ width: '46px', height: '46px', background: bg, color, borderRadius: '14px' }}>
                {icon}
              </div>
              <div className="font-extrabold text-white" style={{ fontSize: '1.85rem' }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Google Drive Storage Panel ────────────────────────────────────────── */}
      <div className="glass-card-cosmic p-4 mb-4" style={{ borderRadius: '18px', borderLeft: '4px solid #06B6D4' }}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div style={{ padding: '12px', background: googleAccessToken ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: googleAccessToken ? '#34D399' : '#94A3B8', border: googleAccessToken ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(148,163,184,0.2)', borderRadius: '14px' }}>
              {googleAccessToken ? <Cloud size={24} /> : <CloudOff size={24} />}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-white mb-0" style={{ fontSize: '1.1rem' }}>Google Drive Storage</h3>
                <span className={`badge font-bold d-flex align-items-center gap-1 ${googleAccessToken ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.68rem', borderRadius: '9999px' }}>
                  {googleAccessToken ? <><ShieldCheck size={11} /> CONNECTED</> : 'OFFLINE MODE'}
                </span>
                <span className="badge font-mono" style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)', fontSize: '0.68rem', borderRadius: '9999px' }}>
                  <FolderCheck size={11} className="me-1" />/MarkSprint/
                </span>
              </div>
              <p className="m-0" style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                {googleAccessToken
                  ? 'Assessment records auto-sync to your Google Drive inside /MarkSprint/.'
                  : 'Sign in with Google to enable automatic Drive cloud backup.'}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button onClick={() => setShowInspector(v => !v)} className="btn btn-outline px-3 py-2 font-semibold d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <Code size={15} /> {showInspector ? 'Hide JSON' : 'Inspect JSON'}
            </button>
            {!isGuestUser && (
              <button onClick={handleManualSync} disabled={syncing} className="btn btn-outline px-3 py-2 font-semibold d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Syncing...' : 'Sync to Drive'}
              </button>
            )}
            {!isGuestUser && (
              <button onClick={handleExportJSON} className="btn btn-outline px-3 py-2 font-semibold d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                <Download size={15} /> Export JSON
              </button>
            )}
            {isGuestUser && (
              <div className="px-3 py-2 font-semibold d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#94A3B8', background: 'rgba(148,163,184,0.08)', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.15)' }}>
                🔒 Sign in to enable Drive Sync
              </div>
            )}
          </div>
        </div>

        {/* JSON Inspector */}
        {showInspector && (
          <div className="mt-3 p-3" style={{ background: '#090D16', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="font-bold text-white" style={{ fontSize: '0.78rem' }}>
                📁 /MarkSprint/marksprint_structured_data.json Preview
              </span>
              <button onClick={() => setShowInspector(false)} className="btn btn-link p-0 text-decoration-none font-bold" style={{ color: '#F43F5E', fontSize: '0.78rem' }}>
                Close ✕
              </button>
            </div>
            <pre className="m-0 p-3 overflow-auto" style={{ background: '#05070E', fontSize: '0.75rem', maxHeight: '240px', lineHeight: '1.4', color: '#67e8f9', borderRadius: '8px' }}>
              {JSON.stringify(structuredExportPayload, null, 2)}
            </pre>
          </div>
        )}

        {syncNotice && (
          <div className="mt-3 p-2 font-semibold text-center" style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#06B6D4', fontSize: '0.84rem', borderRadius: '10px' }}>
            {syncNotice}
          </div>
        )}
      </div>

      {/* ── Friends Leaderboard ───────────────────────────────────────────────── */}
      <FriendsLeaderboard />

      {/* ── Main Two-Column Layout ────────────────────────────────────────────── */}
      <div className="row g-4 mb-4">

        {/* Sprint History */}
        <div className="col-12 col-lg-7">
          <div className="glass-card-cosmic p-4 h-100" style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="font-bold text-white m-0" style={{ fontSize: '1.15rem' }}>
                Recent Sprint History
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{history.length} Total Records</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-5">
                <Flame size={36} color="#475569" className="mb-2" />
                <p className="text-white font-semibold mb-1">No Sprint History Yet</p>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8' }}>Take your first quiz sprint to track your performance!</p>
                <button onClick={() => navigate('/')} className="btn btn-primary mt-2 px-4 py-2 font-bold" style={{ fontSize: '0.84rem' }}>
                  Start Sprint
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2.5" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {history.map((item) => {
                  const percent = item.totalQuestions > 0 ? Math.round((item.score / item.totalQuestions) * 100) : 0;
                  const dateStr = item.timestamp
                    ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recent';
                  const hasTelemetry = item.telemetry && item.telemetry.length > 0;
                  const scoreColor = percent >= 80 ? '#34D399' : percent >= 50 ? '#FBBF24' : '#F87171';

                  return (
                    <div
                      key={item.id || item.timestamp}
                      className="card-item-nested p-3.5 d-flex flex-column gap-2"
                    >
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <div className="font-bold card-title-text text-capitalize" style={{ fontSize: '0.92rem' }}>
                            {item.subject || 'General Sprint'}
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-1 text-subtext" style={{ fontSize: '0.76rem' }}>
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span>{item.totalQuestions || 0} Questions</span>
                          </div>
                        </div>
                        <div className="font-extrabold text-end" style={{ fontSize: '1.05rem', color: scoreColor }}>
                          {item.score}/{item.totalQuestions} ({percent}%)
                        </div>
                      </div>

                      {hasTelemetry && (
                        <div className="pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <span className="font-bold text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                            ⏱ Per-Question Telemetry:
                          </span>
                          <div className="d-flex flex-wrap gap-1.5">
                            {item.telemetry.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 font-mono"
                                style={{ fontSize: '0.68rem', background: t.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: t.isCorrect ? '#34D399' : '#F87171', border: t.isCorrect ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', lineHeight: '1.8' }}
                                title={`Q${t.questionIndex}: ${t.secondsSpent}s (${t.isCorrect ? 'Correct' : 'Wrong'})`}
                              >
                                Q{t.questionIndex}: {t.secondsSpent}s {t.isCorrect ? '✓' : '✗'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Subject Mastery */}
        <div className="col-12 col-lg-5">
          <div className="glass-card-cosmic p-4 h-100" style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <BarChart2 size={20} color="#818CF8" />
              <h2 className="font-bold text-white m-0" style={{ fontSize: '1.15rem' }}>Subject Mastery</h2>
            </div>

            {Object.keys(subjectStats).length === 0 ? (
              <div className="text-center py-5">
                <BookOpen size={36} color="#475569" className="mb-2" />
                <p className="text-white font-semibold mb-1">No Subject Data Yet</p>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8' }}>Complete quizzes to see subject mastery stats.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {Object.entries(subjectStats).map(([sub, stat]) => {
                  const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const barColor = accuracy >= 75 ? 'linear-gradient(90deg,#10B981,#34D399)' : accuracy >= 50 ? 'linear-gradient(90deg,#F59E0B,#FBBF24)' : 'linear-gradient(90deg,#EF4444,#F87171)';
                  const textColor = accuracy >= 75 ? '#34D399' : accuracy >= 50 ? '#FBBF24' : '#F87171';
                  return (
                    <div key={sub}>
                      <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: '0.86rem' }}>
                        <span className="font-bold text-white text-capitalize">{sub}</span>
                        <span className="font-bold" style={{ color: textColor }}>{accuracy}% ({stat.correct}/{stat.total})</span>
                      </div>
                      <div className="w-100" style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${accuracy}%`, height: '100%', background: barColor, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <Link to="/" className="text-decoration-none font-bold d-flex align-items-center justify-content-between" style={{ color: '#38BDF8', fontSize: '0.86rem' }}>
                <span>Browse Subjects</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Account Settings Modal ────────────────────────────────────────────── */}
      <AccountSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onUpdated={(updated) => setGamification(updated)}
      />
    </div>
  );
}
