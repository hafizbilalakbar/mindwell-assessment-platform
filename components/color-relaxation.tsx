"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, RefreshCw } from "lucide-react"

const colors = [
  { name: "Calm Blue", hex: "#3b82f6", description: "Promotes tranquility and peace" },
  { name: "Serene Green", hex: "#10b981", description: "Encourages balance and harmony" },
  { name: "Gentle Purple", hex: "#8b5cf6", description: "Inspires creativity and mindfulness" },
  { name: "Warm Amber", hex: "#f59e0b", description: "Brings warmth and comfort" },
  { name: "Soft Pink", hex: "#ec4899", description: "Nurtures compassion and care" },
  { name: "Deep Teal", hex: "#0d9488", description: "Refreshes and rejuvenates" },
  { name: "Peaceful Lavender", hex: "#a78bfa", description: "Calms the mind and reduces stress" },
  { name: "Earthy Brown", hex: "#92400e", description: "Grounds and stabilizes emotions" },
]

export function ColorRelaxation() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const currentColor = colors[currentColorIndex]
  
  const handleNextColor = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colors.length)
      setIsAnimating(false)
    }, 500)
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md border border-white/10 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Color Relaxation Therapy</h2>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-white/80">
          Focus on the color and breathe deeply. Allow yourself to be immersed in the color's energy.
        </p>
      </div>
      
      <motion.div 
        className="w-full aspect-video rounded-xl mb-6 flex items-center justify-center"
        style={{ backgroundColor: currentColor.hex }}
        animate={{ 
          opacity: isAnimating ? [1, 0.5, 1] : 1,
          scale: isAnimating ? [1, 0.98, 1] : 1 
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          key={currentColor.name}
          className="text-center p-6"
        >
          <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{currentColor.name}</h3>
          <p className="text-white/90 text-xl drop-shadow-md">{currentColor.description}</p>
        </motion.div>
      </motion.div>
      
      <div className="flex justify-center">
        <Button
          onClick={handleNextColor}
          className="px-6 py-2 bg-white text-indigo-900 hover:bg-white/90 rounded-full font-medium flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Next Color
        </Button>
      </div>
    </div>
  )
} 