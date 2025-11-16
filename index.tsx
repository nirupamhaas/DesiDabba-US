
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. The application cannot be mounted.");
  // Display a fallback message if the root element is critically missing from index.html
  document.body.innerHTML = '<div style="padding: 2rem; font-family: sans-serif; text-align: center;"><h1>Application Error</h1><p>The core HTML structure of the page is missing. Please contact support.</p></div>';
}
