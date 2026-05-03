import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, BookOpen, Brain, MessageCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Navbar.css'

const navItems = [
  { path: '/', label: 'Home', icon: Vote },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/quiz', label: 'Quiz', icon: Brain },
  { path: '/chat', label: 'Ask AI', icon: MessageCircle },
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
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar__container">
        <NavLink to="/" className="navbar__brand" id="nav-brand">
          <div className="navbar__logo">
            <Vote size={24} />
          </div>
          <span className="navbar__title">NirvachakSetu</span>
        </NavLink>

        <div className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              end={item.path === '/'}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  className="navbar__indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          id="nav-toggle"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </motion.nav>
  )
}
