"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, CheckCircle, Menu, X, Loader2, AlertCircle, Star } from "lucide-react"
import { AssessmentFooter } from "@/components/assessment-footer"
import { useAuth } from "@/components/auth-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { CosmicBackground } from "@/components/cosmic-background"
import { ModeToggle } from "@/components/mode-toggle"
import { GoogleTranslateSelector } from "@/components/google-translate-selector"
import gsap from "gsap"

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
  // Stress Questions
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
    id: "stress_3",
    text: "How often do you feel overwhelmed by your responsibilities?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Very often", value: 4 },
    ],
  },
  {
    id: "stress_4",
    text: "Do you find yourself becoming easily agitated or irritable?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Very often", value: 4 },
    ],
  },
  {
    id: "stress_5",
    text: "Do you experience tension headaches or muscle pain due to stress?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Very often", value: 4 },
    ],
  },
  {
    id: "stress_6",
    text: "How well do you feel you manage your stress levels?",
    category: "stress",
    options: [
      { id: "very_well", text: "Very well", value: 0 },
      { id: "well", text: "Well", value: 1 },
      { id: "moderate", text: "Moderately", value: 2 },
      { id: "not_well", text: "Not well", value: 3 },
      { id: "poorly", text: "Poorly", value: 4 },
    ],
  },
  {
    id: "stress_7",
    text: "How often do you feel rushed or short on time?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "stress_8",
    text: "Do you have difficulty falling asleep due to racing thoughts or worries?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  
  // Anxiety Questions
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
    id: "anxiety_3",
    text: "How often do you find it difficult to control your worrying?",
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
    id: "anxiety_4",
    text: "Do you avoid certain situations due to anxiety or fear?",
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
    id: "anxiety_5",
    text: "How often do you feel restless or on edge?",
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
    id: "anxiety_6",
    text: "Do you find yourself anticipating the worst outcome in situations?",
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
    id: "anxiety_7",
    text: "How comfortable do you feel in social situations?",
    category: "anxiety",
    options: [
      { id: "very_comfortable", text: "Very comfortable", value: 0 },
      { id: "comfortable", text: "Comfortable", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "uncomfortable", text: "Uncomfortable", value: 3 },
      { id: "very_uncomfortable", text: "Very uncomfortable", value: 4 },
    ],
  },
  {
    id: "anxiety_8",
    text: "Do you experience sudden feelings of intense fear or panic?",
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
    id: "anxiety_9",
    text: "How often do you feel afraid as if something awful might happen?",
    category: "anxiety",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  
  // Depression Questions
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
    id: "depression_2",
    text: "Have you lost interest or pleasure in activities you previously enjoyed?",
    category: "depression",
    options: [
      { id: "not_at_all", text: "Not at all", value: 0 },
      { id: "slightly", text: "Slightly", value: 1 },
      { id: "moderately", text: "Moderately", value: 2 },
      { id: "considerably", text: "Considerably", value: 3 },
      { id: "significantly", text: "Significantly", value: 4 },
    ],
  },
  {
    id: "depression_3",
    text: "How is your energy level throughout the day?",
    category: "depression",
    options: [
      { id: "very_high", text: "Very high", value: 0 },
      { id: "high", text: "High", value: 1 },
      { id: "moderate", text: "Moderate", value: 2 },
      { id: "low", text: "Low", value: 3 },
      { id: "very_low", text: "Very low", value: 4 },
    ],
  },
  {
    id: "depression_4",
    text: "Do you feel worthless or excessively guilty?",
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
    id: "depression_5",
    text: "How is your ability to concentrate or make decisions?",
    category: "depression",
    options: [
      { id: "excellent", text: "Excellent", value: 0 },
      { id: "good", text: "Good", value: 1 },
      { id: "fair", text: "Fair", value: 2 },
      { id: "poor", text: "Poor", value: 3 },
      { id: "very_poor", text: "Very poor", value: 4 },
    ],
  },
  {
    id: "depression_6",
    text: "Have you had thoughts of harming yourself or that life is not worth living?",
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
    id: "depression_7",
    text: "How often do you feel hopeless about the future?",
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
    id: "depression_8",
    text: "Have you experienced changes in your appetite (increased or decreased)?",
    category: "depression",
    options: [
      { id: "no_change", text: "No change", value: 0 },
      { id: "slight_change", text: "Slight change", value: 1 },
      { id: "moderate_change", text: "Moderate change", value: 2 },
      { id: "significant_change", text: "Significant change", value: 3 },
      { id: "extreme_change", text: "Extreme change", value: 4 },
    ],
  },
  
  // Sleep Questions
  {
    id: "sleep_1",
    text: "How would you rate your sleep quality over the past month?",
    category: "sleep",
    options: [
      { id: "excellent", text: "Excellent", value: 0 },
      { id: "good", text: "Good", value: 1 },
      { id: "fair", text: "Fair", value: 2 },
      { id: "poor", text: "Poor", value: 3 },
      { id: "very_poor", text: "Very poor", value: 4 },
    ],
  },
  {
    id: "sleep_2",
    text: "How often do you have trouble falling asleep?",
    category: "sleep",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "sleep_3",
    text: "How often do you wake up during the night?",
    category: "sleep",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "sleep_4",
    text: "How refreshed do you feel when you wake up in the morning?",
    category: "sleep",
    options: [
      { id: "very_refreshed", text: "Very refreshed", value: 0 },
      { id: "refreshed", text: "Refreshed", value: 1 },
      { id: "somewhat_refreshed", text: "Somewhat refreshed", value: 2 },
      { id: "not_refreshed", text: "Not refreshed", value: 3 },
      { id: "exhausted", text: "Exhausted", value: 4 },
    ],
  },
  
  // General Mental Health Questions
  {
    id: "general_1",
    text: "How would you rate your overall mental health currently?",
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
    id: "general_2",
    text: "How often do you engage in activities that promote your mental wellbeing?",
    category: "general",
    options: [
      { id: "daily", text: "Daily", value: 0 },
      { id: "several_times_weekly", text: "Several times weekly", value: 1 },
      { id: "weekly", text: "Weekly", value: 2 },
      { id: "rarely", text: "Rarely", value: 3 },
      { id: "never", text: "Never", value: 4 },
    ],
  },
  {
    id: "general_3",
    text: "How much does your mental health affect your daily functioning?",
    category: "general",
    options: [
      { id: "not_at_all", text: "Not at all", value: 0 },
      { id: "slightly", text: "Slightly", value: 1 },
      { id: "moderately", text: "Moderately", value: 2 },
      { id: "considerably", text: "Considerably", value: 3 },
      { id: "significantly", text: "Significantly", value: 4 },
    ],
  },
  {
    id: "general_4",
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
    id: "general_5",
    text: "How do you feel about your ability to handle unexpected problems?",
    category: "general",
    options: [
      { id: "very_confident", text: "Very confident", value: 0 },
      { id: "confident", text: "Confident", value: 1 },
      { id: "somewhat_confident", text: "Somewhat confident", value: 2 },
      { id: "not_confident", text: "Not confident", value: 3 },
      { id: "very_unconfident", text: "Very unconfident", value: 4 },
    ],
  },
  {
    id: "general_6",
    text: "How satisfied are you with your relationships with friends and family?",
    category: "general",
    options: [
      { id: "very_satisfied", text: "Very satisfied", value: 0 },
      { id: "satisfied", text: "Satisfied", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "dissatisfied", text: "Dissatisfied", value: 3 },
      { id: "very_dissatisfied", text: "Very dissatisfied", value: 4 },
    ],
  },
  {
    id: "general_7",
    text: "How well do you manage stress in your life?",
    category: "general",
    options: [
      { id: "very_well", text: "Very well", value: 0 },
      { id: "well", text: "Well", value: 1 },
      { id: "moderately", text: "Moderately", value: 2 },
      { id: "poorly", text: "Poorly", value: 3 },
      { id: "very_poorly", text: "Very poorly", value: 4 },
    ],
  },
  
  // Work/Life Balance Questions
  {
    id: "work_life_1",
    text: "How satisfied are you with your work-life balance?",
    category: "general",
    options: [
      { id: "very_satisfied", text: "Very satisfied", value: 0 },
      { id: "satisfied", text: "Satisfied", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "dissatisfied", text: "Dissatisfied", value: 3 },
      { id: "very_dissatisfied", text: "Very dissatisfied", value: 4 },
    ],
  },
  {
    id: "work_life_2",
    text: "How often do you feel overwhelmed by work or study responsibilities?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "work_life_3",
    text: "How often do you take time for yourself to relax or pursue hobbies?",
    category: "general",
    options: [
      { id: "daily", text: "Daily", value: 0 },
      { id: "several_times_weekly", text: "Several times weekly", value: 1 },
      { id: "weekly", text: "Weekly", value: 2 },
      { id: "rarely", text: "Rarely", value: 3 },
      { id: "never", text: "Never", value: 4 },
    ],
  },
  
  // Coping Mechanisms Questions
  {
    id: "coping_1",
    text: "How often do you use healthy coping strategies when feeling stressed or down?",
    category: "general",
    options: [
      { id: "always", text: "Always", value: 0 },
      { id: "often", text: "Often", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "rarely", text: "Rarely", value: 3 },
      { id: "never", text: "Never", value: 4 },
    ],
  },
  {
    id: "coping_2",
    text: "How often do you turn to substances (alcohol, drugs) to cope with stress or emotions?",
    category: "general",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Always", value: 4 },
    ],
  },
  {
    id: "coping_3",
    text: "How comfortable are you seeking help when you're struggling emotionally?",
    category: "general",
    options: [
      { id: "very_comfortable", text: "Very comfortable", value: 0 },
      { id: "comfortable", text: "Comfortable", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "uncomfortable", text: "Uncomfortable", value: 3 },
      { id: "very_uncomfortable", text: "Very uncomfortable", value: 4 },
    ],
  },
  
  // Physical Health Impact Questions
  {
    id: "physical_1",
    text: "How often do you experience physical symptoms (headaches, digestive issues) related to your mental state?",
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
    id: "physical_2",
    text: "How often do you engage in physical exercise?",
    category: "general",
    options: [
      { id: "daily", text: "Daily", value: 0 },
      { id: "several_times_weekly", text: "Several times weekly", value: 1 },
      { id: "weekly", text: "Weekly", value: 2 },
      { id: "rarely", text: "Rarely", value: 3 },
      { id: "never", text: "Never", value: 4 },
    ],
  },
  
  // Technology and Mental Health
  {
    id: "tech_1",
    text: "How often do you feel anxious when separated from your phone or digital devices?",
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
    id: "tech_2",
    text: "How much does social media affect your mood or self-esteem?",
    category: "general",
    options: [
      { id: "not_at_all", text: "Not at all", value: 0 },
      { id: "slightly", text: "Slightly", value: 1 },
      { id: "moderately", text: "Moderately", value: 2 },
      { id: "considerably", text: "Considerably", value: 3 },
      { id: "significantly", text: "Significantly", value: 4 },
    ],
  },
  
  // More specific anxiety questions
  {
    id: "anxiety_10",
    text: "How often do you feel that you might lose control or 'go crazy'?",
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
    id: "anxiety_11",
    text: "Do you experience intrusive or unwanted thoughts that cause anxiety?",
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
    id: "anxiety_12",
    text: "How often do you feel a sense of dread or foreboding?",
    category: "anxiety",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  
  // Additional depression questions
  {
    id: "depression_9",
    text: "How often do you feel that life is meaningless?",
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
    id: "depression_10",
    text: "Do you feel like you are a burden to others?",
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
    id: "depression_11",
    text: "How often do you experience feelings of emptiness?",
    category: "depression",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  
  // Additional sleep questions
  {
    id: "sleep_5",
    text: "How often do you use sleep medications or aids?",
    category: "sleep",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  },
  {
    id: "sleep_6",
    text: "How often do you have nightmares or disturbing dreams?",
    category: "sleep",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "always", text: "Almost always", value: 4 },
    ],
  }
];

// Enhanced progress bar component
function EnhancedProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full bg-gray-100/50 dark:bg-gray-800/70 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
      <div 
        className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// Indicator dots component
function ProgressIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex justify-center items-center space-x-1.5 py-2 overflow-x-auto max-w-full">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            index === current 
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/20" 
              : index < current 
                ? "bg-indigo-400/80 shadow-sm" 
                : "bg-gray-300 dark:bg-gray-600/50"
          }`}
          style={{
            transform: index === current ? 'scale(1.4)' : 'scale(1)',
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }}
        />
      ))}
    </div>
  );
}

export default function AssessmentPage() {
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
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  // Card ref for animations
  const cardRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
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
    setWarningShakeEffect(false);
    
    // Check if we already have an answer for this question
    const existingAnswer = answers.find((answer) => answer.questionId === currentQuestion.id);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.optionId);
    }
  }, [currentQuestionIndex, answers, currentQuestion]);

  // Animation effects
  useEffect(() => {
    if (!cardRef.current || !optionsRef.current) return;
    
    // Simpler fade in animation for the card without movement
    gsap.fromTo(
      cardRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4, ease: "power1.out" }
    );
    
    // Simpler fade in for options without movement
    const options = optionsRef.current.querySelectorAll('.option-item');
    gsap.fromTo(
      options,
      { opacity: 0 },
      { 
        opacity: 1, 
        stagger: 0.05, 
        duration: 0.3, 
        ease: "power1.out",
        delay: 0.1
      }
    );
    
    // Remove all hover animations to prevent jumpiness
    // Let CSS handle the hover effects
    
  }, [currentQuestionIndex]);
  
  // Remove event listeners on unmount
  useEffect(() => {
    return () => {
      if (cardRef.current) {
        // Reset any animations on cleanup to prevent flickering
        gsap.set(cardRef.current, { clearProps: "all" });
      }
    };
  }, []);

  const handleOptionSelect = (option: QuestionOption) => {
    if (!currentQuestion) return;
    
    setSelectedOption(option.id);
    setShowSelectionWarning(false);
    setWarningShakeEffect(false);

    // No animations on selection to prevent jumpiness

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
    
    // Apply GSAP shake animation to card - gentle shake to avoid disrupting the experience
    if (cardRef.current) {
      const shakeTl = gsap.timeline();
      shakeTl.to(cardRef.current, { x: -3, duration: 0.08 })
        .to(cardRef.current, { x: 3, duration: 0.08 })
        .to(cardRef.current, { x: -3, duration: 0.08 })
        .to(cardRef.current, { x: 3, duration: 0.08 })
        .to(cardRef.current, { x: -2, duration: 0.05 })
        .to(cardRef.current, { x: 2, duration: 0.05 })
        .to(cardRef.current, { x: 0, duration: 0.05 });
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

    // Simpler fade transition to avoid shifting
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => {
          // Move to next question or complete assessment
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            // Immediate state update
            setTimeout(() => {
              setIsLoading(false);
            }, 10);
          } else {
            // Assessment complete - calculate results and redirect
            calculateAndRedirect();
          }
        }
      });
    } else {
      // Fallback if ref not available
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setIsLoading(false);
        }, 300);
      } else {
        calculateAndRedirect();
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isLoading) {
      setIsLoading(true);
      
      // Simpler fade transition to avoid shifting
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power1.in",
          onComplete: () => {
            setCurrentQuestionIndex((prev) => prev - 1);
            // Immediate state update
            setTimeout(() => {
              setIsLoading(false);
            }, 10);
          }
        });
      } else {
        // Fallback if ref not available
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev - 1);
          setIsLoading(false);
        }, 300);
      }
    }
  }

  const calculateAndRedirect = () => {
    // Make sure all questions have been answered
    if (answers.length < questions.length) {
      triggerWarningAnimation();
      setIsLoading(false);
      return;
    }

    // Show redirecting state
    setIsRedirecting(true);

    // Calculate scores by category
    const categoryScores: Record<string, { score: number; count: number }> = {};
    
    answers.forEach((answer) => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = { score: 0, count: 0 };
        }
        categoryScores[question.category].score += answer.value;
        categoryScores[question.category].count += 1;
      }
    });
    
    // Calculate total and percentage
    const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
    const maxPossibleScore = questions.length * 4;
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    // Create the results object
    const resultsObject = {
      totalScore,
      percentage,
      timestamp: new Date().toISOString(),
      // Calculate individual category percentages
      stress: categoryScores.stress ? Math.round((categoryScores.stress.score / (categoryScores.stress.count * 4)) * 100) : 50,
      anxiety: categoryScores.anxiety ? Math.round((categoryScores.anxiety.score / (categoryScores.anxiety.count * 4)) * 100) : 50,
      depression: categoryScores.depression ? Math.round((categoryScores.depression.score / (categoryScores.depression.count * 4)) * 100) : 50,
      // Store all category scores for completeness
      ...Object.fromEntries(
        Object.entries(categoryScores).map(([category, data]) => {
          const categoryPercentage = Math.round((data.score / (data.count * 4)) * 100);
          return [`${category}_percentage`, categoryPercentage];
        })
      )
    };
    
    // Clear any existing storage to avoid using old data
    localStorage.removeItem("mindwell_assessment_results");
    sessionStorage.removeItem("mindwell_assessment_results");
    
    // Store the new assessment results
    try {
      // Store in localStorage
      localStorage.setItem("mindwell_assessment_results", JSON.stringify(resultsObject));
      
      // Also store in sessionStorage as a backup
      sessionStorage.setItem("mindwell_assessment_results", JSON.stringify(resultsObject));
      
      console.log("Assessment results stored successfully:", resultsObject);
      
      // Also store user data for reports
      if (user) {
        const userData = {
          name: user.name || "",
          age: user.age ? String(user.age) : "",
          gender: user.gender || "",
          email: user.email || "",
          occupation: user.occupation || "",
          location: user.location || "",
          assessment: {
            date: new Date().toISOString(),
            stress: resultsObject.stress,
            anxiety: resultsObject.anxiety,
            depression: resultsObject.depression,
            overall: resultsObject.percentage
          }
        };
        
        // Store user data for reports
        localStorage.setItem("mindwell_user_data", JSON.stringify(userData));
        console.log("User data stored for reports:", userData);
      }
      
      // Create query params for URL
      const queryParams = new URLSearchParams();
      queryParams.set("score", totalScore.toString());
      queryParams.set("percentage", percentage.toString());
      
      // Add category scores to query params
      Object.entries(categoryScores).forEach(([category, data]) => {
        const categoryPercentage = Math.round((data.score / (data.count * 4)) * 100);
        queryParams.set(`${category}_percentage`, categoryPercentage.toString());
      });
      
      // Force a small delay to ensure storage is complete
      setTimeout(() => {
        // Redirect to report page
        console.log("Redirecting to:", `/report?${queryParams.toString()}`);
        router.push(`/report?${queryParams.toString()}`);
      }, 500);
    } catch (error) {
      console.error("Error storing assessment results:", error);
      setIsRedirecting(false);
      setIsLoading(false);
      
      // Still try to redirect even if storage fails
      setTimeout(() => {
        try {
          const queryParams = new URLSearchParams();
          queryParams.set("score", totalScore.toString());
          queryParams.set("percentage", percentage.toString());
          
          Object.entries(categoryScores).forEach(([category, data]) => {
            const categoryPercentage = Math.round((data.score / (data.count * 4)) * 100);
            queryParams.set(`${category}_percentage`, categoryPercentage.toString());
          });
          
          router.push(`/report?${queryParams.toString()}`);
        } catch (redirectError) {
          console.error("Redirection error:", redirectError);
          alert("There was an issue redirecting to your report. Please try again.");
        }
      }, 500);
    }
  }

  // Render redirecting state
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 dark:from-gray-950 dark:to-indigo-950/30">
        <div className="w-full max-w-md px-6 py-10 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border border-pink-100/50 dark:border-purple-900/30 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-pink-500 dark:text-pink-400" />
              <div className="absolute inset-0 rounded-full border-2 border-pink-200 dark:border-pink-700 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Generating Your Report
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we process your assessment results...
            </p>
          </div>
        </div>
      </div>
    );
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
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Enhanced modern background for both light and dark modes */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Light mode: Subtle modern pattern background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-indigo-50 dark:opacity-0 opacity-100">
            {/* Abstract shapes for light mode */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-bl-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-tr-full blur-3xl"></div>
            <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
            
            {/* Subtle dot pattern overlay for texture */}
            <div className="absolute inset-0 opacity-5" 
                 style={{backgroundImage: 'radial-gradient(#6366F1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          </div>
          
          {/* Dark mode background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-indigo-950/30 opacity-0 dark:opacity-100">
            {/* Keep existing dark background */}
          </div>
        </div>
        
        {/* Header - static, no animations */}
        <header className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg sticky top-0 z-50 shadow-md border-b border-pink-100 dark:border-purple-900/50 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center group">
                <div className="relative w-[140px] h-12">
                  <Image 
                    src="/mindwell-logo.png" 
                    alt="MindWell Logo" 
                    width={140}
                    height={48}
                    className="object-contain transition-all duration-300 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/0 via-indigo-600/10 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:block">
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group">
                      Home
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group">
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group">
                      Contact
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Theme and Mobile Actions */}
              <div className="flex items-center space-x-3">
                <ErrorBoundary>
                  <GoogleTranslateSelector />
                </ErrorBoundary>
                <ModeToggle />
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <nav className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          )}
        </header>

        <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10">
          {/* Title with enhanced styling */}
          <div className="text-center mb-10">
            <h1 className="relative mb-6">
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 inline-block text-transparent bg-clip-text">Mind</span>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-300 dark:to-blue-400 inline-block text-transparent bg-clip-text">Well</span>
              </span>
              <span className="block text-2xl md:text-3xl mt-2 font-medium text-gray-700 dark:text-gray-300">Assessment</span>
              {/* Modern line design */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-full">
                <div className="h-0.5 w-12 bg-gradient-to-r from-pink-500 to-transparent rounded-full"></div>
                <div className="mx-2 h-2 w-2 rounded-full bg-pink-500"></div>
                <div className="h-0.5 w-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
                <div className="mx-2 h-2 w-2 rounded-full bg-purple-600"></div>
                <div className="h-0.5 w-12 bg-gradient-to-l from-purple-600 to-transparent rounded-full"></div>
              </div>
            </h1>

            {/* Progress Bar with enhanced styling */}
            <div className="max-w-md mx-auto mb-4 mt-10">
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-pink-500 rounded-full"></span>
                  Progress: {Math.round(progress)}%
                </span>
                <span className="flex items-center gap-1.5">
                  Question {currentQuestionIndex + 1} of {questions.length}
                  <Star className="h-3.5 w-3.5 text-pink-400 dark:text-pink-300" />
                </span>
              </div>
              <EnhancedProgressBar value={progress} />
            </div>
            
            <p className="text-sm md:text-base text-gray-600 dark:text-white/80 max-w-2xl mx-auto mt-3 px-2">
              Choose the option that best describes how you've been feeling recently.
            </p>
          </div>

          {/* Question Card - with enhanced styling for light mode */}
          <div className={`max-w-3xl mx-auto relative ${warningShakeEffect ? 'animate-shake' : ''}`}>
            {/* Enhanced card effect for light mode */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-pink-200/40 to-indigo-200/40 dark:bg-purple-900/30 rounded-2xl opacity-70 dark:opacity-60 blur-md ${showSelectionWarning ? 'bg-red-100 dark:bg-red-900/30' : ''}`}></div>
            
            <div ref={cardRef} className="relative">
              <Card className={`shadow-xl border border-pink-100/70 dark:border-purple-900/30 bg-white/90 dark:bg-gray-800/95 backdrop-blur-lg overflow-hidden rounded-2xl ${showSelectionWarning ? 'ring-2 ring-red-500/70' : ''}`}>
                {/* Enhanced category indicator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700"></div>
                
                <CardHeader className="pb-4 pt-8">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white font-semibold leading-tight">
                    {currentQuestion.text}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 options-container px-4 sm:px-6 pb-8" ref={optionsRef}>
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option.id}
                      data-option-id={option.id}
                      onClick={() => handleOptionSelect(option)}
                      className={`option-item w-full text-left flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl 
                        ${selectedOption === option.id
                          ? "bg-purple-100 dark:bg-purple-900/50 shadow-md border border-purple-200 dark:border-purple-700/50"
                          : "bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center
                          ${selectedOption === option.id
                            ? "bg-purple-600 dark:bg-purple-500"
                            : "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                          }`}
                      >
                        {selectedOption === option.id && (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        )}
                      </div>
                      <span className={`font-medium text-sm sm:text-base ${selectedOption === option.id ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-white/90"}`}>
                        {option.text}
                      </span>
                    </button>
                  ))}
                  
                  {/* Selection warning message - simplified */}
                  {showSelectionWarning && (
                    <div className="text-center p-3 sm:p-4 text-red-600 dark:text-red-300 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30 shadow-md">
                      <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                      <span>Please select an option before proceeding</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Controls - updated with pink gradients */}
          <div className="flex justify-between items-center mt-8 sm:mt-10 max-w-3xl mx-auto px-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isLoading}
              className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4
                ${currentQuestionIndex === 0 
                  ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed" 
                  : "bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 hover:border-pink-300 dark:hover:border-pink-700 text-gray-700 dark:text-white shadow-sm"
                }`}
              size="default"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 dark:text-pink-400" />
              <span className="text-gray-700 dark:text-white">Previous</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4
                ${selectedOption 
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700 hover:from-pink-400 hover:to-purple-500 dark:hover:from-pink-500 dark:hover:to-purple-600 text-white shadow-sm border-0" 
                  : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                }`}
              size="default"
            >
              {isLoading ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span>Processing</span>
                </div>
              ) : currentQuestionIndex === questions.length - 1 ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span>Complete</span>
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:h-4" />
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span>Next</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              )}
            </Button>
          </div>
        </main>
        
        <AssessmentFooter />
      </div>
    </ErrorBoundary>
  );
}
