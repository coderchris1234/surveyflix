/**
 * main.jsx — Application entry point
 *
 * This is the first file React loads. It:
 * 1. Mounts the React app into the <div id="root"> in index.html
 * 2. Wraps everything in <BrowserRouter> so react-router-dom can handle
 *    URL-based navigation throughout the app
 * 3. Wraps in <StrictMode> which highlights potential issues during development
 *    (double-renders components in dev mode — this is normal)
 * 4. Pings the backend immediately on load to wake up the Render free-tier server
 *    so it's ready by the time the user tries to sign up or log in
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Wake up the Render server immediately — free tier spins down after inactivity
// This runs silently in the background so the server is warm when the user submits a form
fetch('https://surveyinfrastructure-xcer.onrender.com/Dsurvey').catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
