import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, ChevronRight, Trophy, RotateCcw, CheckCircle,
  XCircle, Loader, Zap, Target, Star, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './Quiz.css'

const difficultyColors = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
}

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
      // Calculate locally as fallback
      let correct = 0
      quizzes.forEach(q => {
        if (answers[q._id] === q.correct_answer) correct++
      })
      setResult({
        score: correct,
        total: quizzes.length,
        percentage: Math.round((correct / quizzes.length) * 100)
      })
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQ(0)
    setAnswers({})
    setShowResult(false)
    setResult(null)
    setSelectedOption(null)
    setShowFeedback(false)
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <Loader className="quiz-loading__spinner" size={32} />
        <p>Loading quiz...</p>
      </div>
    )
  }

  const current = quizzes[currentQ]
  const progress = ((currentQ + 1) / quizzes.length) * 100

  const getGrade = (pct) => {
    if (pct >= 90) return { emoji: '🏆', label: 'Outstanding!', color: '#22c55e' }
    if (pct >= 70) return { emoji: '🎉', label: 'Great Job!', color: '#3b82f6' }
    if (pct >= 50) return { emoji: '👍', label: 'Good Effort!', color: '#f59e0b' }
    return { emoji: '📚', label: 'Keep Learning!', color: '#ef4444' }
  }

  return (
    <div className="quiz" id="quiz-page">
      <div className="quiz__container">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* ── Header ── */}
              <div className="quiz__header">
                <div className="quiz__header-left">
                  <Brain size={22} className="quiz__header-icon" />
                  <h1>Election Quiz</h1>
                </div>
                <div className="quiz__score-badge">
                  <Target size={16} />
                  <span>{currentQ + 1} / {quizzes.length}</span>
                </div>
              </div>

              {/* ── Progress ── */}
              <div className="quiz__progress">
                <motion.div
                  className="quiz__progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* ── Question Card ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  className="quiz__card"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="quiz__card-top">
                    <span
                      className="quiz__difficulty"
                      style={{ '--diff-color': difficultyColors[current.difficulty || 'medium'] }}
                    >
                      <Zap size={12} />
                      {current.difficulty || 'medium'}
                    </span>
                    <span className="quiz__qnum">Q{currentQ + 1}</span>
                  </div>

                  <h2 className="quiz__question">{current.question}</h2>

                  <div className="quiz__options">
                    {current.options.map((option, i) => {
                      const isSelected = selectedOption === option
                      const isCorrect = option === current.correct_answer
                      const showCorrect = showFeedback && isCorrect
                      const showWrong = showFeedback && isSelected && !isCorrect

                      return (
                        <motion.button
                          key={i}
                          className={`quiz__option ${isSelected ? 'quiz__option--selected' : ''} ${showCorrect ? 'quiz__option--correct' : ''} ${showWrong ? 'quiz__option--wrong' : ''}`}
                          onClick={() => selectAnswer(option)}
                          whileHover={!showFeedback ? { scale: 1.01 } : {}}
                          whileTap={!showFeedback ? { scale: 0.99 } : {}}
                          id={`quiz-option-${i}`}
                        >
                          <span className="quiz__option-letter">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="quiz__option-text">{option}</span>
                          {showCorrect && <CheckCircle size={18} className="quiz__option-icon quiz__option-icon--correct" />}
                          {showWrong && <XCircle size={18} className="quiz__option-icon quiz__option-icon--wrong" />}
                        </motion.button>
                      )
                    })}
                  </div>

                  {showFeedback && (
                    <motion.div
                      className="quiz__feedback"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {selectedOption === current.correct_answer ? (
                        <div className="quiz__feedback--correct">
                          <CheckCircle size={18} />
                          <span>Correct! Well done!</span>
                        </div>
                      ) : (
                        <div className="quiz__feedback--wrong">
                          <XCircle size={18} />
                          <span>Incorrect. The answer is: {current.correct_answer}</span>
                        </div>
                      )}
                      <button className="btn btn--primary" onClick={nextQuestion} id="quiz-next">
                        {currentQ < quizzes.length - 1 ? (
                          <>Next Question <ChevronRight size={16} /></>
                        ) : (
                          <>See Results <Trophy size={16} /></>
                        )}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ── Results ── */
            <motion.div
              key="results"
              className="quiz__results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              id="quiz-results"
            >
              {result && (() => {
                const grade = getGrade(result.percentage)
                return (
                  <>
                    <div className="results__trophy">
                      <span className="results__emoji">{grade.emoji}</span>
                    </div>
                    <h2 className="results__title" style={{ color: grade.color }}>
                      {grade.label}
                    </h2>
                    <div className="results__score-circle">
                      <svg viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" className="results__circle-bg" />
                        <motion.circle
                          cx="60" cy="60" r="52"
                          className="results__circle-fill"
                          style={{ stroke: grade.color }}
                          strokeDasharray={`${2 * Math.PI * 52}`}
                          strokeDashoffset={`${2 * Math.PI * 52 * (1 - result.percentage / 100)}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - result.percentage / 100) }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="results__score-text">
                        <span className="results__pct">{result.percentage}%</span>
                        <span className="results__fraction">{result.score}/{result.total}</span>
                      </div>
                    </div>

                    <div className="results__actions">
                      <button className="btn btn--primary" onClick={resetQuiz} id="quiz-retry">
                        <RotateCcw size={18} />
                        Try Again
                      </button>
                      <Link to="/learn" className="btn btn--secondary" id="quiz-back-learn">
                        <ArrowRight size={18} />
                        Back to Learning
                      </Link>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
