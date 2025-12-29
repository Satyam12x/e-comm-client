import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-[400px] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm mb-2">Something went wrong</p>
            <p className="text-xs text-gray-400">Please refresh the page</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
