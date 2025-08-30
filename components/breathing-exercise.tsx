"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, X } from "lucide-react"

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState("inhale")
  const [count, setCount] = useState(4)
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isActive) {
      timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            // Switch phases
            if (phase === "inhale") {
              setPhase("hold")
              return 7
            } else if (phase === "hold") {
              setPhase("exhale")
              return 8
            } else {
              setPhase("inhale")
              return 4
            }
          }
          return prevCount - 1
        })
      }, 1000)
    }
    
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, phase])
  
  const handleToggle = () => {
    if (!isActive) {
      setPhase("inhale")
      setCount(4)
    }
    setIsActive(!isActive)
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md border border-white/10 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Guided Breathing Exercise</h2>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center py-10">
        <motion.div
          className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-8"
          animate={{
            scale: phase === "inhale" ? [1, 1.2] : phase === "exhale" ? [1.2, 1] : 1.2,
          }}
          transition={{
            duration: phase === "hold" ? 0 : 4,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center text-white text-4xl font-bold"
            animate={{
              scale: phase === "inhale" ? [1, 0.9] : phase === "exhale" ? [0.9, 1] : 0.9,
            }}
            transition={{
              duration: phase === "hold" ? 0 : 4,
              ease: "easeInOut"
            }}
          >
            {count}
          </motion.div>
        </motion.div>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-white mb-2">
            {phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : "Breathe Out"}
          </h3>
          <p className="text-white/70">
            {phase === "inhale" 
              ? "Slowly inhale through your nose" 
              : phase === "hold" 
              ? "Hold your breath" 
              : "Slowly exhale through your mouth"}
          </p>
        </div>
        
        <Button
          onClick={handleToggle}
          className="px-6 py-2 bg-white text-indigo-900 hover:bg-white/90 rounded-full font-medium flex items-center gap-2"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 