import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, User, Bot, Sparkles, Loader, Trash2, ArrowDown } from 'lucide-react'
import './Chat.css'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your Election Assistant. Ask me anything about India's election process, voting rights, or how to register.",
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
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([messages[0]])
  }

  return (
    <div className="chat-page" id="chat-page">
      <div className="chat-container">
        {/* --- Chat Header --- */}
        <header className="chat-header">
          <div className="chat-header__info">
            <div className="chat-header__icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h1>AI Election Assistant</h1>
              <p>Powered by Gemini AI</p>
            </div>
          </div>
          <button className="chat-header__clear" onClick={clearChat} title="Clear Chat" id="clear-chat">
            <Trash2 size={18} />
          </button>
        </header>

        {/* --- Messages Area --- */}
        <div className="chat-messages">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`message ${msg.sender === 'user' ? 'message--user' : 'message--bot'}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message__avatar">
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="message__bubble">
                  <div className="message__text">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <span className="message__time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              className="message message--bot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="message__avatar">
                <Bot size={16} />
              </div>
              <div className="message__bubble message__bubble--typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Input Area --- */}
        <form className="chat-input-area" onSubmit={handleSend}>
          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about voter ID, EVMs, election dates..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              id="chat-input-field"
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={!input.trim() || isTyping}
              id="send-message-btn"
            >
              {isTyping ? <Loader size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="chat-disclaimer">
            This is an AI assistant. For official information, visit <a href="https://eci.gov.in" target="_blank" rel="noreferrer">eci.gov.in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
