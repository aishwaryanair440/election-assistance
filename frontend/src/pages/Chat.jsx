import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Loader, Trash2, ShieldCheck, Info, Printer, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react'
import './Chat.css'

const SUGGESTED_QUESTIONS = [
  "How can I register for a new Voter ID?",
  "What is the eligibility for voting?",
  "How do I find my polling booth?",
  "What documents are required for voting?",
  "What is the Model Code of Conduct?"
]

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the NirvachakSetu Helpdesk. I am your automated assistant. How can I help you regarding the electoral process today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (text = input) => {
    const messageText = text.trim()
    if (!messageText || isTyping) return

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText })
      })
      const data = await response.json()
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.answer,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const botMessage = {
        id: Date.now() + 1,
        text: "I am currently experiencing connectivity issues. Please refer to the official Election Commission website at eci.gov.in for immediate assistance.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const printChat = () => {
    window.print()
  }

  return (
    <div className="chat-gov" id="chat-page">
      <div className="chat-gov__container" id="main-content">
        <header className="chat-gov__header">
          <div className="chat-gov__header-info">
            <div className="chat-gov__badge">Helpdesk</div>
            <h2>Automated Citizen Support</h2>
          </div>
          <div className="chat-gov__actions">
            <button className="chat-gov__header-btn" onClick={printChat} title="Print Conversation">
              <Printer size={16} /> Print
            </button>
            <button className="chat-gov__header-btn" onClick={() => setMessages([messages[0]])} title="Reset">
              <Trash2 size={16} /> Reset
            </button>
          </div>
        </header>

        <div className="chat-gov__disclaimer">
          <Info size={14} />
          <span>Information provided is for general awareness. For official verification, visit <strong>eci.gov.in</strong></span>
        </div>

        <div className="chat-gov__messages">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                className={`chat-gov__msg ${msg.sender === 'user' ? 'msg--user' : 'msg--bot'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="msg-avatar">
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="msg-bubble-container">
                  <div className="msg-bubble">
                    <div className="msg-text">
                      {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  </div>
                  <div className="msg-footer">
                    <span className="msg-time">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.sender === 'bot' && msg.id !== 1 && (
                      <div className="msg-rating">
                        <button title="Helpful" aria-label="Helpful"><ThumbsUp size={12} aria-hidden="true" /></button>
                        <button title="Not Helpful" aria-label="Not Helpful"><ThumbsDown size={12} aria-hidden="true" /></button>
                      </div>

                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="chat-gov__msg msg--bot">
              <div className="msg-avatar"><Bot size={14} /></div>
              <div className="msg-bubble-container">
                <div className="msg-bubble typing">
                  <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length < 3 && (
          <div className="chat-gov__suggestions">
            <p>Suggested Questions:</p>
            <div className="suggestion-chips" role="group" aria-label="Suggested election questions">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button 
                  key={i} 
                  className="suggestion-chip" 
                  onClick={() => handleSend(q)}
                  aria-label={`Ask: ${q}`}
                >
                  {q} <ArrowRight size={12} aria-hidden="true" />
                </button>
              ))}
            </div>

          </div>
        )}

        <form className="chat-gov__input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Type your query here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              aria-label="Election query input"
              maxLength={500}
            />
            <button type="submit" disabled={!input.trim() || isTyping} aria-label="Send Message">
              {isTyping ? <Loader size={18} className="spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            </button>

          </div>
          <div className="chat-gov__footer-meta">
            <div className="secure-tag">
              <ShieldCheck size={12} /> SSL Encrypted
            </div>
            <div className="character-count">{input.length}/500</div>
          </div>
        </form>
      </div>
    </div>
  )
}
