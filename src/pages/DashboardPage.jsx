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
    <div className="d-flex flex-column gap-5 anim-fade-in font-mono pb-5 mb-5">

      {/* ── Operative Profile Header ────────────────────────────────────────── */}
      <div className="neo-brutal-card p-4 p-md-5 d-flex flex-column md:flex-row justify-content-between align-items-center gap-4 shadow-hard">
        <div className="d-flex align-items-center gap-4">
          <div className="w-24 h-24 text-brand border-brutal flex align-items-center justify-content-center flex-shrink-0" style={{ width: '80px', height: '80px', background: 'var(--bg-main)' }}>
            {gamification.customAvatarUrl || user?.photoURL ? (
              <img src={gamification.customAvatarUrl || user.photoURL} alt="Profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
            ) : (
              <User size={48} className="text-brand" />
            )}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-headline text-4xl font-black uppercase italic m-0" style={{ color: 'var(--text-main)' }}>
                {displayName.toUpperCase()}
              </h2>
              <span className="bg-brand text-black px-2 py-0.5 text-xs font-bold border-brutal uppercase">
                {currentDivision.icon} {currentDivision.name}
              </span>
            </div>
            <div className="d-flex gap-2">
              <span className="px-2 py-0.5 text-xs font-bold font-mono border-brutal" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>LVL {levelInfo.level}</span>
              <span className="bg-brand text-black px-2 py-0.5 text-xs font-bold italic font-mono border-brutal">XP: {(gamification.xp || 0).toLocaleString()}</span>
              {gamification.streakDays > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold font-mono border-brutal" style={{ background: 'var(--warning)', color: '#000000' }}>🔥 {gamification.streakDays}D STREAK</span>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowSettings(true)}
            className="btn"
          >
            SETTINGS_
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            START SPRINT
          </button>
        </div>
      </div>

      {/* ── Daily Sprint Quests Section ────────────────────────────────────────── */}
      {gamification.dailyQuests?.list && (
        <div className="neo-brutal-card p-5 p-md-6 shadow-hard-sm">
          <div className="d-flex align-items-center justify-content-between mb-4 border-b-brutal pb-3">
            <div className="d-flex align-items-center gap-2">
              <Gift size={20} style={{ color: 'var(--text-main)' }} />
              <h3 className="font-headline text-2xl font-black uppercase italic m-0" style={{ color: 'var(--text-main)' }}>DAILY SPRINT QUESTS</h3>
            </div>
            <span className="font-mono text-xs font-bold uppercase text-black bg-brand px-2 py-0.5 border-brutal">RESETS DAILY</span>
          </div>

          <div className="row g-3">
            {gamification.dailyQuests.list.map(q => {
              const percent = Math.min(100, Math.round((q.current / q.target) * 100));

              return (
                <div key={q.id} className="col-12 col-md-4">
                  <div className="neo-brutal-card p-5 h-100 d-flex flex-column justify-content-between shadow-hard-sm position-relative">
                    <div>
                      <div className="d-flex align-items-start justify-content-between mb-3 gap-2">
                        <span className="font-bold font-mono text-xs uppercase pr-5" style={{ color: 'var(--text-main)' }}>{q.icon} {q.title}</span>
                        <span className="position-absolute font-bold font-mono text-white bg-brand px-2 py-1 text-xs border-brutal m-2" style={{ top: '8px', right: '8px' }}>+{q.reward} XP</span>
                      </div>
                      <p className="m-0 mb-3 font-mono text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{q.desc}</p>
                    </div>

                    <div>
                      <div className="d-flex align-items-center justify-content-between my-3 font-mono text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                        <span>PROGRESS</span>
                        <span>{q.current} / {q.target}</span>
                      </div>
                      <div className="progress mb-4">
                        <div className="progress-bar" style={{ width: `${percent}%`, background: q.completed ? 'var(--success)' : 'var(--warning)' }} />
                      </div>

                      {q.completed ? (
                        q.claimed ? (
                          <div className="text-center py-1 font-bold text-xs" style={{ color: 'var(--success)' }}>
                            <Check size={14} className="me-1 d-inline" /> CLAIMED
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimQuest(q.id, q.reward)}
                            className="btn btn-primary btn-sm w-100"
                          >
                            CLAIM +{q.reward} XP
                          </button>
                        )
                      ) : (
                        <div className="text-center py-1 font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>
                          IN PROGRESS
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

      {/* Google Drive Storage Panel */}
      <div className="neo-brutal-card p-4 shadow-hard-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 border-brutal flex-shrink-0" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
              {googleAccessToken ? <Cloud size={24} /> : <CloudOff size={24} />}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3 className="font-headline font-black text-xl mb-0" style={{ color: 'var(--text-main)' }}>GOOGLE DRIVE STORAGE</h3>
                <span className="badge font-bold px-2 py-0.5 border-brutal text-xs" style={{ background: googleAccessToken ? 'var(--success)' : 'var(--bg-main)', color: googleAccessToken ? '#000000' : 'var(--text-muted)' }}>
                  {googleAccessToken ? '✓ CONNECTED' : 'OFFLINE MODE'}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 border-brutal" style={{ background: 'var(--bg-main)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                  /MarkSprint/
                </span>
              </div>
              <p className="m-0 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                {googleAccessToken
                  ? 'Assessment records auto-sync to your Google Drive inside /MarkSprint/.'
                  : 'Sign in with Google to enable automatic Drive cloud backup.'}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button onClick={() => setShowInspector(v => !v)} className="btn btn-sm">
              <Code size={14} className="me-1 d-inline" /> {showInspector ? 'HIDE JSON' : 'INSPECT JSON'}
            </button>
            {!isGuestUser && (
              <button onClick={handleManualSync} disabled={syncing} className="btn btn-sm" style={{ background: 'var(--brand)', color: '#000000' }}>
                <RefreshCw size={14} className={`me-1 d-inline ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'SYNCING...' : 'SYNC DRIVE'}
              </button>
            )}
            {!isGuestUser && (
              <button onClick={handleExportJSON} className="btn btn-sm">
                <Download size={14} className="me-1 d-inline" /> EXPORT JSON
              </button>
            )}
            {isGuestUser && (
              <div className="px-3 py-1.5 font-bold text-xs uppercase border-brutal" style={{ background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
                🔒 SIGN IN FOR DRIVE SYNC
              </div>
            )}
          </div>
        </div>

        {/* JSON Inspector */}
        {showInspector && (
          <div className="mt-3 p-3 font-mono border-brutal" style={{ background: 'var(--bg-main)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="font-bold text-xs">
                📁 /MarkSprint/marksprint_structured_data.json PREVIEW
              </span>
              <button onClick={() => setShowInspector(false)} className="font-bold border-0 bg-transparent text-xs" style={{ color: 'var(--danger)' }}>
                CLOSE ✕
              </button>
            </div>
            <pre className="m-0 p-3 overflow-auto text-xs border-brutal" style={{ maxHeight: '240px', lineHeight: '1.4', background: 'var(--bg-card)', color: 'var(--text-main)', borderColor: 'var(--accent)' }}>
              {JSON.stringify(structuredExportPayload, null, 2)}
            </pre>
          </div>
        )}

        {syncNotice && (
          <div className="mt-3 p-2 font-bold text-center bg-brand text-black border-brutal text-xs uppercase">
            {syncNotice}
          </div>
        )}
      </div>

      {/* Friends Leaderboard */}
      <FriendsLeaderboard />

      {/* Main Two-Column Layout */}
      <div className="row g-4 mb-4">

        {/* Sprint History */}
        <div className="col-12 col-lg-7">
          <div className="neo-brutal-card p-4 h-100 shadow-hard-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-b-brutal pb-2">
              <h2 className="font-headline text-2xl font-black uppercase italic m-0" style={{ color: 'var(--text-main)' }}>
                RECENT SPRINT HISTORY_
              </h2>
              <span className="bg-brand text-black px-2 py-0.5 font-mono text-xs font-bold border-brutal">{history.length} RECORDS</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-5">
                <Flame size={36} className="text-brand mb-2 mx-auto" />
                <p className="font-headline text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>NO SPRINT HISTORY YET</p>
                <p className="text-xs font-bold font-mono" style={{ color: 'var(--text-muted)' }}>Take your first quiz sprint to track your performance!</p>
                <button onClick={() => navigate('/')} className="btn btn-primary mt-3">
                  START SPRINT
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 history-scroll" style={{ maxHeight: '440px', overflowY: 'auto', paddingRight: '4px', scrollbarWidth: 'thin', scrollbarColor: 'var(--border-muted) transparent' }}>
                <style>{`
                  .history-scroll::-webkit-scrollbar { width: 4px; }
                  .history-scroll::-webkit-scrollbar-track { background: transparent; }
                  .history-scroll::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: 4px; }
                  .history-scroll::-webkit-scrollbar-thumb:hover { background: var(--brand); }
                `}</style>
                {history.map((item) => {
                  const percent = item.totalQuestions > 0 ? Math.round((item.score / item.totalQuestions) * 100) : 0;
                  const dateStr = item.timestamp
                    ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recent';
                  const hasTelemetry = item.telemetry && item.telemetry.length > 0;
                  
                  let scoreBg = 'var(--danger)';
                  if (percent >= 80) scoreBg = 'var(--success)';
                  else if (percent >= 50) scoreBg = 'var(--brand)';

                  return (
                    <div
                      key={item.id || item.timestamp}
                      className="p-4 d-flex flex-column gap-2"
                      style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border-main)' }}
                    >
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <div className="font-headline font-black text-xl uppercase" style={{ color: 'var(--text-main)' }}>
                            {item.subject || 'General Sprint'}
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-0.5 font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span>{item.totalQuestions || 0} QUESTIONS</span>
                          </div>
                        </div>
                        <div className="font-headline font-black text-lg px-3 py-1 border-brutal" style={{ background: scoreBg, color: '#000000' }}>
                          {item.score}/{item.totalQuestions} ({percent}%)
                        </div>
                      </div>

                      {hasTelemetry && (
                        <div className="pt-2 border-t-brutal mt-1">
                          <span className="font-mono text-[10px] font-bold text-brand uppercase d-block mb-1">
                            ⏱ PER-QUESTION TELEMETRY:
                          </span>
                          <div className="d-flex flex-wrap gap-2">
                            {item.telemetry.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 font-mono text-[11px] font-bold"
                                style={{
                                  background: t.isCorrect ? 'var(--success)' : 'var(--danger)',
                                  color: '#000000',
                                  borderRadius: '4px'
                                }}
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

        <div className="col-12 col-lg-5">
          <div className="neo-brutal-card p-4 h-100 shadow-hard-sm">
            <div className="d-flex align-items-center gap-2 mb-3 border-b-brutal pb-2">
              <BarChart2 size={22} className="text-brand" />
              <h2 className="font-headline text-2xl font-black uppercase italic m-0" style={{ color: 'var(--text-main)' }}>SUBJECT MASTERY_</h2>
            </div>

            {Object.keys(subjectStats).length === 0 ? (
              <div className="text-center py-5">
                <BookOpen size={36} style={{ color: 'var(--text-muted)' }} className="mb-2 mx-auto" />
                <p className="font-headline text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>NO SUBJECT DATA YET</p>
                <p className="text-xs font-bold font-mono" style={{ color: 'var(--text-muted)' }}>Complete quizzes to see subject mastery stats.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 font-mono">
                {Object.entries(subjectStats).map(([sub, stat]) => {
                  const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const barBg = accuracy >= 75 ? 'var(--success)' : accuracy >= 50 ? 'var(--brand)' : 'var(--danger)';
                  return (
                    <div key={sub} className="p-3 border-brutal" style={{ background: 'var(--bg-main)' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1 text-xs">
                        <span className="font-bold uppercase" style={{ color: 'var(--text-main)' }}>{sub}</span>
                        <span className="font-headline font-black text-sm" style={{ color: barBg }}>{accuracy}% ({stat.correct}/{stat.total})</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${accuracy}%`, background: barBg }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t-brutal">
              <Link to="/" className="btn btn-primary w-100 d-flex align-items-center justify-content-between">
                <span>BROWSE TARGET SECTORS</span>
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
