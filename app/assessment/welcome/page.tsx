"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Brain, Clock, Shield, CheckCircle, ArrowRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function WelcomePage() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleBeginAssessment = () => {
    setShowWelcomePopup(false)
    // Small delay to allow popup to close smoothly
    setTimeout(() => {
      router.push("/assessment")
    }, 300)
  }

  const handleClosePopup = () => {
    setShowWelcomePopup(false)
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen quiz-container flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 sm:mx-4 my-4 sm:my-6"
            >
              <Card className="quiz-card border-0 shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                </button>

                <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
                  {/* Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
                        MindWell Pro Assessment
                      </h1>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 leading-tight">
                      Welcome to Your Mental Health Journey
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                      This assessment will help you understand your mental wellbeing better. We'll ask you a series of
                      questions about your thoughts, feelings, and behaviors.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-sm sm:text-base">5-10 Minutes</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Quick to complete</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center bg-green-50 dark:bg-green-900/10 p-3 rounded-lg"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-sm sm:text-base">100% Confidential</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Your data is secure</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3">
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-sm sm:text-base">Professional Insights</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Evidence-based results</p>
                    </motion.div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">Before you begin:</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                          Find a quiet place where you can focus without distractions
                        </span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                          Answer honestly - there are no right or wrong answers
                        </span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                          Consider how you've been feeling over the past two weeks
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Greeting */}
                  <div className="text-center mb-4 sm:mb-6 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg">
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">
                      Hello <span className="font-semibold text-purple-600 dark:text-purple-400">{user.name}</span>,
                      ready to take the first step towards better mental health?
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    <motion.div 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="inline-block w-full sm:w-auto"
                    >
                      <Button
                        onClick={handleBeginAssessment}
                        className="btn-professional text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 h-auto shadow-lg hover:shadow-xl w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Begin Assessment
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-4 sm:mt-6 md:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      This assessment is for informational purposes only and is not a substitute for professional
                      medical advice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Content (shown when popup is closed) */}
      {!showWelcomePopup && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Preparing your assessment...</p>
        </motion.div>
      )}
    </div>
  )
}
