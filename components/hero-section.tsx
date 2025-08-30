"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, Brain, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-medium text-sm">
              Mental Health Assessment Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Understand Your <span className="text-purple-600 dark:text-purple-400">Mental Wellbeing</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Take our scientifically-backed assessment to gain insights into your mental health and receive personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/assessment/welcome">
                <Button size="lg" className="hero-btn-primary">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" className="hero-btn-secondary">
                  Learn More
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>Scientifically Validated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-5 w-5 text-purple-500" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="relative max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
              <Image
                src="/hero-image.png"
                alt="Mental Health Assessment"
                width={600}
                height={600}
                className="relative z-10"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-70" />
    </div>
  )
}
