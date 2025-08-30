"use client"

import { useEffect, useState, useRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnimatedStatProps {
  value: number
  suffix: string
  label: string
  icon: LucideIcon
  animate: boolean
  delay?: number
  special?: boolean
}

export default function AnimatedStat({ 
  value, 
  suffix, 
  label, 
  icon: Icon, 
  animate, 
  delay = 0,
  special = false
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)
    
    // Start animation immediately if animate is true
    if (animate && !special) {
      startCountAnimation()
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  // Handle animation when animate prop changes
  useEffect(() => {
    if (animate && isClient && !special) {
      startCountAnimation()
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [animate, isClient])
  
  // Function to start the count animation
  const startCountAnimation = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Start from 0
    setDisplayValue(0)
    
    // Calculate increment and duration
    const duration = 1500 // 1.5 seconds (faster)
    const steps = 30 // 30 steps (smoother)
    const increment = value / steps
    const interval = duration / steps
    let current = 0
    
    // Create interval to increment the value
    intervalRef.current = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, interval)
  }
  
  return (
    <div className="text-center">
      <motion.div 
        className="stats-card backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 dark:border-white/10 p-6 hover:bg-white/20 transition-all duration-500 flex flex-col items-center"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: delay / 1000
          }
        }}
        whileHover={{ 
          y: -10, 
          boxShadow: "0 25px 35px -15px rgba(0, 0, 0, 0.3)",
          scale: 1.03,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Decorative elements inside each card */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl"></div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white/30 to-white/10 dark:from-white/20 dark:to-white/5 rounded-full flex items-center justify-center shadow-lg relative transform transition-transform duration-500 hover:scale-110 hover:rotate-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 animate-spin-slow"></div>
          <Icon className="h-8 w-8 text-white relative z-10" />
        </div>
        
        <div className="stat-container text-center">
          <div className="flex items-center justify-center">
            <div className="counter-value flex">
              {special ? (
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 stat-number animate-count">
                  24/7
                </div>
              ) : (
                <>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 stat-number animate-count">
                    {isClient ? displayValue : 0}
                  </div>
                  {suffix && (
                    <span className="text-4xl md:text-5xl font-bold text-white mb-2">{suffix}</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-purple-100 font-medium relative z-10 text-center mt-2">{label}</div>
        
        {/* Animated underline */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: '40%', opacity: 1 }}
          transition={{ duration: 0.8, delay: delay / 1000 + 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="h-0.5 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 rounded-full mt-3"
        />
      </motion.div>
    </div>
  )
} 