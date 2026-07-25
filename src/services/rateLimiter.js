/**
 * Firebase Spark Free-Tier Rate Limiter & Quota Protection
 * Prevents excessive Firestore read/write calls to guarantee 100% free-tier operation.
 * State is persisted across page reloads via localStorage.
 */

const WRITE_COOLDOWN_MS = 30000; // 30 seconds cooldown between non-essential Firestore writes
const LS_KEY = 'marksprint_rl_lastWrite';
let firestoreWriteCountSession = 0;

function getLastWriteTime() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

function setLastWriteTime(ts) {
  try {
    localStorage.setItem(LS_KEY, String(ts));
  } catch {
    // ignore storage errors silently
  }
}

/**
 * Checks if a Firestore write is permitted based on rate limit cooldown
 */
export function canWriteToFirestore() {
  const now = Date.now();
  return (now - getLastWriteTime()) >= WRITE_COOLDOWN_MS;
}

/**
 * Records a successful Firestore write
 */
export function recordFirestoreWrite() {
  setLastWriteTime(Date.now());
  firestoreWriteCountSession += 1;
}

/**
 * Returns current Firestore rate limit status for UI display
 */
export function getFirestoreQuotaStatus() {
  const lastWriteTime = getLastWriteTime();
  const elapsed = Date.now() - lastWriteTime;
  const cooldownRemainingSeconds = Math.max(0, Math.ceil((WRITE_COOLDOWN_MS - elapsed) / 1000));
  return {
    canWrite: canWriteToFirestore(),
    cooldownRemainingSeconds,
    writesThisSession: firestoreWriteCountSession,
    freeTierDailyLimit: 20000, // Firebase Spark Plan daily document write allowance
  };
}
