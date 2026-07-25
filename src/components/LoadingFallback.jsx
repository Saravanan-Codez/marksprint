import React from 'react';

export default function LoadingFallback({ message = 'Preparing your experience...' }) {
  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center px-4 text-center"
      style={{ background: 'var(--bg-50)', color: 'var(--ink-700)' }}
    >
      <div
        className="spinner-border mb-3"
        role="status"
        style={{ width: '2.2rem', height: '2.2rem', color: 'var(--primary-600)' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h2 className="h5 fw-bold mb-2" style={{ color: 'var(--ink-900)' }}>
        Loading
      </h2>
      <p className="mb-0" style={{ maxWidth: '420px', color: 'var(--ink-500)' }}>
        {message}
      </p>
    </div>
  );
}
