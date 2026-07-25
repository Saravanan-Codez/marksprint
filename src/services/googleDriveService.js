/**
 * Google Drive Zero-Database Storage Engine for MarkSprint (Falkon Labs)
 * Stores structured student assessment records inside a dedicated 'MarkSprint' folder on Google Drive.
 */

const FOLDER_NAME = 'MarkSprint';
const FILE_NAME = 'marksprint_structured_data.json';

/**
 * Searches for or creates the 'MarkSprint' folder on the user's Google Drive
 */
export async function getOrCreateMarkSprintFolder(accessToken) {
  if (!accessToken) return null;

  try {
    // 1. Search for existing MarkSprint folder
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) throw new Error('Failed to search Google Drive folders');
    const searchData = await searchRes.json();
    const existingFolder = searchData.files && searchData.files[0];

    if (existingFolder) {
      return existingFolder.id;
    }

    // 2. Create new MarkSprint folder if not found
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'MarkSprint Learning & Assessment Records - Falkon Labs',
      }),
    });

    if (!createRes.ok) throw new Error('Failed to create MarkSprint folder');
    const newFolder = await createRes.json();
    return newFolder.id;
  } catch (err) {
    console.warn('Google Drive folder resolution notice:', err.message);
    return null;
  }
}

/**
 * Uploads structured quiz results to the 'MarkSprint/' folder on Google Drive
 */
export async function syncResultsToGoogleDrive(accessToken, historyData, studentProfile = null) {
  if (!accessToken) return { success: false, reason: 'No Google OAuth token' };

  try {
    const folderId = await getOrCreateMarkSprintFolder(accessToken);
    
    // Construct structured data payload
    const totalQ = historyData.reduce((acc, h) => acc + (h.totalQuestions || 0), 0);
    const totalC = historyData.reduce((acc, h) => acc + (h.score || 0), 0);
    const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

    const structuredPayload = {
      app: 'MarkSprint by Falkon Labs',
      version: '1.0',
      schema: 'structured_student_record_v1',
      lastSynced: new Date().toISOString(),
      studentProfile: {
        displayName: studentProfile?.displayName || 'Student',
        email: studentProfile?.email || 'N/A',
      },
      summary: {
        totalSprints: historyData.length,
        totalQuestions: totalQ,
        totalCorrect: totalC,
        overallAccuracy: accuracy,
      },
      testHistory: historyData,
    };

    const fileContent = JSON.stringify(structuredPayload, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });

    // Search for existing file inside MarkSprint folder
    const query = folderId
      ? `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`
      : `name='${FILE_NAME}' and trashed=false`;

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) throw new Error('Failed to search files in Google Drive');
    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files[0];

    if (existingFile) {
      // Update existing file
      const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`;
      const updateRes = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: blob,
      });

      if (!updateRes.ok) throw new Error('Failed to update structured file in Google Drive');
      return { success: true, updated: true, fileId: existingFile.id, folderId };
    } else {
      // Create new file inside MarkSprint folder
      const metadata = {
        name: FILE_NAME,
        mimeType: 'application/json',
        parents: folderId ? [folderId] : [],
        description: 'MarkSprint Structured Assessment & Progress Log',
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', blob);

      const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      const createRes = await fetch(createUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!createRes.ok) throw new Error('Failed to create file in MarkSprint folder');
      const newFile = await createRes.json();
      return { success: true, created: true, fileId: newFile.id, folderId };
    }
  } catch (err) {
    console.warn('Google Drive structured sync notice:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Downloads and parses structured results from MarkSprint folder on Google Drive
 */
export async function loadResultsFromGoogleDrive(accessToken) {
  if (!accessToken) return null;

  try {
    const folderId = await getOrCreateMarkSprintFolder(accessToken);
    const query = folderId
      ? `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`
      : `name='${FILE_NAME}' and trashed=false`;

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files[0];

    if (!existingFile) return null;

    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`;
    const downloadRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!downloadRes.ok) return null;
    const parsed = await downloadRes.json();
    return parsed.testHistory || (Array.isArray(parsed) ? parsed : null);
  } catch (err) {
    console.warn('Failed to load structured data from Google Drive:', err.message);
    return null;
  }
}
