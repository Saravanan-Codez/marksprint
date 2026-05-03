import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import "./App.css";
import Galaxy from "./components/Galaxy";
import ClickSpark from "./components/ClickSpark";
import MagicRings from "./components/MagicRings";

const subjects = ["Physics", "Chemistry", "Maths", "Computer", "Biology"];

const CreatorSection = () => (
  <div className="creator-footer">
    <span className="creator-text">CREATOR : S.K.SREEHARI</span>
    <button 
      className="portfolio-btn" 
      onClick={() => window.open("/portfolio.html", "_blank")}
    >
      PORTFOLIO <ExternalLink size={14} />
    </button>
  </div>
);

function App() {
  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showRing, setShowRing] = useState(false);
  const navigate = useNavigate();

  // Subject rotation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % subjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % subjects.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + subjects.length) % subjects.length);
  };

  const handleSelect = () => {
    setSelected(subjects[index]);
    setShowRing(true);
    setTimeout(() => setShowRing(false), 2000);
  };

  return (
    <ClickSpark isDark={dark}>
      <div className={dark ? "app dark" : "app light"}>
        <Galaxy isDark={dark} />
        
        <div className="header">
          <div className="logo">MARKSPRINT</div>
          <div className="toggle" onClick={() => setDark(!dark)}>
            {dark ? "🌙" : "☀️"}
          </div>
        </div>

        <h1 className="main-title">MARKSPRINT</h1>
        <p className="about-section">
          Boost your 12th board scores with focused one-mark practice.
          Choose a subject, test yourself, and improve your accuracy with every sprint.
        </p>

        <p className="subtitle">Choose the Subject</p>

        <div className="circle-container">
          <button className="arrow" onClick={prev}>◀</button>
          <div className="circle">
            <div key={index} className="subject animate">
              {subjects[index]}
            </div>
            <button className="select-btn" onClick={handleSelect}>
              SELECT
            </button>
            {showRing && (
              <div className="ring-wrapper">
                <MagicRings />
              </div>
            )}
          </div>
          <button className="arrow" onClick={next}>▶</button>
        </div>

        {selected && (
          <p className="selected-text">Selected: {selected}</p>
        )}

        <button 
          className="go-btn"
          onClick={() => {
            if (!selected) {
              alert("Select a subject first");
              return;
            }
            navigate(`/quiz/${selected === "Computer" ? "cs" : selected.toLowerCase()}`);
          }}
        >
          GO
        </button>

        <CreatorSection />
      </div>
    </ClickSpark>
  );
}

export default App;
