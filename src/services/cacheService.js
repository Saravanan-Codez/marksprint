/**
 * MarkSprint Cache Service
 * Multi-layer TTL cache: memory (fastest) + localStorage (persists across reloads).
 * All keys are namespaced to 'ms_cache_v1:'.
 */

const NAMESPACE = 'ms_cache_v1:';
const memoryStore = new Map(); // L1: in-process memory

/**
 * Serialises a value to localStorage with a TTL timestamp.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlMs  Milliseconds until the entry expires. 0 = never.
 */
export function cacheSet(key, value, ttlMs = 0) {
  const entry = { value, expiry: ttlMs > 0 ? Date.now() + ttlMs : 0 };
  memoryStore.set(key, entry);
  try {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(entry));
  } catch {
    // localStorage quota exceeded — memory cache still works
  }
}

/**
 * Retrieves a cached value. Returns `undefined` on cache miss or expiry.
 * @param {string} key
 * @returns {* | undefined}
 */
export function cacheGet(key) {
  // L1: check memory first (fastest path)
  if (memoryStore.has(key)) {
    const entry = memoryStore.get(key);
    if (!entry.expiry || entry.expiry > Date.now()) return entry.value;
    memoryStore.delete(key);
  }

  // L2: check localStorage
  try {
    const raw = localStorage.getItem(NAMESPACE + key);
    if (!raw) return undefined;
    const entry = JSON.parse(raw);
    if (!entry.expiry || entry.expiry > Date.now()) {
      memoryStore.set(key, entry); // warm L1
      return entry.value;
    }
    localStorage.removeItem(NAMESPACE + key);
  } catch {
    // Corrupt entry — ignore
  }
  return undefined;
}

/**
 * Invalidates a single cache entry.
 */
export function cacheInvalidate(key) {
  memoryStore.delete(key);
  try { localStorage.removeItem(NAMESPACE + key); } catch { /* ignore */ }
}

/**
 * Clears all MarkSprint cache entries from localStorage.
 */
export function cacheClearAll() {
  memoryStore.clear();
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NAMESPACE))
      .forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

/**
 * Returns cached value if fresh, otherwise calls `fetcher()`, caches the result, and returns it.
 * @param {string} key
 * @param {() => Promise<*>} fetcher
 * @param {number} ttlMs
 */
export async function cacheGetOrFetch(key, fetcher, ttlMs = 300_000) {
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  const fresh = await fetcher();
  cacheSet(key, fresh, ttlMs);
  return fresh;
}

// Common TTL constants
export const TTL = {
  QUIZ_CSV:       15 * 60 * 1000,  // 15 min — CSV data is static per session
  TEST_HISTORY:    2 * 60 * 1000,  //  2 min — results may sync from Drive
  GAMIFICATION:   10 * 60 * 1000,  // 10 min
  DRIVE_SYNC:      5 * 60 * 1000,  //  5 min
};
