"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Brain, Heart, Shield, Users, Star, ArrowRight, CheckCircle, Clock, Award } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import AnimatedStat from "@/components/AnimatedStat"

// Define user type
interface User {
  id?: string;
  name?: string;
  email?: string;
  age?: string | number;
  gender?: string;
  occupation?: string;
  location?: string;
}

export default function HomePage() {
  const router = useRouter()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const featureCardRefs = useRef<Array<HTMLDivElement | null>>([])
  const statsRef = useRef<HTMLDivElement>(null)

  // Check localStorage for user on client side
  useEffect(() => {
    try {
      // Add a slight delay to ensure the app is fully mounted
      const timer = setTimeout(() => {
        // Check if we're coming from a logout
        const justLoggedOut = sessionStorage.getItem("just_logged_out");
        
        if (justLoggedOut) {
          // Remove the flag and don't load user data
          sessionStorage.removeItem("just_logged_out");
          setIsLoading(false);
          return;
        }
        
        // Load user data only if it exists
        const savedUser = localStorage.getItem("mindwell_user")
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            // Only set user data if it has a valid ID
            if (userData && userData.id) {
              setUser(userData)
            } else {
              // Clear invalid user data
              localStorage.removeItem("mindwell_user")
            }
          } catch (e) {
            console.error("Error parsing user data:", e)
            // Reset corrupted data
            localStorage.removeItem("mindwell_user")
          }
        }
        setIsLoading(false)
      }, 100)
      
      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Error loading user data:", error)
      setIsLoading(false)
    }
  }, [])

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for feature cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent, index: number) => {
      const card = featureCardRefs.current[index];
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const bgEffect = card.querySelector('.card-bg-effect') as HTMLElement;
      if (bgEffect) {
        bgEffect.style.setProperty('--x', `${(x / rect.width) * 100}%`);
        bgEffect.style.setProperty('--y', `${(y / rect.height) * 100}%`);
      }
    };

    const eventListeners: { element: HTMLDivElement, handler: (e: MouseEvent) => void }[] = [];

    featureCardRefs.current.forEach((card, index) => {
      if (card) {
        const handler = (e: MouseEvent) => handleMouseMove(e, index);
        card.addEventListener('mousemove', handler);
        eventListeners.push({ element: card, handler });
      }
    });

    return () => {
      eventListeners.forEach(({ element, handler }) => {
        element.removeEventListener('mousemove', handler);
      });
    };
  }, []);

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

  const features = [
    {
      icon: Brain,
      title: "Professional Assessment",
      description:
        "Evidence-based questionnaires designed by mental health professionals to provide accurate insights.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Heart,
      title: "Personalized Insights",
      description: "Receive detailed reports and personalized recommendations based on your assessment results.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Shield,
      title: "100% Confidential",
      description: "Your privacy is our priority. All assessments are completely confidential and secure.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Access to mental health resources and support whenever you need it.",
      color: "from-blue-500 to-cyan-500",
    },
  ]

  const stats = [
    { number: 50, label: "Users Helped", icon: Users, display: "K+" },
    { number: 100, label: "Assessments Completed", icon: CheckCircle, display: "K+" },
    { number: 95, label: "Success Rate", icon: Award, display: "%" },
    { number: 24, label: "Support Available", icon: Clock, display: "/7", special: true },
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      content:
        "MindWell has revolutionized how I approach patient care. The comprehensive assessments and personalized insights help my clients understand their mental health journey better. The platform is evidence-based and truly professional.",
      rating: 5,
      avatar: "/images/home-images/testmonial-img-1.jpg",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Psychiatrist",
      content:
        "As a mental health professional, I appreciate the scientific approach MindWell takes. The platform provides valuable insights that complement my treatment plans and helps patients visualize their progress over time.",
      rating: 5,
      avatar: "/images/home-images/testmonial-img-2.jpg",
    },
    {
      name: "Dr. Amina Patel",
      role: "Neuropsychologist",
      content:
        "MindWell's assessment tools are exceptional in their depth and accuracy. I've recommended this platform to countless patients who report significant improvements in self-awareness and mental wellness strategies.",
      rating: 5,
      avatar: "/images/home-images/testmonial-img-3.jpg",
    },
    {
      name: "Dr. Michelle Zhang",
      role: "Therapist & Wellness Coach",
      content:
        "The holistic approach of MindWell aligns perfectly with my practice. The platform helps identify underlying patterns that might be missed in traditional sessions, enabling more targeted and effective therapeutic interventions.",
      rating: 5,
      avatar: "/images/home-images/testmonial-img-4.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Simplified Background Gradient - No Animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-100/80 dark:from-gray-900/80 dark:via-purple-900/80 dark:to-indigo-900/80 z-0">
          {/* Simple static gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-purple-200/10 via-blue-200/10 to-indigo-200/10 dark:from-purple-500/10 dark:via-blue-500/10 dark:to-indigo-500/10"
            style={{
              backgroundSize: "200% 200%"
            }}
          />
          
          {/* Static radial gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 70%)"
            }}
          />
          
          {/* Enhanced decorative elements with subtle animations */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Element 1 */}
            <div
              className="absolute rounded-lg icon-float icon-float-1"
              style={{
                width: "60px",
                height: "60px",
                top: "30%",
                left: "70%",
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))",
                boxShadow: "0 0 20px 5px rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
            
            {/* Element 2 */}
            <div
              className="absolute rounded-full icon-float icon-float-2"
              style={{
                width: "50px",
                height: "50px",
                top: "60%",
                left: "30%",
                background: "radial-gradient(circle, rgba(192, 132, 252, 0.2), rgba(192, 132, 252, 0.05))",
                boxShadow: "0 0 15px 5px rgba(192, 132, 252, 0.15)"
              }}
            />

            {/* New Element 3 */}
            <div
              className="absolute rounded-lg icon-float icon-float-3"
              style={{
                width: "45px",
                height: "45px",
                top: "15%",
                left: "20%",
                background: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(99, 102, 241, 0.2))",
                boxShadow: "0 0 15px 5px rgba(236, 72, 153, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />

            {/* New Element 4 */}
            <div
              className="absolute rounded-full icon-float icon-float-4"
              style={{
                width: "70px",
                height: "70px",
                bottom: "15%",
                right: "25%",
                background: "radial-gradient(circle, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0.05))",
                boxShadow: "0 0 20px 5px rgba(79, 70, 229, 0.1)"
              }}
            />

            {/* New Element 5 */}
            <div
              className="absolute rounded-lg rotate-45 icon-float icon-float-5"
              style={{
                width: "40px",
                height: "40px",
                top: "45%",
                right: "15%",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))",
                boxShadow: "0 0 15px 5px rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
          </div>
        </div>
        
        {/* Simplified MindWell Themed Background - No Animations */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Static brain wave pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brainwave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 C50,100 50,50 100,50 C150,50 150,100 200,100 C250,100 250,50 300,50 C350,50 350,100 400,100 C450,100 450,50 500,50 C550,50 550,100 600,100 C650,100 650,50 700,50 C750,50 750,100 800,100 C850,100 850,50 900,50 C950,50 950,100 1000,100"
              fill="none"
              stroke="url(#brainwave-gradient)"
              strokeWidth="2"
            />
          </svg>
          
          {/* Two static geometric shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "30%",
                top: "20%",
                left: "10%",
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05))",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
            
            <div
              className="absolute"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "40%",
                top: "60%",
                right: "15%",
                background: "linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(99, 102, 241, 0.05))",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
          </div>
        </div>
        
        {/* Content section remains the same */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Content with Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12 lg:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                <span className="block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Transform</span>{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Your</span>
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Mental Wellbeing</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Professional mental health assessment and personalized insights to help you understand and improve your
                mental wellness journey with evidence-based tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Enhanced Primary Button with Animation */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Button 
                    onClick={handleGetStarted} 
                    className="btn-professional text-lg px-8 py-4 h-auto shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Start Free Assessment
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 dark:from-purple-600 dark:via-indigo-600 dark:to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                  </Button>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                </motion.div>
                
                {/* Enhanced Secondary Button with Animation */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Button
                    variant="outline"
                    onClick={() => router.push("/about")}
                    className="btn-outline-professional text-lg px-8 py-4 h-auto relative z-10"
                  >
                    <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                      Learn More
                    </span>
                  </Button>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                </motion.div>
              </div>

              {/* Enhanced Trust Indicators with 3D Rotation Animation */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div 
                  className="trust-indicator flex items-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className="rounded-full bg-green-100 dark:bg-green-900/30 p-2 mr-3 transition-all duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-800/40"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Free Assessment</span>
                </motion.div>
                
                <motion.div 
                  className="trust-indicator flex items-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 mr-3 transition-all duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">100% Confidential</span>
                </motion.div>
                
                <motion.div 
                  className="trust-indicator flex items-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 mr-3 transition-all duration-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">5-10 Minutes</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Image - Enhanced Heptagon Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Enhanced Heptagon with cosmic universe gradient */}
                <div className="heptagon-clip w-80 h-80 lg:w-[450px] lg:h-[450px] relative overflow-hidden shadow-2xl">
                  {/* Cosmic universe background with nebula and stars effect */}
                  <div className="absolute inset-0">
                    {/* Base cosmic gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900"></div>
                    
                    {/* Add nebula effect */}
                    <div className="absolute inset-0 opacity-60 mix-blend-screen"
                      style={{
                        background: "radial-gradient(circle at 30% 40%, rgba(236, 72, 153, 0.6), transparent 70%), radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.6), transparent 70%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5), transparent 70%)"
                      }}
                    ></div>
                    
                    {/* Add the cosmic gif or overlay */}
                    <img
                      src="/images/home-images/mind-well-site.gif"
                      alt="Mind Well meditation visualization"
                      className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                    />
                    
                    {/* Star field effect */}
                    <div className="absolute inset-0"
                      style={{
                        backgroundImage: "radial-gradient(1px 1px at 25% 25%, white 1px, transparent 0), radial-gradient(1px 1px at 50% 50%, white 1px, transparent 0), radial-gradient(1px 1px at 75% 75%, white 1px, transparent 0), radial-gradient(2px 2px at 33% 67%, white 1px, transparent 0), radial-gradient(2px 2px at 67% 33%, white 1px, transparent 0)",
                        backgroundSize: "100px 100px",
                        opacity: 0.4
                      }}
                    ></div>
                    
                    {/* Cosmic glow effect */}
                    <div className="absolute inset-0"
                      style={{
                        background: "radial-gradient(circle at center, rgba(167, 139, 250, 0.4) 0%, rgba(139, 92, 246, 0.2) 25%, rgba(0, 0, 0, 0) 60%)",
                      }}
                    ></div>
                  </div>
                  
                  {/* Central glow - enhanced */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className="relative w-20 h-20 rounded-full"
                      style={{ 
                        background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(139, 92, 246, 0.5))",
                        boxShadow: "0 0 30px 15px rgba(255,255,255,0.7), 0 0 60px 30px rgba(139,92,246,0.5), 0 0 100px 80px rgba(59,130,246,0.3)"
                      }}
                    />
                  </div>

                  {/* Cosmic edge highlight */}
                  <div className="absolute inset-0 heptagon-clip opacity-70 bg-transparent border-[3px] border-white/30 scale-[0.98]"></div>
                </div>
                
                {/* Mental health icons with new floating animations - repositioned */}
                <div className="absolute inset-0 pointer-events-none heptagon-icon-container">                  
                  {/* Top icon - smooth floating */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 icon-float icon-float-1">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
                      <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  {/* Top right icon - smooth floating */}
                  <div className="absolute top-[20%] right-0 translate-x-10 icon-float icon-float-2">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
                      <Heart className="h-8 w-8 text-pink-500 dark:text-pink-400" />
                    </div>
                  </div>

                  {/* Bottom right icon - smooth floating */}
                  <div className="absolute bottom-[20%] right-0 translate-x-10 icon-float icon-float-3">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
                      <Users className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                  </div>

                  {/* Bottom left icon - smooth floating */}
                  <div className="absolute bottom-[20%] left-0 -translate-x-10 icon-float icon-float-4">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
                      <Shield className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>

                  {/* Bottom icon - smooth floating */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 icon-float icon-float-5">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
                      <Clock className="h-8 w-8 text-teal-500 dark:text-teal-400" />
                    </div>
                  </div>

                  {/* Top left icon - smooth floating */}
                  <div className="absolute top-[20%] left-0 -translate-x-10 icon-float icon-float-6">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
                      <Star className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 overflow-hidden relative">
        {/* Background decoration elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/4 right-10 w-40 h-40 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-2xl opacity-20"></div>
        <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-2xl opacity-20"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm text-purple-800 dark:text-purple-200 text-sm font-medium border border-purple-200 dark:border-purple-800/30">
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Why Choose <span className="text-gradient">MindWell</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Our platform combines professional mental health expertise with innovative technology to provide you with
              the most comprehensive assessment experience.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card group"
                ref={(el: HTMLDivElement | null) => {
                  if (el) featureCardRefs.current[index] = el;
                }}
              >
                <Card className="h-full border-0 bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-800/90 shadow-lg group-hover:shadow-xl transition-all duration-500 overflow-hidden relative rounded-2xl backdrop-blur-md">
                  <div className="card-bg-effect"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-6 feature-card-content relative z-10">
                    <div className="flex items-start gap-6">
                      <motion.div 
                        className={`feature-icon-container bg-gradient-to-r ${feature.color} flex-shrink-0`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 professional-heading">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      whileInView={{ width: "100%", opacity: 0.5 }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={`h-px bg-gradient-to-r ${feature.color} mt-5 opacity-50`}
                    ></motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 overflow-hidden relative" ref={statsRef}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-900 dark:to-indigo-950 z-0"></div>
        
        {/* Background patterns - different for light/dark modes */}
        <div className="absolute inset-0 bg-[url('/images/light-pattern.svg')] dark:bg-[url('/images/dark-pattern.svg')] opacity-10 dark:opacity-20 bg-repeat z-0"></div>
        
        {/* Light rays effect - only in dark mode */}
        <div className="absolute inset-0 overflow-hidden z-0 hidden dark:block">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-white/20 to-transparent dark:from-purple-400/10 dark:to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-white/20 to-transparent dark:from-blue-400/10 dark:to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Top and bottom fades - only in dark mode */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white dark:from-gray-900 to-transparent z-0 hidden dark:block"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-0 hidden dark:block"></div>
        
        {/* Static glass elements instead of floating */}
        <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-purple-500/5 dark:from-white/20 dark:to-purple-500/10 backdrop-blur-sm border border-white/10 dark:border-white/20 z-0"></div>
        <div className="absolute bottom-1/4 right-10 w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-blue-500/5 dark:from-white/20 dark:to-blue-500/10 backdrop-blur-sm border border-white/10 dark:border-white/20 z-0"></div>
        <div className="absolute top-3/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-indigo-500/2 dark:from-white/10 dark:to-indigo-500/5 backdrop-blur-sm border border-white/5 dark:border-white/10 z-0"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-pink-500/2 dark:from-white/10 dark:to-pink-500/5 backdrop-blur-sm border border-white/5 dark:border-white/10 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/10 shadow-lg">
                Our Impact
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
              Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">thousands worldwide</span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto drop-shadow">
              Join our community of users taking control of their mental health with professional guidance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
                <AnimatedStat
                  key={index}
                  value={stat.number}
                  suffix={stat.display}
                  label={stat.label}
                  icon={stat.icon}
                  animate={true}
                  delay={index * 100}
                  special={stat.special}
                />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What our users say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from people who transformed their mental wellbeing
            </p>
          </motion.div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="card-professional">
                      <CardContent className="p-8">
                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">"{testimonial.content}"</p>
                        <div className="flex items-center">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-purple-400"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-lg">{testimonial.name}</div>
                            <div className="text-purple-600 dark:text-purple-400">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dots Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index 
                      ? "bg-purple-600 w-6" 
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to start your mental wellness journey?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health with our professional assessment. It's free,
              confidential, and takes just 5-10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleGetStarted} className="btn-professional text-lg px-8 py-4 h-auto">
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/about")}
                className="btn-outline-professional text-lg px-8 py-4 h-auto"
              >
                Learn More About Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
