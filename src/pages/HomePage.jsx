import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Settings, MousePointer, Cloud, Star, Zap, BookOpen } from 'lucide-react';
import Carousel from '../components/Carousel';
import BorderGlow from '../components/BorderGlow';

const subjects = [
  { key: 'biology', label: 'Biology', description: 'Life science and important diagrams.' },
  { key: 'physics', label: 'Physics', description: 'Mechanics, optics and modern physics.' },
  { key: 'chemistry', label: 'Chemistry', description: 'Physical, organic and inorganic concepts.' },
  { key: 'maths', label: 'Maths', description: 'Algebra, calculus and problem solving.' },
  { key: 'cs', label: 'Computer Science', description: 'Programming logic and data structures.' },
  { key: 'english', label: 'English', description: 'Grammar, comprehension and vocabulary.' },
  { key: 'tamil', label: 'Tamil', description: 'Language practice for the board exam.' }
];

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].key);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [position, setPosition] = useState(1); // loop starting position is 1
  const navigate = useNavigate();

  const currentIdx = subjects.findIndex((s) => s.key === selectedSubject);
  const selected = subjects[currentIdx] || subjects[0];

  // Carousel items mapped with Lucide icons
  const carouselItems = subjects.map(s => ({
    id: s.key,
    title: s.label,
    description: s.description,
    icon: <BookOpen className="carousel-icon" />
  }));

  const handlePrev = () => {
    setIsConfirmed(false);
    setPosition(prev => prev - 1);
  };

  const handleNext = () => {
    setIsConfirmed(false);
    setPosition(prev => prev + 1);
  };

  useEffect(() => {
    setIsConfirmed(false);
  }, []);

  return (
    <div className="position-relative w-100 d-flex flex-column align-items-center justify-content-center py-4" style={{ maxWidth: '900px', minHeight: '68vh' }}>
      
      {/* 🔮 Deduplicated Single HUD Stats Widget in the Top Right Corner (Lavender color theme) */}
      <BorderGlow
        className="position-absolute d-none d-lg-block"
        edgeSensitivity={35}
        glowColor="270 80 80"
        backgroundColor="var(--color-surface-dark)"
        borderRadius={16}
        glowRadius={30}
        glowIntensity={1.0}
        colors={['#C8ACD6', '#433D8F', '#2E2A62']}
        style={{ 
          top: '0px', 
          right: '0px', 
          width: '210px', 
          zIndex: 30
        }}
      >
        <div className="d-flex flex-column gap-3 p-3">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1 text-theme-slate font-bold" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
              <span className="d-flex align-items-center gap-1"><Zap size={10} className="text-theme-highlight" /> PROGRESS</span>
              <span className="text-theme-highlight">110</span>
            </div>
            <div className="progress" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="progress-bar shadow" style={{ width: '70%', backgroundColor: 'var(--color-lavender)', boxShadow: '0 0 8px var(--color-lavender)' }} />
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1 text-theme-slate font-bold" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
              <span className="d-flex align-items-center gap-1"><Star size={10} className="text-theme-highlight" /> SKILLS</span>
              <span className="text-theme-highlight">10</span>
            </div>
            <div className="progress" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="progress-bar shadow" style={{ width: '45%', backgroundColor: 'var(--color-accent-dark)' }} />
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Main Content Workspace Stack */}
      <div className="d-flex flex-column align-items-center w-100 gap-4">

        {/* Grouped Carousel Row: Left Arrow, Central Carousel Orb, Right Arrow */}
        <div className="d-flex align-items-center justify-content-center gap-5 w-100">
          
          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="btn rounded-circle d-flex align-items-center justify-content-center p-0 border hover-lavender-border"
            style={{ 
              width: '60px', 
              height: '60px', 
              background: 'rgba(10, 15, 29, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              zIndex: 10
            }}
            aria-label="Previous Subject"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Central Controlled Subject Carousel (Subject Orb) */}
          <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '300px', height: '300px' }}>
            
            {/* Glowing outer circle bounds */}
            <div 
              className="position-absolute rounded-circle pointer-events-none" 
              style={{ 
                inset: '16px', 
                border: isConfirmed ? '2px solid var(--color-lavender)' : '1px solid rgba(255, 255, 255, 0.1)', 
                boxShadow: isConfirmed ? '0 0 35px rgba(200, 172, 214, 0.35)' : '0 0 15px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.5s ease'
              }} 
            />

            <Carousel 
              items={carouselItems}
              baseWidth={300}
              loop={true}
              round={true}
              position={position}
              setPosition={setPosition}
              onSelect={(id) => {
                setSelectedSubject(id);
                setIsConfirmed(false);
              }}
            />
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="btn rounded-circle d-flex align-items-center justify-content-center p-0 border hover-lavender-border"
            style={{ 
              width: '60px', 
              height: '60px', 
              background: 'rgba(10, 15, 29, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              zIndex: 10
            }}
            aria-label="Next Subject"
          >
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Subject description placed tightly underneath the carousel orb wrapper */}
        <p className="m-0 mt-2 text-center text-theme-slate font-light" style={{ fontSize: '0.8rem', letterSpacing: '0.05em', maxWidth: '280px', lineHeight: '1.5' }}>
          {selected.description}
        </p>

        {/* Action Buttons grouped comfortably below the description */}
        <div className="d-flex flex-column align-items-center gap-4 w-100 mt-2">
          
          {/* SELECT SUBJECT Button */}
          <button
            onClick={() => setIsConfirmed(true)}
            className={`btn d-flex align-items-center justify-content-between w-100 py-3 px-4 rounded-3 text-uppercase font-bold tracking-widest ${
              isConfirmed 
                ? 'btn-outline-light text-theme-highlight border-theme-highlight bg-white bg-opacity-5 shadow-highlight-glow' 
                : 'btn-outline-light text-white border-theme-accent shadow-highlight-glow'
            }`}
            style={{ 
              maxWidth: '350px',
              transition: 'all 0.3s ease',
              fontSize: '0.88rem',
              borderColor: isConfirmed ? 'var(--color-lavender)' : 'var(--color-accent-dark)'
            }}
          >
            <div style={{ width: '20px' }} /> {/* Balance spacer */}
            <span>{isConfirmed ? 'Subject Confirmed' : 'Select Subject'}</span>
            <div className="d-flex align-items-center gap-2 text-theme-highlight">
              <Cloud size={16} />
              <MousePointer size={14} className="animate-bounce-slow" />
            </div>
          </button>

          {/* Status Indicators Banner */}
          <div className="position-relative d-flex align-items-center justify-content-center py-2 px-5" style={{ width: '100%', maxWidth: '300px' }}>
            <svg className="position-absolute w-100 h-100 text-theme-highlight opacity-25" viewBox="0 0 200 40" fill="none">
              <path d="M 10 20 Q 50 35 100 20 Q 150 5 190 20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
              <path d="M 10 20 Q 50 5 100 20 Q 150 35 190 20" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 4" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={isConfirmed ? 'confirmed' : 'waiting'}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="text-white font-bold uppercase tracking-widest"
                style={{ fontSize: '0.74rem' }}
              >
                {isConfirmed ? `Confirmed: ${selected.label}` : 'Awaiting Selection'}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* PROCEED TO SETUP Button */}
          <button
            onClick={() => {
              if (isConfirmed) {
                navigate(`/quiz/${selected.key}`);
              } else {
                setIsConfirmed(true);
              }
            }}
            className={`btn w-100 py-3 rounded-4 position-relative overflow-hidden text-uppercase font-bold tracking-wider d-flex align-items-center justify-content-center gap-2 ${
              isConfirmed 
                ? 'btn-outline-light text-white shadow-highlight-glow' 
                : 'btn-outline-secondary text-secondary'
            }`}
            style={{ 
              maxWidth: '260px',
              fontSize: '0.78rem',
              transition: 'all 0.5s ease',
              borderColor: isConfirmed ? 'var(--color-lavender)' : 'rgba(255, 255, 255, 0.15)'
            }}
          >
            {/* Sliding progress bar backdrop */}
            <div 
              className="position-absolute top-0 bottom-0 start-0 bg-white bg-opacity-10" 
              style={{ width: isConfirmed ? '100%' : '0%', transition: 'all 500ms ease' }}
            />
            <span className="position-relative z-3">Proceed to Setup</span>
            <Settings size={14} className={`position-relative z-3 ${isConfirmed ? 'animate-spin-slow text-theme-highlight' : 'text-secondary'}`} />
          </button>

        </div>

      </div>

      {/* Custom CSS overrides inside style tag for layout glow effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lavender-border:hover {
          border-color: var(--color-lavender) !important;
          color: var(--color-lavender) !important;
          box-shadow: 0 0 15px rgba(200, 172, 214, 0.45) !important;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}} />

    </div>
  );
}
