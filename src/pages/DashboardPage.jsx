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
    <div className="d-flex flex-column gap-5 anim-fade-in font-mono">

      {/* ── Operative Profile Header ────────────────────────────────────────── */}
      <div className="bg-white border-brutal p-4 p-md-5 text-black d-flex flex-column md:flex-row justify-content-between align-items-center gap-4 shadow-hard">
        <div className="d-flex align-items-center gap-4">
          <div className="w-24 h-24 bg-black text-brand border-brutal flex align-items-center justify-content-center flex-shrink-0" style={{ width: '80px', height: '80px' }}>
            {gamification.customAvatarUrl || user?.photoURL ? (
              <img src={gamification.customAvatarUrl || user.photoURL} alt="Profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
            ) : (
              <User size={48} className="text-brand" />
            )}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-headline text-4xl font-black uppercase italic m-0 text-black">
                {displayName.toUpperCase()}
              </h2>
              <span className="bg-brand text-black px-2 py-0.5 text-xs font-bold border border-black uppercase">
                {currentDivision.icon} {currentDivision.name}
              </span>
            </div>
            <div className="d-flex gap-2">
              <span className="bg-black text-white px-2 py-0.5 text-xs font-bold font-mono">LVL {levelInfo.level}</span>
              <span className="bg-brand text-black px-2 py-0.5 text-xs font-bold italic font-mono">XP: {(gamification.xp || 0).toLocaleString()}</span>
              {gamification.streakDays > 0 && (
                <span className="bg-black text-brand px-2 py-0.5 text-xs font-bold font-mono">🔥 {gamification.streakDays}D STREAK</span>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowSettings(true)}
            className="bg-white text-black border-2 border-black px-4 py-2.5 font-headline font-black uppercase hover:bg-black hover:text-white transition-all shadow-hard-sm"
          >
            SETTINGS_
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white border-2 border-black px-6 py-3 font-headline text-xl font-black uppercase hover:bg-brand hover:text-black transition-all shadow-hard-sm"
          >
            START SPRINT
          </button>
        </div>
      </div>

      {/* ── Daily Sprint Quests Section ────────────────────────────────────────── */}
      {gamification.dailyQuests?.list && (
        <div className="bg-white border-brutal p-4 text-black shadow-hard-sm">
          <div className="d-flex align-items-center justify-content-between mb-3 border-b-2 border-black pb-2">
            <div className="d-flex align-items-center gap-2">
              <Gift size={20} className="text-black" />
              <h3 className="font-headline text-2xl font-black uppercase italic m-0 text-black">DAILY SPRINT QUESTS</h3>
            </div>
            <span className="font-mono text-xs font-bold uppercase text-black bg-brand px-2 py-0.5 border border-black">RESETS DAILY</span>
          </div>

          <div className="row g-3">
            {gamification.dailyQuests.list.map(q => {
              const percent = Math.min(100, Math.round((q.current / q.target) * 100));

              return (
                <div key={q.id} className="col-12 col-md-4">
                  <div className="bg-white border-2 border-black p-3.5 h-100 d-flex flex-column justify-content-between shadow-hard-sm">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="font-bold font-mono text-black text-xs uppercase">{q.icon} {q.title}</span>
                        <span className="font-bold font-mono text-black bg-brand px-1.5 py-0.5 text-xs border border-black">+{q.reward} XP</span>
                      </div>
                      <p className="m-0 mb-2 font-mono text-xs font-semibold text-slate-700">{q.desc}</p>
                    </div>

                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-1 font-mono text-xs font-bold text-black">
                        <span>PROGRESS</span>
                        <span>{q.current} / {q.target}</span>
                      </div>
                      <div className="w-100 mb-2 border border-black" style={{ height: '8px', background: '#E2E8F0', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: q.completed ? '#10B981' : '#FBBF24', transition: 'width 0.4s ease' }} />
                      </div>

                      {q.completed ? (
                        q.claimed ? (
                          <div className="text-center py-1 font-bold text-success text-xs">
                            <Check size={14} className="me-1 d-inline" /> CLAIMED
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimQuest(q.id, q.reward)}
                            className="bg-brand text-black border border-black btn-sm w-100 font-bold font-headline uppercase"
                            style={{ fontSize: '0.8rem' }}
                          >
                            CLAIM +{q.reward} XP
                          </button>
                        )
                      ) : (
                        <div className="text-center py-1 font-semibold text-slate-500 text-xs">
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
      <div className="bg-slate-900 border-2 border-cyan-400 p-4 text-white shadow-hard-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-black text-cyan-400 border border-cyan-400 flex-shrink-0">
              {googleAccessToken ? <Cloud size={24} /> : <CloudOff size={24} />}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3 className="font-headline font-black text-xl text-white mb-0">GOOGLE DRIVE STORAGE</h3>
                <span className={`badge font-bold px-2 py-0.5 border text-xs ${googleAccessToken ? 'bg-emerald-500 text-black border-black' : 'bg-slate-800 text-slate-300 border-slate-600'}`}>
                  {googleAccessToken ? '✓ CONNECTED' : 'OFFLINE MODE'}
                </span>
                <span className="bg-black text-cyan-400 border border-cyan-400 font-mono text-xs font-bold px-2 py-0.5">
                  /MarkSprint/
                </span>
              </div>
              <p className="m-0 text-xs font-bold text-slate-300">
                {googleAccessToken
                  ? 'Assessment records auto-sync to your Google Drive inside /MarkSprint/.'
                  : 'Sign in with Google to enable automatic Drive cloud backup.'}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button onClick={() => setShowInspector(v => !v)} className="bg-black text-white border-2 border-black px-3 py-1.5 font-headline font-bold text-xs uppercase hover:bg-white hover:text-black transition-all">
              <Code size={14} className="me-1 d-inline" /> {showInspector ? 'HIDE JSON' : 'INSPECT JSON'}
            </button>
            {!isGuestUser && (
              <button onClick={handleManualSync} disabled={syncing} className="bg-brand text-black border-2 border-black px-3 py-1.5 font-headline font-bold text-xs uppercase hover:bg-white hover:text-black transition-all">
                <RefreshCw size={14} className={`me-1 d-inline ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'SYNCING...' : 'SYNC DRIVE'}
              </button>
            )}
            {!isGuestUser && (
              <button onClick={handleExportJSON} className="bg-black text-brand border-2 border-black px-3 py-1.5 font-headline font-bold text-xs uppercase hover:bg-brand hover:text-black transition-all">
                <Download size={14} className="me-1 d-inline" /> EXPORT JSON
              </button>
            )}
            {isGuestUser && (
              <div className="px-3 py-1.5 font-bold text-xs uppercase bg-black text-slate-400 border border-slate-700">
                🔒 SIGN IN FOR DRIVE SYNC
              </div>
            )}
          </div>
        </div>

        {/* JSON Inspector */}
        {showInspector && (
          <div className="mt-3 p-3 bg-black border-2 border-cyan-400 text-cyan-400 font-mono">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="font-bold text-xs">
                📁 /MarkSprint/marksprint_structured_data.json PREVIEW
              </span>
              <button onClick={() => setShowInspector(false)} className="text-rose-400 font-bold border-0 bg-transparent text-xs">
                CLOSE ✕
              </button>
            </div>
            <pre className="m-0 p-3 overflow-auto text-xs" style={{ maxHeight: '240px', lineHeight: '1.4', background: '#05070E' }}>
              {JSON.stringify(structuredExportPayload, null, 2)}
            </pre>
          </div>
        )}

        {syncNotice && (
          <div className="mt-3 p-2 font-bold text-center bg-brand text-black border-2 border-black text-xs uppercase">
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
          <div className="bg-slate-900 border-2 border-brand/50 p-4 h-100 text-white shadow-hard-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-b-2 border-brand/40 pb-2">
              <h2 className="font-headline text-2xl font-black uppercase italic m-0 text-white">
                RECENT SPRINT HISTORY_
              </h2>
              <span className="bg-brand text-black px-2 py-0.5 font-mono text-xs font-bold border border-black">{history.length} RECORDS</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-5">
                <Flame size={36} className="text-brand mb-2 mx-auto" />
                <p className="font-headline text-lg font-bold text-white mb-1">NO SPRINT HISTORY YET</p>
                <p className="text-xs font-bold text-slate-300 font-mono">Take your first quiz sprint to track your performance!</p>
                <button onClick={() => navigate('/')} className="bg-brand text-black border-2 border-black mt-3 px-5 py-2 font-headline font-black uppercase hover:bg-white">
                  START SPRINT
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3" style={{ maxHeight: '440px', overflowY: 'auto' }}>
                {history.map((item) => {
                  const percent = item.totalQuestions > 0 ? Math.round((item.score / item.totalQuestions) * 100) : 0;
                  const dateStr = item.timestamp
                    ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recent';
                  const hasTelemetry = item.telemetry && item.telemetry.length > 0;
                  const scoreColorClass = percent >= 80 ? 'bg-emerald-400 text-black' : percent >= 50 ? 'bg-brand text-black' : 'bg-rose-500 text-white';

                  return (
                    <div
                      key={item.id || item.timestamp}
                      className="bg-black border-2 border-slate-700 p-3.5 d-flex flex-column gap-2 text-white"
                    >
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <div className="font-headline font-black text-xl uppercase text-white">
                            {item.subject || 'General Sprint'}
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-0.5 font-mono text-xs text-slate-400 font-bold">
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span>{item.totalQuestions || 0} QUESTIONS</span>
                          </div>
                        </div>
                        <div className={`font-headline font-black text-lg px-3 py-1 border border-black ${scoreColorClass}`}>
                          {item.score}/{item.totalQuestions} ({percent}%)
                        </div>
                      </div>

                      {hasTelemetry && (
                        <div className="pt-2 border-t border-slate-800">
                          <span className="font-mono text-[10px] font-bold text-brand uppercase d-block mb-1">
                            ⏱ PER-QUESTION TELEMETRY:
                          </span>
                          <div className="d-flex flex-wrap gap-1.5">
                            {item.telemetry.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className={`px-2 py-0.5 font-mono text-[11px] font-bold border ${t.isCorrect ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-rose-950 text-rose-300 border-rose-600'}`}
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
          <div className="bg-slate-900 border-2 border-brand/50 p-4 h-100 text-white shadow-hard-sm">
            <div className="d-flex align-items-center gap-2 mb-3 border-b-2 border-brand/40 pb-2">
              <BarChart2 size={22} className="text-brand" />
              <h2 className="font-headline text-2xl font-black uppercase italic m-0 text-white">SUBJECT MASTERY_</h2>
            </div>

            {Object.keys(subjectStats).length === 0 ? (
              <div className="text-center py-5">
                <BookOpen size={36} className="text-slate-500 mb-2 mx-auto" />
                <p className="font-headline text-lg font-bold text-white mb-1">NO SUBJECT DATA YET</p>
                <p className="text-xs font-bold text-slate-300 font-mono">Complete quizzes to see subject mastery stats.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 font-mono">
                {Object.entries(subjectStats).map(([sub, stat]) => {
                  const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const barBg = accuracy >= 75 ? '#10B981' : accuracy >= 50 ? '#FBBF24' : '#F43F5E';
                  return (
                    <div key={sub} className="bg-black p-3 border border-slate-700">
                      <div className="d-flex align-items-center justify-content-between mb-1 text-xs">
                        <span className="font-bold text-white uppercase">{sub}</span>
                        <span className="font-headline font-black text-sm" style={{ color: barBg }}>{accuracy}% ({stat.correct}/{stat.total})</span>
                      </div>
                      <div className="w-100 border border-slate-700 bg-slate-900" style={{ height: '10px' }}>
                        <div style={{ width: `${accuracy}%`, height: '100%', background: barBg, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800">
              <Link to="/" className="bg-brand text-black border-2 border-black p-3 font-headline font-black text-xs uppercase text-decoration-none d-flex align-items-center justify-content-between hover:bg-white">
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
