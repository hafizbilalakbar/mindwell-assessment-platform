"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, Trophy, RotateCcw } from "lucide-react"

// Define the colors we'll use in the game
const COLORS = [
  { name: "Red", textClass: "text-red-500 dark:text-red-400", bgClass: "bg-red-500 dark:bg-red-600" },
  { name: "Blue", textClass: "text-blue-500 dark:text-blue-400", bgClass: "bg-blue-500 dark:bg-blue-600" },
  { name: "Green", textClass: "text-green-500 dark:text-green-400", bgClass: "bg-green-500 dark:bg-green-600" },
  { name: "Purple", textClass: "text-purple-500 dark:text-purple-400", bgClass: "bg-purple-500 dark:bg-purple-600" },
  { name: "Yellow", textClass: "text-yellow-500 dark:text-yellow-400", bgClass: "bg-yellow-500 dark:bg-yellow-600" },
]

export function ColorMatch() {
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQuestion, setCurrentQuestion] = useState({ colorName: "", textColor: 0, matched: false })
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null)
  const [streak, setStreak] = useState(0)

  // Generate a new question
  const generateQuestion = () => {
    const colorNameIndex = Math.floor(Math.random() * COLORS.length)
    const textColorIndex = Math.floor(Math.random() * COLORS.length)
    const matched = Math.random() > 0.5 ? true : false
    
    // If matched is true, the text color should match the color name
    // If matched is false, they should be different
    const finalTextColorIndex = matched ? colorNameIndex : 
      (colorNameIndex === textColorIndex) ? 
        (textColorIndex + 1) % COLORS.length : textColorIndex
    
    setCurrentQuestion({
      colorName: COLORS[colorNameIndex].name,
      textColor: finalTextColorIndex,
      matched
    })
  }

  // Start the game
  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(30)
    setStreak(0)
    setLastAnswer(null)
    generateQuestion()
  }

  // End the game
  const endGame = () => {
    setGameActive(false)
    if (score > highScore) {
      setHighScore(score)
    }
  }

  // Handle user's answer
  const handleAnswer = (userAnswer: boolean) => {
    const isCorrect = userAnswer === currentQuestion.matched
    
    if (isCorrect) {
      // Calculate points based on current streak
      const newStreak = streak + 1
      const pointsToAdd = Math.min(10, 5 + Math.floor(newStreak / 3))
      
      setScore(prev => prev + pointsToAdd)
      setStreak(newStreak)
      setLastAnswer(true)
    } else {
      setStreak(0)
      setLastAnswer(false)
    }
    
    // Generate a new question
    generateQuestion()
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, gameActive])

  return (
    <div className="max-w-md mx-auto p-6">
      {!gameActive ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Color Match Challenge</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Does the color of the text match the color name? Decide quickly!
          </p>
          
          {score > 0 && (
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg mb-6 text-center">
              <h3 className="font-bold text-purple-800 dark:text-purple-300 text-xl mb-2">Game Over!</h3>
              <p className="text-purple-700 dark:text-purple-200">Your score: <span className="font-bold text-xl">{score}</span></p>
            </div>
          )}
          
          <Button onClick={startGame} className="btn-professional">
            {score > 0 ? "Play Again" : "Start Game"}
          </Button>
        </div>
      ) : (
        <div>
          {/* Game Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg flex items-center gap-1">
              <Trophy className="h-4 w-4 text-purple-800 dark:text-purple-300" />
              <span className="font-medium text-purple-800 dark:text-purple-300">Score: {score}</span>
            </div>
            
            <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg flex items-center gap-1">
              <Clock className="h-4 w-4 text-purple-800 dark:text-purple-300" />
              <span className="font-medium text-purple-800 dark:text-purple-300">{timeLeft}s</span>
            </div>
          </div>
          
          {/* Streak indicator */}
          {streak > 2 && (
            <div className="text-center mb-4">
              <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-lg">
                <span className="font-medium text-yellow-800 dark:text-yellow-300">
                  {streak} streak! {streak > 5 ? "🔥🔥🔥" : streak > 3 ? "🔥🔥" : "🔥"}
                </span>
              </div>
            </div>
          )}
          
          {/* Current Question */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6 text-center">
            <h3 className="text-lg font-medium mb-6 dark:text-white">Does the color match the word?</h3>
            
            <div className="mb-8">
              <span className={`text-4xl font-bold ${COLORS[currentQuestion.textColor].textClass}`}>
                {currentQuestion.colorName}
              </span>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                className="bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 flex items-center gap-2"
                onClick={() => handleAnswer(true)}
              >
                <Check className="h-5 w-5" />
                Yes, match
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 flex items-center gap-2"
                onClick={() => handleAnswer(false)}
              >
                <X className="h-5 w-5" />
                No, different
              </Button>
            </div>
          </div>
          
          {/* Feedback for last answer */}
          {lastAnswer !== null && (
            <div className={`text-center mb-6 p-3 rounded-lg ${
              lastAnswer 
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}>
              {lastAnswer 
                ? <span className="flex items-center justify-center gap-1"><Check className="h-4 w-4" /> Correct!</span> 
                : <span className="flex items-center justify-center gap-1"><X className="h-4 w-4" /> Wrong!</span>}
            </div>
          )}
          
          {/* End Game Button */}
          <div className="text-center">
            <Button variant="outline" onClick={endGame} className="inline-flex items-center">
              <RotateCcw className="mr-2 h-4 w-4" />
              End Game
            </Button>
          </div>
        </div>
      )}
      
      {/* High Score Display */}
      {highScore > 0 && !gameActive && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            High Score: <span className="font-bold">{highScore}</span>
          </p>
        </div>
      )}
    </div>
  )
} 