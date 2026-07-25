import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, FlaskConical, Dna, Atom, Calculator, Code2,
  Languages, Sparkles, Trophy, BookMarked, Target, Clock, Zap,
  Brain, Award, Gauge
} from 'lucide-react';

const SUBJECT_ICON = {
  biology:     { icon: Dna,         color: '#10B981', bg: '#D1FAE5', label: 'Biology' },
  physics:     { icon: Atom,        color: '#4F46E5', bg: '#E0E7FF', label: 'Physics' },
  chemistry:   { icon: FlaskConical,color: '#F59E0B', bg: '#FEF3C7', label: 'Chemistry' },
  maths:       { icon: Calculator,  color: '#8B5CF6', bg: '#EDE9FE', label: 'Maths' },
  cs:          { icon: Code2,       color: '#0EA5E9', bg: '#E0F2FE', label: 'Computer Science' },
  english:     { icon: Languages,   color: '#EC4899', bg: '#FCE7F3', label: 'English' },
  tamil:       { icon: BookOpen,    color: '#EF4444', bg: '#FEE2E2', label: 'Tamil' }
};

const SUBJECTS = [
  { key: 'biology',   desc: 'Cell biology, human systems, diagrams.' },
  { key: 'physics',   desc: 'Mechanics, optics, modern physics.' },
  { key: 'chemistry', desc: 'Organic, inorganic and physical chemistry.' },
  { key: 'maths',     desc: 'Algebra, calculus and problem solving.' },
  { key: 'cs',        desc: 'Programming logic and data structures.' },
  { key: 'english',   desc: 'Grammar, comprehension and writing.' },
  { key: 'tamil',     desc: 'Language and literature practice.' }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = SUBJECTS.filter((s) => {
    const meta = SUBJECT_ICON[s.key];
    const query = searchTerm.toLowerCase().trim();
    return (
      !query ||
      meta.label.toLowerCase().includes(query) ||
      s.desc.toLowerCase().includes(query) ||
      s.key.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffsetY = Math.min(scrollY * 0.15, 60);

  return (
    <div className="d-flex flex-column gap-6 gap-lg-8 anim-fade-up" style={{ position: 'relative', zIndex: 2 }}>

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section
        className="glass-card surface p-5 p-md-6 p-lg-7 position-relative overflow-hidden parallax-container"
        style={{
          background:
            'color-mix(in oklab, var(--surface) 85%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)'
        }}
      >
        <div
          className="parallax-layer"
          style={{
            transform: `translateY(${parallaxOffsetY}px)`,
            willChange: 'transform'
          }}
        >
        <div
          className="position-absolute anim-float"
          style={{
            width: '320px', height: '320px',
            right: '-80px', top: '-80px',
            background: 'radial-gradient(square at 30% 30%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 65%)',
            pointerEvents: 'none',
            borderRadius: '0px'
          }}
        />
        <div
          className="position-absolute anim-float"
          style={{
            width: '260px', height: '260px',
            left: '-60px', bottom: '-70px',
            background: 'radial-gradient(square at 60% 40%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 65%)',
            pointerEvents: 'none',
            animationDelay: '1.2s',
            borderRadius: '0px'
          }}
        />

        <div className="position-relative z-2 py-3">
          <div className="max-w-3xl">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge-falkon">
                <Sparkles size={13} /> Falkon Labs Open Source
              </span>
            </div>
            <h1 className="text-display mb-3 font-bold text-white" style={{ fontSize: '2.6rem', letterSpacing: '-0.02em' }}>
              Sprint through every <span style={{ color: '#38BDF8' }}>subject</span>.
            </h1>
            <p className="text-lead mb-4" style={{ maxWidth: '64ch', color: '#94A3B8', fontSize: '1.08rem', lineHeight: '1.6' }}>
              A calm, focused open-source quiz platform engineered by Falkon Labs for Tamil Nadu 12th graders. Configure realistic timed sprints, review incorrect answers, and master board-exam subjects.
            </p>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
              <button
                onClick={() => document.getElementById('subjects-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-cosmic-primary px-4 py-3 font-bold d-inline-flex align-items-center gap-2"
                style={{ borderRadius: '0px', fontSize: '0.96rem' }}
              >
                Choose a Subject
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="btn btn-cosmic-outline px-4 py-3 font-bold"
                style={{ borderRadius: '0px', fontSize: '0.96rem' }}
              >
                Learn More
              </button>
            </div>

            {/* Quick stats row */}
            <div className="d-flex flex-wrap gap-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {[
                { icon: Target,  k: '7', v: 'Core Subjects' },
                { icon: Clock,   k: '4', v: 'Timer Presets' },
                { icon: Zap,     k: '∞', v: 'Sprint Attempts' },
                { icon: Award,   k: '2', v: 'Sprint Modes' }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.v} className="d-flex align-items-center gap-3 anim-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '42px', height: '42px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#38BDF8',
                        borderRadius: '0px'
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-white" style={{ fontSize: '1.15rem', lineHeight: 1.1 }}>{s.k}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{s.v}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* =========================================
          SUBJECT GRID
          ========================================= */}
      <section id="subjects-grid">
        <div className="d-flex align-items-end justify-content-between mb-4 mb-md-5 flex-wrap gap-3">
          <div>
            <div className="chip chip-primary mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
              <BookMarked size={12} /> Subjects
            </div>
            <h2 className="text-h1">Pick a subject to sprint</h2>
            <p className="mt-2 text-lead" style={{ maxWidth: '56ch' }}>
              All 7 core Grade 12 TN state-board subjects available immediately. Click a card to jump into setup.
            </p>
          </div>

          {/* Instant Search Filter */}
          <div className="w-100 max-w-xs">
            <input
              type="text"
              placeholder="Search subjects or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control cosmic-input px-3 py-2 font-semibold"
              style={{ borderRadius: '0px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        <div className="row g-4">
          {filteredSubjects.map((s, idx) => {
            const meta = SUBJECT_ICON[s.key];
            const Icon = meta.icon;
            const isSelected = selected === s.key;
            return (
              <div key={s.key} className="col-12 col-sm-6 col-lg-4 anim-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <button
                  type="button"
                  className="glass-card-cosmic glass-card-cosmic-hover edge-glow-desktop p-4 p-md-5 w-100 text-start h-100 position-relative d-flex flex-column"
                  style={{
                    outline: isSelected ? `2px solid #00F0FF` : 'none',
                    outlineOffset: isSelected ? '2px' : 0,
                    cursor: 'pointer',
                    borderRadius: '0px'
                  }}
                  onMouseEnter={() => setHovered(s.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { setSelected(s.key); setTimeout(() => navigate(`/quiz/${s.key}`), 80); }}
                >
                  {/* Top row */}
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '52px', height: '52px',
                        background: meta.bg,
                        color: meta.color,
                        borderRadius: '0px'
                      }}
                    >
                      <Icon size={26} strokeWidth={2.1} />
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-center transition-all"
                      style={{
                        width: '32px', height: '32px',
                        background: hovered === s.key ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                        color: hovered === s.key ? 'white' : '#94A3B8',
                        borderRadius: '0px'
                      }}
                    >
                      <ArrowRight size={16} strokeWidth={2.3} />
                    </div>
                  </div>

                  <h3 className="text-h3 mb-2" style={{ color: 'var(--ink-900)' }}>{meta.label}</h3>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{s.desc}</p>

                  <div className="mt-auto pt-4 d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-1.5" style={{ color: 'var(--ink-400)' }}>
                      <Gauge size={14} />
                      <span style={{ fontSize: '0.76rem', fontWeight: 500 }}>4 timer presets</span>
                    </div>
                    <div className="d-flex align-items-center gap-1.5 ml-auto" style={{ color: 'var(--ink-400)' }}>
                      <Brain size={14} />
                      <span style={{ fontSize: '0.76rem', fontWeight: 500 }}>Review mode</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          FEATURE HIGHLIGHTS
          ========================================= */}
      <section
        className="row g-4 mt-2"
      >
        {[
          {
            icon: Clock, tint: 'primary', title: 'Realistic Exam Timers',
            body: 'Per-question and global timers mimic real board-exam pressure so you get used to working under time constraints.'
          },
          {
            icon: BookMarked, tint: 'accent', title: 'Bookmark + Resume',
            body: 'Save tricky questions for later, or exit mid-sprint and resume exactly where you left off — progress is auto-saved.'
          },
          {
            icon: Brain, tint: 'success', title: 'Active Recall Loops',
            body: 'Wrong answers are re-inserted into the queue until you answer correctly. Fast, focused mastery per concept.'
          },
          {
            icon: Trophy, tint: 'warning', title: 'Persistent Statistics',
            body: 'Best score, rolling average, and attempt counts tracked per subject — watch your improvement compound over sessions.'
          }
        ].map((f, idx) => {
          const Icon = f.icon;
          const tintMap = {
            primary: { bg: 'var(--primary-100)', fg: 'var(--primary-600)' },
            accent:  { bg: 'var(--accent-100)',  fg: 'var(--accent-600)' },
            success: { bg: 'var(--success-100)', fg: 'var(--success)' },
            warning: { bg: 'var(--warning-100)', fg: '#B45309' }
          };
          const tint = tintMap[f.tint];
          return (
            <div key={f.title} className="col-12 col-md-6 col-xl-3 anim-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="surface surface-hover h-100 p-4 p-md-5">
                <div
                  className="d-flex align-items-center justify-content-center rounded-4 mb-4"
                  style={{
                    width: '48px', height: '48px',
                    background: tint.bg,
                    color: tint.fg
                  }}
                >
                  <Icon size={22} strokeWidth={2.1} />
                </div>
                <h3 className="text-h3 mb-2" style={{ color: 'var(--ink-900)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{f.body}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
