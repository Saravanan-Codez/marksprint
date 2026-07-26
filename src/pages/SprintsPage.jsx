import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, FlaskConical, Dna, Atom, Calculator, Code2,
  Languages
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

export default function SprintsPage() {
  const navigate = useNavigate();
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
    <div className="anim-fade-in font-mono">
      {/* TARGET SECTOR WALL */}
      <section id="subjectGrid" className="py-2">
        <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter m-0" style={{ color: 'var(--text-main)' }}>
              CORE SPRINTS_
            </h2>
            <p className="text-brand font-bold text-xs uppercase m-0 mt-1">
              SELECT A SUBJECT TO LAUNCH HIGH-SPEED REVISION SPRINT
            </p>
          </div>

          <div style={{ maxWidth: '280px' }} className="w-100">
            <input
              type="text"
              placeholder="SEARCH SPRINT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-100 form-control"
            />
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className="row g-4">
          {filteredSubjects.length === 0 ? (
            <div className="col-12">
              <div className="border-brutal p-5 text-center shadow-hard" style={{ background: 'var(--bg-card)' }}>
                <h3 className="font-headline text-3xl font-black uppercase mb-2" style={{ color: 'var(--text-main)' }}>NO TARGETS FOUND</h3>
                <p className="font-mono text-sm uppercase" style={{ color: 'var(--text-muted)' }}>YOUR SEARCH RETURNED ZERO MATCHES. ADJUST SEARCH PARAMETERS.</p>
              </div>
            </div>
          ) : (
            filteredSubjects.map((s) => {
              const meta = SUBJECT_ICON[s.key];
              const Icon = meta.icon;

              return (
                <div key={s.key} className="col-12 col-md-6 col-lg-4">
                  <div
                    onClick={() => navigate(`/quiz/${s.key}`)}
                    className="neo-brutal-card p-4 h-100 d-flex flex-column justify-content-between cursor-pointer group"
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="bg-brand text-white d-flex align-items-center justify-content-center border-brutal" style={{ width: '46px', height: '46px' }}>
                          <Icon size={24} />
                        </div>
                      </div>

                      <h3 className="font-headline text-3xl font-black uppercase leading-none mb-1">
                        {meta.label}
                      </h3>
                      <p className="text-xs font-bold m-0 font-mono" style={{ color: 'var(--text-muted)' }}>{meta.desc}</p>
                    </div>

                    <div className="pt-4 d-flex align-items-center justify-content-between border-t-brutal mt-4">
                      <span className="text-xs font-bold uppercase text-brand font-mono">DEPLOY SPRINT</span>
                      <div className="p-1.5 border-brutal bg-brand text-white group-hover:bg-white group-hover:text-brand transition-colors" style={{ opacity: 0.85 }}>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
