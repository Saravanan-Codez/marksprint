import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MagicRings from "../components/MagicRings";

const subjects = ["Physics", "Chemistry", "Maths", "Computer", "Biology", "English", "Tamil"];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showRing, setShowRing] = useState(false);
  const navigate = useNavigate();

  // Subject rotation every 5 seconds
  useEffect(() => {
    if (selected) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % subjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [selected, index]);

  const next = () => setIndex((prev) => (prev + 1) % subjects.length);
  const prev = () => setIndex((prev) => (prev - 1 + subjects.length) % subjects.length);

  const handleSelect = () => {
    setSelected(subjects[index]);
    setShowRing(true);
    setTimeout(() => setShowRing(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center flex-1 h-full pt-4 md:pt-12">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] tracking-[0.2em] mb-4 text-center drop-shadow-lg"
      >
        MARKSPRINT
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-2xl text-gray-300 text-sm md:text-lg px-4 mb-8 leading-relaxed"
      >
        Boost your 12th board scores with focused one-mark practice.
        Choose a subject, test yourself, and improve your accuracy with every sprint.
      </motion.p>

      <p className="text-xl text-gray-100 font-semibold mb-6 tracking-wider uppercase">Choose the Subject</p>

      {/* Premium Rotating Wheel */}
      <div className="flex items-center justify-center gap-4 md:gap-12 my-8 w-full max-w-lg px-4">
        <button 
          className="p-4 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-[#00d2ff] active:scale-90" 
          onClick={prev}
        >
          ◀
        </button>
        
        <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] shadow-[0_0_40px_rgba(0,210,255,0.15)] backdrop-blur-xl bg-[rgba(0,0,0,0.4)]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[#00d2ff] tracking-widest text-center drop-shadow-[0_0_15px_rgba(0,210,255,0.6)]"
            >
              {subjects[index]}
            </motion.div>
          </AnimatePresence>
          
          <button 
            className="absolute bottom-[-24px] px-8 py-3 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] text-white font-bold rounded-full shadow-[0_0_20px_rgba(0,210,255,0.6)] hover:scale-105 active:scale-95 transition-all z-20 border border-[rgba(255,255,255,0.2)] tracking-widest" 
            onClick={handleSelect}
          >
            SELECT
          </button>
          
          {showRing && (
            <div className="absolute inset-0 z-10 pointer-events-none scale-[1.3] md:scale-150">
              <MagicRings />
            </div>
          )}
        </div>
        
        <button 
          className="p-4 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-[#00d2ff] active:scale-90" 
          onClick={next}
        >
          ▶
        </button>
      </div>

      <div className="h-16 flex flex-col items-center justify-center mt-4">
        {selected ? (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-white mb-4 tracking-wider"
          >
            Locked in: <span className="text-[#00d2ff]">{selected}</span>
          </motion.p>
        ) : (
          <div className="h-11"></div> // Placeholder
        )}
      </div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-16 py-4 text-xl font-black rounded-xl tracking-[0.3em] transition-all duration-300 shadow-2xl border ${selected ? 'bg-white text-black border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]' : 'bg-[rgba(255,255,255,0.05)] text-gray-500 border-gray-700 cursor-not-allowed'}`}
        onClick={() => {
          if (!selected) {
            alert("Select a subject first");
            return;
          }
          navigate(`/quiz/${selected === "Computer" ? "cs" : selected.toLowerCase()}`);
        }}
      >
        GO
      </motion.button>
    </div>
  );
}
