"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Heart, Users } from "lucide-react"

export function WelcomeHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/40 dark:text-purple-300">
              Welcome to MindWell
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Your Mental Health <br className="hidden sm:inline" />
              <span className="text-purple-600 dark:text-purple-400">Assessment Platform</span>
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600 dark:text-gray-300">
              Discover insights about your mental wellbeing through our
              scientifically validated assessment tools and resources.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <Link href="/assessment/welcome">
              <Button size="lg" className="hero-btn-primary">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" className="hero-btn-secondary">
                Learn More
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/40">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Scientifically Validated</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our assessments are based on clinically validated psychological measures
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/40">
                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Personalized Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive personalized feedback and practical recommendations
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/40">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Completely Confidential</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your privacy is our priority with secure and confidential assessments
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-64 w-96 h-96 opacity-20 bg-purple-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 -right-64 w-96 h-96 opacity-20 bg-blue-400 rounded-full filter blur-3xl"></div>
      </div>
    </section>
  )
}
