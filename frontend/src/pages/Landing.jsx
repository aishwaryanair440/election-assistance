import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Vote, BookOpen, Brain, MessageCircle, Shield, Users, 
  ArrowRight, Sparkles, ChevronRight, Star
} from 'lucide-react'
import './Landing.css'

const features = [
  {
    icon: BookOpen,
    title: 'Learn Step-by-Step',
    desc: 'Master the Indian election process through 10 comprehensive, beautifully crafted modules.',
    color: '#FF9933'
  },
  {
    icon: Brain,
    title: 'Test Your Knowledge',
    desc: '15 interactive quiz questions across easy, medium, and hard difficulty levels.',
    color: '#138808'
  },
  {
    icon: MessageCircle,
    title: 'AI-Powered Answers',
    desc: 'Got questions? Our Gemini AI assistant provides instant, accurate answers about elections.',
    color: '#6366f1'
  },
  {
    icon: Shield,
    title: 'Your Rights Matter',
    desc: 'Understand your voting rights, NOTA options, and how to report election violations.',
    color: '#ec4899'
  }
]

const stats = [
  { value: '10+', label: 'Learning Modules' },
  { value: '15+', label: 'Quiz Questions' },
  { value: 'AI', label: 'Powered Chat' },
  { value: '100%', label: 'Free & Open' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function Landing() {
  return (
    <div className="landing" id="landing-page">
      {/* ── Hero Section ── */}
      <section className="hero" id="hero-section">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>

        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles size={14} />
            <span>Empowering India's Voters</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Vote,{' '}
            <span className="hero__title--accent">Your Voice</span>
            <br />
            <span className="hero__title--sub">Learn. Quiz. Ask AI.</span>
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            NirvachakSetu is your complete guide to understanding India's election process.
            From voter registration to polling day — learn everything with interactive modules,
            quizzes, and AI-powered assistance.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link to="/learn" className="btn btn--primary" id="hero-cta-learn">
              <BookOpen size={18} />
              Start Learning
              <ArrowRight size={16} />
            </Link>
            <Link to="/quiz" className="btn btn--secondary" id="hero-cta-quiz">
              <Brain size={18} />
              Take Quiz
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Floating Elements ── */}
        <motion.div
          className="hero__float hero__float--ballot"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Vote size={32} />
        </motion.div>
        <motion.div
          className="hero__float hero__float--star"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Star size={20} />
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <motion.section
        className="stats"
        id="stats-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {stats.map((stat, i) => (
          <motion.div key={i} className="stats__item" variants={itemVariants}>
            <span className="stats__value">{stat.value}</span>
            <span className="stats__label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Features Section ── */}
      <motion.section
        className="features"
        id="features-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div className="features__header" variants={itemVariants}>
          <h2 className="section__title">Everything You Need</h2>
          <p className="section__subtitle">
            A comprehensive platform designed to make election education accessible,
            engaging, and empowering for every Indian citizen.
          </p>
        </motion.div>

        <div className="features__grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div
                className="feature-card__icon"
                style={{ '--feature-color': feature.color }}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
              <div className="feature-card__glow" style={{ '--feature-color': feature.color }} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA Section ── */}
      <motion.section
        className="cta"
        id="cta-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta__bg">
          <div className="cta__orb" />
        </div>
        <div className="cta__content">
          <h2>Ready to Become an Informed Voter?</h2>
          <p>Start your journey through India's democratic process today.</p>
          <div className="cta__actions">
            <Link to="/learn" className="btn btn--primary btn--lg" id="cta-start">
              Get Started
              <ChevronRight size={18} />
            </Link>
            <Link to="/chat" className="btn btn--ghost" id="cta-chat">
              <MessageCircle size={18} />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer className="footer" id="footer">
        <div className="footer__content">
          <div className="footer__brand">
            <Vote size={20} />
            <span>NirvachakSetu</span>
          </div>
          <p className="footer__text">
            Empowering India's democracy through voter education.
          </p>
          <div className="footer__tricolor">
            <span className="footer__bar footer__bar--saffron" />
            <span className="footer__bar footer__bar--white" />
            <span className="footer__bar footer__bar--green" />
          </div>
        </div>
      </footer>
    </div>
  )
}
