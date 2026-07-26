import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code, ShieldCheck, Sparkles, Users, Heart, Rocket, Layers, Cpu } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="w-100 py-4 position-relative">
      
      {/* Background radial glow */}
      <div 
        className="position-fixed inset-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12), transparent 70%), radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.1), transparent 60%)', 
          zIndex: 0 
        }} 
      />

      <div className="position-relative z-3 mx-auto" style={{ maxWidth: '1080px' }}>
        
        {/* Main Hero Card */}
        <div className="glass-card-cosmic p-4 p-md-5 mb-4 position-relative overflow-hidden">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge-falkon">
              <Sparkles size={13} /> FALKON LABS OPEN SOURCE
            </span>
          </div>

          <h1 className="font-bold text-white tracking-tight mb-3" style={{ fontSize: '2.4rem' }}>
            MARKSPRINT
          </h1>
          <p className="m-0 font-normal leading-relaxed" style={{ fontSize: '1.08rem', color: '#94A3B8', maxWidth: '72ch' }}>
            MarkSprint is a calm, high-performance open-source quiz and review platform engineered by <strong style={{ color: '#F8FAFC' }}>Falkon Labs</strong> to empower Tamil Nadu 12th-grade students to master board-exam subjects through active recall and realistic test simulation.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3 mt-4 pt-2">
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Rocket size={16} style={{ color: '#38BDF8' }} />
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 600 }}>100% Free & Open Source</span>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Layers size={16} style={{ color: '#818CF8' }} />
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 600 }}>7 Core TN 12th Subjects</span>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Cpu size={16} style={{ color: '#34D399' }} />
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 600 }}>Canvas Starfield Engine</span>
            </div>
          </div>
        </div>

        {/* MAINTAINERS SECTION */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Users size={20} style={{ color: '#38BDF8' }} />
            <h2 className="m-0 font-bold text-white" style={{ fontSize: '1.4rem' }}>Falkon Labs Team</h2>
          </div>

          <div className="glass-card-cosmic p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge-falkon">Falkon Labs</span>
                <span className="badge-falkon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#A5B4FC', borderColor: 'rgba(165, 180, 252, 0.3)' }}>Open Source Team</span>
              </div>
              <Heart size={18} className="text-rose-400 opacity-75" />
            </div>

            <p className="mb-4" style={{ fontSize: '0.94rem', color: '#94A3B8', lineHeight: '1.6', maxWidth: '75ch' }}>
              MarkSprint is designed, built, and actively maintained by the engineering team at <strong className="text-white">Falkon Labs</strong>. Our goal is to craft ultra-fast, student-first open-source tools with premium web ergonomics.
            </p>

            <div className="row g-4 pt-2">
              {/* Sree Hari Sk */}
              <div className="col-md-6">
                <div className="glass-card-cosmic p-4 h-100" style={{ border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '18px' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h3 className="font-bold m-0" style={{ fontSize: '1.25rem' }}>Sree Hari Sk</h3>
                    <span className="badge-falkon" style={{ fontSize: '0.65rem' }}>LEAD</span>
                  </div>
                  <p className="font-semibold mb-3" style={{ fontSize: '0.85rem', color: '#06B6D4' }}>Lead Developer & Maintainer</p>
                  <p className="m-0 mb-3" style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                    Drives core platform architecture, active recall quiz engine, canvas starfield performance, and repository maintenance.
                  </p>
                  <a
                    href="https://sreehari-sk.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="d-inline-flex align-items-center gap-2 font-bold text-decoration-none"
                    style={{ color: '#06B6D4', fontSize: '0.86rem' }}
                  >
                    Visit Portfolio Website <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* S. Saravanan */}
              <div className="col-md-6">
                <div className="glass-card-cosmic p-4 h-100" style={{ border: '1px solid rgba(129, 140, 248, 0.35)', borderRadius: '18px' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h3 className="font-bold m-0" style={{ fontSize: '1.25rem' }}>S. Saravanan</h3>
                    <span className="badge-falkon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818CF8', borderColor: 'rgba(129, 140, 248, 0.4)', fontSize: '0.65rem' }}>CO-DEV</span>
                  </div>
                  <p className="font-semibold mb-3" style={{ fontSize: '0.85rem', color: '#818CF8' }}>Co-Developer & Maintainer</p>
                  <p className="m-0 mb-3" style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                    Focuses on front-end user experience, TN state-board subject curriculum structure, content manager tools, and student interaction design.
                  </p>
                  <a
                    href="https://saravanan-codes.pages.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="d-inline-flex align-items-center gap-2 font-bold text-decoration-none"
                    style={{ color: '#818CF8', fontSize: '0.86rem' }}
                  >
                    Visit Portfolio Website <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS & FEATURES */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="glass-card-cosmic p-4 p-md-5 h-100">
              <h2 className="font-bold text-white mb-3" style={{ fontSize: '1.35rem' }}>How MarkSprint Works</h2>
              <p className="mb-4" style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Select any subject, configure practice or exam sprints, and use active recall review to close knowledge gaps. Designed for extreme focus without ad clutter or textbook drudgery.
              </p>

              <div className="d-flex flex-column gap-3">
                {[
                  'Instant access to all 7 TN state-board 12th subjects.',
                  'Realistic exam timer presets to build speed and confidence.',
                  'Practice mode with immediate feedback or Test mode with post-sprint review.',
                  'Active recall loops that resurface incorrect answers until mastered.'
                ].map((item) => (
                  <div 
                    key={item} 
                    className="rounded-4 p-3 d-flex align-items-center gap-3" 
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                  >
                    <ShieldCheck size={18} className="flex-shrink-0" style={{ color: '#38BDF8' }} />
                    <span style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.4' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="glass-card-cosmic p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <span className="badge-falkon mb-2">OPEN SOURCE REPO</span>
                <h3 className="font-bold text-white mt-2 mb-3" style={{ fontSize: '1.2rem' }}>Contribute on GitHub</h3>
                <p className="m-0 mb-4" style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.6' }}>
                  MarkSprint is maintained by Falkon Labs under an open-source model. We welcome contributions from developers, teachers, and students alike!
                </p>
              </div>

              <div className="d-flex flex-column gap-3">
                <a
                  href="https://github.com/sreehari462/marksprint"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-cosmic-outline py-3 px-4 d-flex align-items-center justify-content-center gap-2 font-bold text-decoration-none"
                  style={{ borderRadius: '2px', fontSize: '0.9rem' }}
                >
                  <Code size={18} /> View Repository on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row align-items-center gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="btn btn-cosmic-primary px-4 py-3 font-bold w-100 w-sm-auto"
            style={{ borderRadius: '2px', fontSize: '0.92rem', minWidth: '170px' }}
          >
            Start a Sprint
          </button>
          <button
            onClick={() => navigate('/content-manager')}
            className="btn btn-cosmic-outline px-4 py-3 font-bold w-100 w-sm-auto"
            style={{ borderRadius: '2px', fontSize: '0.92rem', minWidth: '170px' }}
          >
            Manage Content
          </button>
        </div>
      </div>
    </div>
  );
}

