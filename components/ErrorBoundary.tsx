import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-bold text-white mb-4 font-display">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300 mb-8 font-light leading-relaxed">
                We're sorry, but it looks like there was an unexpected error. Our team has been notified and is working to fix this issue.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-red-400 font-medium mb-2">Error Details:</h3>
                  <pre className="text-gray-400 text-sm overflow-auto max-h-40">
                    {this.state.error.message}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-red-400 cursor-pointer">Stack Trace</summary>
                      <pre className="text-gray-400 text-xs mt-2 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload Page</span>
                </button>

                <a
                  href="/"
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Go Home</span>
                </a>
              </div>

              {/* Contact Support */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-3">
                  If this problem persists, please contact our support team:
                </p>
                <a
                  href="mailto:hello@saintlammyfoundation.org"
                  className="inline-flex items-center space-x-2 text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@saintlammyfoundation.org</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error handler for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);

    // TODO: Report to error service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Specialized error boundaries for different parts of the app
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Page Error
            </h1>
            <p className="text-gray-600 mb-6">
              This page encountered an error and couldn't load properly.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Page Error:', error, errorInfo);
        // TODO: Report page errors with additional context
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Form Error
              </h3>
              <p className="mt-1 text-sm text-red-700">
                This form encountered an error. Please refresh the page and try again.
              </p>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Form Error:', error, errorInfo);
        // TODO: Report form errors with form context
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({
  children,
  componentName
}: {
  children: ReactNode;
  componentName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            {componentName ? `${componentName} component` : 'Component'} failed to load.
          </p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error(`Component Error (${componentName}):`, error, errorInfo);
        // TODO: Report component errors with component context
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;