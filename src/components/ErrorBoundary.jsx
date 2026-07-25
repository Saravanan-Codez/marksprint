import React from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleHardReset = () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-vh-100 w-full d-flex align-items-center justify-content-center p-4 position-relative overflow-hidden"
          style={{ background: '#05070E', color: '#fff' }}
        >
          <div 
            className="p-4 p-md-5 position-relative w-100"
            style={{
              maxWidth: '620px',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(243, 244, 246, 0.2)',
              borderRadius: '0px',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)'
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div 
                className="p-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#F87171',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '0px'
                }}
              >
                <AlertTriangle size={28} />
              </div>
              <div>
                <h2 className="font-extrabold text-white mb-0" style={{ fontSize: '1.4rem' }}>
                  Application Error Intercepted
                </h2>
                <span className="font-mono text-uppercase" style={{ fontSize: '0.72rem', color: '#F87171' }}>
                  MarkSprint Fault-Tolerant Engine
                </span>
              </div>
            </div>

            <p className="mb-3 font-medium" style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.5' }}>
              MarkSprint encountered an unexpected issue while rendering this view. Your test progress and local data remain safe.
            </p>

            {/* Error Message Detail Box */}
            <div 
              className="p-3 mb-4 font-mono text-start overflow-x-auto"
              style={{
                background: '#090D16',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                color: '#FCA5A5',
                fontSize: '0.78rem',
                borderRadius: '0px',
                maxHeight: '120px'
              }}
            >
              {this.state.error?.message || 'Unknown Application Error'}
            </div>

            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              <button
                onClick={this.resetError}
                className="btn btn-cosmic-primary px-4 py-2.5 font-bold d-flex align-items-center gap-2"
                style={{ borderRadius: '0px', fontSize: '0.85rem' }}
              >
                <RotateCcw size={16} /> Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn btn-cosmic-outline px-4 py-2.5 font-bold d-flex align-items-center gap-2"
                style={{ borderRadius: '0px', fontSize: '0.85rem' }}
              >
                <RefreshCw size={16} /> Reload Page
              </button>

              <button
                onClick={this.handleHardReset}
                className="btn btn-cosmic-outline px-3 py-2.5 font-semibold text-muted d-flex align-items-center gap-1.5"
                style={{ borderRadius: '0px', fontSize: '0.82rem' }}
              >
                <Home size={15} /> Reset Session & Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
