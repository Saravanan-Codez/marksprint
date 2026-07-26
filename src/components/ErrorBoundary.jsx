import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

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
        <div className="min-vh-100 w-full d-flex align-items-center justify-content-center p-4">
          <div 
            className="glass-card-cosmic p-4 p-md-5 w-100 text-center"
            style={{ maxWidth: '520px', borderRadius: '20px' }}
          >
            <div 
              className="d-inline-flex align-items-center justify-content-center p-3 mb-3"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                borderRadius: '16px'
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h2 className="font-bold text-slate-900 mb-2" style={{ fontSize: '1.35rem' }}>
              Something went wrong
            </h2>

            <p className="text-slate-500 mb-4" style={{ fontSize: '0.88rem' }}>
              An unexpected issue occurred while rendering this page.
            </p>

            {this.state.error?.message && (
              <div 
                className="p-3 mb-4 font-mono text-start overflow-x-auto text-danger border rounded-3"
                style={{ background: 'rgba(239, 68, 68, 0.05)', fontSize: '0.8rem', maxHeight: '100px' }}
              >
                {this.state.error.message}
              </div>
            )}

            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary px-4 py-2 font-semibold d-flex align-items-center gap-2"
                style={{ fontSize: '0.86rem' }}
              >
                <RefreshCw size={15} /> Refresh Page
              </button>

              <button
                onClick={this.handleHardReset}
                className="btn btn-outline px-4 py-2 font-semibold text-slate-700 d-flex align-items-center gap-2"
                style={{ fontSize: '0.86rem' }}
              >
                <Home size={15} /> Go to Home
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
