import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code } from 'lucide-react';
import Galaxy from '../components/Galaxy';
import ClickSpark from '../components/ClickSpark';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <ClickSpark isDark={true}>
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 text-center">
        <Galaxy isDark={true} />
        <div className="z-10 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 max-w-3xl shadow-[0_0_20px_rgba(0,210,255,0.1)]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#7fdfff] tracking-wide">ABOUT MARKSPRINT</h1>
          
          <div className="text-left text-base md:text-lg leading-relaxed mb-8 text-gray-200 space-y-6">
            <p className="text-center text-xl text-[#9fe3ff]">
              <strong>MARKSPRINT</strong> is an open-source, interactive quiz engine designed to help 12th-grade Tamil Nadu State Board students master one-mark questions. 
            </p>
            
            <div className="bg-[rgba(0,0,0,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <h2 className="text-2xl font-bold text-[#00d2ff] mb-3">⚙️ How It Works</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Select a Subject:</strong> Choose from Physics, Chemistry, Maths, Computer Science, Biology, English, or Tamil.</li>
                <li><strong>Customize Your Sprint:</strong> Pick specific chapters, set global or per-question timers, and shuffle options.</li>
                <li><strong>Practice Mode vs Test Mode:</strong> Use Practice Mode for instant correct/wrong feedback, or Test Mode to simulate real exam pressure.</li>
                <li><strong>Review & Learn:</strong> After the sprint, get a detailed breakdown of your accuracy and review exactly what you got wrong with the correct answers provided.</li>
              </ul>
            </div>

            <div className="bg-[rgba(0,0,0,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <h2 className="text-2xl font-bold text-[#00d2ff] mb-3">💻 Tech Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h3 className="font-bold text-[#7fdfff]">Frontend Core</h3>
                  <p>React 19 & Vite Bundler</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#7fdfff]">Styling & UI</h3>
                  <p>Tailwind CSS v4 & Framer Motion</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#7fdfff]">Data & Parsing</h3>
                  <p>PapaParse (Client-side CSV loading)</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#7fdfff]">Special Rendering</h3>
                  <p>MathJax (For advanced formulas)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-3 border border-[#2aa8d8] text-[#2aa8d8] font-bold rounded-lg transition-all duration-300 hover:bg-[#2aa8d8] hover:text-white hover:shadow-[0_0_15px_rgba(42,168,216,0.5)]"
            >
              Back to Home
            </button>
            <a 
              href="https://github.com/sreehari462/marksprint" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#2aa8d8] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#1a88b8] hover:shadow-[0_0_15px_rgba(42,168,216,0.5)]"
            >
              <Code size={20} /> View Source
            </a>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
