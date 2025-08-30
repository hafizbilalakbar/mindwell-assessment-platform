"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Zap, Clock, Trophy, RotateCcw, Ban } from "lucide-react"

export function ReactionTime() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "clicked" | "tooEarly">("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [averageTime, setAverageTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [waitTimeout, setWaitTimeout] = useState<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const startGame = () => {
    setGameState("waiting")
    // Random wait time between 1-5 seconds
    const randomWait = Math.floor(Math.random() * 4000) + 1000
    
    const timeout = setTimeout(() => {
      setGameState("ready")
      startTimeRef.current = Date.now()
    }, randomWait)
    
    setWaitTimeout(timeout)
  }

  const handleClick = () => {
    if (gameState === "idle") {
      startGame()
    } else if (gameState === "waiting") {
      // Clicked too early
      if (waitTimeout) clearTimeout(waitTimeout)
      setGameState("tooEarly")
    } else if (gameState === "ready") {
      const endTime = Date.now()
      const time = startTimeRef.current ? endTime - startTimeRef.current : 0
      setReactionTime(time)
      
      // Update attempts list
      const newAttempts = [...attempts, time]
      setAttempts(newAttempts)
      
      // Calculate average
      const sum = newAttempts.reduce((acc, val) => acc + val, 0)
      setAverageTime(Math.round(sum / newAttempts.length))
      
      // Update best time
      if (bestTime === null || time < bestTime) {
        setBestTime(time)
      }
      
      setGameState("clicked")
    } else if (gameState === "clicked" || gameState === "tooEarly") {
      startGame()
    }
  }

  const resetGame = () => {
    if (waitTimeout) clearTimeout(waitTimeout)
    setGameState("idle")
    setReactionTime(null)
    setAttempts([])
    setAverageTime(null)
    setBestTime(null)
  }

  useEffect(() => {
    return () => {
      if (waitTimeout) clearTimeout(waitTimeout)
    }
  }, [waitTimeout])

  // Get feedback based on reaction time
  const getFeedback = () => {
    if (!reactionTime) return ""
    
    if (reactionTime < 200) return "Lightning fast!"
    if (reactionTime < 250) return "Amazing reflexes!"
    if (reactionTime < 300) return "Very good!"
    if (reactionTime < 350) return "Good job!"
    if (reactionTime < 400) return "Decent!"
    if (reactionTime < 500) return "Average"
    return "Keep practicing!"
  }

  // Get background color based on game state
  const getBackgroundColor = () => {
    switch (gameState) {
      case "idle":
        return "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
      case "waiting":
        return "bg-red-500 dark:bg-red-600"
      case "ready":
        return "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
      case "clicked":
        return "bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700"
      case "tooEarly":
        return "bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700"
      default:
        return "bg-blue-500"
    }
  }

  // Get instruction text based on game state
  const getInstructionText = () => {
    switch (gameState) {
      case "idle":
        return "Click to start"
      case "waiting":
        return "Wait for green..."
      case "ready":
        return "Click now!"
      case "clicked":
        return "Click to try again"
      case "tooEarly":
        return "Too early! Click to try again"
      default:
        return ""
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold dark:text-white">Reaction Time Test</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Test your reflexes! Wait for the green color, then click as fast as you can.
        </p>
      </div>

      {/* Stats Display */}
      {(bestTime !== null || averageTime !== null) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {bestTime !== null && (
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Best Time</span>
              </div>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{bestTime} ms</p>
            </div>
          )}
          
          {averageTime !== null && (
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Average</span>
              </div>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{averageTime} ms</p>
            </div>
          )}
        </div>
      )}

      {/* Game Button */}
      <button
        onClick={handleClick}
        className={`w-full h-48 rounded-xl transition-colors duration-200 flex flex-col items-center justify-center ${getBackgroundColor()} text-white p-8 mb-6`}
      >
        <span className="text-2xl font-bold mb-3">{getInstructionText()}</span>
        
        {gameState === "clicked" && reactionTime && (
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{reactionTime} ms</div>
            <div className="text-lg font-medium">{getFeedback()}</div>
          </div>
        )}
        
        {gameState === "tooEarly" && (
          <div className="flex items-center gap-2">
            <Ban className="w-6 h-6" />
            <span className="text-lg font-medium">Too early!</span>
          </div>
        )}
      </button>

      {/* Reset Button */}
      {(gameState !== "idle" || attempts.length > 0) && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={resetGame}
            className="inline-flex items-center"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      )}
    </div>
  )
} 