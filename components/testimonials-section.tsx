"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Professional",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "MindWell helped me understand my anxiety patterns and provided practical tools to manage stress. The assessment was thorough and the recommendations were spot-on.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Clinical Psychologist",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "As a mental health professional, I'm impressed by the scientific rigor and user-friendly design of MindWell. It's a valuable tool for both patients and practitioners.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "College Student",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "The platform made it easy to track my mental health journey. The relaxation games were surprisingly effective during stressful exam periods.",
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-responsive-lg font-bold mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from people who transformed their mental wellbeing with MindWell.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-modern hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-purple-200 dark:text-purple-800" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
