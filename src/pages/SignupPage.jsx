import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader, AlertCircle, User, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !displayName || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center bg-theme-base text-white py-5 position-relative">
      
      {/* Ambient background glows */}
      <div className="position-fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(200, 172, 214, 0.1), transparent)', zIndex: 0 }} />

      {/* Main card container (Bootstrap styling) */}
      <div 
        className="position-relative z-3 w-100 px-4 py-5 rounded-5 border shadow-lg" 
        style={{ 
          maxWidth: '460px', 
          backgroundColor: 'rgba(46, 42, 98, 0.9)', 
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        
        {/* Navigation / Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-link text-decoration-none p-2 rounded-circle hover-lavender"
            style={{ color: 'var(--color-lavender)', transition: 'all 0.3s ease' }}
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
          <h1 className="m-0 text-center font-bold uppercase tracking-wide" style={{ fontSize: '1.2rem' }}>Sign Up</h1>
          <div style={{ width: '40px' }} />
        </div>

        {/* Title Area */}
        <div className="mb-4 text-center">
          <h2 className="font-bold tracking-tight text-white mb-2" style={{ fontSize: '1.6rem' }}>Create Account</h2>
          <p className="text-theme-slate font-light m-0" style={{ fontSize: '0.9rem' }}>Join MARKSPRINT to start your journey</p>
        </div>

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-white rounded-3 p-3 mb-4 d-flex align-items-center gap-2" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="d-flex flex-column gap-3">
          <div className="d-flex flex-column gap-1.5">
            <label className="text-slate-300 font-bold" style={{ fontSize: '0.82rem', tracking: '0.05em' }}>Name</label>
            <div className="position-relative d-flex align-items-center">
              <User className="position-absolute text-secondary" style={{ left: '16px' }} size={18} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tony Nguyen"
                className="form-control text-white bg-theme-base border-secondary-subtle py-3 ps-5 shadow-sm"
                style={{ 
                  borderRadius: '16px',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-1.5">
            <label className="text-slate-300 font-bold" style={{ fontSize: '0.82rem', tracking: '0.05em' }}>Email Address</label>
            <div className="position-relative d-flex align-items-center">
              <Mail className="position-absolute text-secondary" style={{ left: '16px' }} size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="form-control text-white bg-theme-base border-secondary-subtle py-3 ps-5 shadow-sm"
                style={{ 
                  borderRadius: '16px',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-1.5">
            <label className="text-slate-300 font-bold" style={{ fontSize: '0.82rem', tracking: '0.05em' }}>Password</label>
            <div className="position-relative d-flex align-items-center">
              <Lock className="position-absolute text-secondary" style={{ left: '16px' }} size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control text-white bg-theme-base border-secondary-subtle py-3 ps-5 pe-5 shadow-sm"
                style={{ 
                  borderRadius: '16px',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.92rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-link position-absolute text-secondary p-2"
                style={{ right: '12px' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="d-flex flex-column gap-1.5">
            <label className="text-slate-300 font-bold" style={{ fontSize: '0.82rem', tracking: '0.05em' }}>Confirm Password</label>
            <div className="position-relative d-flex align-items-center">
              <Lock className="position-absolute text-secondary" style={{ left: '16px' }} size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control text-white bg-theme-base border-secondary-subtle py-3 ps-5 pe-5 shadow-sm"
                style={{ 
                  borderRadius: '16px',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.92rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="btn btn-link position-absolute text-secondary p-2"
                style={{ right: '12px' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-check my-2">
            <input 
              type="checkbox" 
              className="form-check-input bg-transparent border-secondary" 
              id="agreeTerms" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label className="form-check-label text-slate-300" htmlFor="agreeTerms" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
              I agree to the <a href="#" className="text-decoration-none text-theme-highlight font-semibold">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-theme-highlight text-theme-base font-bold py-3 w-100 shadow-highlight-glow mt-2"
            style={{ borderRadius: '16px', fontSize: '1rem' }}
          >
            {loading ? <Loader size={20} className="animate-spin text-theme-base" /> : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 d-flex align-items-center gap-3">
          <hr className="flex-grow-1 m-0 text-secondary opacity-25" />
          <span className="text-secondary" style={{ fontSize: '0.78rem' }}>or continue with</span>
          <hr className="flex-grow-1 m-0 text-secondary opacity-25" />
        </div>

        <div className="d-flex flex-column gap-3">
          <button className="btn btn-outline-light border-theme-accent bg-dark bg-opacity-25 py-3 d-flex align-items-center justify-content-center gap-3 font-semibold" style={{ borderRadius: '16px', fontSize: '0.9rem' }}>
            <svg className="h-[20px] w-[20px]" style={{ color: '#1877F2' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          <button
            onClick={handleGoogleSignUp}
            className="btn btn-outline-light border-theme-accent bg-dark bg-opacity-25 py-3 d-flex align-items-center justify-content-center gap-3 font-semibold"
            style={{ borderRadius: '16px', fontSize: '0.9rem' }}
          >
            <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        <p className="mt-4 text-center text-secondary m-0" style={{ fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none text-theme-highlight font-semibold">
            Login
          </Link>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lavender:hover {
          background-color: rgba(200, 172, 214, 0.1) !important;
          color: white !important;
        }
      `}} />
    </div>
  );
}
