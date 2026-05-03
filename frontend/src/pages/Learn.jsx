import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, ChevronLeft, CheckCircle, Circle,
  Vote, Layers, UserCheck, Shield, Calendar, Monitor,
  Scale, TrendingUp, Loader
} from 'lucide-react'
import './Learn.css'

const iconMap = {
  vote: Vote,
  layers: Layers,
  'user-check': UserCheck,
  shield: Shield,
  calendar: Calendar,
  monitor: Monitor,
  'book-open': BookOpen,
  'check-circle': CheckCircle,
  scale: Scale,
  'trending-up': TrendingUp,
}

export default function Learn() {
  const [modules, setModules] = useState([])
  const [activeModule, setActiveModule] = useState(0)
  const [completedModules, setCompletedModules] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        setModules(data)
        setLoading(false)
      })
      .catch(() => {
        // Fallback data if API unavailable
        setModules([
          { _id: '1', order: 1, title: 'What is an Election?', content: 'An election is a formal group decision-making process by which a population chooses an individual to hold public office.', icon: 'vote' },
          { _id: '2', order: 2, title: 'Types of Elections in India', content: 'India has General Elections, State Assembly Elections, Local Body Elections, and more.', icon: 'layers' },
          { _id: '3', order: 3, title: 'Who Can Vote?', content: 'Every Indian citizen who is 18 years or older is eligible to vote.', icon: 'user-check' },
        ])
        setLoading(false)
      })
  }, [])

  const markComplete = (index) => {
    setCompletedModules(prev => new Set([...prev, index]))
  }

  const goNext = () => {
    markComplete(activeModule)
    if (activeModule < modules.length - 1) {
      setActiveModule(activeModule + 1)
    }
  }

  const goPrev = () => {
    if (activeModule > 0) {
      setActiveModule(activeModule - 1)
    }
  }

  const progress = modules.length > 0
    ? Math.round((completedModules.size / modules.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="learn-loading">
        <Loader className="learn-loading__spinner" size={32} />
        <p>Loading modules...</p>
      </div>
    )
  }

  const currentModule = modules[activeModule]
  const IconComponent = currentModule ? iconMap[currentModule.icon] || BookOpen : BookOpen

  return (
    <div className="learn" id="learn-page">
      {/* ── Sidebar ── */}
      <aside className={`learn__sidebar ${sidebarOpen ? 'learn__sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <BookOpen size={20} />
          <h2>Learning Path</h2>
        </div>

        <div className="sidebar__progress">
          <div className="sidebar__progress-bar">
            <motion.div
              className="sidebar__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="sidebar__progress-text">{progress}% Complete</span>
        </div>

        <nav className="sidebar__nav">
          {modules.map((mod, i) => (
            <button
              key={mod._id}
              className={`sidebar__item ${i === activeModule ? 'sidebar__item--active' : ''} ${completedModules.has(i) ? 'sidebar__item--completed' : ''}`}
              onClick={() => { setActiveModule(i); setSidebarOpen(false); }}
              id={`module-nav-${i}`}
            >
              <div className="sidebar__item-status">
                {completedModules.has(i) ? (
                  <CheckCircle size={18} className="sidebar__check" />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              <div className="sidebar__item-content">
                <span className="sidebar__item-step">Module {mod.order}</span>
                <span className="sidebar__item-title">{mod.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Mobile sidebar toggle ── */}
      <button
        className="learn__sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        id="sidebar-toggle"
      >
        <BookOpen size={18} />
        <span>Modules</span>
      </button>

      {/* ── Main Content ── */}
      <main className="learn__main">
        <AnimatePresence mode="wait">
          {currentModule && (
            <motion.article
              key={currentModule._id}
              className="module"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="module__header">
                <div className="module__icon">
                  <IconComponent size={28} />
                </div>
                <div className="module__meta">
                  <span className="module__step">Module {currentModule.order} of {modules.length}</span>
                  <h1 className="module__title">{currentModule.title}</h1>
                </div>
              </div>

              <div className="module__content">
                {currentModule.content.split('\n\n').map((para, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    {para.startsWith('**') ? (
                      <h3 className="module__subheading">
                        {para.replace(/\*\*/g, '')}
                      </h3>
                    ) : (
                      <p className="module__paragraph">{para}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="module__actions">
                <button
                  className="btn btn--secondary"
                  onClick={goPrev}
                  disabled={activeModule === 0}
                  id="module-prev"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                {activeModule < modules.length - 1 ? (
                  <button
                    className="btn btn--primary"
                    onClick={goNext}
                    id="module-next"
                  >
                    Mark Complete & Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    className="btn btn--primary"
                    onClick={() => markComplete(activeModule)}
                    id="module-finish"
                  >
                    <CheckCircle size={18} />
                    {completedModules.has(activeModule) ? 'Completed!' : 'Mark as Complete'}
                  </button>
                )}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </main>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="learn__overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
