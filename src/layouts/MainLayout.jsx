import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, UserRound, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import Galaxy from '../components/Galaxy';

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
  const { isDark } = useTheme();
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
        className="glass-panel sticky top-0 z-50 border-b"
        style={{
          background: 'color-mix(in oklab, var(--surface) 85%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderColor: 'var(--ink-100)'
        }}
      >
        <div className="mx-auto px-4 px-md-5 px-lg-6" style={{ maxWidth: '1240px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ height: '68px' }}>
            {/* Brand */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="d-flex align-items-center gap-3 p-0 border-0 bg-transparent cursor-pointer"
              style={{ lineHeight: 1 }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-0 position-relative"
                style={{
                  width: '40px', height: '40px',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--accent))',
                  color: 'white',
                  boxShadow: '0 4px 12px -2px color-mix(in oklab, var(--primary) 40%, transparent)',
                  borderRadius: '0px'
                }}
              >
                <Sparkles size={20} strokeWidth={2.3} />
              </div>
              <div className="text-start d-none d-md-block">
                <div className="font-extrabold tracking-tight" style={{ fontSize: '1.05rem', color: 'var(--ink-900)' }}>MarkSprint</div>
                <div className="font-semibold" style={{ fontSize: '0.66rem', color: '#38BDF8', letterSpacing: '0.08em' }}>FALKON LABS OPEN SOURCE</div>
              </div>
            </button>

            {/* Center Nav */}
            <nav className="d-none d-md-flex align-items-center gap-1 rounded-0 p-1" style={{ background: 'var(--surface-3)', borderRadius: '0px' }}>
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="px-4 py-2 rounded-0 text-decoration-none font-semibold transition-all"
                    style={{
                      fontSize: '0.85rem',
                      background: active ? 'var(--surface)' : 'transparent',
                      color: active ? 'var(--ink-900)' : 'var(--ink-500)',
                      boxShadow: active ? 'var(--shadow-xs)' : 'none',
                      borderRadius: '0px'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: User controls */}
            <div className="d-flex align-items-center gap-2">
              {quizSubject && (
                <span className="chip chip-accent d-none d-md-inline-flex">{quizSubject}</span>
              )}
              {user ? (
                <>
                  {googleAccessToken && (
                    <span 
                      className="px-2 py-1 font-bold text-uppercase d-none d-lg-inline-flex align-items-center gap-1"
                      style={{
                        fontSize: '0.66rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D399',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '0px'
                      }}
                      title="Google Drive Cloud Auto-Sync Enabled"
                    >
                      <span>🟢</span> Drive Synced
                    </span>
                  )}
                  <div
                    className="d-flex align-items-center gap-2 rounded-0 px-2 py-1 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'var(--surface-3)', borderRadius: '0px', cursor: 'pointer' }}
                    title="View Analytics Dashboard"
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-0"
                      style={{
                        width: '32px', height: '32px',
                        background: 'var(--primary-100)',
                        color: 'var(--primary-600)',
                        borderRadius: '0px'
                      }}
                    >
                      <UserRound size={16} />
                    </div>
                    <div className="text-start d-none d-md-block">
                      <div className="font-bold" style={{ fontSize: '0.8rem', color: 'var(--ink-900)' }}>
                        {userProfile?.displayName || user.email?.split('@')[0] || 'User'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--ink-400)' }}>{userProfile?.role || 'Student'}</div>
                    </div>
                  </div>
                  <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout">
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
                  Sign In
                </button>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                className="btn btn-ghost btn-sm d-md-none"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div
            className="d-md-none border-top anim-fade-in"
            style={{ borderColor: 'var(--ink-100)', background: 'var(--surface-2)' }}
          >
            <div className="mx-auto px-4 py-3 d-flex flex-column gap-1" style={{ maxWidth: '1240px' }}>
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-3 text-decoration-none font-semibold"
                    style={{
                      fontSize: '0.9rem',
                      background: active ? 'var(--primary-50)' : 'transparent',
                      color: active ? 'var(--primary-600)' : 'var(--ink-700)'
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

      {/* Main content area */}
      <main className="flex-grow-1">
        <div className="mx-auto px-3 px-md-4 px-lg-5 py-5 py-md-6" style={{ maxWidth: '1240px' }}>
          <Outlet />
        </div>
      </main>

      <footer
        className="glass-panel border-top py-5 mt-4"
        style={{
          borderColor: 'var(--ink-100)',
          background: 'color-mix(in oklab, var(--surface) 85%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)'
        }}
      >
        <div className="mx-auto px-4 px-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3" style={{ maxWidth: '1240px' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '28px', height: '28px',
                background: 'linear-gradient(135deg, var(--primary-500), var(--accent))',
                color: 'white',
                borderRadius: '0px'
              }}
            >
              <Sparkles size={14} />
            </div>
            <div className="font-bold" style={{ fontSize: '0.88rem', color: 'var(--ink-700)' }}>
              © {new Date().getFullYear()} MarkSprint
            </div>
          </div>
          <div className="d-flex align-items-center gap-4 flex-wrap justify-content-center">
            <Link to="/about" className="text-decoration-none font-medium" style={{ fontSize: '0.82rem', color: 'var(--ink-500)' }}>About</Link>
            {userProfile?.role === 'teacher' && (
              <Link to="/content-manager" className="text-decoration-none font-medium" style={{ fontSize: '0.82rem', color: 'var(--ink-500)' }}>Content Manager</Link>
            )}
            <a href="https://github.com/sreehari462/marksprint" target="_blank" rel="noreferrer" className="text-decoration-none font-medium" style={{ fontSize: '0.82rem', color: 'var(--ink-500)' }}>GitHub</a>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>
            Falkon Labs Open Source · Maintained by Sree Hari Sk & S. Saravanan
          </div>
        </div>
      </footer>
    </div>
  );
}
