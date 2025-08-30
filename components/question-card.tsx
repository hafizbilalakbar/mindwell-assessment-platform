"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import type { Question } from "@/lib/questions"

interface QuestionCardProps {
  question: Question
  onAnswer: (question: Question, optionId: string, value: number) => void
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionSelect = (optionId: string, value: number) => {
    setSelectedOption(optionId)
    setTimeout(() => {
      onAnswer(question, optionId, value)
    }, 500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{question.text}</CardTitle>
          <CardDescription>Please select the option that best describes your experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.value)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  {selectedOption === option.id && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
