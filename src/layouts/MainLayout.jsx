import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PillNav from '../components/PillNav';
import LiquidEther from '../components/LiquidEther';

// Cosmic starfield backdrop using the theme colors
function CosmicBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0.5 + Math.random() * 1.2,
      alpha: Math.random(),
      speed: 0.003 + Math.random() * 0.006,
      glow: Math.random() > 0.85
    }));

    const render = () => {
      ctx.fillStyle = '#17153B'; // Base background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Swirling faint nebulae glows (Indigo & Lavender)
      const gradIndigo = ctx.createRadialGradient(
        canvas.width * 0.25, canvas.height * 0.3, 50,
        canvas.width * 0.25, canvas.height * 0.3, canvas.width * 0.6
      );
      gradIndigo.addColorStop(0, 'rgba(67, 61, 143, 0.08)');
      gradIndigo.addColorStop(0.5, 'rgba(46, 42, 98, 0.04)');
      gradIndigo.addColorStop(1, 'transparent');
      ctx.fillStyle = gradIndigo;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradLavender = ctx.createRadialGradient(
        canvas.width * 0.75, canvas.height * 0.7, 50,
        canvas.width * 0.75, canvas.height * 0.7, canvas.width * 0.5
      );
      gradLavender.addColorStop(0, 'rgba(200, 172, 214, 0.06)');
      gradLavender.addColorStop(1, 'transparent');
      ctx.fillStyle = gradLavender;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = '#ffffff';
        if (star.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#C8ACD6';
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.15) {
          star.speed = -star.speed;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="position-fixed top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: -2 }} />;
}

export default function MainLayout() {
  const { user, userProfile, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'About', href: '/about' }
  ];
  if (userProfile?.role === 'teacher') {
    navItems.push({ label: 'Content Manager', href: '/content-manager' });
  }

  const activeHref = location.pathname.startsWith('/quiz/') ? '/' : location.pathname;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

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
      <>
        <CosmicBackground />
        <LiquidEther
          colors={['#C8ACD6', '#433D8F', '#2E2A62']}
          mouseForce={20}
          cursorSize={80}
          isViscous={true}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={2.0}
          takeoverDuration={0.25}
          autoResumeDelay={2000}
          autoRampDuration={0.6}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1 }}
        />
        <Outlet />
      </>
    );
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column overflow-hidden position-relative p-0 bg-theme-base">
      
      {/* Cosmic Background */}
      <CosmicBackground />
      <LiquidEther
        colors={['#C8ACD6', '#433D8F', '#2E2A62']}
        mouseForce={20}
        cursorSize={80}
        isViscous={true}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.4}
        autoIntensity={2.0}
        takeoverDuration={0.25}
        autoResumeDelay={2000}
        autoRampDuration={0.6}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1 }}
      />

      {/* Decorative Planet (Lavender accent) */}
      <svg className="position-absolute opacity-50" style={{ top: '22%', left: '12%', width: '40px', height: '40px', pointerEvents: 'none', zIndex: -1, color: 'var(--color-lavender)' }} viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="50" rx="35" ry="12" stroke="currentColor" strokeWidth="3" transform="rotate(-25 50 50)" />
        <circle cx="50" cy="50" r="16" fill="var(--color-accent-dark)" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Decorative Planet Bottom Right */}
      <svg className="position-absolute opacity-50" style={{ bottom: '15%', right: '10%', width: '64px', height: '64px', pointerEvents: 'none', zIndex: -1, color: 'var(--color-lavender)' }} viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="50" rx="42" ry="14" stroke="currentColor" strokeWidth="3.5" transform="rotate(-15 50 50)" />
        <circle cx="50" cy="50" r="20" fill="var(--color-surface-dark)" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Main layout container (Fixed Viewport Centering) */}
      <div className="d-flex flex-column flex-grow-1 overflow-auto position-relative" style={{ zIndex: 20 }}>
        
        {/* Header Redesign (Bootstrap classes, clean, no traffic lights/address bar) */}
        <header className="w-100 px-4 py-3 px-md-5 py-md-4 bg-transparent border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
          <div className="d-flex align-items-center justify-content-between">
            
            {/* Branding Logo: M in galaxy swirl */}
            <div className="d-flex align-items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="position-relative d-flex align-items-center justify-content-center rounded-3 bg-dark border" style={{ width: '56px', height: '56px', borderColor: 'var(--color-accent-dark)' }}>
                <svg className="position-absolute w-100 h-100 animate-spin-slow" style={{ color: 'var(--color-lavender)', opacity: 0.7 }} viewBox="0 0 100 100" fill="none">
                  <path d="M 50 50 Q 65 30 50 15 Q 35 30 50 50 Q 65 70 80 50 Q 65 30 50 50" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 50 50 Q 35 70 50 85 Q 65 70 50 50 Q 35 30 20 50 Q 35 70 50 50" stroke="var(--color-accent-dark)" strokeWidth="2.5" />
                </svg>
                <span className="position-relative z-3 font-bold text-white text-xl" style={{ textShadow: '0 0 8px #ffffff' }}>M</span>
              </div>
              <div>
                <div className="font-bold text-theme-highlight" style={{ fontSize: '1.25rem', letterSpacing: '0.15em', textShadow: '0 0 8px rgba(200, 172, 214, 0.25)' }}>
                  MARKSPRINT
                </div>
                <p className="m-0 text-white font-medium uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>ASSESSMENT PLATFORM</p>
              </div>
            </div>

            {/* Centered Pill Navigation Menu */}
            <PillNav
              items={navItems}
              activeHref={activeHref}
              baseColor="#C8ACD6"
              pillColor="#2E2A62"
              pillTextColor="#ffffff"
              hoveredPillTextColor="#17153B"
              initialLoadAnimation={true}
            />

            {/* User Controls */}
            <div className="d-flex align-items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light border-theme-accent hover:bg-theme-highlight hover:text-theme-base font-bold text-uppercase py-2 px-4"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.12em', borderRadius: '12px' }}
                  >
                    Logout
                  </button>
                  
                  {/* Glowing Moon Phase Icon */}
                  <div className="position-relative rounded-circle overflow-hidden bg-dark d-flex align-items-center justify-content-center shadow" style={{ width: '44px', height: '44px', border: '1px solid var(--color-accent-dark)' }}>
                    <svg className="w-100 h-100 text-secondary" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="50" cy="50" r="45" fill="#e2e8f0" />
                      <circle cx="35" cy="30" r="6" fill="#cbd5e1" className="opacity-80" />
                      <circle cx="65" cy="40" r="8" fill="#cbd5e1" className="opacity-80" />
                      <circle cx="45" cy="65" r="10" fill="#cbd5e1" className="opacity-80" />
                    </svg>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(45deg, rgba(0,0,0,0.4), transparent)' }} />
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-theme-highlight bg-theme-highlight text-theme-base font-bold tracking-wider py-2 px-4"
                  style={{ borderRadius: '12px' }}
                >
                  SIGN IN
                </button>
              )}
            </div>

          </div>
        </header>

        {/* Centered Main Workspace (Centered child blocks) */}
        <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="w-100 py-3 bg-dark bg-opacity-10 text-center text-theme-slate" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <p className="m-0" style={{ fontSize: '0.7rem' }}>© {new Date().getFullYear()} MARKSPRINT — A cosmic game-like quiz experience.</p>
        </footer>

      </div>
    </div>
  );
}
