"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Check, RotateCcw, Sparkles, Clock } from "lucide-react"

export function WordScramble() {
  const [words] = useState([
    "mindfulness", "relax", "breathe", "meditation", "wellness", "tranquil", 
    "balance", "harmony", "serenity", "peace", "calm", "focus", "presence",
    "awareness", "healing", "clarity", "stillness", "reflection", "energy",
    "wisdom", "gratitude", "compassion", "kindness", "patience", "growth"
  ])
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [userGuess, setUserGuess] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameActive, setIsGameActive] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [streakCount, setStreakCount] = useState(0)

  // Scramble a word
  const scrambleWord = (word: string) => {
    const array = word.split('')
    let currentIndex = array.length
    let randomIndex
    
    // While there remain elements to shuffle
    while (currentIndex !== 0) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      
      // And swap it with the current element
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
    
    // Make sure the scrambled word is different from the original
    const scrambled = array.join('')
    if (scrambled === word && word.length > 1) {
      return scrambleWord(word) // try again
    }
    
    return scrambled
  }

  // Select a new word
  const getNewWord = () => {
    const newWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(newWord)
    setScrambledWord(scrambleWord(newWord))
    setUserGuess("")
    setIsCorrect(false)
    setShowHint(false)
  }

  // Start game
  const startGame = () => {
    setIsGameActive(true)
    setScore(0)
    setStreakCount(0)
    setTimeLeft(60)
    getNewWord()
  }

  // Reset game
  const resetGame = () => {
    setIsGameActive(false)
    setUserGuess("")
    setIsCorrect(false)
    setShowHint(false)
  }

  // Check answer
  const checkAnswer = () => {
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      setIsCorrect(true)
      setScore(score + 10 + (showHint ? 0 : 5)) // Less points if hint was used
      setStreakCount(streakCount + 1)
      
      // Add bonus points for streak
      if (streakCount > 0 && streakCount % 3 === 0) {
        setScore(prev => prev + 15)
      }
      
      setTimeout(() => {
        getNewWord()
      }, 1500)
    }
  }

  // Reveal hint (first letter)
  const showWordHint = () => {
    setShowHint(true)
    setUserGuess(currentWord[0]) // Set the first letter as hint
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isGameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsGameActive(false)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, isGameActive])

  return (
    <div className="max-w-lg mx-auto p-6">
      {!isGameActive ? (
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Word Scramble</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Unscramble the words to test your brain and vocabulary. How many can you solve in 60 seconds?
          </p>
          
          {score > 0 && (
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg mb-6 text-center">
              <h3 className="font-bold text-purple-800 dark:text-purple-300 text-xl mb-2">Game Over!</h3>
              <p className="text-purple-700 dark:text-purple-200">Your final score: <span className="font-bold text-xl">{score}</span></p>
            </div>
          )}
          
          <Button onClick={startGame} className="btn-professional">
            <Sparkles className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                <span className="font-medium text-purple-800 dark:text-purple-300">Score: {score}</span>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                <span className="font-medium text-purple-800 dark:text-purple-300">Streak: {streakCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
              <Clock className="h-4 w-4 text-purple-800 dark:text-purple-300" />
              <span className="font-medium text-purple-800 dark:text-purple-300">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-center text-lg font-medium mb-2 dark:text-white">Unscramble this word:</h3>
            <div className="text-center">
              <div className="text-3xl font-bold tracking-wide mb-6 text-purple-700 dark:text-purple-300">
                {scrambledWord.split('').map((letter, i) => (
                  <span key={i} className="inline-block mx-1 transition-all transform hover:scale-110 hover:text-purple-500">
                    {letter.toUpperCase()}
                  </span>
                ))}
              </div>
              
              <div className="mb-6">
                <Input
                  type="text"
                  value={userGuess}
                  onChange={e => setUserGuess(e.target.value)}
                  placeholder="Your answer..."
                  className="text-center text-lg"
                  disabled={isCorrect}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && userGuess) {
                      checkAnswer()
                    }
                  }}
                />
              </div>
              
              {isCorrect ? (
                <div className="flex items-center justify-center text-green-600 dark:text-green-400 font-medium gap-2 mb-4">
                  <Check className="h-5 w-5" />
                  <span>Correct! Well done!</span>
                </div>
              ) : (
                <div className="flex justify-center gap-3 mb-4">
                  <Button onClick={checkAnswer} disabled={!userGuess}>
                    Check Answer
                  </Button>
                  <Button variant="outline" onClick={showWordHint} disabled={showHint}>
                    Hint (-5 pts)
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <Button variant="outline" onClick={resetGame} className="inline-flex items-center">
              <RotateCcw className="mr-2 h-4 w-4" />
              End Game
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 