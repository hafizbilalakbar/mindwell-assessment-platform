"use client"

import { motion } from "framer-motion"
import { Shield, Heart, Brain, Users, Zap, Award } from "lucide-react"

export function AboutValues() {
  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your mental health data is sacred. We use enterprise-grade encryption and never share your personal information.",
    },
    {
      icon: Brain,
      title: "Evidence-Based",
      description:
        "All our assessments are grounded in peer-reviewed research and validated by mental health professionals.",
    },
    {
      icon: Heart,
      title: "Empathy-Driven",
      description: "We approach mental health with compassion, understanding, and without judgment.",
    },
    {
      icon: Users,
      title: "Inclusive Design",
      description: "Our platform is designed to be accessible to people of all backgrounds, cultures, and abilities.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously improve our platform using the latest technology and user feedback.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from assessment quality to user experience.",
    },
  ]

  return (
    <section className="py-24 gradient-secondary">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-secondary text-white mb-4">
            Our Core
            <span className="block text-gradient">Values</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            These principles guide every decision we make and every feature we build.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <value.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
