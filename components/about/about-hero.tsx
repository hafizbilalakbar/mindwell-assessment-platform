"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface AboutHeroProps {
  onScrollToMission: () => void
}

export function AboutHero({ onScrollToMission }: AboutHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section 
      ref={ref} 
      className="about-hero-section relative h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, opacity, scale }}
      >
        <div className="about-hero-image-container-fixed w-full h-full">
          <Image
            src="/images/about-images/about-hero-image.png"
            alt="Mental wellness"
            fill
            className="about-hero-image-fixed object-cover"
            priority
          />
          <div className="about-hero-overlay"></div>
        </div>
      </motion.div>

      <motion.div 
        className="about-hero-content container relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-medium text-white">Empowering Mental Wellness</span>
          </span>
        </motion.div>
        
        <motion.h1 
          className="about-hero-title-fixed text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Transforming Mental Health
          <span className="block gradient-text">One Mind at a Time</span>
        </motion.h1>
        
        <motion.p 
          className="about-hero-description-fixed text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          At MindWell, we combine clinical expertise with innovative technology to make mental health 
          assessment and support accessible to everyone, everywhere.
        </motion.p>
        
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <motion.button 
            onClick={onScrollToMission}
            className="hero-button-primary hover-shine text-white dark:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Learn More <Sparkles className="inline-block ml-2 h-4 w-4" />
          </motion.button>
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div 
            onClick={onScrollToMission}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white animate-bounce">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[10%] right-[5%] w-32 h-32 md:w-48 md:h-48 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/about-images/about-hero-img.jpg"
            alt="Mental health support"
            fill
            className="object-cover rounded-full border-4 border-white/30 shadow-2xl"
          />
        </div>
      </motion.div>
    </section>
  )
}
