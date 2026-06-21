import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code, ShieldCheck } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 w-100 bg-theme-base text-white py-5 position-relative overflow-auto">
      
      {/* Background radial gradient */}
      <div className="position-fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(200, 172, 214, 0.05), transparent)', zIndex: 0 }} />

      <div className="position-relative z-3 container py-4" style={{ maxWidth: '1000px' }}>
        
        {/* Main Card */}
        <SpotlightCard className="p-4 p-md-5 mb-4" spotlightColor="rgba(200, 172, 214, 0.15)">
          <p className="text-uppercase tracking-wider font-bold text-theme-highlight m-0" style={{ fontSize: '0.75rem', letterSpacing: '0.25em' }}>About the Product</p>
          <h1 className="mt-3 font-bold text-white tracking-tight" style={{ fontSize: '2.5rem' }}>MARKSPRINT</h1>
          <p className="mt-4 text-theme-slate font-light m-0" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
            MARKSPRINT is a calm, modern quiz platform crafted to help Tamil Nadu 12th-grade students learn quickly, retain results, and steadily improve performance.
          </p>
        </SpotlightCard>

        {/* Secondary Grid */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <SpotlightCard className="p-4 p-md-5 h-100" spotlightColor="rgba(200, 172, 214, 0.15)">
              <h2 className="h3 font-bold text-white mb-3">How it works</h2>
              <p className="text-theme-slate font-light leading-relaxed mb-4">
                Choose a subject, configure your practice or test sprint, and use the review board to learn from your mistakes. The experience is intentionally lightweight to keep focus on learning rather than distractions.
              </p>

              <div className="d-flex flex-column gap-3">
                {[
                  'Select from 7 subjects and start instantly.',
                  'Use custom timers and shuffle settings to mimic exam pressure.',
                  'Practice mode gives fast feedback, test mode keeps answers hidden until the end.',
                  'Review incorrect answers with data-backed insight after each sprint.'
                ].map((item) => (
                  <div key={item} className="rounded-4 border p-3" style={{ backgroundColor: 'rgba(23, 21, 59, 0.55)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <ShieldCheck size={18} className="text-theme-highlight flex-shrink-0" />
                      <span className="font-light text-theme-slate" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

          <div className="col-lg-5">
            <SpotlightCard className="p-4 p-md-5 h-100 d-flex flex-column justify-content-between" spotlightColor="rgba(200, 172, 214, 0.15)">
              <div>
                <p className="text-uppercase tracking-wider font-bold text-theme-highlight m-0" style={{ fontSize: '0.75rem', letterSpacing: '0.25em' }}>Built for Students</p>
                <h3 className="h4 font-bold text-white mt-3">Designed for exam-ready study</h3>
                <p className="text-theme-slate font-light mt-3 mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Designed around quick question flow, clean review screens, and easy subject selection so learners spend more time solving problems and less time navigating the app.
                </p>
              </div>

              <div className="mt-4 d-flex flex-column gap-3">
                <div className="rounded-4 border p-3" style={{ backgroundColor: 'rgba(23, 21, 59, 0.55)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                  <p className="text-uppercase tracking-wider font-bold text-theme-slate m-0 mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Data Source</p>
                  <p className="text-white font-light m-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>CSV-driven content with local edits preserved via the content manager.</p>
                </div>
                <div className="rounded-4 border p-3" style={{ backgroundColor: 'rgba(23, 21, 59, 0.55)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                  <p className="text-uppercase tracking-wider font-bold text-theme-slate m-0 mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Review Flow</p>
                  <p className="text-white font-light m-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>Replay wrong questions automatically and close knowledge gaps faster.</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="row g-4 mb-4">
          {[
            { title: 'Modern Interface', detail: 'A refined layout built for clarity and performance.' },
            { title: 'Faster Navigation', detail: 'Select subjects and start quizzes in two taps.' },
            { title: 'Configurable Sessions', detail: 'Control timing, shuffling, and question selection with ease.' }
          ].map((item) => (
            <div key={item.title} className="col-lg-4">
              <SpotlightCard className="p-4 h-100" spotlightColor="rgba(200, 172, 214, 0.15)">
                <p className="h5 font-bold text-white m-0 mb-2">{item.title}</p>
                <p className="text-theme-slate font-light m-0" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{item.detail}</p>
              </SpotlightCard>
            </div>
          ))}
        </div>

        {/* Credits */}
        <SpotlightCard className="p-4 p-md-5 mb-4" spotlightColor="rgba(200, 172, 214, 0.15)">
          <h2 className="h3 font-bold text-white mb-4">Credits & Links</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="rounded-5 border p-4 h-100 d-flex flex-column justify-content-between align-items-start" style={{ backgroundColor: 'rgba(23, 21, 59, 0.55)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                <div>
                  <p className="text-uppercase tracking-wider font-bold text-theme-highlight m-0 mb-2" style={{ fontSize: '0.7rem' }}>Created by</p>
                  <p className="h4 font-bold text-white m-0">S. Saravanan</p>
                </div>
                <a
                  href="https://saravanan-portfolio.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-link text-decoration-none text-theme-highlight font-semibold mt-4 p-0 d-flex align-items-center gap-2 hover-lavender-text"
                  style={{ fontSize: '0.9rem' }}
                >
                  Visit portfolio <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="rounded-5 border p-4 h-100 d-flex flex-column justify-content-between align-items-start" style={{ backgroundColor: 'rgba(23, 21, 59, 0.55)', borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                <div>
                  <p className="text-uppercase tracking-wider font-bold text-theme-highlight m-0 mb-2" style={{ fontSize: '0.7rem' }}>Source code</p>
                  <p className="h4 font-bold text-white m-0">GitHub Repository</p>
                </div>
                <a
                  href="https://github.com/sreehari462/marksprint"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-link text-decoration-none text-theme-highlight font-semibold mt-4 p-0 d-flex align-items-center gap-2 hover-lavender-text"
                  style={{ fontSize: '0.9rem' }}
                >
                  Explore the code <Code size={16} />
                </a>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row align-items-center gap-3 pt-3">
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline-light border-theme-highlight text-theme-highlight px-4 py-3 font-bold text-uppercase w-100 w-sm-auto"
            style={{ borderRadius: '16px', fontSize: '0.85rem', letterSpacing: '0.05em', minWidth: '160px' }}
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/content-manager')}
            className="btn btn-theme-highlight text-theme-base font-bold py-3 px-4 shadow-highlight-glow w-100 w-sm-auto"
            style={{ borderRadius: '16px', fontSize: '0.85rem', letterSpacing: '0.05em', minWidth: '160px' }}
          >
            Manage Content
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lavender-text:hover {
          color: white !important;
        }
      `}} />
    </div>
  );
}
