import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, FlaskConical, Dna, Atom, Calculator, Code2,
  Languages, Sparkles, Trophy, Gauge, BookMarked, Target, Clock, Zap,
  Brain, Award
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

  return (
    <div className="d-flex flex-column gap-6 gap-lg-8 anim-fade-up">

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section
        className="surface p-5 p-md-6 p-lg-7 position-relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--surface) 0%, color-mix(in oklab, var(--primary-50) 60%, var(--surface)) 100%)'
        }}
      >
        <div
          className="position-absolute rounded-circle anim-float"
          style={{
            width: '320px', height: '320px',
            right: '-80px', top: '-80px',
            background: 'radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 65%)',
            pointerEvents: 'none'
          }}
        />
        <div
          className="position-absolute rounded-circle anim-float"
          style={{
            width: '260px', height: '260px',
            left: '-60px', bottom: '-70px',
            background: 'radial-gradient(circle at 60% 40%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 65%)',
            pointerEvents: 'none',
            animationDelay: '1.2s'
          }}
        />

        <div className="row g-5 align-items-center position-relative">
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="chip chip-primary d-inline-flex align-items-center gap-1.5 anim-fade-in">
                <Sparkles size={13} />
                New · Practice Mode v2
              </span>
            </div>
            <h1 className="text-display mb-3" style={{ maxWidth: '18ch' }}>
              Sprint through every <span style={{ color: 'var(--primary)' }}>subject</span>.
            </h1>
            <p className="text-lead mb-5" style={{ maxWidth: '52ch' }}>
              A calm, focused quiz platform for TN 12th graders. Configure realistic tests,
              review every wrong answer, and close knowledge gaps faster than textbook drudgery.
            </p>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <button
                onClick={() => document.getElementById('subjects-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary btn-lg"
              >
                Choose a Subject
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="btn btn-outline btn-lg"
              >
                Learn more
              </button>
            </div>

            {/* Quick stats row */}
            <div className="d-flex flex-wrap gap-4 mt-6 pt-5" style={{ gap: '2rem', marginTop: '2.5rem' }}>
              {[
                { icon: Target,  k: '7', v: 'Subjects' },
                { icon: Clock,   k: '4', v: 'Timer Presets' },
                { icon: Zap,     k: '∞', v: 'Attempts' },
                { icon: Award,   k: '2', v: 'Sprint Modes' }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.v} className="d-flex align-items-center gap-3 anim-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div
                      className="d-flex align-items-center justify-content-center rounded-4"
                      style={{
                        width: '42px', height: '42px',
                        background: 'var(--surface)',
                        border: '1px solid var(--ink-100)',
                        color: 'var(--primary-600)'
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-black" style={{ fontSize: '1.1rem', color: 'var(--ink-900)', lineHeight: 1.1 }}>{s.k}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--ink-400)' }}>{s.v}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-5 d-none d-lg-block">
            {/* Illustrated feature card */}
            <div className="surface p-5" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <span className="chip chip-accent"><Trophy size={13} /> Live demo</span>
                </div>
                <div className="d-flex align-items-center gap-1.5">
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: 'var(--success)', opacity: 0.9 }} />
                  <span style={{ fontSize: '0.76rem', color: 'var(--ink-400)', fontWeight: 500 }}>34/50 answered</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-500)' }}>Physics · Thermodynamics</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>68%</span>
                </div>
                <div className="progress" style={{ height: 10 }}>
                  <div className="progress-bar" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Fake question preview */}
              <div
                className="rounded-5 p-4 mb-3"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--ink-100)' }}
              >
                <p className="font-semibold mb-3" style={{ color: 'var(--ink-800)', fontSize: '0.92rem' }}>
                  Which law relates the entropy of a system to the heat transfer at a constant temperature?
                </p>
                <div className="d-flex flex-column gap-2">
                  {[
                    { t: "Newton's Second Law", c: false },
                    { t: 'Zeroth Law of Thermodynamics', c: false },
                    { t: 'Second Law of Thermodynamics', c: true },
                    { t: 'Ideal Gas Law', c: false }
                  ].map((opt, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 rounded-3 d-flex align-items-center gap-2"
                      style={{
                        background: opt.c ? 'color-mix(in oklab, var(--success) 10%, var(--surface))' : 'var(--surface)',
                        border: `1px solid ${opt.c ? 'color-mix(in oklab, var(--success) 40%, var(--ink-100))' : 'var(--ink-100)'}`,
                        color: opt.c ? 'var(--success)' : 'var(--ink-600)',
                        fontSize: '0.84rem',
                        fontWeight: opt.c ? 700 : 500
                      }}
                    >
                      <span style={{ width: 20, fontWeight: 800, opacity: 0.6 }}>{String.fromCharCode(65 + i)}.</span>
                      {opt.t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="d-flex gap-2">
                <div className="flex-grow-1 p-3 rounded-4" style={{ background: 'var(--success-100)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)', letterSpacing: 0.08 }}>CORRECT</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--ink-900)' }}>34</div>
                </div>
                <div className="flex-grow-1 p-3 rounded-4" style={{ background: 'var(--danger-100)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--danger)', letterSpacing: 0.08 }}>WRONG</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--ink-900)' }}>16</div>
                </div>
                <div className="flex-grow-1 p-3 rounded-4" style={{ background: 'var(--primary-100)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-600)', letterSpacing: 0.08 }}>AVG</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--ink-900)' }}>68%</div>
                </div>
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
              All 7 core Grade 12 TN state-board subjects available immediately. Click a card
              to jump into the setup screen.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {SUBJECTS.map((s, idx) => {
            const meta = SUBJECT_ICON[s.key];
            const Icon = meta.icon;
            const isSelected = selected === s.key;
            return (
              <div key={s.key} className="col-12 col-sm-6 col-lg-4 anim-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <button
                  type="button"
                  className="surface surface-hover p-4 p-md-5 w-100 text-start border-0 h-100 position-relative d-flex flex-column"
                  style={{
                    outline: isSelected ? `2px solid var(--primary)` : 'none',
                    outlineOffset: isSelected ? '2px' : 0,
                    cursor: 'pointer',
                    transform: hovered === s.key ? 'translateY(-4px)' : undefined
                  }}
                  onMouseEnter={() => setHovered(s.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { setSelected(s.key); setTimeout(() => navigate(`/quiz/${s.key}`), 80); }}
                >
                  {/* Top row */}
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-4"
                      style={{
                        width: '52px', height: '52px',
                        background: meta.bg,
                        color: meta.color
                      }}
                    >
                      <Icon size={26} strokeWidth={2.1} />
                    </div>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center transition-all"
                      style={{
                        width: '32px', height: '32px',
                        background: hovered === s.key ? 'var(--primary)' : 'var(--surface-3)',
                        color: hovered === s.key ? 'white' : 'var(--ink-500)'
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
