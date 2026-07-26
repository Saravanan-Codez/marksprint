import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, UserRound, Sparkles, Menu, X, Moon, SunMedium } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import Galaxy from '../components/Galaxy';
import OfflineIndicator from '../components/OfflineIndicator';
import { getLocalGamificationData } from '../services/gamificationService';
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

  useEffect(() => {
    // If user is logged in (and not guest) but missing setup, force to setup
    const isSetupDone = userProfile?.setupCompleted || (userProfile?.board && userProfile?.standard);
    if (
      user && 
      user.uid !== 'guest_student_demo' && 
      userProfile && 
      !isSetupDone && 
      location.pathname !== '/setup'
    ) {
      navigate('/setup');
    }
  }, [user, userProfile, location.pathname, navigate]);
  
  const gamification = getLocalGamificationData();
  const avatarUrl = gamification?.customAvatarUrl || user?.photoURL;

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const quizSubject = location.pathname.startsWith('/quiz/')
    ? SUBJECT_MAP[location.pathname.replace('/quiz/', '')]
    : null;

  const navItems = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Sprints', href: '/sprints', icon: 'sprints' },
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
      
      {/* Industrial Neo-Brutalist Header */}
      <header className="sticky-top z-50 transition-all border-b-brutal" style={{ background: 'var(--bg-main)' }}>
        <div className="mx-auto px-3 px-md-4 px-lg-5" style={{ maxWidth: '1380px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ height: '64px' }}>
            
            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="d-flex align-items-center gap-3 p-0 border-0 bg-transparent cursor-pointer text-decoration-none group"
            >
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '36px', height: '36px' }}
              >
                <img src={faviconSvg} alt="MarkSprint Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="text-start d-none d-sm-block">
                <h1 className="font-headline text-2xl font-black tracking-wider uppercase italic m-0" style={{ lineHeight: '1', color: 'var(--text-main)' }}>
                  MARKSPRINT
                </h1>
                <div className="font-mono font-bold text-uppercase mt-0.5" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                  FALKON LABS // OPEN SOURCE
                </div>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="d-none d-md-flex align-items-center gap-2 font-mono text-xs">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-3 py-1.5 text-decoration-none transition-all font-headline font-bold text-xs uppercase border-2 border-transparent ${
                      active
                        ? 'bg-brand text-white font-black border-black shadow-hard-sm'
                        : 'nav-link-custom'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="d-flex align-items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="btn p-0 font-mono font-bold uppercase d-flex align-items-center justify-content-center border-brutal transition-all shadow-hard-sm"
                title="Switch Theme Mode"
                aria-label="Switch Theme Mode"
                style={{ width: '38px', height: '38px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
              >
                {theme === 'space' ? <SunMedium size={18} /> : <Moon size={18} />}
              </button>

              {quizSubject && (
                <span className="badge bg-brand text-white font-mono font-bold text-uppercase d-none d-lg-inline-flex px-3 py-1.5 border-2 border-black text-xs shadow-hard-sm">
                  {quizSubject}
                </span>
              )}

              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center cursor-pointer transition-all border-brutal shadow-hard-sm"
                    onClick={() => navigate('/dashboard')}
                    title="View Analytics Dashboard"
                    style={{ background: 'var(--bg-card)', width: '38px', height: '38px' }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserRound size={18} className="text-brand" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn p-2 transition-all border-brutal shadow-hard-sm"
                    title="Logout"
                    style={{ background: 'var(--danger)', color: '#000000' }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="font-mono font-bold text-xs uppercase px-3 py-1.5 d-none d-lg-inline border-brutal shadow-hard-sm"
                    style={{ background: '#1E1035', color: '#E9D5FF', borderColor: 'var(--brand)' }}
                  >
                    GUEST MODE
                  </span>
                  <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    className="btn-primary btn-sm border-brutal shadow-hard-sm"
                  >
                    SIGN IN_
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                className="btn p-2 d-md-none border-brutal shadow-hard-sm"
                aria-label="Toggle menu"
                style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="d-md-none border-t-brutal p-3 font-mono font-bold" style={{ background: 'var(--bg-main)' }}>
            <div className="d-flex flex-column gap-2">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`p-3 text-decoration-none font-bold text-uppercase border-2 transition-all ${
                      active ? 'bg-brand text-white border-black font-black shadow-hard-sm' : 'border-transparent nav-link-custom hover:border-brutal'
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
      <footer className="border-t-brutal py-5 font-mono" style={{ background: 'var(--bg-main)' }}>
        <div className="mx-auto px-4 px-md-5" style={{ maxWidth: '1380px' }}>
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-4">
            <div>
              <h4 className="font-headline text-3xl font-black uppercase italic mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
                MARKSPRINT <span className="text-brand text-xs font-mono font-bold not-italic px-2 py-0.5 border-2 border-black bg-brand text-white">FALKON LABS</span>
              </h4>
              <p className="text-xs font-bold uppercase tracking-widest m-0" style={{ color: 'var(--text-muted)' }}>SPEED REVISION & KNOWLEDGE MASTERY ENGINE</p>
            </div>
            <div className="d-flex gap-3 font-bold uppercase text-xs flex-wrap">
              <Link to="/about" className="text-decoration-none border-2 transition-all shadow-hard-sm" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', padding: '0.4rem 0.8rem', borderColor: 'var(--border-main)' }}>ABOUT</Link>
              {userProfile?.role === 'teacher' && (
                <Link to="/content-manager" className="text-decoration-none border-2 transition-all shadow-hard-sm" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', padding: '0.4rem 0.8rem', borderColor: 'var(--border-main)' }}>CONTENT MANAGER</Link>
              )}
              <a href="https://github.com/sreehari462/marksprint" target="_blank" rel="noreferrer" className="text-decoration-none border-2 transition-all shadow-hard-sm" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', padding: '0.4rem 0.8rem', borderColor: 'var(--border-main)' }}>GITHUB</a>
            </div>
            <div className="text-md-end">
              <p className="text-xs font-bold uppercase m-0" style={{ color: 'var(--text-muted)' }}>MAINTAINED BY SREE HARI SK & S. SARAVANAN</p>
              <p className="text-xs font-black mt-1 m-0 text-brand">© 2026_ALL_RIGHTS_RESERVED</p>
            </div>
          </div>
        </div>
      </footer>

      <OfflineIndicator />
    </div>
  );
}
