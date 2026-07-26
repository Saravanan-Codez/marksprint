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

  const isWarning = timeLeft <= warningThreshold;

  return (
    <div
      className={`border-2 border-black font-mono px-3 py-1.5 d-flex align-items-center gap-2 ${isWarning ? 'bg-rose-500 text-white' : 'bg-brand text-black'}`}
      style={{
        minWidth: '95px',
        boxShadow: '3px 3px 0px 0px #000000'
      }}
    >
      <span className="font-bold text-xs uppercase">{label}:</span>
      <span className="font-black text-lg ms-auto">{displayTime}</span>
    </div>
  );
}
