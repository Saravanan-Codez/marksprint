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

  const wrapperClass = timeLeft <= warningThreshold ? 'timer-warning' : 'timer-normal';

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center p-2 px-4 rounded-3 border w-100 w-md-auto position-relative overflow-hidden ${wrapperClass}`}>
      <div className="position-absolute top-0 start-0 end-0" style={{ height: '1.5px', background: timeLeft <= warningThreshold ? 'linear-gradient(90deg, transparent, #dc3545, transparent)' : 'linear-gradient(90deg, transparent, var(--color-lavender), transparent)' }}></div>
      <span className="text-uppercase tracking-wider text-secondary mb-0.5" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{label}</span>
      <span className={`h5 font-black tracking-wider m-0 ${timeLeft <= warningThreshold ? 'text-danger animate-pulse' : 'text-theme-highlight'}`}>
        {displayTime}
      </span>

      <style dangerouslySetInnerHTML={{ __html: `
        .timer-warning {
          background-color: rgba(220, 53, 69, 0.2) !important;
          border-color: #dc3545 !important;
          box-shadow: 0 0 15px rgba(220, 53, 69, 0.4) !important;
        }
        .timer-normal {
          background-color: rgba(46, 42, 98, 0.6) !important;
          border-color: rgba(200, 172, 214, 0.3) !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
        }
      `}} />
    </div>
  );
}
