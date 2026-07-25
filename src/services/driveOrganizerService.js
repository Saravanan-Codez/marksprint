/**
 * Multi-File Google Drive Record Book & Telemetry Storage Engine
 * Manages /MarkSprint/ directory structure:
 * - /MarkSprint/record_book.json (Master ledger, XP, streak, privacy settings, friends)
 * - /MarkSprint/subjects/{subject}_details.json (Deep question-by-question telemetry)
 * - /MarkSprint/avatars/profile_picture.png (Custom user avatar)
 */

import { getOrCreateMarkSprintFolder } from './googleDriveService';

const FOLDER_NAME = 'MarkSprint';
const SUBJECTS_SUBFOLDER = 'subjects';

/**
 * Ensures a subfolder exists inside /MarkSprint/
 */
export async function getOrCreateSubfolder(accessToken, parentFolderId, subfolderName) {
  if (!accessToken || !parentFolderId) return null;

  try {
    const query = `mimeType='application/vnd.google-apps.folder' and name='${subfolderName}' and '${parentFolderId}' in parents and trashed=false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files[0]) {
      return searchData.files[0].id;
    }

    // Create subfolder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: subfolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      }),
    });

    if (!createRes.ok) return null;
    const newSubfolder = await createRes.json();
    return newSubfolder.id;
  } catch (err) {
    console.warn(`Error resolving subfolder ${subfolderName}:`, err);
    return null;
  }
}

/**
 * Saves or updates /MarkSprint/record_book.json
 */
export async function saveRecordBookToDrive(accessToken, recordBookData) {
  if (!accessToken) return null;

  try {
    const rootFolderId = await getOrCreateMarkSprintFolder(accessToken);
    const fileName = 'record_book.json';
    const content = JSON.stringify(recordBookData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });

    const query = `name='${fileName}' and '${rootFolderId}' in parents and trashed=false`;
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files[0];

    if (existingFile) {
      // Update
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: blob,
      });
      return existingFile.id;
    } else {
      // Create
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: [rootFolderId],
      };
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', blob);

      const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const newFile = await createRes.json();
      return newFile.id;
    }
  } catch (err) {
    console.warn('Failed to save record_book.json to Drive:', err);
    return null;
  }
}

/**
 * Loads /MarkSprint/record_book.json from Drive
 */
export async function loadRecordBookFromDrive(accessToken) {
  if (!accessToken) return null;

  try {
    const rootFolderId = await getOrCreateMarkSprintFolder(accessToken);
    const query = `name='record_book.json' and '${rootFolderId}' in parents and trashed=false`;
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const file = searchData.files && searchData.files[0];
    if (!file) return null;

    const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!downloadRes.ok) return null;
    return await downloadRes.json();
  } catch (err) {
    console.warn('Failed to load record_book.json from Drive:', err);
    return null;
  }
}

/**
 * Saves granular telemetry for a specific subject inside /MarkSprint/subjects/{subject}_details.json
 */
export async function saveSubjectTelemetryToDrive(accessToken, subjectName, telemetryData) {
  if (!accessToken || !subjectName) return null;

  try {
    const rootFolderId = await getOrCreateMarkSprintFolder(accessToken);
    const subjectsFolderId = await getOrCreateSubfolder(accessToken, rootFolderId, SUBJECTS_SUBFOLDER);
    if (!subjectsFolderId) return null;

    const safeSubjectKey = subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const fileName = `${safeSubjectKey}_details.json`;
    const content = JSON.stringify({
      subject: subjectName,
      lastUpdated: new Date().toISOString(),
      telemetry: telemetryData,
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const query = `name='${fileName}' and '${subjectsFolderId}' in parents and trashed=false`;
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files[0];

    if (existingFile) {
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: blob,
      });
      return existingFile.id;
    } else {
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: [subjectsFolderId],
      };
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', blob);

      const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const newFile = await createRes.json();
      return newFile.id;
    }
  } catch (err) {
    console.warn(`Failed to save telemetry for ${subjectName}:`, err);
    return null;
  }
}
