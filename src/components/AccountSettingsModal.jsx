import React, { useState } from 'react';
import { X, User, Shield, Lock, Eye, Check, Upload, Sparkles, FolderCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { getLocalGamificationData, saveGamificationData } from '../services/gamificationService';

export default function AccountSettingsModal({ isOpen, onClose, onUpdated }) {
  const { user } = useAuth();
  const gamification = getLocalGamificationData();

  const [privacyMode, setPrivacyMode] = useState(gamification.privacyMode || 'public');
  const [avatarUrl, setAvatarUrl] = useState(gamification.customAvatarUrl || user?.photoURL || '');
  const [savedNotice, setSavedNotice] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = {
      ...gamification,
      privacyMode,
      customAvatarUrl: avatarUrl,
    };
    saveGamificationData(updated);
    if (onUpdated) onUpdated(updated);
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
        className="glass-card-cosmic p-4 p-md-5 position-relative w-100 overflow-hidden"
        style={{ maxWidth: '580px', borderRadius: '0px', border: '1px solid rgba(0, 240, 255, 0.4)' }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="d-flex align-items-center gap-2">
            <User size={22} className="text-cyan-400" />
            <h2 className="text-h3 font-extrabold text-white m-0">Account & Privacy Settings</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost p-1 text-white border-0 bg-transparent">
            <X size={20} />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="mb-4">
          <label className="font-bold text-white mb-2 d-block" style={{ fontSize: '0.88rem' }}>Profile Picture</label>
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
              style={{
                width: '64px', height: '64px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                border: '2px solid #00F0FF',
                borderRadius: '0px'
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-100 h-100 object-fit-cover" />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>

            <div className="d-flex flex-column gap-2">
              <label 
                className="btn btn-cosmic-outline px-3 py-1.5 font-bold cursor-pointer m-0 d-inline-flex align-items-center gap-1.5"
                style={{ fontSize: '0.8rem', borderRadius: '0px' }}
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
            <span className="font-semibold text-muted d-block mb-2" style={{ fontSize: '0.76rem' }}>Or select a avatar preset:</span>
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
                    border: avatarUrl === url ? '2px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'var(--surface-3)',
                    borderRadius: '0px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Toggle Section */}
        <div className="mb-4">
          <label className="font-bold text-white mb-2 d-block" style={{ fontSize: '0.88rem' }}>Profile Privacy Mode</label>
          <div className="row g-2">
            <div className="col-6">
              <div 
                onClick={() => setPrivacyMode('public')}
                className="p-3 cursor-pointer text-center transition-all"
                style={{
                  background: privacyMode === 'public' ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-3)',
                  border: privacyMode === 'public' ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0px'
                }}
              >
                <Eye size={20} className={privacyMode === 'public' ? 'text-success' : 'text-muted'} />
                <div className="font-bold text-white mt-1" style={{ fontSize: '0.84rem' }}>Public</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Visible to friends & leaderboard</div>
              </div>
            </div>

            <div className="col-6">
              <div 
                onClick={() => setPrivacyMode('private')}
                className="p-3 cursor-pointer text-center transition-all"
                style={{
                  background: privacyMode === 'private' ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-3)',
                  border: privacyMode === 'private' ? '1px solid #F87171' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0px'
                }}
              >
                <Lock size={20} className={privacyMode === 'private' ? 'text-danger' : 'text-muted'} />
                <div className="font-bold text-white mt-1" style={{ fontSize: '0.84rem' }}>Private</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Only visible on your device</div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Drive Multi-File Structure Info */}
        <div className="p-3 mb-4" style={{ background: '#090D16', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '0px' }}>
          <div className="d-flex align-items-center gap-1.5 mb-1 font-bold text-white" style={{ fontSize: '0.8rem' }}>
            <FolderCheck size={16} className="text-cyan-400" />
            Google Drive Allocated File Architecture
          </div>
          <div className="font-mono text-cyan-300" style={{ fontSize: '0.73rem', lineHeight: '1.5' }}>
            <div>📄 /MarkSprint/record_book.json (Master XP & Streaks)</div>
            <div>📁 /MarkSprint/subjects/ (Subject-specific telemetry logs)</div>
          </div>
        </div>

        {savedNotice && (
          <div className="p-2.5 mb-3 text-center font-bold text-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0px', fontSize: '0.82rem' }}>
            <Check size={16} className="me-1" /> {savedNotice}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-end gap-2">
          <button onClick={onClose} className="btn btn-cosmic-outline px-4 py-2 font-semibold" style={{ borderRadius: '0px' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-cosmic-primary px-4 py-2 font-bold d-flex align-items-center gap-2" style={{ borderRadius: '0px' }}>
            <Sparkles size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
