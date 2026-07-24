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
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / (warningThreshold * 3)) * 100));

  return (
    <div
      className={`chip ${isWarning ? 'chip-danger' : 'chip-primary'} position-relative overflow-hidden`}
      style={{
        padding: '0.5rem 0.9rem',
        fontSize: '0.8rem',
        gap: '0.5rem',
        minWidth: '90px'
      }}
    >
      <div
        className="position-absolute bottom-0 start-0"
        style={{
          height: '2.5px',
          width: `${progressPercent}%`,
          background: isWarning ? 'var(--danger)' : 'var(--primary-600)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 1s linear, background-color 0.25s ease'
        }}
      />
      <div className="d-flex align-items-center gap-2 w-100 position-relative z-1">
        <span
          style={{
            fontSize: '0.62rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            opacity: 0.85
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            fontSize: '1.35rem',
            fontWeight: '800',
            lineHeight: 1,
            marginLeft: 'auto',
            color: isWarning ? 'var(--danger)' : 'var(--primary-600)',
            animation: isWarning ? 'pulse-soft 1.2s ease-in-out infinite' : 'none'
          }}
        >
          {displayTime}
        </span>
      </div>
    </div>
  );
}
