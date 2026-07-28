import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Runtime crash caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            padding: '2rem',
            color: '#ff6b6b',
            background: '#100d18',
            fontFamily: 'monospace',
            fontSize: '14px',
            minHeight: '100vh',
          }}
        >
          {this.state.error.stack || this.state.error.message || String(this.state.error)}
        </pre>
      );
    }

    return this.props.children;
  }
}
