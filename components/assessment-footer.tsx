"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Heart, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export function AssessmentFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 via-indigo-50/50 to-purple-50/70 dark:from-gray-900 dark:via-indigo-950/80 dark:to-purple-950/80 text-gray-800 dark:text-white py-10 mt-auto w-full relative overflow-hidden">
      {/* Animated gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 animate-gradient-slow"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
          {/* Logo and tagline - centered for assessment page */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative w-[140px] h-[70px] mb-4 group">
              <Image 
                src="/mindwell-logo.png" 
                alt="MindWell Logo" 
                fill
                style={{ objectFit: "contain" }}
                priority
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/0 via-indigo-600/20 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-indigo-200 text-center max-w-md mx-auto">
              Empowering you to better understand and improve your mental well-being.
            </p>
          </motion.div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-indigo-800/20 flex flex-col md:flex-row justify-center items-center">
          <p className="text-xs text-gray-500 dark:text-indigo-300 mb-4 md:mb-0 font-medium">
            &copy; {currentYear} MindWell. All rights reserved.
          </p>
          
          <div className="flex items-center md:ml-6">
            <p className="text-xs text-gray-500 dark:text-indigo-300 flex items-center font-medium">
              Made with <Heart className="h-3 w-3 text-pink-500 mx-1 animate-pulse-slow" /> for mental health awareness
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 