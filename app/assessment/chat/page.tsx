"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { questions } from "@/lib/questions"
import { ArrowRight, Send, Brain, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

type Answer = {
  questionId: string
  value: any
}

export default function ChatAssessment() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [inputValue, setInputValue] = useState("")
  const [scaleValue, setScaleValue] = useState<number[]>([5])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Check for authentication and complete profile
  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/auth/login')
    } else if (!(user.age && user.gender && user.occupation && user.location)) {
      // Redirect to info page if profile is incomplete
      router.push('/assessment/info')
    }
  }, [user, router])

  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [visibleQuestions, isTyping])

  const currentQuestion = questions[currentQuestionIndex]

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleScaleChange = (value: number[]) => {
    setScaleValue(value)
  }

  const handleCheckboxChange = (optionId: string) => {
    setSelectedOptions((prev) => {
      // If "None of the above" is selected, clear all other selections
      if (optionId === "q14-f") {
        return prev.includes(optionId) ? [] : [optionId]
      }

      // If any other option is selected, remove "None of the above"
      const newSelection = prev.filter((id) => id !== "q14-f")

      // Toggle the selected option
      if (prev.includes(optionId)) {
        return newSelection.filter((id) => id !== optionId)
      } else {
        return [...newSelection, optionId]
      }
    })
  }

  const handleSubmitAnswer = () => {
    let answer: Answer | null = null

    switch (currentQuestion.type) {
      case "text":
        if (currentQuestion.required && !inputValue.trim()) return
        answer = { questionId: currentQuestion.id, value: inputValue }
        setInputValue("")
        break
      case "number":
        const numValue = Number.parseInt(inputValue)
        if (currentQuestion.required && (!inputValue || isNaN(numValue))) return
        if (
          (currentQuestion.min !== undefined && numValue < currentQuestion.min) ||
          (currentQuestion.max !== undefined && numValue > currentQuestion.max)
        )
          return
        answer = { questionId: currentQuestion.id, value: numValue }
        setInputValue("")
        break
      case "select":
        if (!answers[currentQuestion.id]) return
        answer = answers[currentQuestion.id]
        break
      case "scale":
        answer = { questionId: currentQuestion.id, value: scaleValue[0] }
        setScaleValue([5])
        break
      case "multiselect":
        if (selectedOptions.length === 0 && currentQuestion.required) return
        answer = { questionId: currentQuestion.id, value: selectedOptions }
        setSelectedOptions([])
        break
    }

    if (answer) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer! }))

      // Simulate typing for the next question
      setIsTyping(true)
      setTimeout(() => {
        // Find next question based on conditional logic
        let nextQuestionIndex = currentQuestionIndex + 1

        if (currentQuestion.type === "select") {
          const selectedOption = currentQuestion.options?.find((opt) => opt.id === answer?.value)
          if (selectedOption?.nextQuestion) {
            const nextIndex = questions.findIndex((q) => q.id === selectedOption.nextQuestion)
            if (nextIndex !== -1) {
              nextQuestionIndex = nextIndex
            }
          }
        }

        // Check if we've reached the end of the questions
        if (nextQuestionIndex >= questions.length) {
          setIsSubmitting(true)
          setTimeout(() => {
            router.push("/assessment/report")
          }, 1500)
          return
        }

        setCurrentQuestionIndex(nextQuestionIndex)
        setVisibleQuestions((prev) => [...prev, nextQuestionIndex])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleOptionSelect = (questionId: string, optionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, value: optionId },
    }))
  }

  const getProgressPercentage = () => {
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
  }

  // Finish the assessment and redirect to results
  const finishAssessment = () => {
    setStatus('completed')
    
    // Here you would calculate a score based on the responses
    // and save the assessment results
    
    // Redirect to the assessment/report page
    router.push("/assessment/report")
  }

  // If not authenticated, show loading screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <div className="container max-w-4xl mx-auto flex-1 flex flex-col p-4">
          <div className="bg-card rounded-xl shadow-xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-semibold">MindWell Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">{getProgressPercentage()}% Complete</div>
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${getProgressPercentage()}%`, transition: "width 0.5s ease-in-out" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex flex-col">
                {visibleQuestions.map((index) => {
                  const question = questions[index]
                  return (
                    <div key={question.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="chat-bubble chat-bubble-bot"
                      >
                        <p>{question.text}</p>
                      </motion.div>

                      {question.type === "select" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                          {question.options?.map((option) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                answers[question.id]?.value === option.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => handleOptionSelect(question.id, option.id, option.value)}
                            >
                              {option.text}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {question.type === "scale" && index === currentQuestionIndex && (
                        <div className="mb-6 px-4">
                          <div className="mb-4">
                            <Slider
                              value={scaleValue}
                              min={1}
                              max={10}
                              step={1}
                              onValueChange={handleScaleChange}
                              className="my-6"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Low (1)</span>
                              <span className="font-medium text-foreground">Current: {scaleValue[0]}</span>
                              <span>High (10)</span>
                            </div>
                          </div>
                          <Button onClick={handleSubmitAnswer} className="ml-auto">
                            Submit
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {question.type === "multiselect" && index === currentQuestionIndex && (
                        <div className="mb-6 space-y-3">
                          {question.options?.map((option) => (
                            <div key={option.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={option.id}
                                checked={selectedOptions.includes(option.id)}
                                onCheckedChange={() => handleCheckboxChange(option.id)}
                              />
                              <label
                                htmlFor={option.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {option.text}
                              </label>
                            </div>
                          ))}
                          <Button onClick={handleSubmitAnswer} className="mt-4 ml-auto">
                            Submit
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {(question.type === "text" || question.type === "number") && index === currentQuestionIndex && (
                        <div className="flex gap-2 mb-6">
                          <Input
                            type={question.type === "number" ? "number" : "text"}
                            placeholder={question.placeholder || "Type your answer..."}
                            value={inputValue}
                            onChange={handleTextInput}
                            min={question.min}
                            max={question.max}
                            className="flex-1"
                          />
                          <Button onClick={handleSubmitAnswer} size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {answers[question.id] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="chat-bubble chat-bubble-user"
                        >
                          {question.type === "select" ? (
                            <p>{question.options?.find((opt) => opt.id === answers[question.id].value)?.text}</p>
                          ) : question.type === "scale" ? (
                            <p>{answers[question.id].value} out of 10</p>
                          ) : question.type === "multiselect" ? (
                            <div>
                              {answers[question.id].value.length === 0 ? (
                                <p>None selected</p>
                              ) : (
                                <ul className="list-disc pl-5">
                                  {answers[question.id].value.map((optionId: string) => (
                                    <li key={optionId}>{question.options?.find((opt) => opt.id === optionId)?.text}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <p>{answers[question.id].value}</p>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )
                })}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-bubble chat-bubble-bot">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                    </div>
                  </motion.div>
                )}

                {isSubmitting && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-bubble chat-bubble-bot">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Analyzing your responses and generating your report...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
