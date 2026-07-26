import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  ArrowRight, BookOpen, FlaskConical, Dna, Atom, Calculator, Code2,
  Languages, Sparkles, Trophy, Clock, Zap, Brain, Shield, ShieldCheck, Gauge, Target
} from 'lucide-react';

const SUBJECT_ICON = {
  biology:     { icon: Dna,          label: 'BIOLOGY',          desc: 'CELLS. SYSTEMS. DIAGRAMS.', preset: '[ 04 PRESETS ]' },
  physics:     { icon: Atom,         label: 'PHYSICS',          desc: 'MECHANICS & OPTICS',        preset: '[ 04 PRESETS ]' },
  chemistry:   { icon: FlaskConical, label: 'CHEMISTRY',        desc: 'ORGANIC & PHYSICAL',        preset: '[ 04 PRESETS ]' },
  maths:       { icon: Calculator,   label: 'MATHS',            desc: 'ALGEBRA & CALCULUS',        preset: '[ 04 PRESETS ]' },
  cs:          { icon: Code2,        label: 'COMP SCI',         desc: 'LOGIC & DATA STRUCTURES',   preset: '[ 04 PRESETS ]' },
  english:     { icon: Languages,    label: 'ENGLISH',          desc: 'GRAMMAR & COMPREHENSION',   preset: '[ 04 PRESETS ]' },
  tamil:       { icon: BookOpen,     label: 'TAMIL',            desc: 'LANGUAGE & LITERATURE',     preset: '[ 04 PRESETS ]' }
};

const SUBJECTS = [
  { key: 'biology' },
  { key: 'physics' },
  { key: 'chemistry' },
  { key: 'maths' },
  { key: 'cs' },
  { key: 'english' },
  { key: 'tamil' }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = SUBJECTS.filter((s) => {
    const meta = SUBJECT_ICON[s.key];
    const query = searchTerm.toLowerCase().trim();
    return (
      !query ||
      meta.label.toLowerCase().includes(query) ||
      meta.desc.toLowerCase().includes(query) ||
      s.key.toLowerCase().includes(query)
    );
  });

  return (
    <div className="d-flex flex-column gap-5 anim-fade-in font-mono">

      {/* Guest Status Banner */}
      {!user && (
        <div className="bg-brand text-white border-2 border-black p-3.5 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 shadow-hard-sm">
          <div className="d-flex align-items-center gap-2">
            <Sparkles size={20} className="flex-shrink-0 text-white" />
            <span className="font-bold uppercase text-xs" style={{ letterSpacing: '0.04em' }}>
              <strong>RECRUIT NOTICE:</strong> PRACTICING IN GUEST MODE. SPRINT FREE OR ENLIST AN ACCOUNT TO SAVE STREAKS & CLIMB LEAGUES.
            </span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-black text-white border-2 border-black px-4 py-2 font-headline font-black uppercase text-xs hover:bg-white hover:text-black transition-all flex-shrink-0 shadow-hard-sm"
          >
            ENLIST NOW_
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="position-relative overflow-hidden py-5 my-md-4">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-7">
            <span className="d-inline-block bg-brand text-white px-3 py-1 font-bold text-xs mb-4 border border-black uppercase font-mono shadow-hard-sm">
              FALKON LABS // OPEN SOURCE
            </span>
            <h1 className="font-headline font-black text-uppercase tracking-tighter mb-4" style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', lineHeight: '0.9', color: 'var(--text-main)' }}>
              STRIKE <span className="text-brand">HARD</span><br />
              SPRINT <span style={{ color: 'var(--accent)' }}>FAST</span>
            </h1>
            <p className="font-mono text-lg font-bold mb-4 uppercase" style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
              Master TN 12th Board Exams through High-Speed Active Recall. Stop reading. Start executing.
            </p>
          </div>

          <div className="col-12 col-lg-5">
            <div className="neo-brutal-card p-4 p-md-5 shadow-hard" style={{ background: 'var(--bg-main)' }}>
              <p className="font-headline text-lg font-black uppercase leading-tight mb-4" style={{ fontSize: '1.15rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                ELIMINATE WEAKNESS. MASTER THE BOARD. 7 CORE SUBJECTS. ZERO DISTRACTIONS. ENGINEERED BY FALKON LABS.
              </p>
              <div className="d-flex flex-column gap-3">
                <button
                  onClick={() => navigate('/sectors')}
                  className="btn btn-primary py-3 font-headline text-xl font-black shadow-hard-sm"
                >
                  STRIKE NOW
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="btn py-3 font-headline text-xl font-black shadow-hard-sm"
                >
                  RECON (ABOUT)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE BANNER */}
      <div className="w-100 overflow-hidden" style={{ maxWidth: '100vw' }}>
        <div className="bg-brand border-y-brutal py-3 my-1 overflow-hidden rotate-1 shadow-hard-sm">
          <div className="animate-marquee-infinite">
            <div className="font-headline text-xl font-black uppercase flex gap-5 text-white pr-5">
              <span>BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL //</span>
            </div>
            <div className="font-headline text-xl font-black uppercase flex gap-5 text-white pr-5">
              <span>BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL //</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE SYSTEMS SECTION */}
      <section className="py-5 my-md-4">
        <div className="text-center mb-5">
          <h2 className="font-headline text-5xl font-black uppercase tracking-tighter m-0" style={{ color: 'var(--text-main)' }}>
            CORE SYSTEMS_
          </h2>
          <p className="text-brand font-bold text-sm uppercase m-0 mt-2 font-mono">
            ARCHITECTED FOR MAXIMUM RETENTION
          </p>
        </div>
        
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="neo-brutal-card p-4 p-md-5 h-100 shadow-hard-sm" style={{ background: 'var(--bg-main)' }}>
              <div className="bg-brand text-white border-brutal d-inline-flex p-3 mb-4">
                <Zap size={28} />
              </div>
              <h3 className="font-headline text-2xl font-black uppercase mb-3" style={{ color: 'var(--text-main)' }}>RAPID FIRE SPRINTS</h3>
              <p className="font-mono text-sm uppercase font-bold m-0" style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Micro-quizzes engineered to test reflex memory. No long essays. Pure speed and accuracy metrics.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="neo-brutal-card p-4 p-md-5 h-100 shadow-hard-sm" style={{ background: 'var(--bg-main)' }}>
              <div className="bg-brand text-white border-brutal d-inline-flex p-3 mb-4">
                <Gauge size={28} />
              </div>
              <h3 className="font-headline text-2xl font-black uppercase mb-3" style={{ color: 'var(--text-main)' }}>ADVANCED TELEMETRY</h3>
              <p className="font-mono text-sm uppercase font-bold m-0" style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Track per-question time, identify weak sectors, and monitor XP growth with pinpoint precision.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="neo-brutal-card p-4 p-md-5 h-100 shadow-hard-sm" style={{ background: 'var(--bg-main)' }}>
              <div className="bg-brand text-white border-brutal d-inline-flex p-3 mb-4">
                <Trophy size={28} />
              </div>
              <h3 className="font-headline text-2xl font-black uppercase mb-3" style={{ color: 'var(--text-main)' }}>LEADERBOARDS</h3>
              <p className="font-mono text-sm uppercase font-bold m-0" style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Compete on the Sprint Leaderboard. Send kudos, maintain streaks, and climb the tactical divisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTION FLOW */}
      <section className="py-5 mb-5 border-y-brutal bg-brand text-white shadow-hard" style={{ position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', width: '100vw' }}>
        <div className="mx-auto px-4" style={{ maxWidth: '1380px' }}>
          <div className="text-center mb-5">
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter m-0 text-black">
              EXECUTION PROTOCOL_
            </h2>
          </div>
          <div className="row g-4 text-center">
            <div className="col-12 col-md-4">
              <div className="font-headline text-6xl font-black mb-3" style={{ opacity: 0.3, color: '#000' }}>01</div>
              <h4 className="font-headline text-xl font-black uppercase mb-2 text-black">SELECT SECTOR</h4>
              <p className="font-mono text-xs font-bold uppercase m-0 text-white" style={{ opacity: 0.9 }}>Lock onto a core subject target.</p>
            </div>
            <div className="col-12 col-md-4">
              <div className="font-headline text-6xl font-black mb-3" style={{ opacity: 0.3, color: '#000' }}>02</div>
              <h4 className="font-headline text-xl font-black uppercase mb-2 text-black">DEPLOY SPRINT</h4>
              <p className="font-mono text-xs font-bold uppercase m-0 text-white" style={{ opacity: 0.9 }}>Execute active recall under time pressure.</p>
            </div>
            <div className="col-12 col-md-4">
              <div className="font-headline text-6xl font-black mb-3" style={{ opacity: 0.3, color: '#000' }}>03</div>
              <h4 className="font-headline text-xl font-black uppercase mb-2 text-black">ANALYZE DATA</h4>
              <p className="font-mono text-xs font-bold uppercase m-0 text-white" style={{ opacity: 0.9 }}>Review telemetry and patch weaknesses.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
