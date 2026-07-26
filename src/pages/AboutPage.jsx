import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function AboutPage() {

  return (
    <div className="w-100 py-4 font-mono d-flex flex-column gap-5 anim-fade-in">
      
      {/* ── Mission Banner ────────────────────────────────────────────────────────── */}
      <div className="bg-brand border-brutal p-4 p-md-5 text-black shadow-hard-white">
        <h2 className="font-headline font-black text-uppercase leading-tight mb-3 text-black" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '0.9' }}>
          MARKSPRINT MISSION_
        </h2>
        <p className="font-headline font-black text-uppercase leading-snug m-0 text-black" style={{ fontSize: '1.25rem', maxWidth: '800px', lineHeight: '1.4' }}>
          CALM. HIGH-PERFORMANCE. OPEN SOURCE. ENGINEERED BY FALKON LABS TO EMPOWER TN 12TH GRADERS. MASTER BOARD EXAMS THROUGH ACTIVE RECALL.
        </p>
      </div>

      {/* ── Maintainers & Contribution Grid ─────────────────────────────────── */}
      <div className="row g-4">
        {/* The Command */}
        <div className="col-12 col-lg-6">
          <div className="neo-brutal-card p-4 p-md-5 h-100 shadow-hard-sm" style={{ background: 'var(--bg-main)' }}>
            <h3 className="font-headline text-3xl font-black uppercase mb-4 border-b-brutal pb-2" style={{ color: 'var(--text-main)' }}>
              THE COMMAND_
            </h3>

            <div className="d-flex flex-column gap-3">
              {/* Sree Hari Sk */}
              <a
                href="https://sreehari-sk.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="p-4 border-brutal text-decoration-none hover:bg-brand transition-all d-block group"
                style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h4 className="font-headline text-2xl font-black uppercase m-0 group-hover:text-black transition-colors" style={{ color: 'var(--text-main)' }}>Sree Hari Sk</h4>
                  <ExternalLink size={18} className="text-brand group-hover:text-black transition-colors" />
                </div>
                <p className="text-xs font-bold font-mono m-0 uppercase group-hover:text-black transition-colors" style={{ color: 'var(--text-muted)' }}>LEAD DEVELOPER / PLATFORM ARCHITECT</p>
              </a>

              {/* S. Saravanan */}
              <a
                href="https://saravanan-codes.pages.dev/"
                target="_blank"
                rel="noreferrer"
                className="p-4 border-brutal text-decoration-none hover:bg-brand transition-all d-block group"
                style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h4 className="font-headline text-2xl font-black uppercase m-0 group-hover:text-black transition-colors" style={{ color: 'var(--text-main)' }}>S. Saravanan</h4>
                  <ExternalLink size={18} className="text-brand group-hover:text-black transition-colors" />
                </div>
                <p className="text-xs font-bold font-mono m-0 uppercase group-hover:text-black transition-colors" style={{ color: 'var(--text-muted)' }}>CO-DEV / UX STRATEGIST</p>
              </a>
            </div>
          </div>
        </div>

        {/* Contribute Box */}
        <div className="col-12 col-lg-6">
          <div className="neo-brutal-card p-4 p-md-5 d-flex flex-column justify-content-between h-100 shadow-hard-sm text-center" style={{ background: 'var(--bg-main)' }}>
            <div>
              <h3 className="font-headline text-4xl font-black uppercase mb-3 text-brand">
                CONTRIBUTE_
              </h3>
              <p className="font-bold mb-4 text-sm uppercase" style={{ color: 'var(--text-muted)' }}>
                OPEN SOURCE UNDER MIT LICENSE. JOIN THE REPOSITORY ON GITHUB TO CONTRIBUTE DATASETS, FEATURES, OR CODE IMPROVEMENTS.
              </p>
            </div>

            <a
              href="https://github.com/sreehari462/marksprint"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary px-6 py-4 font-headline text-2xl font-black uppercase text-decoration-none d-inline-block w-100"
            >
              VIEW SOURCE CODE
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

