import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Fatal Error: The '#root' element was not found in the DOM. App cannot be mounted.");
    // Display a fallback message if the app can't load
    document.body.innerHTML = '<div style="padding: 2rem; font-family: sans-serif;"><h1>Application Error</h1><p>Failed to initialize the application. The root DOM element is missing.</p></div>';
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// This logic ensures that we only try to mount the app after the HTML document is fully parsed.
if (document.readyState === 'loading') {
  // The document is still loading, so we wait for the 'DOMContentLoaded' event.
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // The DOM is already fully loaded, so we can mount the app immediately.
  mountApp();
}
