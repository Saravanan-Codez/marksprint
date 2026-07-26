import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, UserRound, Sparkles, Menu, X, Moon, SunMedium } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import Galaxy from '../components/Galaxy';
import OfflineIndicator from '../components/OfflineIndicator';
import faviconSvg from '../assets/favicon.svg';

const SUBJECT_MAP = {
  biology: 'Biology',
  physics: 'Physics',
  chemistry: 'Chemistry',
  maths: 'Maths',
  cs: 'Computer Science',
  english: 'English',
  tamil: 'Tamil'
};

export default function MainLayout() {
  const { user, userProfile, googleAccessToken, logOut } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const quizSubject = location.pathname.startsWith('/quiz/')
    ? SUBJECT_MAP[location.pathname.replace('/quiz/', '')]
    : null;

  const navItems = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'About', href: '/about', icon: 'about' }
  ];
  if (userProfile?.role === 'teacher') {
    navItems.push({ label: 'Content Manager', href: '/content-manager', icon: 'cm' });
  }

  const activeHref = quizSubject ? '/' : location.pathname;

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full position-relative">
        <Galaxy isDark={isDark} />
        <div
          className="position-fixed inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(900px 500px at 10% 0%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 60%), radial-gradient(700px 500px at 100% 100%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 60%), linear-gradient(135deg, var(--bg-50), var(--bg-100))'
          }}
        />
        <div className="position-relative z-10">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col position-relative">
      <Galaxy isDark={isDark} />
      <header
        className="glass-panel sticky-top z-50 border-bottom"
        style={{
          background: isDark ? 'rgba(18, 24, 45, 0.88)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)'
        }}
      >
        <div className="mx-auto px-3 px-md-4 px-lg-5" style={{ maxWidth: '1280px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ height: '70px' }}>
            
            {/* Brand Logo & Name */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="d-flex align-items-center gap-3 p-0 border-0 bg-transparent cursor-pointer text-decoration-none"
              style={{ lineHeight: 1 }}
            >
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '42px', height: '42px',
                  background: isDark ? 'rgba(18, 24, 45, 0.95)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(203, 213, 225, 0.8)',
                  borderRadius: '12px',
                  boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(99, 102, 241, 0.25)',
                  padding: '6px'
                }}
              >
                <img src={faviconSvg} alt="MarkSprint Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="text-start d-none d-sm-block">
                <div className="font-extrabold tracking-tight card-title-text" style={{ fontSize: '1.25rem' }}>MarkSprint</div>
                <div className="font-bold text-uppercase" style={{ fontSize: '0.62rem', color: '#06B6D4', letterSpacing: '0.12em' }}>FALKON LABS OPEN SOURCE</div>
              </div>
            </button>

            {/* Center Navigation Bar */}
            <nav 
              className="d-none d-md-flex align-items-center gap-2 p-1.5" 
              style={{ 
                background: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(241, 245, 249, 0.9)', 
                borderRadius: '9999px', 
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(203, 213, 225, 0.8)' 
              }}
            >
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="px-4 py-2 text-decoration-none font-bold transition-all d-inline-block"
                    style={{
                      fontSize: '0.88rem',
                      background: active ? 'linear-gradient(135deg, #6366F1, #4F46E5)' : 'transparent',
                      color: active ? '#FFFFFF' : isDark ? '#E2E8F0' : '#334155',
                      borderRadius: '9999px',
                      boxShadow: active ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Theme Toggle & User Controls */}
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-outline btn-sm d-flex align-items-center justify-content-center flex-shrink-0"
                title="Switch Theme Mode"
                aria-label="Switch Theme Mode"
                style={{ width: '40px', height: '40px', borderRadius: '12px' }}
              >
                {theme === 'space' ? <Moon size={18} /> : <SunMedium size={18} className="text-warning" />}
              </button>

              {quizSubject && (
                <span className="chip chip-accent d-none d-lg-inline-flex">{quizSubject}</span>
              )}

              {user ? (
                <>
                  {googleAccessToken && (
                    <span 
                      className="px-2.5 py-1 font-bold text-uppercase d-none d-xl-inline-flex align-items-center gap-1.5"
                      style={{
                        fontSize: '0.68rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D399',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '9999px'
                      }}
                      title="Google Drive Cloud Auto-Sync Enabled"
                    >
                      <span style={{ fontSize: '0.6rem' }}>🟢</span> Drive Synced
                    </span>
                  )}
                  
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-1.5 cursor-pointer transition-all"
                    onClick={() => navigate('/dashboard')}
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(203, 213, 225, 0.8)',
                      borderRadius: '9999px',
                      cursor: 'pointer'
                    }}
                    title="View Analytics Dashboard"
                  >
                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '30px', height: '30px',
                        background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                        color: 'white',
                        borderRadius: '50%'
                      }}
                    >
                      <UserRound size={15} />
                    </div>
                    <div className="text-start d-none d-md-block">
                      <div className="font-bold card-title-text" style={{ fontSize: '0.82rem', lineHeight: '1.2' }}>
                        {userProfile?.displayName || user.email?.split('@')[0] || 'User'}
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm p-2" title="Logout">
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2.5">
                  <span 
                    className="d-none d-md-inline-flex align-items-center gap-1.5 px-3 py-1 font-bold text-uppercase"
                    style={{
                      fontSize: '0.7rem',
                      background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)',
                      color: isDark ? '#94A3B8' : '#475569',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(203, 213, 225, 0.8)',
                      borderRadius: '9999px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    Guest Mode
                  </span>
                  <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    className="btn btn-primary btn-sm px-3.5 py-2 font-bold flex-shrink-0"
                    style={{ fontSize: '0.86rem', borderRadius: '12px' }}
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                className="btn btn-ghost btn-sm p-2 d-md-none"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div
            className="d-md-none border-top anim-fade-in"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)',
              background: isDark ? 'rgba(18, 24, 45, 0.95)' : 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div className="mx-auto px-4 py-3 d-flex flex-column gap-2" style={{ maxWidth: '1280px' }}>
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3.5 py-2.5 text-decoration-none font-semibold"
                    style={{
                      fontSize: '0.92rem',
                      borderRadius: '12px',
                      background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: active ? '#6366F1' : isDark ? 'var(--ink-700)' : '#334155',
                      border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow-1">
        <div className="mx-auto px-3 px-md-4 px-lg-5 py-4 py-md-5" style={{ maxWidth: '1280px' }}>
          <Outlet />
        </div>
      </main>

      <footer
        className="glass-panel border-top py-4 mt-5"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)',
          background: isDark ? 'rgba(18, 24, 45, 0.85)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <div className="mx-auto px-4 px-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3" style={{ maxWidth: '1280px' }}>
          <div className="d-flex align-items-center gap-2.5">
            <div
              className="d-flex align-items-center justify-content-center p-1.5"
              style={{
                width: '36px', height: '36px',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(203, 213, 225, 0.8)',
                borderRadius: '10px'
              }}
            >
              <img src={faviconSvg} alt="MarkSprint Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            </div>
            <div className="font-bold card-title-text" style={{ fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} MarkSprint
            </div>
          </div>
          <div className="d-flex align-items-center gap-4 flex-wrap justify-content-center">
            <Link to="/about" className="text-decoration-none font-medium" style={{ fontSize: '0.85rem', color: 'var(--ink-500)' }}>About</Link>
            {userProfile?.role === 'teacher' && (
              <Link to="/content-manager" className="text-decoration-none font-medium" style={{ fontSize: '0.85rem', color: 'var(--ink-500)' }}>Content Manager</Link>
            )}
            <a href="https://github.com/sreehari462/marksprint" target="_blank" rel="noreferrer" className="text-decoration-none font-medium" style={{ fontSize: '0.85rem', color: 'var(--ink-500)' }}>GitHub</a>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-400)' }}>
            Falkon Labs Open Source · Maintained by Sree Hari Sk & S. Saravanan
          </div>
        </div>
      </footer>

      <OfflineIndicator />
    </div>
  );
}
