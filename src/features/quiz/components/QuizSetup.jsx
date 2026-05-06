import React from 'react';

export default function QuizSetup({ engine, subject }) {
  const {
    quizType, setQuizType,
    selectedLessons, setSelectedLessons, availableLessons,
    selectedVolume, setSelectedVolume, availableVolumes,
    repeatWrong, setRepeatWrong,
    shuffleQ, setShuffleQ,
    shuffleOpt, setShuffleOpt,
    timerLimit, setTimerLimit,
    globalTimerLimit, setGlobalTimerLimit,
    questionCount, setQuestionCount,
    isTestMode, setIsTestMode,
    startQuiz
  } = engine;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-4 md:pt-8 px-4 pb-16">
      <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] tracking-[0.2em] mb-8 drop-shadow-lg">
        {subject?.toUpperCase()}
      </h2>
      
      <div className="w-full bg-[rgba(11,31,42,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col gap-8">
        
        <section>
          <h4 className="text-sm font-bold text-gray-400 tracking-widest mb-3 uppercase">Quiz Type</h4>
          <div className="grid grid-cols-3 gap-2 md:gap-4 p-1 bg-[rgba(0,0,0,0.3)] rounded-xl border border-[rgba(255,255,255,0.05)]">
            {["lesson", "volume", "full"].map(t => (
              <button 
                key={t} 
                className={`py-3 md:py-4 rounded-lg font-bold text-xs md:text-sm tracking-wider transition-all duration-300 ${quizType === t ? 'bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] text-white shadow-[0_0_15px_rgba(0,210,255,0.4)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`}
                onClick={() => setQuizType(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {quizType === "lesson" && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="text-sm font-bold text-gray-400 tracking-widest mb-3 uppercase">Select Lessons</h4>
            <div className="flex flex-wrap gap-2 md:gap-3 max-h-48 overflow-y-auto p-2 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.05)] custom-scrollbar">
              {availableLessons.map(lesson => (
                <button 
                  key={lesson}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 border ${selectedLessons.includes(lesson) ? 'bg-[#00d2ff] bg-opacity-20 text-[#00d2ff] border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                >
                  Lesson {lesson}
                </button>
              ))}
            </div>
          </section>
        )}

        {quizType === "volume" && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="text-sm font-bold text-gray-400 tracking-widest mb-3 uppercase">Select Volume</h4>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {availableVolumes.map(vol => (
                <button 
                  key={vol}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border ${selectedVolume === vol ? 'bg-[#00d2ff] bg-opacity-20 text-[#00d2ff] border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-[rgba(0,0,0,0.3)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setSelectedVolume(vol)}
                >
                  Volume {vol}
                </button>
              ))}
              <button 
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border ${selectedVolume === "all" ? 'bg-[#00d2ff] bg-opacity-20 text-[#00d2ff] border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-[rgba(0,0,0,0.3)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                onClick={() => setSelectedVolume("all")}
              >
                All Volumes
              </button>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3 w-full bg-[rgba(0,0,0,0.2)] p-4 rounded-2xl border border-[rgba(255,255,255,0.05)]">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm md:text-base text-gray-200 font-medium">Practice Mode <span className="text-xs text-gray-500 ml-2 hidden md:inline">(Instant Feedback)</span></span>
            <button role="switch" aria-checked={!isTestMode} onClick={() => setIsTestMode(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${!isTestMode ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!isTestMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
          
          {!isTestMode && (
            <>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm md:text-base text-gray-200 font-medium">Repeat Wrong Answers</span>
                <button role="switch" aria-checked={repeatWrong} onClick={() => setRepeatWrong(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${repeatWrong ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${repeatWrong ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
            </>
          )}
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm md:text-base text-gray-200 font-medium">Shuffle Questions</span>
            <button role="switch" aria-checked={shuffleQ} onClick={() => setShuffleQ(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shuffleQ ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shuffleQ ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm md:text-base text-gray-200 font-medium">Shuffle Options</span>
            <button role="switch" aria-checked={shuffleOpt} onClick={() => setShuffleOpt(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shuffleOpt ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shuffleOpt ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section>
            <h4 className="text-xs font-bold text-gray-400 tracking-widest mb-3 uppercase text-center md:text-left">Timer (Per Q)</h4>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map(t => (
                <button 
                  key={t} 
                  className={`py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 border ${timerLimit === t ? 'bg-[#00d2ff] bg-opacity-20 text-[#00d2ff] border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-[rgba(0,0,0,0.3)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setTimerLimit(t)}
                >
                  {t === 0 ? "OFF" : `${t}s`}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-gray-400 tracking-widest mb-3 uppercase text-center md:text-left">Global Timer</h4>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 30].map(t => (
                <button 
                  key={t} 
                  className={`py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 border ${globalTimerLimit === t ? 'bg-[#00d2ff] bg-opacity-20 text-[#00d2ff] border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-[rgba(0,0,0,0.3)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setGlobalTimerLimit(t)}
                >
                  {t === 0 ? "OFF" : `${t}m`}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-gray-400 tracking-widest mb-3 uppercase text-center md:text-left">Questions</h4>
            <div className="grid grid-cols-3 gap-2">
              {[0, 15, 20].map(n => (
                <button 
                  key={n} 
                  className={`py-2 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 border ${questionCount === n ? 'bg-[#00d2ff] bg-opacity-20 text-[#00d2ff] border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-[rgba(0,0,0,0.3)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n === 0 ? "ALL" : n}
                </button>
              ))}
            </div>
          </section>
        </div>

        <button 
          className="w-full mt-4 py-4 md:py-5 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] text-white text-lg md:text-xl font-black tracking-[0.3em] rounded-xl shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_40px_rgba(0,210,255,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border border-[rgba(255,255,255,0.2)]" 
          onClick={startQuiz}
        >
          START SPRINT
        </button>
      </div>
    </div>
  );
}
