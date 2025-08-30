"use client"

import { motion } from "framer-motion"
import { Brain, BarChart3, Shield, Clock, Heart, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Professional Assessment",
      description: "Scientifically validated questions to assess your mental wellbeing accurately",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Detailed Reports",
      description: "Get comprehensive insights with visual charts and personalized recommendations",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Private & Secure",
      description: "Your data is encrypted and never shared with third parties",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Quick & Easy",
      description: "Complete the assessment in just 5-10 minutes at your own pace",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Relaxation Tools",
      description: "Access calming activities and exercises to reduce stress and anxiety",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Regular Check-ins",
      description: "Track your progress over time with scheduled reassessments",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MindWell Pro</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers a comprehensive approach to mental health assessment with professional tools and
            resources.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 shadow-lg border border-border"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
