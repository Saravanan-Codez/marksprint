import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

const TOAST_LIFETIME_MS = 3500;

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const _remove = useCallback((id) => {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const show = useCallback((message, opts = {}) => {
    const id = ++toastCounter;
    const type = opts.type || 'info';
    const duration = opts.duration || TOAST_LIFETIME_MS;

    setToasts(prev => [
      ...prev,
      {
        id,
        message,
        type,
        title: opts.title || null,
      }
    ]);

    if (duration > 0) {
      const timer = setTimeout(() => _remove(id), duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [_remove]);

  const success = useCallback((msg, opts = {}) => show(msg, { ...opts, type: 'success' }), [show]);
  const error = useCallback((msg, opts = {}) => show(msg, { ...opts, type: 'error' }), [show]);
  const warning = useCallback((msg, opts = {}) => show(msg, { ...opts, type: 'warning' }), [show]);
  const info = useCallback((msg, opts = {}) => show(msg, { ...opts, type: 'info' }), [show]);
  const remove = useCallback((id) => _remove(id), [_remove]);

  const value = useMemo(() => ({ show, success, error, warning, info, remove }), [show, success, error, warning, info, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={_remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="position-fixed d-flex flex-column gap-2"
      style={{
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        maxWidth: 'min(92vw, 380px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }) {
  const stylesByType = {
    success: {
      icon: '✓',
      accent: '#6EE7B7',
      border: 'rgba(110, 231, 183, 0.35)',
      glow: '0 0 24px rgba(110, 231, 183, 0.25)'
    },
    error: {
      icon: '✕',
      accent: '#FCA5A5',
      border: 'rgba(252, 165, 165, 0.35)',
      glow: '0 0 24px rgba(252, 165, 165, 0.25)'
    },
    warning: {
      icon: '!',
      accent: '#FCD34D',
      border: 'rgba(252, 211, 77, 0.35)',
      glow: '0 0 24px rgba(252, 211, 77, 0.25)'
    },
    info: {
      icon: 'i',
      accent: '#C8ACD6',
      border: 'rgba(200, 172, 214, 0.4)',
      glow: '0 0 24px rgba(200, 172, 214, 0.25)'
    }
  };

  const style = stylesByType[toast.type] || stylesByType.info;

  return (
    <div
      role="status"
      onClick={() => onDismiss(toast.id)}
      className="w-100 p-3 rounded-3 cursor-pointer d-flex gap-3 align-items-start"
      style={{
        pointerEvents: 'auto',
        background: 'rgba(15, 10, 40, 0.92)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${style.border}`,
        boxShadow: style.glow,
        color: 'white',
        animation: 'toast-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both'
      }}
    >
      <div
        className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle fw-bold"
        style={{
          width: '28px',
          height: '28px',
          fontSize: '13px',
          backgroundColor: `${style.accent}`,
          color: '#111',
          lineHeight: 1
        }}
      >
        {style.icon}
      </div>
      <div className="flex-grow-1 min-w-0">
        {toast.title && (
          <div className="fw-semibold mb-1" style={{ fontSize: '14px' }}>{toast.title}</div>
        )}
        <div style={{ fontSize: '13.5px', opacity: 0.9, lineHeight: 1.45, wordBreak: 'break-word' }}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
        aria-label="Dismiss notification"
        className="flex-shrink-0 ms-2 border-0 bg-transparent p-0"
        style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
export default ToastContext;
