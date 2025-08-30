"use client"

import { motion } from "framer-motion"
import { Target, Eye, Compass } from "lucide-react"

export function AboutMission() {
  const missions = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To democratize access to professional mental health assessment tools and provide personalized insights that empower individuals to take control of their mental wellbeing journey.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "A world where mental health support is accessible to everyone, stigma-free, and backed by scientific evidence. We envision a future where seeking mental health support is as normal as visiting a doctor for physical health.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Compass,
      title: "Our Values",
      description:
        "We are guided by principles of privacy, scientific rigor, empathy, and accessibility. Every feature we build and every assessment we create is designed with these core values at the forefront.",
      color: "from-blue-500 to-cyan-500",
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-secondary mb-4">
            Our Purpose &<span className="block text-gradient">Commitment</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make mental health care more accessible, understandable, and actionable for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              className="card-hover bg-card rounded-2xl p-8 border border-border text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${mission.color} mb-6`}
              >
                <mission.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{mission.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
