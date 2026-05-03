import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Vote, BookOpen, Brain, MessageCircle, Shield, 
  ArrowRight, CheckSquare, Info, FileText
} from 'lucide-react'
import './Landing.css'

const features = [
  {
    icon: BookOpen,
    title: 'Electoral Process',
    desc: 'Detailed documentation on how elections are conducted in India, from notification to results.',
    color: 'var(--navy)'
  },
  {
    icon: Brain,
    title: 'Voter Awareness Quiz',
    desc: 'Evaluate your knowledge of democratic rights and the electoral system through certified modules.',
    color: 'var(--navy)'
  },
  {
    icon: MessageCircle,
    title: 'Citizen Helpdesk',
    desc: 'Instant AI-powered support for queries related to voter ID, polling booths, and election laws.',
    color: 'var(--navy)'
  },
  {
    icon: Shield,
    title: 'Rights & Grievances',
    desc: 'Information on Model Code of Conduct and mechanisms for reporting electoral malpractices.',
    color: 'var(--navy)'
  }
]

export default function Landing() {
  return (
    <div className="landing" id="landing-page">
      {/* ── Official Hero Section ── */}
      <section className="hero-gov" id="hero-section">
        <div className="hero-gov__container">
          <motion.div 
            className="hero-gov__content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-gov__badge">
              <Info size={14} />
              <span>Official Voter Education Portal</span>
            </div>
            
            <h1 className="hero-gov__title">
              Empowering the Citizenry through <span className="text-highlight">Informed Voting</span>
            </h1>
            
            <p className="hero-gov__text">
              NirvachakSetu is a dedicated initiative to enhance electoral literacy among Indian citizens. 
              Access official learning modules, test your knowledge, and interact with our automated 
              helpdesk for all election-related information.
            </p>
            
            <div className="hero-gov__actions">
              <Link to="/learn" className="btn-gov btn-gov--primary" id="start-learning">
                Start Learning Process
                <ArrowRight size={18} />
              </Link>
              <Link to="/chat" className="btn-gov btn-gov--secondary" id="ask-questions">
                <MessageCircle size={18} />
                Ask a Question
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-gov__image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="official-seal">
              <Vote size={120} strokeWidth={1} color="var(--navy)" opacity={0.1} />
              <div className="seal-ring" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Quick Links / Notification Bar ── */}
      <div className="notification-bar">
        <div className="notification-bar__label">Updates:</div>
        <div className="notification-bar__scroll">
          <span>• Register for Voter ID online at voters.eci.gov.in</span>
          <span>• Check your name in the Electoral Roll</span>
          <span>• Know your Polling Station and Booth Level Officer (BLO)</span>
        </div>
      </div>

      {/* ── Resources Section ── */}
      <section className="resources" id="resources-section">
        <div className="section-header-gov">
          <h2 className="section-title-gov">Citizen Resources</h2>
          <div className="section-divider-gov" />
        </div>

        <div className="resources__grid">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              className="resource-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="resource-card__icon">
                <feature.icon size={24} />
              </div>
              <h3 className="resource-card__title">{feature.title}</h3>
              <p className="resource-card__desc">{feature.desc}</p>
              <Link to={i === 0 ? "/learn" : i === 1 ? "/quiz" : "/chat"} className="resource-card__link">
                Read More <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats Bar (Clean) ── */}
      <section className="stats-gov">
        <div className="stats-gov__container">
          <div className="stat-item-gov">
            <div className="stat-num">10+</div>
            <div className="stat-text">Learning Modules</div>
          </div>
          <div className="stat-item-gov">
            <div className="stat-num">15+</div>
            <div className="stat-text">Quiz Questions</div>
          </div>
          <div className="stat-item-gov">
            <div className="stat-num">24/7</div>
            <div className="stat-text">AI Support</div>
          </div>
          <div className="stat-item-gov">
            <div className="stat-num">1.4B+</div>
            <div className="stat-text">Potential Voters</div>
          </div>
        </div>
      </section>

      {/* ── Footer (Government Style) ── */}
      <footer className="footer-gov">
        <div className="footer-gov__top">
          <div className="footer-gov__brand">
            <Vote size={24} />
            <div>
              <h3>NirvachakSetu</h3>
              <p>Election Education & Awareness Portal</p>
            </div>
          </div>
          <div className="footer-gov__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Copyright Policy</a>
            <a href="#">Hyperlinking Policy</a>
          </div>
        </div>
        <div className="footer-gov__bottom">
          <p>© 2026 NirvachakSetu. All rights reserved. Managed by Citizens for Democracy.</p>
          <div className="footer-gov__badges">
            <div className="badge-gIGW">GIGW Certified</div>
            <div className="badge-W3C">W3C Compliant</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
