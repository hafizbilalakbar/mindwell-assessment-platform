"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Play, Volume2, VolumeX, RotateCcw } from "lucide-react"

export function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playingSequence, setPlayingSequence] = useState(false)
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [highScore, setHighScore] = useState(0)

  // Sound references
  const soundRefs = [
    useRef<HTMLAudioElement | null>(null),
    useRef<HTMLAudioElement | null>(null),
    useRef<HTMLAudioElement | null>(null),
    useRef<HTMLAudioElement | null>(null),
  ]

  // Add a new random color to the sequence
  const addToSequence = () => {
    const randomColor = Math.floor(Math.random() * 4)
    setSequence(prev => [...prev, randomColor])
  }

  // Start a new game
  const startGame = () => {
    setSequence([])
    setUserSequence([])
    setGameOver(false)
    setGameStarted(true)
    setLevel(1)
    
    // Create initial sequence with one item
    const randomColor = Math.floor(Math.random() * 4)
    setSequence([randomColor])
    
    // Play initial sequence after a short delay
    setTimeout(() => {
      playSequence([randomColor])
    }, 1000)
  }

  // Play the sequence for the user to watch
  const playSequence = async (sequenceToPlay: number[]) => {
    setPlayingSequence(true)
    setUserSequence([])
    
    // Play each color with delay between
    for (let i = 0; i < sequenceToPlay.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          flashButton(sequenceToPlay[i])
          resolve(null)
        }, 700 * i)
      })
    }
    
    // Wait for the last animation to finish
    setTimeout(() => {
      setPlayingSequence(false)
    }, 700 * sequenceToPlay.length)
  }

  // Flash a button and play its sound
  const flashButton = (index: number) => {
    // Play sound
    if (!isMuted && soundRefs[index]?.current) {
      soundRefs[index].current!.currentTime = 0
      soundRefs[index].current!.play().catch(e => console.error("Audio error:", e))
    }
    
    // Flash animation will be handled by CSS classes
    const button = document.getElementById(`simon-button-${index}`)
    if (button) {
      button.classList.add("simon-active")
      setTimeout(() => {
        button.classList.remove("simon-active")
      }, 300)
    }
  }

  // Handle user button presses
  const handleButtonPress = (colorIndex: number) => {
    if (playingSequence || gameOver || !gameStarted) return
    
    flashButton(colorIndex)
    
    // Add to user sequence
    const newUserSequence = [...userSequence, colorIndex]
    setUserSequence(newUserSequence)
    
    // Check if the user pressed the wrong button
    const correctButton = sequence[newUserSequence.length - 1]
    if (colorIndex !== correctButton) {
      // Game over
      setGameOver(true)
      if (level - 1 > highScore) {
        setHighScore(level - 1)
      }
      return
    }
    
    // Check if user completed the sequence
    if (newUserSequence.length === sequence.length) {
      // Level completed
      setLevel(prev => prev + 1)
      
      // Add to sequence and play the new sequence after a delay
      setTimeout(() => {
        addToSequence()
      }, 1000)
    }
  }

  // When sequence changes and it's not empty, play the sequence
  useEffect(() => {
    if (sequence.length > 0 && level > userSequence.length + 1) {
      setTimeout(() => {
        playSequence(sequence)
      }, 1000)
    }
  }, [sequence])

  // Set up audio elements
  useEffect(() => {
    // Create audio elements for each color
    soundRefs[0].current = new Audio("/audio/simon-1.mp3")
    soundRefs[1].current = new Audio("/audio/simon-2.mp3")
    soundRefs[2].current = new Audio("/audio/simon-3.mp3")
    soundRefs[3].current = new Audio("/audio/simon-4.mp3")
    
    // Clean up audio elements
    return () => {
      soundRefs.forEach(ref => {
        if (ref.current) {
          ref.current.pause()
          ref.current = null
        }
      })
    }
  }, [])

  return (
    <div className="max-w-md mx-auto p-4">
      <style jsx global>{`
        .simon-button {
          transition: all 0.2s ease;
        }
        .simon-active {
          filter: brightness(1.5);
          transform: scale(0.95);
        }
      `}</style>
      
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Simon Says</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Watch the pattern, then repeat it! How far can you go?
        </p>
      </div>
      
      {/* Game Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
          <span className="font-medium text-purple-800 dark:text-purple-300">Level: {level}</span>
        </div>
        
        {highScore > 0 && (
          <div className="bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
            <span className="font-medium text-purple-800 dark:text-purple-300">High Score: {highScore}</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-gray-500" />
          ) : (
            <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          )}
        </Button>
      </div>
      
      {/* Game Grid */}
      <div className="relative aspect-square w-full mb-6">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Red Button */}
          <button
            id="simon-button-0"
            className="simon-button bg-red-500 dark:bg-red-600 rounded-tl-full"
            onClick={() => handleButtonPress(0)}
            disabled={playingSequence || !gameStarted}
          ></button>
          
          {/* Blue Button */}
          <button
            id="simon-button-1"
            className="simon-button bg-blue-500 dark:bg-blue-600 rounded-tr-full"
            onClick={() => handleButtonPress(1)}
            disabled={playingSequence || !gameStarted}
          ></button>
          
          {/* Yellow Button */}
          <button
            id="simon-button-2"
            className="simon-button bg-yellow-500 dark:bg-yellow-600 rounded-bl-full"
            onClick={() => handleButtonPress(2)}
            disabled={playingSequence || !gameStarted}
          ></button>
          
          {/* Green Button */}
          <button
            id="simon-button-3"
            className="simon-button bg-green-500 dark:bg-green-600 rounded-br-full"
            onClick={() => handleButtonPress(3)}
            disabled={playingSequence || !gameStarted}
          ></button>
        </div>
        
        {/* Center circle with status */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-full w-1/3 h-1/3 flex items-center justify-center shadow-md">
            {!gameStarted ? (
              <Button 
                onClick={startGame} 
                className="rounded-full bg-purple-600 hover:bg-purple-700 pointer-events-auto"
              >
                <Play className="h-6 w-6" />
              </Button>
            ) : gameOver ? (
              <span className="text-red-600 dark:text-red-400 font-bold">Game Over</span>
            ) : playingSequence ? (
              <span className="text-purple-600 dark:text-purple-400 font-bold">Watch</span>
            ) : (
              <span className="text-green-600 dark:text-green-400 font-bold">Your Turn</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Game Controls */}
      <div className="flex justify-center">
        {(gameStarted || gameOver) && (
          <Button
            variant="outline"
            onClick={startGame}
            className="inline-flex items-center"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {gameOver ? "Play Again" : "Restart"}
          </Button>
        )}
      </div>
    </div>
  )
} 