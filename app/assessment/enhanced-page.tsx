"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, CheckCircle, Menu, X, Loader2, AlertCircle, Info } from "lucide-react"
import { AssessmentFooter } from "@/components/assessment-footer"
import { useAuth } from "@/components/auth-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { CosmicBackground } from "@/components/cosmic-background"
import gsap from "gsap"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface QuestionOption {
  id: string
  text: string
  value: number
}

interface Question {
  id: string
  text: string
  category: "stress" | "anxiety" | "depression" | "general" | "sleep"
  options: QuestionOption[]
}

interface Answer {
  questionId: string
  optionId: string
  value: number
  text: string
}

const allQuestions: Question[] = [
  {
    id: "stress_1",
    text: "How often have you felt nervous or stressed in the past week?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely (1-2 times)", value: 1 },
      { id: "sometimes", text: "Sometimes (3-4 times)", value: 2 },
      { id: "often", text: "Often (5-6 times)", value: 3 },
      { id: "always", text: "Almost always (daily)", value: 4 },
    ],
  },
  {
    id: "anxiety_1",
    text: "Do you worry excessively about everyday situations?",
    category: "anxiety",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "depression_1",
    text: "How often do you feel sad or down?",
    category: "depression",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "stress_2",
    text: "How difficult is it for you to relax?",
    category: "stress",
    options: [
      { id: "very_easy", text: "Very easy", value: 0 },
      { id: "easy", text: "Easy", value: 1 },
      { id: "moderate", text: "Moderate", value: 2 },
      { id: "difficult", text: "Difficult", value: 3 },
      { id: "very_difficult", text: "Very difficult", value: 4 },
    ],
  },
  {
    id: "anxiety_2",
    text: "Do you experience physical symptoms when anxious (racing heart, sweating, etc.)?",
    category: "anxiety",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "sleep_1",
    text: "How would you rate your sleep quality over the past month?",
    category: "general",
    options: [
      { id: "excellent", text: "Excellent", value: 0 },
      { id: "good", text: "Good", value: 1 },
      { id: "fair", text: "Fair", value: 2 },
      { id: "poor", text: "Poor", value: 3 },
      { id: "very_poor", text: "Very poor", value: 4 },
    ],
  },
  {
    id: "concentration_1",
    text: "How often do you have trouble concentrating on tasks?",
    category: "general",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "social_1",
    text: "How comfortable do you feel in social situations?",
    category: "anxiety",
    options: [
      { id: "very_comfortable", text: "Very comfortable", value: 0 },
      { id: "comfortable", text: "Comfortable", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "uncomfortable", text: "Uncomfortable", value: 3 },
      { id: "very_uncomfortable", text: "Very uncomfortable", value: 4 },
    ],
  }
];

// Enhanced progress bar component
function EnhancedProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 w-full bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50 shadow-inner">
      <div 
        className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function EnhancedAssessmentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSelectionWarning, setShowSelectionWarning] = useState(false)
  const [warningShakeEffect, setWarningShakeEffect] = useState(false)
  const [attemptedNextWithoutSelection, setAttemptedNextWithoutSelection] = useState(false)
  
  // Card ref for animations
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex]

  // Function to select random questions
  const selectRandomQuestions = () => {
    const questionsCopy = [...allQuestions];
    for (let i = questionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
    }
    return questionsCopy.slice(0, 20);
  }

  // Initialize questions
  useEffect(() => {
    if (allQuestions.length > 0 && !isInitialized) {
      setQuestions(selectRandomQuestions());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Check for auth
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (!(user.age && user.gender && user.occupation && user.location)) {
      router.push('/assessment/info')
    }
  }, [user, router])

  // Calculate progress
  const progress = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  
  // Reset selected option when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    
    setSelectedOption(null);
    setShowSelectionWarning(false);
    setAttemptedNextWithoutSelection(false);
    
    // Check if we already have an answer for this question
    const existingAnswer = answers.find((answer) => answer.questionId === currentQuestion.id);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.optionId);
    }
  }, [currentQuestionIndex, answers, currentQuestion]);

  // Animation effects
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Fade in and scale animation for the card
    gsap.fromTo(
      cardRef.current, 
      { opacity: 0, y: 20, scale: 0.98 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option: QuestionOption) => {
    if (!currentQuestion) return;
    
    setSelectedOption(option.id);
    setShowSelectionWarning(false);
    setAttemptedNextWithoutSelection(false);

    // Update or add answer
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      optionId: option.id,
      value: option.value,
      text: option.text,
    }

    setAnswers((prev) => {
      const filtered = prev.filter((answer) => answer.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
  }

  const triggerWarningAnimation = () => {
    setWarningShakeEffect(true);
    setShowSelectionWarning(true);
    setAttemptedNextWithoutSelection(true);
    
    // Apply GSAP shake animation to card
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: [-5, 5, -5, 5, -3, 3, -2, 2, 0],
        duration: 0.6,
        ease: "power1.inOut"
      });
    }
    
    // Reset shake effect after animation completes
    setTimeout(() => {
      setWarningShakeEffect(false);
    }, 600);
  }

  const handleNext = () => {
    if (!selectedOption) {
      triggerWarningAnimation();
      return;
    }

    setIsLoading(true);
    setShowSelectionWarning(false);
    setAttemptedNextWithoutSelection(false);

    // Move to next question or complete assessment
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsLoading(false);
      }, 300);
    } else {
      // Assessment complete - calculate results and redirect
      calculateAndRedirect();
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setIsLoading(false);
      }, 300);
    }
  }

  const calculateAndRedirect = () => {
    // Make sure all questions are answered
    if (answers.length < questions.length) {
      triggerWarningAnimation();
      return;
    }

    // Calculate scores
    const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0)
    const maxPossibleScore = questions.length * 4
    const percentage = (totalScore / maxPossibleScore) * 100
    
    // Redirect with query params
    const queryParams = new URLSearchParams();
    queryParams.set("score", totalScore.toString());
    queryParams.set("percentage", percentage.toString());
    
    router.push("/assessment/report?" + queryParams.toString());
  }

  // Render loading state
  if (!isInitialized || !questions.length || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950">
        <div className="flex flex-col items-center gap-6 max-w-md mx-auto p-8 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl">
          <div className="relative">
            <Loader2 className="h-20 w-20 animate-spin text-purple-500" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-pulse-slow"></div>
          </div>
          <h3 className="text-xl font-medium text-white">Preparing Your Assessment</h3>
          <p className="text-center text-purple-200/70 text-sm">Selecting questions tailored for you...</p>
        </div>
      </div>
    );
  }

  // Main assessment UI
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-gray-900 relative overflow-hidden">
          {/* Cosmic background for visual appeal */}
          <CosmicBackground />
          
          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-transparent to-purple-950/30 pointer-events-none"></div>
          
          {/* Header */}
          <header className="bg-gray-900/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center">
                  <div className="relative w-[120px] h-10">
                    <Image 
                      src="/mindwell-logo.png" 
                      alt="MindWell Logo" 
                      width={120}
                      height={40}
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                  <ul className="flex space-x-4">
                    <li>
                      <Link href="/" className="text-white/80 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-white/80 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-white/80 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white/80 hover:text-purple-300"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden">
                <nav className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/80 backdrop-blur-md border-t border-white/10">
                  <Link href="/" className="text-white/80 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="text-white/80 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium">
                    About
                  </Link>
                  <Link href="/contact" className="text-white/80 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium">
                    Contact
                  </Link>
                </nav>
              </div>
            )}
          </header>

          <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:py-12">
            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                MindWell Assessment
              </h1>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-4">
                <div className="flex justify-between text-sm font-medium text-white/80 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    Progress: {Math.round(progress)}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <EnhancedProgressBar value={progress} />
              </div>
              
              {/* Question indicator dots */}
              <div className="hidden sm:flex justify-center items-center space-x-1 py-2 overflow-x-auto max-w-full mb-6">
                {Array.from({ length: questions.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentQuestionIndex 
                        ? "bg-purple-500" 
                        : index < currentQuestionIndex 
                          ? "bg-indigo-400/80" 
                          : "bg-gray-600/50"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-white/80 max-w-2xl mx-auto mt-3 px-2">
                Choose the option that best describes how you've been feeling recently.
              </p>
            </div>

            {/* Question Card with warning animation */}
            <div className={`max-w-3xl mx-auto relative ${warningShakeEffect ? 'animate-shake' : ''}`}>
              {/* Card glowing effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-lg ${attemptedNextWithoutSelection ? 'from-red-500 to-red-600' : ''}`}></div>
              
              <div ref={cardRef} className="relative">
                <Card className={`shadow-xl border-0 bg-gray-900/70 backdrop-blur-xl overflow-hidden ${attemptedNextWithoutSelection ? 'ring-2 ring-red-500/50' : ''}`}>
                  {/* Category indicator */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-500"></div>
                  
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-xl sm:text-2xl text-white font-semibold">
                      {currentQuestion.text}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 options-container">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left flex items-center space-x-3 p-4 rounded-xl transition-all ${
                          selectedOption === option.id
                            ? "bg-gradient-to-r from-purple-700 to-indigo-700 shadow-lg border border-purple-400/30"
                            : "bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-800/90"
                        }`}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                          opacity: 0,
                          animation: 'fade-in-up 0.3s ease-out forwards',
                          animationDelay: `${index * 0.05}s`
                        }}
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full ${
                            selectedOption === option.id
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md"
                              : "border-2 border-gray-400"
                          } flex items-center justify-center`}
                        >
                          {selectedOption === option.id && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={`font-medium ${selectedOption === option.id ? "text-white" : "text-white/90"}`}>
                          {option.text}
                        </span>
                      </button>
                    ))}
                    
                    {/* Selection warning message */}
                    {showSelectionWarning && (
                      <div className="text-center p-3 text-red-300 text-sm font-medium flex items-center justify-center gap-2 bg-red-900/20 rounded-lg border border-red-400/30 animate-pulse-subtle">
                        <AlertCircle size={18} />
                        <span>Please select an option before proceeding</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isLoading}
                className={`flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800 transition-all duration-300 ${
                  currentQuestionIndex === 0 ? "opacity-50" : "hover:border-purple-500/50"
                }`}
                size="lg"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <div className="block sm:hidden text-center text-white/80 text-sm font-medium">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
              
              <Tooltip open={!selectedOption && attemptedNextWithoutSelection}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className={`flex items-center gap-2 ${
                      selectedOption 
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 shadow-lg" 
                        : "bg-gray-600 cursor-not-allowed"
                    } transition-all duration-300`}
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing</span>
                      </div>
                    ) : currentQuestionIndex === questions.length - 1 ? (
                      <div className="flex items-center gap-2">
                        <span>Complete</span>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-red-900/90 border-red-500/50 text-white">
                  <span>Please select an answer first</span>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Assessment Info */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg border border-indigo-700/20 p-4 text-sm text-white/70 flex items-start gap-3">
                <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Your responses help create a personalized mental health assessment. All questions must be answered to generate your report.</p>
                </div>
              </div>
            </div>
          </main>
          
          <AssessmentFooter />
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
