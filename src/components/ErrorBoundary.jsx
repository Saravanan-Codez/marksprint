import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
          <div className="max-w-md w-full text-center p-5 rounded-4 border"
               style={{
                 backgroundColor: 'rgba(46, 42, 98, 0.85)',
                 backdropFilter: 'blur(12px)',
                 border: '1px solid rgba(255, 255, 255, 0.1)'
               }}>
            <div className="mb-4" style={{ fontSize: '48px' }}>⚠️</div>
            <h2 className="text-white mb-3" style={{ fontWeight: 700 }}>Something went wrong</h2>
            <p className="text-theme-slate mb-4" style={{ opacity: 0.8, fontSize: '14px' }}>
              {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button
                onClick={this.resetError}
                className="btn px-4 py-2 rounded-3"
                style={{
                  backgroundColor: 'var(--color-lavender)',
                  color: '#1a1435',
                  fontWeight: 600,
                  border: 'none'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn px-4 py-2 rounded-3"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Reload Page
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
