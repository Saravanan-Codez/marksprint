/**
 * MarkSprint Gamification & League Engine (Falkon Labs)
 * Weekly Sprint League, Divisions, Flame Streaks, Streak Protection & Firestore Sync
 */

import { loadFirestore } from '../config/firebase.js';

const GAMIFICATION_KEY = 'marksprint_gamification_v2';

export const LEAGUE_DIVISIONS = [
  { id: 'bronze',   name: 'Bronze League',   icon: '🥉', minXp: 0,    color: '#CD7F32', bg: 'rgba(205, 127, 50, 0.15)', border: 'rgba(205, 127, 50, 0.35)' },
  { id: 'silver',   name: 'Silver League',   icon: '🥈', minXp: 250,  color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.35)' },
  { id: 'gold',     name: 'Gold League',     icon: '🥇', minXp: 650,  color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' },
  { id: 'sapphire', name: 'Sapphire League', icon: '💎', minXp: 1200, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.35)' },
  { id: 'diamond',  name: 'Diamond League',  icon: '👑', minXp: 2000, color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)' },
];

export function getDivisionInfo(totalXp = 0) {
  let division = LEAGUE_DIVISIONS[0];
  for (let i = LEAGUE_DIVISIONS.length - 1; i >= 0; i--) {
    if (totalXp >= LEAGUE_DIVISIONS[i].minXp) {
      division = LEAGUE_DIVISIONS[i];
      break;
    }
  }
  return division;
}

export function getInitialQuests(dateStr) {
  return {
    date: dateStr,
    list: [
      { id: 'q1', title: 'Daily Warmup', desc: 'Complete 1 quiz sprint', target: 1, current: 0, reward: 30, completed: false, claimed: false, icon: '⚡' },
      { id: 'q2', title: 'Precision Master', desc: 'Achieve 80%+ accuracy on any sprint', target: 1, current: 0, reward: 50, completed: false, claimed: false, icon: '🎯' },
      { id: 'q3', title: 'XP Crusher', desc: 'Earn 100 XP in a single day', target: 100, current: 0, reward: 70, completed: false, claimed: false, icon: '🔥' }
    ]
  };
}

export function getLocalGamificationData() {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultData = {
    xp: 0,
    streakDays: 1,
    lastStreakDate: todayStr,
    streakShieldActive: true,
    privacyMode: 'public',
    customAvatarUrl: '',
    setupCompleted: false,
    board: 'tn_state',
    standard: '12',
    dailyQuests: getInitialQuests(todayStr),
    friends: [
      { id: 'f1', name: 'Sree Hari Sk', xp: 1450, streak: 12, isLead: true, division: 'Sapphire League', avatar: '' },
      { id: 'f2', name: 'S. Saravanan', xp: 1320, streak: 9, isCoLead: true, division: 'Sapphire League', avatar: '' }
    ]
  };

  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    
    // Ensure dailyQuests are up to date for today
    if (!parsed.dailyQuests || parsed.dailyQuests.date !== todayStr) {
      parsed.dailyQuests = getInitialQuests(todayStr);
    }
    return { ...defaultData, ...parsed };
  } catch {
    return defaultData;
  }
}

export function saveGamificationData(data) {
  try {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save gamification data:', e);
  }
}

export function calculateXpForQuiz(correctCount, totalQuestions, perQuestionTelemetry = []) {
  let xp = correctCount * 10;

  // Perfect Score Bonus
  if (totalQuestions >= 5 && correctCount === totalQuestions) {
    xp += 50;
  }

  // Speed bonus for questions answered under 10 seconds
  let fastCount = 0;
  perQuestionTelemetry.forEach(t => {
    if (t.isCorrect && t.secondsSpent < 10) {
      fastCount += 1;
    }
  });
  xp += fastCount * 5;

  return xp;
}

export function getLevelInfo(totalXp) {
  const level = Math.floor(Math.sqrt(totalXp / 40)) + 1;
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 40;
  const nextLevelXp = Math.pow(level, 2) * 40;
  const progressInLevel = totalXp - currentLevelBaseXp;
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const percent = Math.min(100, Math.round((progressInLevel / (xpNeededForLevel || 1)) * 100));

  return {
    level,
    currentLevelBaseXp,
    nextLevelXp,
    progressInLevel,
    xpNeededForLevel,
    percent
  };
}

export function calculateStreakUpdate(lastDateStr, currentStreak, streakShieldActive = false) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!lastDateStr) return { streak: 1, lastDate: todayStr, shieldUsed: false };

  if (lastDateStr === todayStr) {
    return { streak: currentStreak || 1, lastDate: todayStr, shieldUsed: false };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDateStr === yesterdayStr) {
    return { streak: (currentStreak || 1) + 1, lastDate: todayStr, shieldUsed: false };
  }

  // Gap > 1 day: check if streak shield is active
  if (streakShieldActive) {
    return { streak: currentStreak || 1, lastDate: todayStr, shieldUsed: true };
  }

  return { streak: 1, lastDate: todayStr, shieldUsed: false };
}

export function updateQuestsOnSprintComplete(data, quizScore, totalQuestions, xpEarned) {
  const todayStr = new Date().toISOString().split('T')[0];
  const questsObj = (data.dailyQuests && data.dailyQuests.date === todayStr) 
    ? data.dailyQuests 
    : getInitialQuests(todayStr);

  const accuracyPercent = totalQuestions > 0 ? Math.round((quizScore / totalQuestions) * 100) : 0;

  const updatedList = questsObj.list.map(q => {
    let newCurrent = q.current;
    if (q.id === 'q1') {
      newCurrent = Math.min(q.target, q.current + 1);
    } else if (q.id === 'q2' && accuracyPercent >= 80) {
      newCurrent = Math.min(q.target, q.current + 1);
    } else if (q.id === 'q3') {
      newCurrent = Math.min(q.target, q.current + xpEarned);
    }
    const isCompleted = newCurrent >= q.target;
    return {
      ...q,
      current: newCurrent,
      completed: isCompleted
    };
  });

  return {
    ...data,
    dailyQuests: {
      date: todayStr,
      list: updatedList
    }
  };
}

export async function syncGamificationToFirestore(user, gamificationData) {
  if (!user || !user.uid) return;
  try {
    const db = await loadFirestore();
    if (!db) return;
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    const division = getDivisionInfo(gamificationData.xp || 0);

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      xp: gamificationData.xp || 0,
      streakDays: gamificationData.streakDays || 1,
      lastStreakDate: gamificationData.lastStreakDate || new Date().toISOString().split('T')[0],
      division: division.name,
      privacyMode: gamificationData.privacyMode || 'public',
      displayName: user.displayName || 'Student',
      email: user.email || '',
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Also update global leaderboard document
    if (gamificationData.privacyMode !== 'private') {
      const lbRef = doc(db, 'leaderboard', user.uid);
      await setDoc(lbRef, {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Student',
        email: user.email || '',
        xp: gamificationData.xp || 0,
        streak: gamificationData.streakDays || 1,
        division: division.name,
        avatar: gamificationData.customAvatarUrl || user.photoURL || '',
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore gamification sync notice:', err);
  }
}

export async function fetchFirestoreLeaderboard() {
  try {
    const db = await loadFirestore();
    if (!db) return null;
    const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');

    const lbRef = collection(db, 'leaderboard');
    const q = query(lbRef, orderBy('xp', 'desc'), limit(20));
    const snapshot = await getDocs(q);

    const list = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (err) {
    console.warn('Leaderboard fetch warning:', err);
    return null;
  }
}
