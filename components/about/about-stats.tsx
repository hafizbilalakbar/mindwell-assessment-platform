"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Globe, Clock } from "lucide-react"

export function AboutStats() {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Users Served",
      description: "Individuals who have completed our assessment",
    },
    {
      icon: Globe,
      value: "25+",
      label: "Countries",
      description: "Global reach across multiple continents",
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Satisfaction Rate",
      description: "Users who found our platform helpful",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Availability",
      description: "Round-the-clock access to our platform",
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
            Our Impact
            <span className="block text-gradient">By the Numbers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These numbers represent real people whose lives we've touched through our platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
