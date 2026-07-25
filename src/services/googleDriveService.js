/**
 * Google Drive Zero-Database Storage Service for MarkSprint
 * Saves and loads test results directly to/from the user's personal Google Drive.
 */

const DRIVE_FILE_NAME = 'marksprint_test_results.json';

/**
 * Uploads or updates quiz results JSON file on user's Google Drive
 */
export async function syncResultsToGoogleDrive(accessToken, resultsData) {
  if (!accessToken) return { success: false, reason: 'No Google OAuth token' };

  try {
    const fileContent = JSON.stringify(resultsData, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });

    // Search for existing file on Google Drive
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FILE_NAME}' and trashed=false`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) throw new Error('Failed to query Google Drive API');
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

      if (!updateRes.ok) throw new Error('Failed to update Google Drive file');
      return { success: true, updated: true, fileId: existingFile.id };
    } else {
      // Create new file on Google Drive
      const metadata = {
        name: DRIVE_FILE_NAME,
        mimeType: 'application/json',
        description: 'MarkSprint Test Results and Student Progress Backup',
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

      if (!createRes.ok) throw new Error('Failed to create file on Google Drive');
      const newFile = await createRes.json();
      return { success: true, created: true, fileId: newFile.id };
    }
  } catch (err) {
    console.warn('Google Drive sync notice:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Downloads test results from Google Drive
 */
export async function loadResultsFromGoogleDrive(accessToken) {
  if (!accessToken) return null;

  try {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FILE_NAME}' and trashed=false`;
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
    return await downloadRes.json();
  } catch (err) {
    console.warn('Failed to load from Google Drive:', err.message);
    return null;
  }
}
