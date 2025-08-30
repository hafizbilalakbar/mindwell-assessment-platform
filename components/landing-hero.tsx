"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ArrowUpRight } from "lucide-react"

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="flex-1 flex items-center py-16 md:py-24">
      <div className="container grid lg:grid-cols-2 gap-12 md:gap-16">
        <motion.div
          className="flex flex-col justify-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>Professional Assessment</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            variants={itemVariants}
          >
            Understand Your <span className="text-primary">Mental Wellbeing</span> Better
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-muted-foreground max-w-xl" variants={itemVariants}>
            Take our professional assessment to gain insights into your mental health and receive personalized
            recommendations for improvement.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
            <Link href="/assessment/welcome">
              <Button size="lg" className="hero-btn-primary rounded-full px-8">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" className="hero-btn-secondary rounded-full px-8">
                Learn More
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">JD</div>
              <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white">KL</div>
              <div className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center text-white">MN</div>
            </div>
            <p>
              Trusted by <span className="font-semibold">10,000+</span> people worldwide
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-3xl clip-hexagon shadow-2xl shadow-primary/20">
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="MindWell Hero"
              width={500}
              height={500}
              className="object-cover w-full h-full"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
