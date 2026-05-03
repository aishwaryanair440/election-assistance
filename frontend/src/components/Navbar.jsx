import { NavLink, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, BookOpen, Brain, MessageCircle, Menu, X, Accessibility } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Navbar.css'

const navItems = [
  { path: '/', label: 'Home', icon: Vote },
  { path: '/learn', label: 'Learn Process', icon: BookOpen },
  { path: '/quiz', label: 'Knowledge Test', icon: Brain },
  { path: '/chat', label: 'Helpdesk (AI)', icon: MessageCircle },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [fontSize, setFontSize] = useState(100) // Percentage
  const [lang, setLang] = useState('EN')
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  const adjustFontSize = (type) => {
    if (type === 'increase' && fontSize < 120) setFontSize(prev => prev + 5)
    if (type === 'decrease' && fontSize > 80) setFontSize(prev => prev - 5)
    if (type === 'reset') setFontSize(100)
  }

  const toggleLang = () => setLang(prev => (prev === 'EN' ? 'HI' : 'EN'))

  const skipToContent = () => {
    const main = document.getElementById('main-content')
    if (main) {
      main.tabIndex = -1
      main.focus()
      main.scrollIntoView()
    }
  }

  return (
    <>
      <div className="tricolor-strip">
        <div className="strip-saffron" />
        <div className="strip-white" />
        <div className="strip-green" />
      </div>
      
      <div className="accessibility-bar">
        <div className="accessibility-bar__container">
          <button className="acc-btn" onClick={skipToContent}>Skip to main content</button>
          <button className="acc-btn" onClick={() => alert('Screen Reader optimized mode active.')}>Screen Reader Access</button>
          <div className="font-controls">
            <button className="acc-btn" onClick={() => adjustFontSize('decrease')} title="Decrease Font">A-</button>
            <button className="acc-btn" onClick={() => adjustFontSize('reset')} title="Normal Font">A</button>
            <button className="acc-btn" onClick={() => adjustFontSize('increase')} title="Increase Font">A+</button>
          </div>
          <button className="acc-btn lang-toggle" onClick={toggleLang}>
            {lang === 'EN' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>

      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          <NavLink to="/" className="navbar__brand" id="nav-brand">
            <div className="navbar__logo">
              <Vote size={32} strokeWidth={1.5} />
            </div>
            <div className="navbar__title">
              <span>NirvachakSetu</span>
            </div>
          </NavLink>

          <div className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                end={item.path === '/'}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <button
            className="navbar__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            id="nav-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </>
  )
}
