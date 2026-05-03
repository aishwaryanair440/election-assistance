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
