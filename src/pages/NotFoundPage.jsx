import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-4 py-5 text-center" style={{ background: 'var(--bg-50)', color: 'var(--ink-700)' }}>
      <div style={{ maxWidth: '480px' }}>
        <div className="display-1 fw-bold mb-3" style={{ color: 'var(--primary-600)' }}>404</div>
        <h1 className="h3 fw-bold mb-3" style={{ color: 'var(--ink-900)' }}>Page not found</h1>
        <p className="mb-4" style={{ color: 'var(--ink-500)' }}>
          The page you requested does not exist or may have moved. Return home and continue studying.
        </p>
        <Link to="/" className="btn btn-primary px-4 py-2">
          Go Home
        </Link>
      </div>
    </div>
  );
}
