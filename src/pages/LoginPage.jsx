import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Loader, AlertCircle, Eye, EyeOff, ChevronLeft, User, Check } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const location = useLocation();
  const initialMode = location.pathname === '/signup' ? 'signup' : 'login';
  
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
    <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden">
      
      {/* Cosmic background nebulae */}
      <div
        className="position-fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.18), transparent 65%), radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.15), transparent 50%)',
          zIndex: 0
        }}
      />

      {/* Main Glass Card */}
      <div 
        className="glass-card-cosmic position-relative z-3 w-100 p-4 p-sm-5" 
        style={{ maxWidth: '450px', borderRadius: '0px' }}
      >
        {/* Navigation & MarkSprint by Falkon Labs Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-cosmic-outline p-2 d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', borderRadius: '0px' }}
            title="Go to Home"
            aria-label="Go to Home"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <div className="font-extrabold text-white tracking-tight" style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
              MarkSprint
            </div>
            <div className="font-semibold text-uppercase" style={{ fontSize: '0.66rem', color: '#38BDF8', letterSpacing: '0.12em' }}>
              by Falkon Labs
            </div>
          </div>

          <div style={{ width: '38px' }} />
        </div>

        {/* Dual Mode Mode Tab Switcher */}
        <div 
          className="d-flex p-1 mb-4" 
          style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px' }}
        >
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            className="btn flex-grow-1 py-2.5 font-bold transition-all"
            style={{
              borderRadius: '0px',
              fontSize: '0.88rem',
              background: authMode === 'login' ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'transparent',
              color: authMode === 'login' ? '#FFFFFF' : '#94A3B8',
              border: authMode === 'login' ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid transparent',
              boxShadow: authMode === 'login' ? '0 0 14px rgba(0, 240, 255, 0.25)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); }}
            className="btn flex-grow-1 py-2.5 font-bold transition-all"
            style={{
              borderRadius: '0px',
              fontSize: '0.88rem',
              background: authMode === 'signup' ? 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' : 'transparent',
              color: authMode === 'signup' ? '#FFFFFF' : '#94A3B8',
              border: authMode === 'signup' ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid transparent',
              boxShadow: authMode === 'signup' ? '0 0 14px rgba(0, 240, 255, 0.25)' : 'none'
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div 
            className="p-3 mb-4 d-flex align-items-center gap-2" 
            style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#FCA5A5', borderRadius: '0px' }}
            role="alert"
          >
            <AlertCircle size={18} className="flex-shrink-0" />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleSignIn} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1.5">
              <label className="font-semibold" style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Email Address</label>
              <div className="position-relative d-flex align-items-center">
                <Mail className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-control input-cosmic input-cosmic-has-icon-left"
                  style={{ borderRadius: '0px', height: '46px' }}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-1.5">
              <label className="font-semibold" style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Password</label>
              <div className="position-relative d-flex align-items-center">
                <Lock className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control input-cosmic input-cosmic-has-icon-left input-cosmic-has-icon-right"
                  style={{ borderRadius: '0px', height: '46px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-link position-absolute p-2 border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between my-1" style={{ fontSize: '0.84rem' }}>
              {/* INSTANT ZERO-LAG CONTROLLED CHECKBOX */}
              <div 
                className="d-flex align-items-center gap-2 m-0 cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div 
                  className="d-flex align-items-center justify-content-center transition-all"
                  style={{
                    width: '18px',
                    height: '18px',
                    border: rememberMe ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.25)',
                    background: rememberMe ? '#00F0FF' : 'rgba(15, 23, 42, 0.6)',
                    color: rememberMe ? '#0B0E1F' : 'transparent',
                    borderRadius: '0px'
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
                <span style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                  Remember me
                </span>
              </div>

              <a href="#" className="text-decoration-none font-semibold" style={{ color: '#38BDF8' }}>Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-cosmic-primary w-100 font-bold mt-2 d-flex align-items-center justify-content-center"
              style={{ borderRadius: '0px', height: '46px', fontSize: '0.94rem' }}
            >
              {loading ? <Loader size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1.5">
              <label className="font-semibold" style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Full Name</label>
              <div className="position-relative d-flex align-items-center">
                <User className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} size={18} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="form-control input-cosmic input-cosmic-has-icon-left"
                  style={{ borderRadius: '0px', height: '46px' }}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-1.5">
              <label className="font-semibold" style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Email Address</label>
              <div className="position-relative d-flex align-items-center">
                <Mail className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-control input-cosmic input-cosmic-has-icon-left"
                  style={{ borderRadius: '0px', height: '46px' }}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-1.5">
              <label className="font-semibold" style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Password</label>
              <div className="position-relative d-flex align-items-center">
                <Lock className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control input-cosmic input-cosmic-has-icon-left input-cosmic-has-icon-right"
                  style={{ borderRadius: '0px', height: '46px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-link position-absolute p-2 border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-1.5">
              <label className="font-semibold" style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Confirm Password</label>
              <div className="position-relative d-flex align-items-center">
                <Lock className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control input-cosmic input-cosmic-has-icon-left input-cosmic-has-icon-right"
                  style={{ borderRadius: '0px', height: '46px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="btn btn-link position-absolute p-2 border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* INSTANT ZERO-LAG CONTROLLED TERMS CHECKBOX */}
            <div 
              className="d-flex align-items-center gap-2 my-1 cursor-pointer"
              onClick={() => setAgreeTerms(!agreeTerms)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div 
                className="d-flex align-items-center justify-content-center transition-all flex-shrink-0"
                style={{
                  width: '18px',
                  height: '18px',
                  border: agreeTerms ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.25)',
                  background: agreeTerms ? '#00F0FF' : 'rgba(15, 23, 42, 0.6)',
                  color: agreeTerms ? '#0B0E1F' : 'transparent',
                  borderRadius: '0px'
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
              className="btn btn-cosmic-accent w-100 font-bold mt-2 d-flex align-items-center justify-content-center"
              style={{ borderRadius: '0px', height: '46px', fontSize: '0.94rem' }}
            >
              {loading ? <Loader size={20} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
        )}

        <div className="my-4 d-flex align-items-center gap-3">
          <hr className="flex-grow-1 m-0" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ fontSize: '0.76rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or continue with</span>
          <hr className="flex-grow-1 m-0" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        <div className="d-flex flex-column gap-2.5">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="btn btn-cosmic-outline w-100 d-flex align-items-center justify-content-center gap-3 font-semibold"
            style={{ borderRadius: '0px', height: '46px', fontSize: '0.9rem' }}
          >
            <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            {authMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
          </button>

          <button
            type="button"
            onClick={() => {
              loginAsGuest();
              navigate('/');
            }}
            className="btn btn-cosmic-outline w-100 d-flex align-items-center justify-content-center gap-2 font-semibold"
            style={{ borderRadius: '0px', height: '42px', fontSize: '0.85rem', color: '#94A3B8', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Continue as Guest (Demo Mode)
          </button>
        </div>

        <p className="mt-4 text-center m-0" style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('signup')}
                className="btn btn-link p-0 text-decoration-none font-bold border-0 bg-transparent" 
                style={{ color: '#38BDF8', fontSize: '0.86rem' }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('login')}
                className="btn btn-link p-0 text-decoration-none font-bold border-0 bg-transparent" 
                style={{ color: '#38BDF8', fontSize: '0.86rem' }}
              >
                Log in
              </button>
            </>
          )}
        </p>

        <div className="mt-4 pt-3 text-center border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <span className="font-mono d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem', color: '#64748B' }}>
            <Check size={13} className="text-cyan-400" />
            Protected by Google reCAPTCHA Enterprise
          </span>
        </div>
      </div>
    </div>
  );
}


