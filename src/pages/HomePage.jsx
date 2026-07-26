import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
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
  const { user } = useAuth();
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

      {!user && (
        <div className="banner-suggestion p-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-2">
          <div className="d-flex align-items-center gap-2">
            <Sparkles size={18} className="text-cyan-400 flex-shrink-0" />
            <span style={{ fontSize: '0.88rem' }}>
              <strong>Practicing as Guest!</strong> You can sprint through all subjects free without an account, or create an account to save streaks.
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-accent btn-sm font-bold px-3 py-1.5"
              style={{ fontSize: '0.82rem' }}
            >
              Create Free Account
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          HERO SECTION
          ========================================= */}
      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section
        className="glass-card-cosmic p-4 p-md-6 p-lg-7 position-relative overflow-hidden"
        style={{
          minHeight: '480px',
          marginBottom: '4rem',
          borderRadius: '24px'
        }}
      >
        <div className="position-relative z-2 py-2">
          <div style={{ maxWidth: '780px' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge-falkon">
                <Sparkles size={14} /> Falkon Labs Open Source
              </span>
            </div>
            <h1 className="text-display mb-3 text-white">
              Sprint through every <span style={{ color: '#06B6D4' }}>subject</span>.
            </h1>
            <p className="text-lead mb-4" style={{ maxWidth: '64ch', color: '#94A3B8', fontSize: '1.1rem', lineHeight: '1.6' }}>
              A calm, focused open-source quiz platform engineered by Falkon Labs for Tamil Nadu 12th graders. Configure realistic timed sprints, review incorrect answers, and master board-exam subjects.
            </p>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <button
                onClick={() => document.getElementById('subjects-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary btn-lg font-bold d-inline-flex align-items-center gap-2"
              >
                Choose a Subject
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="btn btn-outline btn-lg font-bold"
              >
                Learn More
              </button>
            </div>

            {/* Quick stats row */}
            <div className="d-flex flex-wrap gap-4 pt-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
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
                        width: '44px', height: '44px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#818CF8',
                        borderRadius: '12px'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-extrabold text-white" style={{ fontSize: '1.2rem', lineHeight: 1.1 }}>{s.k}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{s.v}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SUBJECT GRID
          ========================================= */}
      <section id="subjects-grid" style={{ marginTop: '2rem' }}>
        <div className="d-flex align-items-end justify-content-between mb-4 mb-md-5 flex-wrap gap-3">
          <div>
            <div className="chip chip-primary mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
              <BookMarked size={12} /> Subjects
            </div>
            <h2 className="text-h1">Pick a subject to sprint</h2>
            <p className="mt-2 text-lead" style={{ maxWidth: '56ch' }}>
              All 7 core Grade 12 TN state-board subjects available immediately. Click a card to jump into setup.
            </p>
          </div>

          {/* Instant Search Filter */}
          <div className="w-100" style={{ maxWidth: '320px' }}>
            <input
              type="text"
              placeholder="Search subjects or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control px-3.5 py-2.5 font-semibold"
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
                  className="glass-card-cosmic p-4 p-md-5 w-100 text-start h-100 position-relative d-flex flex-column border-0"
                  style={{
                    boxShadow: isSelected ? `0 0 0 2px #06B6D4, 0 10px 30px rgba(6, 182, 212, 0.3)` : undefined,
                    cursor: 'pointer',
                    borderRadius: '20px'
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
                        width: '54px', height: '54px',
                        background: meta.bg,
                        color: meta.color,
                        borderRadius: '16px'
                      }}
                    >
                      <Icon size={28} strokeWidth={2.1} />
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-center transition-all"
                      style={{
                        width: '36px', height: '36px',
                        background: hovered === s.key ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                        color: hovered === s.key ? 'white' : '#94A3B8',
                        borderRadius: '50%'
                      }}
                    >
                      <ArrowRight size={18} strokeWidth={2.3} />
                    </div>
                  </div>

                  <h3 className="text-h3 mb-2 text-white">{meta.label}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94A3B8' }}>{s.desc}</p>

                  <div className="mt-auto pt-4 d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-1.5" style={{ color: '#94A3B8' }}>
                      <Gauge size={14} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>4 timer presets</span>
                    </div>
                    <div className="d-flex align-items-center gap-1.5 ms-auto" style={{ color: '#94A3B8' }}>
                      <Brain size={14} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>Review mode</span>
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
        className="row g-4 mt-4"
      >
        {[
          {
            icon: Clock, tint: 'primary', title: 'Realistic Exam Timers',
            body: 'Per-question and global timers mimic real board-exam pressure so you get used to working under time constraints.'
          },
          {
            icon: Gauge, tint: 'accent', title: 'Offline-First Engine',
            body: 'Full PWA service worker caching ensures all datasets, subjects, and analytics remain 100% available without internet.'
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
            primary: { bg: 'rgba(99, 102, 241, 0.15)', fg: '#818CF8' },
            accent:  { bg: 'rgba(6, 182, 212, 0.15)',  fg: '#22D3EE' },
            success: { bg: 'rgba(16, 185, 129, 0.15)', fg: '#34D399' },
            warning: { bg: 'rgba(245, 158, 11, 0.15)', fg: '#FBBF24' }
          };
          const tint = tintMap[f.tint];
          return (
            <div key={f.title} className="col-12 col-md-6 col-xl-3 anim-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="glass-card-cosmic h-100 p-4 p-md-4" style={{ borderRadius: '18px' }}>
                <div
                  className="d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '48px', height: '48px',
                    background: tint.bg,
                    color: tint.fg,
                    borderRadius: '14px'
                  }}
                >
                  <Icon size={22} strokeWidth={2.1} />
                </div>
                <h3 className="text-h3 mb-2 text-white" style={{ fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#94A3B8' }}>{f.body}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
