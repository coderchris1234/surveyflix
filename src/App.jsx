/**
 * App.jsx — Root routing configuration
 *
 * This file defines ALL the pages/routes in the application.
 * react-router-dom's <Routes> and <Route> components map URL paths
 * to the correct page component.
 *
 * Route map:
 *   /           → Home (landing page with all sections)
 *   /signup     → SignUp page
 *   /login      → Login page
 *   /dashboard  → User dashboard (surveys, rewards, overview)
 *   /terms      → Terms & Conditions page
 *   /admin      → Admin panel (gift card claim management)
 *   *           → NotFound (catches any unknown URL)
 *
 * The Home component is defined here (not in its own file) because it's
 * just a simple stack of landing page sections.
 */
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import WhyJoin from './components/WhyJoin/WhyJoin'
import ValueOpinion from './components/ValueOpinion/ValueOpinion'
import AboutUs from './components/AboutUs/AboutUs'
import Testimonials from './components/Testimonials/Testimonials'
import OurFacts from './components/OurFacts/OurFacts'
import Footer from './components/Footer/Footer'
import SignUp from './components/SignUp/SignUp'
import Login from './components/Login/Login'
import Dashboard from './dashboard/Dashboard'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import Admin from './admin/Admin'

// Home assembles all the landing page sections in order
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyJoin />
      <ValueOpinion />
      <AboutUs />
      <Testimonials />
      <OurFacts />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/admin" element={<Admin />} />
      {/* Catch-all: any URL not matched above shows the 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
