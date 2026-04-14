/**
 * main.jsx — Application entry point
 *
 * This is the first file React loads. It:
 * 1. Mounts the React app into the <div id="root"> in index.html
 * 2. Wraps everything in <BrowserRouter> so react-router-dom can handle
 *    URL-based navigation throughout the app
 * 3. Wraps in <StrictMode> which highlights potential issues during development
 *    (double-renders components in dev mode — this is normal)
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
