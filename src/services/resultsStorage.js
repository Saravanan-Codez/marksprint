import { syncResultsToGoogleDrive, loadResultsFromGoogleDrive } from './googleDriveService';

const LOCAL_STORAGE_KEY = 'marksprint_test_history_v1';

/**
 * Gets local test history
 */
export function getLocalTestHistory() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a completed test result locally and syncs to Google Drive if OAuth token is available
 */
export async function saveTestResult(result, googleAccessToken = null, studentProfile = null) {
  const existingHistory = getLocalTestHistory();
  const updatedHistory = [
    {
      id: `result_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...result,
    },
    ...existingHistory,
  ];

  // Save to localStorage immediately (0ms latency, offline-first)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }

  // Auto-sync structured data to Google Drive inside 'MarkSprint/' folder
  if (googleAccessToken) {
    await syncResultsToGoogleDrive(googleAccessToken, updatedHistory, studentProfile).catch(() => {});
  }

  return updatedHistory;
}

/**
 * Syncs local history with Google Drive cloud backup
 */
export async function syncWithCloud(googleAccessToken, studentProfile = null) {
  if (!googleAccessToken) return getLocalTestHistory();

  const cloudData = await loadResultsFromGoogleDrive(googleAccessToken);
  const localData = getLocalTestHistory();

  if (cloudData && Array.isArray(cloudData)) {
    const combinedMap = new Map();
    [...localData, ...cloudData].forEach((item) => {
      if (item && (item.id || item.timestamp)) {
        combinedMap.set(item.id || item.timestamp, item);
      }
    });

    const merged = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    await syncResultsToGoogleDrive(googleAccessToken, merged, studentProfile).catch(() => {});
    return merged;
  } else if (localData.length > 0) {
    await syncResultsToGoogleDrive(googleAccessToken, localData, studentProfile).catch(() => {});
  }

  return localData;
}
