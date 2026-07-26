import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { getLocalGamificationData, saveGamificationData } from '../services/gamificationService';
import { saveRecordBookToDrive } from '../services/driveOrganizerService';

export default function SetupPage() {
  const { user, userProfile, updateProfileData, loading, googleAccessToken } = useAuth();
  const navigate = useNavigate();

  const [board, setBoard] = useState('tn_state');
  const [standard, setStandard] = useState('12');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [safetyTimeout, setSafetyTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSafetyTimeout(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    const isSetupDone = userProfile?.setupCompleted || (userProfile?.board && userProfile?.standard);
    if (!loading && isSetupDone) {
      navigate('/dashboard');
    }
  }, [user, userProfile, loading, navigate]);

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updates = { board, standard, setupCompleted: true };

      // 1. Update AuthContext profile & Firestore
      await updateProfileData(updates);

      // 2. Update Local Storage
      const gamification = getLocalGamificationData();
      const updatedGamification = { ...gamification, ...updates, setupCompleted: true };
      saveGamificationData(updatedGamification);

      // 3. Save master record_book.json to user's Google Drive
      const token = googleAccessToken || sessionStorage.getItem('marksprint_gdrive_token');
      if (token) {
        try {
          await saveRecordBookToDrive(token, updatedGamification);
        } catch (dErr) {
          console.warn('Drive setup save notice:', dErr);
        }
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Setup save error:', err);
      setError('Failed to save profile. Please try again.');
      setSaving(false);
    }
  };

  if (loading && !safetyTimeout) {
    return (
      <div className="min-h-screen d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ background: 'var(--bg-main)' }}>
        <Loader2 className="animate-spin text-brand mb-3" size={44} />
        <p className="font-mono text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
          INITIALIZING RECRUIT SETUP ENGINE...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center p-3" style={{ background: 'var(--bg-main)' }}>
      <div className="w-100" style={{ maxWidth: '600px' }}>
        
        <div className="text-center mb-5">
          <div className="d-inline-flex bg-brand text-white p-3 border-brutal mb-4 shadow-hard-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="font-headline text-4xl font-black uppercase m-0" style={{ color: 'var(--text-main)' }}>
            INITIALIZE AGENT
          </h1>
          <p className="font-mono text-sm font-bold mt-2 uppercase" style={{ color: 'var(--text-muted)' }}>
            CONFIGURE YOUR ACADEMIC TARGET PARAMETERS
          </p>
        </div>

        <form onSubmit={handleCompleteSetup} className="neo-brutal-card p-4 p-md-5 shadow-hard" style={{ background: 'var(--bg-card)' }}>
          {error && (
            <div className="bg-danger text-white p-3 border-brutal font-mono font-bold text-xs uppercase mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="d-block font-headline font-black text-xl mb-2 uppercase" style={{ color: 'var(--text-main)' }}>
              EDUCATION BOARD
            </label>
            <p className="font-mono text-xs font-bold mb-3 uppercase" style={{ color: 'var(--text-muted)' }}>SELECT YOUR PRIMARY GOVERNING ACADEMIC BOARD.</p>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="form-control form-control-lg border-brutal shadow-hard-sm font-mono font-bold text-sm"
              style={{ background: 'var(--bg-input)', color: 'var(--text-main)', padding: '12px 16px' }}
            >
              <option value="tn_state">Tamil Nadu State Board</option>
              <option value="cbse">CBSE</option>
              <option value="icse">ICSE</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="d-block font-headline font-black text-xl mb-2 uppercase" style={{ color: 'var(--text-main)' }}>
              STANDARD / GRADE
            </label>
            <p className="font-mono text-xs font-bold mb-3 uppercase" style={{ color: 'var(--text-muted)' }}>SELECT YOUR CURRENT GRADE LEVEL.</p>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="form-control form-control-lg border-brutal shadow-hard-sm font-mono font-bold text-sm"
              style={{ background: 'var(--bg-input)', color: 'var(--text-main)', padding: '12px 16px' }}
            >
              <option value="12">12th Standard / Class 12</option>
              <option value="11">11th Standard / Class 11</option>
              <option value="10">10th Standard / Class 10</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-100 py-3 font-headline text-xl font-black shadow-hard-sm d-flex align-items-center justify-content-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                INITIALIZING...
              </>
            ) : (
              <>
                COMPLETE SETUP <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
