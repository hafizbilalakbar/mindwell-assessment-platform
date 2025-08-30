"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, Pause, RefreshCw } from "lucide-react"

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest")
  const [counter, setCounter] = useState(0)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        setCounter((prev) => {
          const newCount = prev + 1

          // Phase transitions
          if (phase === "rest" && newCount > 2) {
            setPhase("inhale")
            return 0
          } else if (phase === "inhale" && newCount > 4) {
            setPhase("hold")
            return 0
          } else if (phase === "hold" && newCount > 7) {
            setPhase("exhale")
            return 0
          } else if (phase === "exhale" && newCount > 8) {
            setPhase("rest")
            setCycles((c) => c + 1)
            return 0
          }

          return newCount
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, phase])

  const toggleActive = () => {
    setIsActive(!isActive)
    if (!isActive) {
      setPhase("rest")
      setCounter(0)
    }
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("rest")
    setCounter(0)
    setCycles(0)
  }

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" },
    },
    hold: {
      scale: 1.5,
      transition: { duration: 7, ease: "easeInOut" },
    },
    exhale: {
      scale: 1,
      transition: { duration: 8, ease: "easeInOut" },
    },
    rest: {
      scale: 1,
      transition: { duration: 2, ease: "easeInOut" },
    },
  }

  const getInstructionText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In..."
      case "hold":
        return "Hold..."
      case "exhale":
        return "Breathe Out..."
      case "rest":
        return "Get Ready..."
      default:
        return "Click Start"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center mb-4">
        <p className="text-lg font-medium mb-2">{getInstructionText()}</p>
        <p className="text-sm text-muted-foreground">Completed cycles: {cycles}</p>
      </div>

      <div className="relative flex items-center justify-center h-64 w-64">
        <motion.div
          className="absolute rounded-full bg-primary/20 border-2 border-primary"
          initial={{ scale: 1, width: 100, height: 100 }}
          animate={phase}
          variants={circleVariants}
        />
        <div className="z-10 text-lg font-semibold">{isActive && counter}</div>
      </div>

      <div className="flex gap-4">
        <Button onClick={toggleActive} size="lg">
          {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetExercise} variant="outline" size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
