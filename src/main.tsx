import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fix duplicate createRoot calls by using only one approach
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Could not find root element");
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
}

// Remove the duplicate createRoot call that was causing the warning
