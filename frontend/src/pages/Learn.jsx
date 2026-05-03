import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
          { _id: '1', order: 1, title: 'What is an Election?', content: 'An election is a formal group decision-making process by which a population chooses an individual or political party to hold public office. In India, it is the world\'s largest democratic exercise, overseen by the Election Commission of India (ECI). Elections are the backbone of any democracy, ensuring that the power lies with the people. Through elections, citizens can choose their leaders, hold them accountable, and participate in governance.\n\nThe concept of elections dates back to ancient Greece, but modern democratic elections have evolved significantly. India adopted universal adult suffrage from its very first election in 1951-52, making it one of the most inclusive democracies from inception.', icon: 'vote' },
          { _id: '2', order: 2, title: 'Types of Elections in India', content: 'India conducts several types of elections:\n\n**1. General Elections (Lok Sabha):** Held every 5 years to elect 543 members of the lower house of Parliament. The party or coalition winning the majority forms the central government.\n\n**2. State Assembly Elections (Vidhan Sabha):** Conducted to elect members of state legislatures. Each state has its own assembly, and elections may not coincide with general elections.\n\n**3. Local Body Elections:** Include Panchayat elections (rural) and Municipal Corporation/Council elections (urban). These form the grassroots level of Indian democracy.\n\n**4. Rajya Sabha Elections:** Members are elected by the elected members of state assemblies, not by direct public vote.\n\n**5. By-Elections:** Held when a seat becomes vacant due to death, resignation, or disqualification of a member.', icon: 'layers' },
          { _id: '3', order: 3, title: 'Who Can Vote?', content: 'Every Indian citizen who is 18 years or older on the qualifying date (January 1 of the year of revision of the electoral roll) is eligible to vote, provided they have registered as a voter.\n\n**Requirements:**\n- Must be an Indian citizen\n- Must be 18 years or older\n- Must be a resident of the constituency\n- Must possess a valid Voter ID (EPIC - Electors Photo Identity Card)\n- Must not be disqualified under any law (unsound mind, corrupt practices, etc.)\n\n**Important:** No person can vote at more than one constituency. You must register in the constituency where you ordinarily reside.\n\n**How to Register:** Visit the National Voters Service Portal (NVSP) at voters.eci.gov.in or use Form 6 at your local Electoral Registration Officer.', icon: 'user-check' },
          { _id: '4', order: 4, title: 'The Election Commission of India', content: 'The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering election processes in India. Established on 25th January 1950 (celebrated as National Voters Day), it operates under Article 324 of the Indian Constitution.\n\n**Structure:**\n- Chief Election Commissioner (CEC)\n- Two Election Commissioners\n- They enjoy same status as Supreme Court judges\n\n**Key Functions:**\n- Preparation and revision of electoral rolls\n- Notification of election schedules\n- Scrutiny of nominations\n- Allotment of election symbols\n- Implementation of Model Code of Conduct\n- Counting of votes and declaration of results\n- Settlement of election disputes\n\nThe ECI has the power to postpone or cancel elections in case of disruptions.', icon: 'shield' },
          { _id: '5', order: 5, title: 'The Election Process Timeline', content: 'The Indian election process follows a systematic timeline:\n\n**Phase 1 - Announcement:** ECI announces election dates. Model Code of Conduct (MCC) comes into effect immediately.\n\n**Phase 2 - Nominations (7 days):** Candidates file nomination papers with required documents and security deposit (₹25,000 for general, ₹12,500 for SC/ST candidates).\n\n**Phase 3 - Scrutiny:** Returning Officer examines nominations for validity.\n\n**Phase 4 - Withdrawal (2 days):** Candidates can withdraw nominations.\n\n**Phase 5 - Campaigning (ends 48 hours before voting):** Parties and candidates campaign. No campaigning allowed 48 hours before polling.\n\n**Phase 6 - Polling Day:** Voting takes place using EVMs and VVPATs. Polling stations open from 7 AM to 6 PM.\n\n**Phase 7 - Counting & Results:** Votes are counted, and results are declared constituency-wise.', icon: 'calendar' },
          { _id: '6', order: 6, title: 'Electronic Voting Machines (EVMs)', content: 'India uses Electronic Voting Machines (EVMs) for conducting elections, making the process faster, more accurate, and reducing invalid votes.\n\n**Components:**\n- **Ballot Unit (BU):** Where voters press the button next to their chosen candidate\n- **Control Unit (CU):** Operated by the presiding officer to enable voting\n- **VVPAT (Voter Verifiable Paper Audit Trail):** Prints a slip showing the candidate name and symbol for 7 seconds, allowing voter verification\n\n**Security Features:**\n- One-time programmable chips\n- No wireless connectivity\n- Battery operated (no external power needed)\n- Stores up to 2,000 votes\n- Tamper-proof sealing\n\n**NOTA Option:** Since 2013, EVMs include a "None of The Above" (NOTA) button, allowing voters to reject all candidates.', icon: 'monitor' },
          { _id: '7', order: 7, title: 'Model Code of Conduct', content: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI that comes into force the moment elections are announced.\n\n**Key Rules:**\n- No government can announce new policies, schemes, or projects that might influence voters\n- Ministers cannot combine official visits with campaign work\n- No party can use government resources for campaigning\n- Campaign speeches must not appeal to caste or communal feelings\n- No party or candidate can bribe voters with money, liquor, or gifts\n- Campaign silence period: 48 hours before polling\n- No victory processions after results\n\n**Violation:** Can lead to FIR, arrest, or disqualification of the candidate.', icon: 'book-open' },
          { _id: '8', order: 8, title: 'Voting Day: Step-by-Step', content: 'Here is what happens on polling day:\n\n**Step 1:** Arrive at your assigned polling booth (check your voter slip or ECI website)\n\n**Step 2:** Stand in the queue. Separate queues may exist for men, women, and senior citizens/disabled persons.\n\n**Step 3:** Present your Voter ID card (EPIC) or any of the 12 approved ID documents to the polling officer.\n\n**Step 4:** Your name is verified in the electoral roll. Indelible ink is applied to your left index finger.\n\n**Step 5:** The presiding officer activates the EVM for you.\n\n**Step 6:** Enter the voting compartment (secret voting). Press the button next to your chosen candidate on the ballot unit.\n\n**Step 7:** Check the VVPAT slip (displayed for 7 seconds) to confirm your vote was recorded correctly.\n\n**Step 8:** Exit the polling booth.\n\n**Tip:** Carry your voter slip to save time. Polling hours are typically 7 AM to 6 PM.', icon: 'check-circle' },
          { _id: '9', order: 9, title: 'Your Rights as a Voter', content: 'As an Indian voter, you have several important rights:\n\n**1. Right to Vote:** Every registered citizen above 18 can vote without discrimination.\n\n**2. Right to Secret Ballot:** Your vote is secret. No one can force you to reveal whom you voted for.\n\n**3. Right to Information:** You can access candidate affidavits containing criminal records, financial assets, and educational qualifications.\n\n**4. Right to Reject (NOTA):** You can choose "None of The Above" if you don\'t support any candidate.\n\n**5. Right to Complain:** You can report election malpractices to the Election Commission through cVIGIL app.\n\n**6. Right to Postal Ballot:** Service voters, disabled persons, and those above 80 years of age can apply for postal ballots.\n\n**7. Right to Accessibility:** Polling stations must be accessible to persons with disabilities. Braille ballot sheets and ramps must be provided.\n\n**8. Right to Challenge:** You can challenge suspicious voters at the polling station.', icon: 'scale' },
          { _id: '10', order: 10, title: 'Making Your Vote Count', content: 'Your vote is your voice! Here\'s how to make the most informed decision:\n\n**Research Candidates:**\n- Check candidate affidavits on ECI website for criminal records and assets\n- Attend public meetings and debates\n- Read party manifestos\n\n**Use Technology:**\n- **Voter Helpline App:** For voter registration, booth search, and complaints\n- **cVIGIL App:** Report election violations with photo/video evidence\n- **NVSP Portal:** Online voter registration and corrections\n\n**Community Participation:**\n- Encourage family and friends to vote\n- Volunteer as a polling agent or booth-level officer\n- Participate in SVEEP (Systematic Voters\' Education and Electoral Participation) activities\n\n**Remember:** Low voter turnout benefits those who rely on manipulation. A high turnout strengthens democracy. Every single vote matters — elections have been won and lost by single votes!\n\n**Helpline:** Call 1950 (ECI Helpline) for any election-related queries.', icon: 'trending-up' },
          { _id: '11', order: 11, title: 'Political Parties & Symbols', content: 'Political parties are the lifeblood of Indian democracy. The Election Commission of India (ECI) classifies parties into National and State parties based on their performance in previous elections.\n\n**Symbol Allotment:** Every party is assigned a unique symbol. For national and state parties, these symbols are "reserved" and cannot be used by others. For unrecognized parties, the ECI provides a list of "free symbols" to choose from. Symbols are crucial in a country with varying literacy levels, as they help voters identify their choice easily.', icon: 'layers' },
          { _id: '12', order: 12, title: 'Election Manifestos', content: 'An election manifesto is a public declaration of policy and aims, issued by a political party before an election. It serves as a social contract between the party and the voters.\n\n**ECI Guidelines:** Manifestos must not contain anything repugnant to the Constitution. The ECI prohibits parties from making promises that might influence voters\' choice unduly or violate the Model Code of Conduct. Parties are required to submit their manifestos to the ECI to ensure transparency and accountability.', icon: 'book-open' },
          { _id: '13', order: 13, title: 'Role of Media & Exit Polls', content: 'Media plays a vital role as the fourth pillar of democracy during elections. It educates voters, provides a platform for debate, and monitors the conduct of parties.\n\n**Exit Polls vs Opinion Polls:** Opinion polls are conducted before voting begins, while exit polls are conducted after voters leave the polling booths. To prevent influence on voters during multi-phase elections, the ECI prohibits the publication of exit polls until the last phase of voting is completed across the country. "Paid news" and misinformation are strictly monitored by the ECI\'s Media Certification and Monitoring Committees (MCMC).', icon: 'monitor' },
          { _id: '14', order: 14, title: 'Delimitation of Constituencies', content: 'Delimitation is the act of redrawing boundaries of Lok Sabha and State Assembly constituencies based on the latest census data. This ensures that each representative represents a roughly equal number of citizens.\n\n**Delimitation Commission:** This task is performed by an independent Delimitation Commission, whose orders have the force of law and cannot be challenged in any court. The current boundaries are based on the 2001 census and are frozen until after the first census taken after 2026.', icon: 'shield' },
          { _id: '15', order: 15, title: 'Election Expenditure & Finance', content: 'To ensure a level playing field, the ECI sets limits on the amount a candidate can spend on their campaign. This limit varies between Lok Sabha and Assembly elections and between states.\n\n**Transparency:** Candidates must maintain a separate bank account for election expenses and submit a detailed account of their spending to the ECI within 30 days of the declaration of results. While there is a limit on candidate spending, there is currently no legal limit on the amount a political party can spend on general party propaganda.', icon: 'scale' },
          { _id: '16', order: 16, title: 'Election Observers', content: 'To ensure free and fair elections, the ECI appoints various types of observers who act as its eyes and ears on the ground.\n\n- **General Observers:** IAS officers who oversee the overall conduct of elections.\n- **Expenditure Observers:** IRS officers who monitor candidate spending and check for money power.\n- **Police Observers:** IPS officers who monitor law and order and the deployment of security forces.\n- **Micro-Observers:** Deployed at sensitive polling stations to monitor the process minutely.', icon: 'user-check' },
          { _id: '17', order: 17, title: 'Postal Ballots & ETPBS', content: 'While most people vote at polling stations, some categories of voters can use postal ballots. This includes "Service Voters" (members of armed forces, police serving outside their state), employees on election duty, and voters under preventive detention.\n\n**ETPBS:** The Electronically Transmitted Postal Ballot System (ETPBS) allows service voters to receive their ballot papers electronically, which they then print, mark, and mail back. Recently, the facility of postal ballots has been extended to senior citizens (80+) and Persons with Disabilities (PwD) to ensure their participation.', icon: 'calendar' },
          { _id: '18', order: 18, title: 'Security & Vulnerability Mapping', content: 'Ensuring a peaceful environment is critical for high voter turnout. The ECI, in coordination with state police and Central Armed Police Forces (CAPF), performs "Vulnerability Mapping" to identify areas where voters might be intimidated.\n\n**Measures:** Preventive arrests of known troublemakers, seizure of illegal arms and liquor, and heavy deployment of security forces in "critical" booths. The use of webcasting and CCTVs at polling stations further enhances security and transparency.', icon: 'shield' },
          { _id: '19', order: 19, title: 'Election Petitions & Disputes', content: 'If a candidate or voter believes that an election was not conducted fairly, they can challenge the result through an "Election Petition."\n\n**Process:** Unlike other legal matters, election disputes can only be raised *after* the election process is complete. These petitions are heard by the High Court of the respective state. Grounds for challenge include corrupt practices, improper rejection of nominations, or non-compliance with the Constitution.', icon: 'scale' },
          { _id: '20', order: 20, title: 'Local Self-Governance (Panchayats)', content: 'Democracy in India operates at three levels: Union, State, and Local. The 73rd and 74th Constitutional Amendments empowered Rural (Panchayats) and Urban (Municipalities) local bodies.\n\n**State Election Commission:** Unlike Lok Sabha and Assembly elections which are conducted by the ECI, local body elections are conducted by the respective State Election Commissions (SEC). These elections are the foundation of "grassroots democracy," bringing governance closer to the people.', icon: 'layers' }
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

        <nav className="sidebar-gov__nav" aria-label="Curriculum Navigation">
          {modules.map((mod, i) => (
            <button
              key={mod._id}
              className={`sidebar-gov__item ${i === activeModule ? 'sidebar-gov__item--active' : ''} ${completedModules.has(i) ? 'sidebar-gov__item--completed' : ''}`}
              onClick={() => { setActiveModule(i); setSidebarOpen(false); }}
              id={`module-nav-${i}`}
              aria-current={i === activeModule ? 'step' : undefined}
              aria-label={`Section ${mod.order}: ${mod.title}`}
            >
              <div className="sidebar-gov__item-step" aria-hidden="true">Section {mod.order}</div>
              <div className="sidebar-gov__item-title">{mod.title}</div>
              {completedModules.has(i) && (
                <CheckCircle 
                  size={14} 
                  className="sidebar-gov__item-icon" 
                  aria-label="Completed" 
                />
              )}
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
                    aria-label={completedModules.has(activeModule) ? 'Curriculum Completed' : 'Mark Section as Completed'}
                  >
                    <CheckCircle size={18} aria-hidden="true" />
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
        aria-label="Toggle Curriculum Index"
        aria-expanded={sidebarOpen}
      >
        <FileText size={18} aria-hidden="true" />
        Index
      </button>


      {sidebarOpen && (
        <div className="learn-gov__overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
