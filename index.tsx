import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Error Boundary Component ---
// This component acts as a safety net. If any part of the React app crashes,
// it will catch the error and display a fallback UI instead of a blank screen.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in React component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center', color: '#b91c1c' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p>The application encountered an error and could not load.</p>
          <pre style={{
            background: '#fef2f2',
            color: '#7f1d1d',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginTop: '1.5rem',
            textAlign: 'left',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
           }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', border: 'none', background: '#d84315', color: 'white', borderRadius: '99px', cursor: 'pointer', fontSize: '1rem' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


// --- Robust App Mounting Function ---
const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } else {
    // This should ideally not be reached with the polling mechanism
    console.error("Fatal Error: The '#root' element was not found in the DOM after polling.");
    document.body.innerHTML = '<div style="padding: 2rem; font-family: sans-serif; text-align: center;"><h1>Application Error</h1><p>Failed to find the root element to mount the application.</p></div>';
  }
};

// --- Polling Logic to find the root element ---
// This is more reliable than a simple event listener in some deployment environments.
const tryMount = (retries = 10, interval = 100) => {
    if (document.getElementById('root')) {
        mountApp();
    } else if (retries > 0) {
        setTimeout(() => tryMount(retries - 1, interval), interval);
    } else {
        console.error("Could not find root element after multiple retries. The app will not mount.");
        // Display a fallback message if polling fails completely
        document.body.innerHTML = '<div style="padding: 2rem; font-family: sans-serif; text-align: center;"><h1>Application Load Failed</h1><p>The application could not start because a key HTML element is missing. Please try refreshing the page.</p></div>';
    }
};

// Start the mounting process
tryMount();
