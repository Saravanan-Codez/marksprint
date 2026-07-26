import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3500);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (showRestored) {
    return (
      <div 
        className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2.5 d-flex align-items-center gap-2 font-bold text-white shadow-lg z-50 transition-all"
        style={{
          background: 'rgba(16, 185, 129, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          fontSize: '0.85rem'
        }}
      >
        <Wifi size={16} /> Online connection restored!
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div 
      className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2.5 d-flex align-items-center gap-2.5 font-semibold text-white shadow-lg z-50 transition-all"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: '9999px',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        fontSize: '0.84rem'
      }}
    >
      <WifiOff size={16} className="text-cyan-400" />
      <span>
        <strong className="text-cyan-300">Offline Mode Active</strong> — All quizzes, datasets, and stats remain fully available.
      </span>
    </div>
  );
}
