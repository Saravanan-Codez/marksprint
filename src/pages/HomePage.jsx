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
        <div className="bg-brand text-black border-2 border-black p-3.5 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 shadow-hard-sm">
          <div className="d-flex align-items-center gap-2">
            <Sparkles size={20} className="flex-shrink-0 text-black" />
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
      <section className="position-relative overflow-hidden py-3">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-7">
            <span className="d-inline-block bg-brand text-black px-3 py-1 font-bold text-xs mb-3 border border-black uppercase font-mono">
              FALKON LABS // OPEN SOURCE
            </span>
            <h1 className="font-headline font-black text-uppercase tracking-tighter mb-4 text-white" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', lineHeight: '0.92' }}>
              STRIKE <span className="text-brand">HARD</span><br />
              SPRINT <span className="text-cyan-400">FAST</span>
            </h1>
          </div>

          <div className="col-12 col-lg-5">
            <div className="bg-slate-900/90 border-2 border-brand p-4 p-md-5 shadow-hard text-white" style={{ borderRadius: '12px' }}>
              <p className="font-headline text-lg font-black uppercase leading-tight mb-4 text-white" style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>
                ELIMINATE WEAKNESS. MASTER THE BOARD. 7 CORE SUBJECTS. ZERO DISTRACTIONS. ENGINEERED BY FALKON LABS.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <button
                  onClick={() => document.getElementById('subjectGrid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-brand text-black border-2 border-black px-4 py-3 font-headline text-base font-black uppercase hover:bg-white hover:text-black transition-all shadow-hard-sm"
                >
                  STRIKE NOW
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="bg-black text-white border-2 border-brand px-4 py-3 font-headline text-base font-black uppercase hover:bg-brand hover:text-black transition-all shadow-hard-sm"
                >
                  RECON
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE BANNER */}
      <div className="bg-brand border-y-2 border-black py-3 my-1 overflow-hidden rotate-1">
        <div className="animate-marquee-infinite">
          <div className="font-headline text-xl font-black uppercase flex gap-5 text-black pr-5">
            <span>BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL //</span>
          </div>
          <div className="font-headline text-xl font-black uppercase flex gap-5 text-black pr-5">
            <span>BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL // BIOLOGY // PHYSICS // CHEMISTRY // MATHS // COMPUTER SCIENCE // ENGLISH // TAMIL //</span>
          </div>
        </div>
      </div>

      {/* TARGET SECTOR WALL */}
      <section id="subjectGrid" className="py-2">
        <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter m-0 text-white">
              TARGET SECTORS_
            </h2>
            <p className="text-brand font-bold text-xs uppercase m-0 mt-1">
              SELECT A SUBJECT TO LAUNCH HIGH-SPEED REVISION SPRINT
            </p>
          </div>

          <div style={{ maxWidth: '280px' }} className="w-100">
            <input
              type="text"
              placeholder="SEARCH SECTOR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-100 bg-slate-900 text-brand border-2 border-brand/50 p-2.5 font-mono font-bold text-xs uppercase outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className="row g-4">
          {filteredSubjects.map((s) => {
            const meta = SUBJECT_ICON[s.key];
            const Icon = meta.icon;

            return (
              <div key={s.key} className="col-12 col-md-6 col-lg-4">
                <div
                  onClick={() => navigate(`/quiz/${s.key}`)}
                  className="neo-brutal-card p-4.5 h-100 d-flex flex-column justify-content-between cursor-pointer group"
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="w-12 h-12 bg-brand text-black flex items-center justify-center border-2 border-black" style={{ width: '46px', height: '46px' }}>
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-black bg-brand px-2.5 py-1 border border-black font-mono">
                        {meta.preset}
                      </span>
                    </div>

                    <h3 className="font-headline text-3xl font-black uppercase leading-none mb-1 text-white">
                      {meta.label}
                    </h3>
                    <p className="text-xs font-bold text-slate-300 m-0 font-mono">{meta.desc}</p>
                  </div>

                  <div className="pt-4 d-flex align-items-center justify-content-between border-t-2 border-slate-700 mt-4">
                    <span className="text-xs font-bold uppercase text-brand font-mono">DEPLOY SPRINT →</span>
                    <div className="p-1.5 border-2 border-black bg-brand text-black group-hover:bg-white group-hover:text-black transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INDUSTRIAL STATS ROW */}
      <section className="py-4 border-t-2 border-brand/40">
        <div className="row g-3 font-mono">
          {[
            { k: '07', v: 'CORE_SUBJECTS', bg: 'bg-slate-900 text-white border-2 border-brand/40' },
            { k: '04', v: 'TIMER_PRESETS', bg: 'bg-brand text-black border-2 border-black' },
            { k: '∞',  v: 'ATTEMPTS',     bg: 'bg-slate-900 text-white border-2 border-brand/40' },
            { k: '02', v: 'SPRINT_MODES', bg: 'bg-slate-900 text-white border-2 border-brand/40' }
          ].map((stat, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className={`${stat.bg} p-4 shadow-hard-sm h-100`}>
                <div className="font-headline text-5xl font-black">{stat.k}</div>
                <div className="text-xs font-bold uppercase tracking-widest mt-2">{stat.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
