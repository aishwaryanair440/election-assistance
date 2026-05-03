import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, BookOpen, Brain, MessageCircle, Menu, X } from 'lucide-react'
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
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="tricolor-strip">
        <div className="strip-saffron" />
        <div className="strip-white" />
        <div className="strip-green" />
      </div>
      
      <div className="accessibility-bar">
        <span>Skip to main content</span>
        <span>Screen Reader Access</span>
        <span>A-</span>
        <span>A</span>
        <span>A+</span>
        <span style={{borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '10px'}}>हिन्दी</span>
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
