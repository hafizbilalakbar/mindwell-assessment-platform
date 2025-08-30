"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Palette, Refresh, Volume2, VolumeX } from "lucide-react"

const COLORS = [
  { bg: "from-purple-500 to-blue-500", name: "Calming Violet" },
  { bg: "from-blue-400 to-cyan-300", name: "Serene Sky" },
  { bg: "from-green-400 to-teal-500", name: "Forest Harmony" },
  { bg: "from-amber-300 to-yellow-200", name: "Sunlight" },
  { bg: "from-rose-400 to-pink-300", name: "Gentle Rose" },
  { bg: "from-indigo-600 to-violet-500", name: "Deep Focus" },
  { bg: "from-emerald-400 to-green-300", name: "Meadow Breath" },
  { bg: "from-cyan-400 to-sky-300", name: "Ocean Calm" },
]

const QUOTES = [
  "Breathe in peace, breathe out tension.",
  "Your mind is a garden, your thoughts are the seeds.",
  "Peace comes from within. Do not seek it without.",
  "Every moment is a fresh beginning.",
  "Inhale confidence, exhale doubt.",
  "Calm mind, peaceful soul.",
  "You are enough, just as you are.",
  "Find peace in the present moment.",
  "You cannot control the waves, but you can learn to surf.",
  "Where there is peace, there is power.",
]

export function ColorRelaxation() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isBreathing, setIsBreathing] = useState(false)

  useEffect(() => {
    // Create audio element for ambient sounds
    const ambientAudio = new Audio("/sounds/ambient.mp3")
    ambientAudio.loop = true
    setAudio(ambientAudio)

    return () => {
      if (ambientAudio) {
        ambientAudio.pause()
        ambientAudio.src = ""
      }
    }
  }, [])

  const toggleAudio = () => {
    if (!audio) return

    if (isAudioPlaying) {
      audio.pause()
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error)
      })
    }
    
    setIsAudioPlaying(!isAudioPlaying)
  }

  const changeColor = () => {
    setCurrentColorIndex((prev) => (prev + 1) % COLORS.length)
    setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length)
  }

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing)
  }

  return (
    <div className={`p-6 h-full min-h-[300px] rounded-lg bg-gradient-to-r ${COLORS[currentColorIndex].bg} transition-all duration-1000`}>
      <div className="h-full flex flex-col items-center justify-between">
        <div className="w-full flex justify-between items-center">
          <span className="text-white/80 font-medium">{COLORS[currentColorIndex].name}</span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleAudio}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              {isAudioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={changeColor}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Palette size={18} />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div
            className={`w-28 h-28 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-8 shadow-lg transition-all duration-4000 ${
              isBreathing ? "animate-pulse scale-110" : ""
            }`}
            onClick={toggleBreathing}
          >
            <div className="text-white text-sm font-medium">
              {isBreathing ? "Breathe..." : "Tap to breathe"}
            </div>
          </div>
          
          <p className="text-white text-lg md:text-xl font-medium max-w-md leading-relaxed">
            {QUOTES[currentQuoteIndex]}
          </p>
        </div>

        <div className="w-full flex justify-center">
          <Button 
            variant="outline" 
            onClick={changeColor}
            className="bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <Refresh size={16} className="mr-2" />
            New Mood
          </Button>
        </div>
      </div>
    </div>
  )
} 