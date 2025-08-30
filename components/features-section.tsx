"use client"

import { motion } from "framer-motion"
import { Brain, ClipboardCheck, Heart, Shield, Users, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Scientific Assessment",
      description: "Our assessments are based on clinically validated psychological measures and standards."
    },
    {
      icon: Heart,
      title: "Personalized Insights",
      description: "Receive tailored feedback and recommendations based on your unique assessment results."
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      description: "Your data is encrypted and protected. We never share your information without consent."
    },
    {
      icon: ClipboardCheck,
      title: "Comprehensive Reports",
      description: "Get detailed reports that help you understand different aspects of your mental wellbeing."
    },
    {
      icon: Users,
      title: "Professional Support",
      description: "Connect with licensed therapists and counselors if your results indicate it would be beneficial."
    },
    {
      icon: Zap,
      title: "Quick & Easy",
      description: "Complete assessments in just 5-10 minutes and get immediate feedback on your results."
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MindWell?</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our platform combines clinical expertise with technology to provide you with the most effective mental health assessment tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
