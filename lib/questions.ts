export interface QuestionOption {
  id: string
  text: string
  value: number
}

export interface Question {
  id: string
  text: string
  category: "stress" | "anxiety" | "depression" | "general"
  options: QuestionOption[]
}

export const questions: Question[] = [
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
  },
  {
    id: "energy_1",
    text: "How would you describe your energy levels recently?",
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
    id: "appetite_1",
    text: "Have you noticed changes in your appetite recently?",
    category: "depression",
    options: [
      { id: "no_change", text: "No change", value: 0 },
      { id: "slight_increase", text: "Slight increase", value: 1 },
      { id: "slight_decrease", text: "Slight decrease", value: 1 },
      { id: "significant_increase", text: "Significant increase", value: 3 },
      { id: "significant_decrease", text: "Significant decrease", value: 3 },
    ],
  },
  {
    id: "motivation_1",
    text: "How motivated do you feel to engage in daily activities?",
    category: "depression",
    options: [
      { id: "very_motivated", text: "Very motivated", value: 0 },
      { id: "motivated", text: "Motivated", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "unmotivated", text: "Unmotivated", value: 3 },
      { id: "very_unmotivated", text: "Very unmotivated", value: 4 },
    ],
  },
  {
    id: "panic_1",
    text: "Do you experience sudden episodes of intense fear or panic?",
    category: "anxiety",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "frequently", text: "Frequently", value: 4 },
    ],
  },
  {
    id: "irritability_1",
    text: "How often do you feel irritable or easily annoyed?",
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
    id: "hopelessness_1",
    text: "Do you ever feel hopeless about the future?",
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
    id: "physical_symptoms_1",
    text: "Do you experience unexplained physical symptoms (headaches, muscle tension, etc.)?",
    category: "stress",
    options: [
      { id: "never", text: "Never", value: 0 },
      { id: "rarely", text: "Rarely", value: 1 },
      { id: "sometimes", text: "Sometimes", value: 2 },
      { id: "often", text: "Often", value: 3 },
      { id: "frequently", text: "Frequently", value: 4 },
    ],
  },
  {
    id: "avoidance_1",
    text: "Do you avoid certain situations because they make you anxious?",
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
    id: "self_worth_1",
    text: "How do you feel about your self-worth and value as a person?",
    category: "depression",
    options: [
      { id: "very_positive", text: "Very positive", value: 0 },
      { id: "positive", text: "Positive", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "negative", text: "Negative", value: 3 },
      { id: "very_negative", text: "Very negative", value: 4 },
    ],
  },
  {
    id: "overwhelm_1",
    text: "How often do you feel overwhelmed by daily responsibilities?",
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
    id: "enjoyment_1",
    text: "Do you still enjoy activities that you used to find pleasurable?",
    category: "depression",
    options: [
      { id: "yes_completely", text: "Yes, completely", value: 0 },
      { id: "yes_mostly", text: "Yes, mostly", value: 1 },
      { id: "somewhat", text: "Somewhat", value: 2 },
      { id: "not_much", text: "Not much", value: 3 },
      { id: "not_at_all", text: "Not at all", value: 4 },
    ],
  },
  {
    id: "support_1",
    text: "How supported do you feel by friends and family?",
    category: "general",
    options: [
      { id: "very_supported", text: "Very supported", value: 0 },
      { id: "supported", text: "Supported", value: 1 },
      { id: "neutral", text: "Neutral", value: 2 },
      { id: "unsupported", text: "Unsupported", value: 3 },
      { id: "very_unsupported", text: "Very unsupported", value: 4 },
    ],
  },
]
