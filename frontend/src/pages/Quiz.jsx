import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, ChevronRight, Trophy, RotateCcw, CheckCircle,
  XCircle, Loader, Target, ArrowRight, FileText
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './Quiz.css'

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data)
        setLoading(false)
      })
      .catch(() => {
        setQuizzes([
          { _id: '1', question: 'What is the minimum age to vote in India?', options: ['16', '18', '21', '25'], correct_answer: '18', difficulty: 'easy' },
          { _id: '2', question: 'Who conducts elections in India?', options: ['Prime Minister', 'Supreme Court', 'Election Commission of India', 'President'], correct_answer: 'Election Commission of India', difficulty: 'easy' },
          { _id: '3', question: 'What does EVM stand for?', options: ['Electronic Voting Machine', 'Election Verification Module', 'Electoral Voting Method', 'Electronic Voter Memory'], correct_answer: 'Electronic Voting Machine', difficulty: 'easy' },
          { _id: '4', question: 'When is National Voters Day celebrated?', options: ['26th January', '15th August', '25th January', '2nd October'], correct_answer: '25th January', difficulty: 'easy' },
          { _id: '5', question: 'What is the NOTA option on an EVM?', options: ['New Option for Total Audit', 'None of The Above', 'National Online Testing Authority', 'No Objection To Application'], correct_answer: 'None of The Above', difficulty: 'medium' },
          { _id: '6', question: 'How many members are elected to the Lok Sabha?', options: ['245', '543', '250', '500'], correct_answer: '543', difficulty: 'medium' },
          { _id: '7', question: 'What document is essential for voter identification?', options: ['Passport only', 'Aadhaar only', 'EPIC (Voter ID Card)', 'PAN Card only'], correct_answer: 'EPIC (Voter ID Card)', difficulty: 'easy' },
          { _id: '8', question: 'Under which Article of the Constitution is the Election Commission established?', options: ['Article 312', 'Article 324', 'Article 356', 'Article 370'], correct_answer: 'Article 324', difficulty: 'hard' },
          { _id: '9', question: 'What is the campaign silence period before polling?', options: ['24 hours', '48 hours', '72 hours', '12 hours'], correct_answer: '48 hours', difficulty: 'medium' },
          { _id: '10', question: 'What does VVPAT stand for?', options: ['Voter Verified Polling Audit Trail', 'Voter Verifiable Paper Audit Trail', 'Vote Verification and Paper Tracking', 'Virtual Voting and Paper Trail'], correct_answer: 'Voter Verifiable Paper Audit Trail', difficulty: 'medium' }
        ])
        setLoading(false)
      })

  }, [])

  const selectAnswer = (option) => {
    if (showFeedback) return
    setSelectedOption(option)
    setAnswers(prev => ({ ...prev, [quizzes[currentQ]._id]: option }))
    setShowFeedback(true)
  }

  const nextQuestion = () => {
    setShowFeedback(false)
    setSelectedOption(null)
    if (currentQ < quizzes.length - 1) {
      setCurrentQ(currentQ + 1)
      window.scrollTo(0, 0)
    } else {
      submitQuiz()
    }
  }

  const submitQuiz = async () => {
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      const data = await res.json()
      setResult(data)
      setShowResult(true)
    } catch {
      setResult({ score: 0, total: quizzes.length, percentage: 0 })
      setShowResult(true)
    }
  }

  if (loading) return <div className="quiz-loading">Loading Assessment...</div>

  const current = quizzes[currentQ]
  const progress = ((currentQ + 1) / quizzes.length) * 100

  return (
    <div className="quiz-gov" id="quiz-page">
      <div className="quiz-gov__container">
        <header className="quiz-gov__header">
          <div className="quiz-gov__title">
            <Target size={24} className="icon-navy" />
            <h1>Voter Awareness Assessment</h1>
          </div>
          <div className="quiz-gov__meta">
            Question {currentQ + 1} of {quizzes.length}
          </div>
        </header>

        <div className="quiz-gov__progress">
          <div className="quiz-gov__progress-bar">
            <div className="quiz-gov__progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key={currentQ}
              className="quiz-gov__card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="quiz-gov__difficulty">Difficulty: {current.difficulty}</div>
              <h2 className="quiz-gov__question">{current.question}</h2>

              <div className="quiz-gov__options">
                {current.options.map((option, i) => {
                  const isSelected = selectedOption === option
                  const isCorrect = option === current.correct_answer
                  const statusClass = showFeedback ? (isCorrect ? 'correct' : (isSelected ? 'wrong' : '')) : (isSelected ? 'selected' : '')

                  return (
                    <button 
                      key={i}
                      className={`quiz-gov__option ${statusClass}`}
                      onClick={() => selectAnswer(option)}
                    >
                      <span className="option-label">{String.fromCharCode(65 + i)}</span>
                      <span className="option-text">{option}</span>
                      {showFeedback && isCorrect && <CheckCircle size={18} className="icon-green" />}
                      {showFeedback && isSelected && !isCorrect && <XCircle size={18} className="icon-red" />}
                    </button>
                  )
                })}
              </div>

              {showFeedback && (
                <div className="quiz-gov__feedback">
                  <div className={`feedback-msg ${selectedOption === current.correct_answer ? 'msg-green' : 'msg-red'}`}>
                    {selectedOption === current.correct_answer ? 'Correct Answer' : `Incorrect. The correct answer is: ${current.correct_answer}`}
                  </div>
                  <button className="btn-gov btn-gov--primary" onClick={nextQuestion}>
                    {currentQ < quizzes.length - 1 ? 'Next Question' : 'View Results'}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="quiz-gov__results">
              <div className="results-header">
                <Trophy size={48} className="icon-saffron" />
                <h2>Assessment Complete</h2>
              </div>
              
              <div className="results-score">
                <div className="score-box">
                  <span className="score-num">{result?.score}</span>
                  <span className="score-label">Correct</span>
                </div>
                <div className="score-box">
                  <span className="score-num">{result?.total}</span>
                  <span className="score-label">Total Questions</span>
                </div>
              </div>

              <div className="results-pct">
                Your Score: <strong>{result?.percentage}%</strong>
              </div>

              <div className="results-actions">
                <button className="btn-gov btn-gov--primary" onClick={() => window.location.reload()}>
                  <RotateCcw size={18} /> Restart Assessment
                </button>
                <Link to="/learn" className="btn-gov btn-gov--secondary">
                  Continue Learning Path
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
