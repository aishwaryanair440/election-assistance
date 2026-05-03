import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Loader, Trash2, ShieldCheck, Info } from 'lucide-react'
import './Chat.css'

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

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = {
      id: Date.now(),
      text: input,
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
        body: JSON.stringify({ question: input })
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

  return (
    <div className="chat-gov" id="chat-page">
      <div className="chat-gov__container">
        <header className="chat-gov__header">
          <div className="chat-gov__header-info">
            <div className="chat-gov__badge">Helpdesk</div>
            <h2>Automated Citizen Support</h2>
          </div>
          <div className="chat-gov__actions">
            <button className="chat-gov__clear" onClick={() => setMessages([messages[0]])}>
              <Trash2 size={16} /> Reset Conversation
            </button>
          </div>
        </header>

        <div className="chat-gov__disclaimer">
          <Info size={14} />
          <span>This is an automated helpdesk. Answers provided are for educational purposes.</span>
        </div>

        <div className="chat-gov__messages">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-gov__msg ${msg.sender === 'user' ? 'msg--user' : 'msg--bot'}`}>
                <div className="msg-avatar">
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="msg-bubble">
                  <div className="msg-text">
                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                  <div className="msg-time">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="chat-gov__msg msg--bot">
              <div className="msg-avatar"><Bot size={14} /></div>
              <div className="msg-bubble typing">Processing request...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-gov__input-area" onSubmit={handleSend}>
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Type your query regarding voter registration, polling, etc."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" disabled={!input.trim() || isTyping}>
              {isTyping ? <Loader size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
          <div className="secure-tag">
            <ShieldCheck size={12} /> SSL Secure Connection
          </div>
        </form>
      </div>
    </div>
  )
}
