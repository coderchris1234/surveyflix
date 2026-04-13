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
    </Routes>
  )
}

export default App
