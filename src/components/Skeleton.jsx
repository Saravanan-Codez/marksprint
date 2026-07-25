import React from 'react';

/**
 * Skeleton — animated placeholder shown while real content is loading.
 *
 * Props:
 *   variant  – 'rect' | 'text' | 'circle'  (default: 'rect')
 *   width    – CSS width string  (default: '100%')
 *   height   – CSS height string (default: '1rem' for text, '100%' otherwise)
 *   className – extra classes
 *   style    – extra styles
 *   lines    – number of text-line skeletons to render (variant='text' only)
 */
export default function Skeleton({
  variant = 'rect',
  width = '100%',
  height,
  className = '',
  style = {},
  lines,
}) {
  const baseStyle = {
    background: 'linear-gradient(90deg, var(--skeleton-base, rgba(255,255,255,0.06)) 25%, var(--skeleton-shine, rgba(255,255,255,0.12)) 50%, var(--skeleton-base, rgba(255,255,255,0.06)) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeletonShimmer 1.5s infinite linear',
    borderRadius: variant === 'circle' ? '50%' : '0px',
    display: 'block',
    flexShrink: 0,
    ...style,
  };

  if (variant === 'text') {
    const count = lines || 1;
    return (
      <div className={`d-flex flex-column gap-2 ${className}`} style={{ width }}>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            style={{
              ...baseStyle,
              width: i === count - 1 && count > 1 ? '65%' : '100%',
              height: height || '0.85rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={className}
      style={{
        ...baseStyle,
        width,
        height: height || (variant === 'circle' ? width : '1rem'),
        display: 'block',
      }}
    />
  );
}

/** Pre-composed skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="col-6 col-md-3">
      <div className="glass-card-cosmic p-4 text-center h-100" style={{ borderRadius: '0px' }}>
        <Skeleton variant="circle" width="42px" height="42px" className="mx-auto mb-3" />
        <Skeleton variant="rect" width="60%" height="1.8rem" className="mx-auto mb-2" />
        <Skeleton variant="text" width="80%" height="0.75rem" className="mx-auto" />
      </div>
    </div>
  );
}

/** Pre-composed skeleton for a sprint history row */
export function HistoryRowSkeleton() {
  return (
    <div className="p-3 d-flex flex-column gap-2" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0px' }}>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height="0.9rem" style={{ marginBottom: '0.5rem' }} />
          <Skeleton variant="text" width="65%" height="0.72rem" />
        </div>
        <Skeleton variant="rect" width="80px" height="1.1rem" />
      </div>
    </div>
  );
}

/** Pre-composed skeleton for a subject card on the homepage */
export function SubjectCardSkeleton() {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="surface p-4 h-100" style={{ borderRadius: '0px' }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <Skeleton variant="circle" width="44px" height="44px" />
          <Skeleton variant="rect" width="50%" height="1.1rem" />
        </div>
        <Skeleton variant="text" lines={2} height="0.8rem" />
        <Skeleton variant="rect" width="100%" height="2.5rem" style={{ marginTop: '1rem' }} />
      </div>
    </div>
  );
}

/** Pre-composed skeleton for the quiz setup question count badge */
export function QuizSetupSkeleton() {
  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <Skeleton variant="rect" width="50%" height="2rem" className="mx-auto" />
      <Skeleton variant="rect" width="100%" height="80px" />
      <Skeleton variant="rect" width="100%" height="120px" />
      <Skeleton variant="rect" width="100%" height="60px" />
      <div className="d-flex gap-3">
        <Skeleton variant="rect" width="100%" height="48px" />
        <Skeleton variant="rect" width="100%" height="48px" />
      </div>
    </div>
  );
}
