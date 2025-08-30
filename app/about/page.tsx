"use client"

import React from 'react'
import { useState, useEffect, useRef, Suspense } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Brain, Heart, Shield, Users, Star, Award, Lightbulb, Sparkles } from "lucide-react"
import { ClientOnly } from "@/components/client-only"
import { AboutHero } from "@/components/about/about-hero"
import { AboutTeam } from "@/components/about/about-team"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import "@/styles/about.css"

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryWrapper extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error in About page:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading about page...</p>
      </div>
    </div>
  );
}

// Main component
function AboutPageContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const missionRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Use a timeout to ensure the page has time to load properly
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsMounted(true)
    }, 500);
    
    return () => clearTimeout(timer);
  }, [])

  // Scroll to mission section when Learn More button is clicked
  const scrollToMission = () => {
    if (missionRef.current) {
      missionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  // Handle Get Started button click for assessment
  const handleGetStarted = () => {
    if (user) {
      if (user.age && user.gender && user.occupation && user.location) {
        router.push("/assessment")
      } else {
        router.push("/assessment/info")
      }
    } else {
      router.push("/auth/login")
    }
  }

  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description:
        "We approach mental health with empathy, understanding, and genuine care for every individual's journey.",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your mental health data is sacred. We maintain the highest standards of privacy and security.",
    },
    {
      icon: Lightbulb,
      title: "Evidence-Based",
      description: "All our tools and recommendations are grounded in scientific research and clinical best practices.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Mental health support should be available to everyone, regardless of location or circumstances.",
    },
  ]

  const stats = [
    { number: "50K+", label: "Users Helped", icon: Users },
    { number: "100K+", label: "Assessments Completed", icon: Brain },
    { number: "95%", label: "User Satisfaction", icon: Star },
    { number: "24/7", label: "Support Available", icon: Heart },
  ]

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <AboutHero onScrollToMission={scrollToMission} />

        {/* Mission Section */}
        <section id="mission-section" ref={missionRef} className="py-16 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ClientOnly
                  fallback={<h2 className="text-3xl font-bold gradient-text-purple mb-6">Our Mission</h2>}
                >
                  <motion.h2 
                    className="text-3xl font-bold gradient-text-purple mb-6 text-3d"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Our Mission
                  </motion.h2>
                </ClientOnly>
                
                <ClientOnly
                  fallback={
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Mental health challenges affect millions of people worldwide, yet access to professional assessment and
                      support remains limited. We believe everyone deserves to understand their mental wellbeing and have
                      access to tools that can help them thrive.
                    </p>
                  }
                >
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Mental health challenges affect millions of people worldwide, yet access to professional assessment and
                    support remains limited. We believe everyone deserves to understand their mental wellbeing and have
                    access to tools that can help them thrive.
                  </motion.p>
                </ClientOnly>
                
                <ClientOnly
                  fallback={
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                      Through our platform, we combine clinical expertise with innovative technology to provide personalized
                      mental health assessments, resources, and support that are accessible anytime, anywhere.
                    </p>
                  }
                >
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Through our platform, we combine clinical expertise with innovative technology to provide personalized
                    mental health assessments, resources, and support that are accessible anytime, anywhere.
                  </motion.p>
                </ClientOnly>
              </div>
              
              <div className="relative flex justify-center">
                <ClientOnly
                  fallback={
                    <div className="relative h-[400px] w-full max-w-[500px] rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src="/images/about-images/about-our-mission-img.png"
                        alt="Our mission"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                    </div>
                  }
                >
                  <motion.div 
                    className="main-image-container relative h-[400px] w-full max-w-[500px] rounded-2xl overflow-hidden shadow-modern dark:shadow-modern-dark modern-lighting-border"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div 
                      className="img-container w-full h-full"
                      data-float="true"
                      style={{
                        "--float-animation-ease": "ease",
                        "--float-animate-from": "0%",
                        "--float-animate-to": "3%",
                        "--float-delay": "0s"
                      } as React.CSSProperties}
                    >
                      <Image
                        src="/images/about-images/about-our-mission-img.png"
                        alt="Our mission"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 p-6 z-30">
                      <motion.div 
                        className="mission-stats-badge px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Our Impact</p>
                        <p className="text-2xl font-bold gradient-text-purple">50,000+ Lives Improved</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </ClientOnly>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} className="py-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ClientOnly
              fallback={<h2 className="text-3xl font-bold text-center gradient-text-purple mb-12">Our Core Values</h2>}
            >
              <motion.h2 
                className="text-3xl font-bold text-center gradient-text-purple mb-12 text-3d"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Our Core Values
              </motion.h2>
            </ClientOnly>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <ClientOnly
                  key={index}
                  fallback={
                    <Card className="value-card h-full">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="value-icon-container w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                          <value.icon className="h-7 w-7 text-purple-600 dark:text-purple-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{value.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                      </div>
                    </Card>
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="value-card h-full tilt-card">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <motion.div 
                          className="value-icon-container w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        >
                          <value.icon className="h-7 w-7 text-purple-600 dark:text-purple-300" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{value.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                </ClientOnly>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="stats-section py-16 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ClientOnly
              fallback={<h2 className="text-3xl font-bold text-center gradient-text-purple mb-12">Our Impact</h2>}
            >
              <motion.h2 
                className="text-3xl font-bold text-center gradient-text-purple mb-12 text-3d"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Our Impact
              </motion.h2>
            </ClientOnly>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <ClientOnly
                  key={index}
                  fallback={
                    <div className="stats-item p-6 flex flex-col items-center text-center">
                      <div className="stats-icon w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="stats-number text-4xl font-bold mb-2 text-gray-800 dark:text-white">{stat.number}</div>
                      <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                    </div>
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="stats-item p-6 flex flex-col items-center text-center">
                      <motion.div 
                        className="stats-icon w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        <stat.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <motion.div 
                        className="stats-number-enhanced text-4xl font-bold mb-2 text-gray-800 dark:text-white"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                    </div>
                  </motion.div>
                </ClientOnly>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <AboutTeam />
        </Suspense>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="cta-container max-w-4xl mx-auto text-center p-8 rounded-2xl">
              <ClientOnly
                fallback={<h2 className="text-3xl font-bold mb-6">Ready to Start Your Mental Wellness Journey?</h2>}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6 text-3d"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Ready to Start Your Mental Wellness Journey?
                </motion.h2>
              </ClientOnly>
              
              <ClientOnly
                fallback={
                  <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                    Join thousands of users who have taken the first step toward better mental health with our
                    comprehensive assessments and personalized resources.
                  </p>
                }
              >
                <motion.p 
                  className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Join thousands of users who have taken the first step toward better mental health with our
                  comprehensive assessments and personalized resources.
                </motion.p>
              </ClientOnly>
              
              <ClientOnly
                fallback={
                  <Button onClick={handleGetStarted} className="cta-button rounded-full px-8 py-6 bg-white text-purple-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
                    Get Started Now <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                }
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    onClick={handleGetStarted}
                    className="cta-button button-3d rounded-full px-8 py-6 bg-white text-purple-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0 group-hover:animate-pulse -translate-x-full"></span>
                    Get Started Now <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </ClientOnly>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function AboutPage() {
  return (
    <ErrorBoundaryWrapper>
      <AboutPageContent />
    </ErrorBoundaryWrapper>
  );
}
