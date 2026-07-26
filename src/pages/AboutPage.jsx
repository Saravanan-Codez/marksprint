import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code, ShieldCheck, Sparkles, Users, Heart, Rocket, Layers, Cpu } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

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
          <div className="bg-white border-brutal p-4 p-md-5 text-black h-100 shadow-hard-sm">
            <h3 className="font-headline text-3xl font-black uppercase mb-4 text-black border-b-2 border-black pb-2">
              THE COMMAND_
            </h3>

            <div className="d-flex flex-column gap-3">
              {/* Sree Hari Sk */}
              <a
                href="https://sreehari-sk.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="bg-black text-brand p-4 border-2 border-black text-decoration-none hover:bg-brand hover:text-black transition-all d-block"
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h4 className="font-headline text-2xl font-black uppercase m-0">Sree Hari Sk</h4>
                  <ExternalLink size={18} />
                </div>
                <p className="text-xs font-bold font-mono opacity-80 m-0 uppercase">LEAD DEVELOPER / PLATFORM ARCHITECT</p>
              </a>

              {/* S. Saravanan */}
              <a
                href="https://saravanan-codes.pages.dev/"
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white p-4 border-2 border-black text-decoration-none hover:bg-brand hover:text-black transition-all d-block"
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h4 className="font-headline text-2xl font-black uppercase m-0">S. Saravanan</h4>
                  <ExternalLink size={18} />
                </div>
                <p className="text-xs font-bold font-mono opacity-80 m-0 uppercase">CO-DEV / UX STRATEGIST</p>
              </a>
            </div>
          </div>
        </div>

        {/* Contribute Box */}
        <div className="col-12 col-lg-6">
          <div className="bg-black border-brutal p-4 p-md-5 text-white d-flex flex-column justify-content-between h-100 shadow-hard-sm text-center">
            <div>
              <h3 className="font-headline text-4xl font-black uppercase mb-3 text-brand">
                CONTRIBUTE_
              </h3>
              <p className="font-bold mb-4 text-sm uppercase text-slate-300">
                OPEN SOURCE UNDER MIT LICENSE. JOIN THE REPOSITORY ON GITHUB TO CONTRIBUTE DATASETS, FEATURES, OR CODE IMPROVEMENTS.
              </p>
            </div>

            <a
              href="https://github.com/sreehari462/marksprint"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black border-2 border-black px-6 py-4 font-headline text-2xl font-black uppercase hover:bg-brand transition-all text-decoration-none d-inline-block"
            >
              VIEW SOURCE CODE
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

