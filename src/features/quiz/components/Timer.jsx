import React, { useEffect } from 'react';

export default function Timer({ timeLeft, setTimeLeft, isActive, onTimeout, label, warningThreshold = 5 }) {
  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      onTimeout();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, setTimeLeft, onTimeout]);

  if (timeLeft === undefined || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;

  return (
    <div className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${timeLeft <= warningThreshold ? 'bg-[rgba(255,0,0,0.1)] border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-pulse' : 'bg-[rgba(0,0,0,0.3)] border-[rgba(255,255,255,0.1)] shadow-inner'}`}>
      <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{label}</span>
      <span className={`text-xl md:text-2xl font-black tabular-nums tracking-wider ${timeLeft <= warningThreshold ? 'text-red-400 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-[#00d2ff] drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]'}`}>
        {displayTime}
      </span>
    </div>
  );
}
