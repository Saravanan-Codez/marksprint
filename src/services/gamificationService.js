/**
 * MarkSprint Gamification Engine (Falkon Labs)
 * Duolingo-style XP, Flame Streaks, Levels, and Friends Leaderboard
 */

const GAMIFICATION_KEY = 'marksprint_gamification_v1';

export function getLocalGamificationData() {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    return raw ? JSON.parse(raw) : {
      xp: 0,
      streakDays: 1,
      lastStreakDate: new Date().toISOString().split('T')[0],
      privacyMode: 'public', // 'public' or 'private'
      customAvatarUrl: '',
      friends: [
        { id: 'f1', name: 'Sree Hari Sk', xp: 1450, streak: 12, isLead: true },
        { id: 'f2', name: 'S. Saravanan', xp: 1320, streak: 9, isCoLead: true }
      ]
    };
  } catch {
    return {
      xp: 0,
      streakDays: 1,
      lastStreakDate: new Date().toISOString().split('T')[0],
      privacyMode: 'public',
      customAvatarUrl: '',
      friends: []
    };
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

export function calculateStreakUpdate(lastDateStr, currentStreak) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!lastDateStr) return { streak: 1, lastDate: todayStr };

  // Use string-based comparison to avoid timezone offset issues
  if (lastDateStr === todayStr) {
    // Same day — streak unchanged
    return { streak: currentStreak || 1, lastDate: todayStr };
  }

  // Calculate yesterday's date string
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDateStr === yesterdayStr) {
    // Consecutive day — increment streak
    return { streak: (currentStreak || 1) + 1, lastDate: todayStr };
  }

  // Gap > 1 day — streak resets
  return { streak: 1, lastDate: todayStr };
}
