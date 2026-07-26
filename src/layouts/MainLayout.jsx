import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, UserRound, Sparkles, Menu, X, Moon, SunMedium } from 'lucide-react';
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
  const { user, userProfile, logOut } = useAuth();
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
        <div className="position-relative z-10">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col position-relative selection:bg-brand selection:text-black">
      <Galaxy isDark={isDark} />
      
      {/* Premium Tactical Header */}
      <header
        className="sticky-top z-50 transition-all"
        style={{
          background: isDark ? 'rgba(8, 12, 24, 0.95)' : '#FFFFFF',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '2px solid #000000',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div className="mx-auto px-3 px-md-4 px-lg-5" style={{ maxWidth: '1380px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ height: '64px' }}>
            
            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="d-flex align-items-center gap-3 p-0 border-0 bg-transparent cursor-pointer text-decoration-none group"
            >
              <div
                className={`d-flex align-items-center justify-content-center transition-all flex-shrink-0 ${
                  isDark ? 'bg-black text-brand border-2 border-amber-400' : 'bg-brand text-black border-2 border-black'
                }`}
                style={{ width: '40px', height: '40px', padding: '6px', borderRadius: '8px' }}
              >
                <img src={faviconSvg} alt="MarkSprint Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="text-start d-none d-sm-block">
                <h1 className={`font-headline text-2xl font-black tracking-wider uppercase italic m-0 ${isDark ? 'text-white' : 'text-black'}`} style={{ lineHeight: '1' }}>
                  MARKSPRINT
                </h1>
                <div className={`font-mono font-bold text-uppercase mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontSize: '0.62rem', letterSpacing: '0.12em' }}>
                  FALKON LABS // OPEN SOURCE
                </div>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="d-none d-md-flex align-items-center gap-1 font-mono text-xs">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-3.5 py-1.5 text-decoration-none transition-all font-headline font-bold text-xs uppercase ${
                      active
                        ? 'bg-brand text-black font-black shadow-sm'
                        : isDark
                        ? 'text-slate-300 hover:text-brand'
                        : 'text-slate-700 hover:text-black'
                    }`}
                    style={{ borderRadius: '6px' }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="d-flex align-items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                className={`btn p-0 font-mono font-bold uppercase d-flex align-items-center justify-content-center border-0 transition-all ${
                  isDark ? 'bg-slate-900 text-brand hover:bg-slate-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
                title="Switch Theme Mode"
                aria-label="Switch Theme Mode"
                style={{ width: '38px', height: '38px', borderRadius: '8px' }}
              >
                {theme === 'space' ? <Moon size={18} /> : <SunMedium size={18} className="text-amber-500" />}
              </button>

              {quizSubject && (
                <span className="badge bg-brand text-black font-mono font-bold text-uppercase d-none d-lg-inline-flex px-3 py-1.5 border-0 text-xs" style={{ borderRadius: '6px' }}>
                  {quizSubject}
                </span>
              )}

              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <div
                    className={`d-flex align-items-center gap-2 px-3 py-1.5 cursor-pointer font-mono font-bold text-xs transition-all ${
                      isDark ? 'bg-slate-900 text-brand hover:bg-slate-800' : 'bg-slate-100 text-black hover:bg-slate-200'
                    }`}
                    onClick={() => navigate('/dashboard')}
                    title="View Analytics Dashboard"
                    style={{ borderRadius: '8px' }}
                  >
                    <UserRound size={15} className="text-brand" />
                    <span className="uppercase d-none d-md-inline">
                      {userProfile?.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`btn p-2 border-0 transition-all ${
                      isDark ? 'bg-slate-900 text-white hover:bg-rose-600' : 'bg-slate-100 text-black hover:bg-rose-600 hover:text-white'
                    }`}
                    title="Logout"
                    style={{ borderRadius: '8px' }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`font-mono font-bold text-[11px] uppercase px-3 py-1.5 d-none d-lg-inline ${
                      isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-100 text-amber-900'
                    }`}
                    style={{ borderRadius: '6px' }}
                  >
                    GUEST MODE
                  </span>
                  <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    className="bg-brand text-black border-0 px-4 py-2 font-headline text-xs font-black uppercase hover:bg-white hover:text-black transition-all shadow-sm"
                    style={{ borderRadius: '6px' }}
                  >
                    SIGN IN_
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                className="btn bg-slate-900 text-brand border border-slate-700 p-2 d-md-none"
                aria-label="Toggle menu"
                style={{ borderRadius: '6px' }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="d-md-none border-t-2 border-brand/40 bg-slate-950 p-3 font-mono font-bold">
            <div className="d-flex flex-column gap-2">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`p-3 text-decoration-none font-bold text-uppercase border-2 ${
                      active ? 'bg-brand text-black border-black font-black' : 'bg-slate-900 text-white border-slate-700'
                    }`}
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
        <div className="mx-auto px-3 px-md-4 px-lg-5 py-4 py-md-5" style={{ maxWidth: '1380px' }}>
          <Outlet />
        </div>
      </main>

      {/* Neo-Brutalism Tactical Footer */}
      <footer className="border-t-2 border-brand/40 py-5 bg-slate-950 text-white font-mono">
        <div className="mx-auto px-4 px-md-5" style={{ maxWidth: '1380px' }}>
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-4">
            <div>
              <h4 className="font-headline text-3xl font-black uppercase italic mb-1 text-white d-flex align-items-center gap-2">
                MARKSPRINT <span className="text-brand text-xs font-mono font-bold not-italic">FALKON LABS</span>
              </h4>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 m-0">SPEED REVISION & KNOWLEDGE MASTERY ENGINE</p>
            </div>
            <div className="d-flex gap-3 font-bold uppercase text-xs flex-wrap">
              <Link to="/about" className="text-white text-decoration-none bg-slate-900 hover:bg-brand hover:text-black px-3 py-1.5 border border-slate-700 transition-all">ABOUT</Link>
              {userProfile?.role === 'teacher' && (
                <Link to="/content-manager" className="text-white text-decoration-none bg-slate-900 hover:bg-brand hover:text-black px-3 py-1.5 border border-slate-700 transition-all">CONTENT MANAGER</Link>
              )}
              <a href="https://github.com/sreehari462/marksprint" target="_blank" rel="noreferrer" className="text-white text-decoration-none bg-slate-900 hover:bg-brand hover:text-black px-3 py-1.5 border border-slate-700 transition-all">GITHUB</a>
            </div>
            <div className="text-md-end">
              <p className="text-xs font-bold uppercase m-0 text-slate-300">MAINTAINED BY SREE HARI SK & S. SARAVANAN</p>
              <p className="text-xs font-black mt-1 m-0 text-brand">© 2026_ALL_RIGHTS_RESERVED</p>
            </div>
          </div>
        </div>
      </footer>

      <OfflineIndicator />
    </div>
  );
}
