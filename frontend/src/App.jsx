import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Learn from './pages/Learn'
import Quiz from './pages/Quiz'
import Chat from './pages/Chat'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to Content</a>
      <Navbar />
      
      <main className="app__content" id="main-content">

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Decorative Background Elements */}
      <div className="app__bg-glow app__bg-glow--1" />
      <div className="app__bg-glow app__bg-glow--2" />
    </div>
  )
}

export default App
