import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Loader, AlertCircle, Eye, EyeOff, ChevronLeft, User, Check } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function LoginPage({ initialMode: defaultMode }) {
  const location = useLocation();
  const initialMode = defaultMode || (location.pathname === '/signup' ? 'signup' : 'login');
  
  const [authMode, setAuthMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, loginAsGuest } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await signIn(cleanEmail, cleanPassword);
      navigate('/');
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    const cleanName = displayName.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (cleanPassword !== confirmPassword.trim()) {
      setError('Passwords do not match.');
      return;
    }

    const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordPolicyRegex.test(cleanPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, number, and special character.');
      return;
    }

    try {
      setLoading(true);
      await signUp(cleanEmail, cleanPassword, cleanName);
      navigate('/');
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden font-mono">
      
      {/* Main Neo-Brutalism Card */}
      <div 
        className="bg-white border-brutal p-4 p-sm-5 text-black shadow-hard position-relative z-3 w-100" 
        style={{ maxWidth: '480px' }}
      >
        {/* Navigation & MarkSprint Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 border-b-2 border-black pb-3">
          <button 
            onClick={() => navigate('/')} 
            className="bg-black text-brand border-2 border-black p-2 font-bold hover:bg-brand hover:text-black transition-all"
            title="Go to Home"
            aria-label="Go to Home"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <h2 className="font-headline text-3xl font-black uppercase italic leading-none m-0 text-black">
              IDENTIFY_
            </h2>
            <span className="font-bold text-xs bg-brand text-black px-2 py-0.5 border border-black inline-block mt-1 uppercase">
              ACCESS REQUIRED
            </span>
          </div>

          <div style={{ width: '38px' }} />
        </div>

        {/* Dual Mode Tab Switcher */}
        <div className="d-flex border-2 border-black p-1 mb-4 bg-black">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            className="btn flex-grow-1 py-2 font-headline text-lg font-black uppercase transition-all"
            style={{
              background: authMode === 'login' ? '#FBBF24' : 'transparent',
              color: authMode === 'login' ? '#000000' : '#FFFFFF'
            }}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); }}
            className="btn flex-grow-1 py-2 font-headline text-lg font-black uppercase transition-all"
            style={{
              background: authMode === 'signup' ? '#FBBF24' : 'transparent',
              color: authMode === 'signup' ? '#000000' : '#FFFFFF'
            }}
          >
            ENLIST (SIGN UP)
          </button>
        </div>

        {error && (
          <div 
            className="p-3 mb-4 d-flex align-items-center gap-2 bg-rose-100 border-2 border-rose-500 text-rose-900 font-bold text-xs" 
            role="alert"
          >
            <AlertCircle size={18} className="flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleSignIn} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1">
              <label className="font-headline text-xs font-black uppercase text-black">EMAIL_ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ID@EXAMPLE.COM"
                className="w-100 bg-white border-2 border-black p-3 font-bold text-black text-sm outline-none focus:bg-brand transition-colors"
                required
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <label className="font-headline text-xs font-black uppercase text-black">PASSPHRASE</label>
              <div className="position-relative d-flex align-items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-100 bg-white border-2 border-black p-3 font-bold text-black text-sm outline-none focus:bg-brand transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute p-2 border-0 bg-transparent text-black"
                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-100 bg-black text-white border-2 border-black p-4 font-headline text-2xl font-black uppercase hover:bg-brand hover:text-black transition-all shadow-hard-sm mt-2"
            >
              {loading ? <Loader size={20} className="animate-spin d-inline" /> : 'EXECUTE SIGN_IN'}
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1">
              <label className="font-headline text-xs font-black uppercase text-black">FULL_NAME</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="OPERATIVE NAME"
                className="w-100 bg-white border-2 border-black p-3 font-bold text-black text-sm outline-none focus:bg-brand transition-colors"
                required
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <label className="font-headline text-xs font-black uppercase text-black">EMAIL_ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ID@EXAMPLE.COM"
                className="w-100 bg-white border-2 border-black p-3 font-bold text-black text-sm outline-none focus:bg-brand transition-colors"
                required
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <label className="font-headline text-xs font-black uppercase text-black">PASSPHRASE</label>
              <div className="position-relative d-flex align-items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-100 bg-white border-2 border-black p-3 font-bold text-black text-sm outline-none focus:bg-brand transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute p-2 border-0 bg-transparent text-black"
                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-1">
              <label className="font-headline text-xs font-black uppercase text-black">CONFIRM PASSPHRASE</label>
              <div className="position-relative d-flex align-items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-100 bg-white border-2 border-black p-3 font-bold text-black text-sm outline-none focus:bg-brand transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="position-absolute p-2 border-0 bg-transparent text-black"
                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div 
              className="d-flex align-items-center gap-2 my-1 cursor-pointer"
              onClick={() => setAgreeTerms(!agreeTerms)}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setAgreeTerms(!agreeTerms); }}
              role="checkbox"
              aria-checked={agreeTerms}
              tabIndex={0}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div 
                className="d-flex align-items-center justify-content-center transition-all flex-shrink-0"
                style={{
                  width: '18px',
                  height: '18px',
                  border: agreeTerms ? '1px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.25)',
                  background: agreeTerms ? '#06B6D4' : 'rgba(15, 23, 42, 0.6)',
                  color: agreeTerms ? '#0B0E1F' : 'transparent',
                  borderRadius: '5px'
                }}
              >
                <Check size={14} strokeWidth={3} />
              </div>
              <span style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                I agree to the <a href="#" onClick={(e) => e.stopPropagation()} className="text-decoration-none font-semibold" style={{ color: '#38BDF8' }}>Terms and Conditions</a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-100 bg-brand text-black border-2 border-black p-4 font-headline text-2xl font-black uppercase hover:bg-black hover:text-brand transition-all shadow-hard-sm mt-2"
            >
              {loading ? <Loader size={20} className="animate-spin d-inline" /> : 'CREATE RECRUIT ACCOUNT'}
            </button>
          </form>
        )}

        <div className="my-4 d-flex align-items-center gap-3">
          <hr className="flex-grow-1 m-0 border-black border-2" />
          <span className="font-mono text-xs font-bold text-black uppercase">OR CONTINUE WITH</span>
          <hr className="flex-grow-1 m-0 border-black border-2" />
        </div>

        <div className="d-flex flex-column gap-2.5">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-100 bg-white text-black border-2 border-black p-3 font-headline text-lg font-black uppercase hover:bg-brand transition-all d-flex align-items-center justify-content-center gap-3 shadow-hard-sm"
          >
            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            GOOGLE AUTH_
          </button>

          <button
            type="button"
            onClick={() => {
              loginAsGuest();
              navigate('/');
            }}
            className="w-100 bg-black text-brand border-2 border-black p-3 font-headline text-lg font-black uppercase hover:bg-white hover:text-black transition-all shadow-hard-sm"
          >
            CONTINUE WITHOUT ACCOUNT →
          </button>
        </div>
      </div>
    </div>
  );
}


