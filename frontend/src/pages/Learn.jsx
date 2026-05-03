import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, ChevronLeft, CheckCircle, Circle,
  Vote, Layers, UserCheck, Shield, Calendar, Monitor,
  Scale, TrendingUp, Loader, FileText
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
        setModules([
          { _id: '1', order: 1, title: 'Introduction to Indian Elections', content: 'The electoral process is the cornerstone of democracy in India...', icon: 'vote' },
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
      window.scrollTo(0, 0)
    }
  }

  const goPrev = () => {
    if (activeModule > 0) {
      setActiveModule(activeModule - 1)
      window.scrollTo(0, 0)
    }
  }

  const progress = modules.length > 0
    ? Math.round((completedModules.size / modules.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="learn-loading">
        <Loader className="learn-loading__spinner" size={32} />
        <p>Fetching curriculum data...</p>
      </div>
    )
  }

  const currentModule = modules[activeModule]
  const IconComponent = currentModule ? iconMap[currentModule.icon] || BookOpen : BookOpen

  return (
    <div className="learn-gov" id="learn-page">
      {/* ── Official Sidebar ── */}
      <aside className={`learn-gov__sidebar ${sidebarOpen ? 'learn-gov__sidebar--open' : ''}`}>
        <div className="sidebar-gov__header">
          <FileText size={18} />
          <h2>Curriculum Index</h2>
        </div>

        <div className="sidebar-gov__progress">
          <div className="sidebar-gov__progress-info">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="sidebar-gov__progress-bar">
            <motion.div
              className="sidebar-gov__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <nav className="sidebar-gov__nav">
          {modules.map((mod, i) => (
            <button
              key={mod._id}
              className={`sidebar-gov__item ${i === activeModule ? 'sidebar-gov__item--active' : ''} ${completedModules.has(i) ? 'sidebar-gov__item--completed' : ''}`}
              onClick={() => { setActiveModule(i); setSidebarOpen(false); }}
              id={`module-nav-${i}`}
            >
              <div className="sidebar-gov__item-step">Section {mod.order}</div>
              <div className="sidebar-gov__item-title">{mod.title}</div>
              {completedModules.has(i) && <CheckCircle size={14} className="sidebar-gov__item-icon" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="learn-gov__main">
        <div className="breadcrumb-gov">
          <Link to="/">Home</Link> / <span>Learning Path</span> / <span>Section {currentModule?.order}</span>
        </div>

        <AnimatePresence mode="wait">
          {currentModule && (
            <motion.article
              key={currentModule._id}
              className="module-gov"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="module-gov__header">
                <div className="module-gov__badge">Section {currentModule.order} of {modules.length}</div>
                <h1 className="module-gov__title">{currentModule.title}</h1>
              </div>

              <div className="module-gov__body">
                {currentModule.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('**')) {
                    return <h3 key={i} className="module-gov__subheading">{para.replace(/\*\*/g, '')}</h3>
                  }
                  if (para.startsWith('- ')) {
                    return (
                      <ul key={i} className="module-gov__list">
                        {para.split('\n').map((item, j) => (
                          <li key={j}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    )
                  }
                  return <p key={i} className="module-gov__paragraph">{para}</p>
                })}
              </div>

              <div className="module-gov__footer">
                <button
                  className="btn-gov btn-gov--secondary"
                  onClick={goPrev}
                  disabled={activeModule === 0}
                  id="module-prev"
                >
                  <ChevronLeft size={18} />
                  Previous Section
                </button>

                {activeModule < modules.length - 1 ? (
                  <button
                    className="btn-gov btn-gov--primary"
                    onClick={goNext}
                    id="module-next"
                  >
                    Complete & Next Section
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    className="btn-gov btn-gov--primary"
                    onClick={() => markComplete(activeModule)}
                    id="module-finish"
                  >
                    <CheckCircle size={18} />
                    {completedModules.has(activeModule) ? 'Curriculum Completed' : 'Mark as Completed'}
                  </button>
                )}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-gov-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FileText size={18} />
        Index
      </button>

      {sidebarOpen && (
        <div className="learn-gov__overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
