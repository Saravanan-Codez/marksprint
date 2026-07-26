import React, { useState } from 'react';
import { X, User, Shield, Lock, Eye, Check, Upload, Sparkles, FolderCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { getLocalGamificationData, saveGamificationData } from '../services/gamificationService';

export default function AccountSettingsModal({ isOpen, onClose, onUpdated }) {
  const { user, userProfile, updateProfileData } = useAuth();
  const gamification = getLocalGamificationData();

  const [privacyMode, setPrivacyMode] = useState(gamification.privacyMode || 'public');
  const [avatarUrl, setAvatarUrl] = useState(gamification.customAvatarUrl || user?.photoURL || '');
  const [board, setBoard] = useState(userProfile?.board || 'tn_state');
  const [standard, setStandard] = useState(userProfile?.standard || '12');
  const [savedNotice, setSavedNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const updated = {
      ...gamification,
      privacyMode,
      customAvatarUrl: avatarUrl,
      board,
      standard,
      setupCompleted: true,
    };
    saveGamificationData(updated);
    
    if (updateProfileData) {
      try {
        await updateProfileData({ board, standard, setupCompleted: true });
      } catch (e) {
        console.error("Failed to update profile", e);
      }
    }

    try {
      const token = sessionStorage.getItem('marksprint_gdrive_token');
      if (token) {
        const { saveRecordBookToDrive } = await import('../services/driveOrganizerService');
        await saveRecordBookToDrive(token, updated);
      }
    } catch (dErr) {
      console.warn('Drive save notice from modal:', dErr);
    }
    
    if (onUpdated) onUpdated(updated);
    setIsSaving(false);
    setSavedNotice('Settings & Profile saved successfully!');
    setTimeout(() => {
      setSavedNotice('');
      onClose();
    }, 1200);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const presetAvatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Falkon1',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Falkon2',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Falkon3',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Falkon4',
  ];

  return (
    <div 
      className="position-fixed inset-0 z-50 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(5, 7, 14, 0.85)', backdropFilter: 'blur(8px)', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="neo-brutal-card p-4 p-md-5 position-relative w-100 overflow-hidden shadow-hard"
        style={{ maxWidth: '580px' }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4 border-b-brutal pb-4">
          <div className="d-flex align-items-center gap-2">
            <User size={22} className="text-brand" />
            <h2 className="font-headline font-black text-2xl uppercase m-0" style={{ color: 'var(--text-main)' }}>Account & Privacy Settings</h2>
          </div>
          <button onClick={onClose} className="btn p-1 border-brutal shadow-hard-sm" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="mb-4 py-4 border-b-brutal">
          <label className="font-bold mb-2 d-block" style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Profile Picture</label>
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0 border-brutal shadow-hard-sm"
              style={{
                width: '64px', height: '64px',
                background: 'var(--bg-main)',
                color: 'var(--text-main)'
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-100 h-100 object-fit-cover" />
              ) : (
                <User size={32} />
              )}
            </div>

            <div className="d-flex flex-column gap-2">
              <label 
                className="btn btn-outline px-3 py-1.5 font-bold cursor-pointer m-0 d-inline-flex align-items-center gap-1.5"
                style={{ fontSize: '0.8rem' }}
              >
                <Upload size={14} /> Upload Image
                <input type="file" accept="image/*" className="d-none" onChange={handleAvatarUpload} />
              </label>

              {user?.photoURL && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl(user.photoURL)}
                  className="btn btn-link p-0 text-start text-decoration-none font-semibold"
                  style={{ color: '#38BDF8', fontSize: '0.78rem' }}
                >
                  Use Google Account Photo
                </button>
              )}
            </div>
          </div>

          {/* Preset Avatars */}
          <div className="mt-3">
            <span className="font-semibold d-block mb-2" style={{ fontSize: '0.76rem', color: 'var(--text-main)' }}>Or select a avatar preset:</span>
            <div className="d-flex align-items-center gap-2">
              {presetAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i}`}
                  onClick={() => setAvatarUrl(url)}
                  className="cursor-pointer p-1 transition-all"
                  style={{
                    width: '38px', height: '38px',
                    border: avatarUrl === url ? '2px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'var(--surface-3)',
                    borderRadius: '50%'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Academic Settings Section */}
        <div className="mb-4 py-4 border-b-brutal">
          <label className="font-bold d-block mb-3" style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Academic Profile</label>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="font-mono text-xs font-bold mb-1 uppercase" style={{ color: 'var(--text-muted)' }}>Board</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="form-control border-brutal shadow-hard-sm font-mono font-bold text-sm"
                style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }}
              >
                <option value="tn_state">Tamil Nadu State</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="font-mono text-xs font-bold mb-1 uppercase" style={{ color: 'var(--text-muted)' }}>Standard</label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="form-control border-brutal shadow-hard-sm font-mono font-bold text-sm"
                style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }}
              >
                <option value="12">12th Standard</option>
                <option value="11">11th Standard</option>
                <option value="10">10th Standard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Toggle Section */}
        <div className="mb-4 py-4 border-b-brutal">
          <label className="font-bold d-block mb-3" style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Profile Privacy Mode</label>
          <div className="row g-2">
            <div className="col-6">
              <div 
                onClick={() => setPrivacyMode('public')}
                className="p-3 cursor-pointer text-center transition-all border-brutal"
                style={{
                  background: privacyMode === 'public' ? 'var(--brand)' : 'var(--bg-main)',
                  color: privacyMode === 'public' ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                <Eye size={20} />
                <div className="font-headline font-black uppercase mt-2">PUBLIC</div>
                <div className="font-mono mt-1" style={{ fontSize: '10px' }}>VISIBLE TO LEADERBOARD</div>
              </div>
            </div>

            <div className="col-6">
              <div 
                onClick={() => setPrivacyMode('private')}
                className="p-3 cursor-pointer text-center transition-all border-brutal"
                style={{
                  background: privacyMode === 'private' ? 'var(--danger)' : 'var(--bg-main)',
                  color: privacyMode === 'private' ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                <Lock size={20} />
                <div className="font-headline font-black uppercase mt-2">PRIVATE</div>
                <div className="font-mono mt-1" style={{ fontSize: '10px' }}>ONLY VISIBLE TO YOU</div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Drive Multi-File Structure Info */}
        <div className="p-3 mb-4 border-brutal" style={{ background: 'var(--bg-main)' }}>
          <div className="d-flex align-items-center gap-1.5 mb-2 font-bold font-mono text-xs uppercase" style={{ color: 'var(--text-main)' }}>
            <FolderCheck size={16} className="text-brand" />
            DRIVE FILE ARCHITECTURE
          </div>
          <div className="font-mono font-bold" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            <div className="mb-1">📄 /MARKSPRINT/RECORD_BOOK.JSON</div>
            <div>📁 /MARKSPRINT/SUBJECTS/</div>
          </div>
        </div>

        {savedNotice && (
          <div className="p-2 mb-3 text-center font-bold font-mono text-xs uppercase border-brutal" style={{ background: 'var(--success)', color: '#000000' }}>
            <Check size={16} className="me-1 d-inline" /> {savedNotice}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-end gap-2">
          <button onClick={onClose} className="btn btn-outline px-4 py-2 font-semibold">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary px-4 py-2 font-bold d-flex align-items-center gap-2">
            <Sparkles size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
