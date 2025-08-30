"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, MessageCircle, HelpCircle, FileText, Brain, Phone, Shield } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function HelpCenterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQueryParam = searchParams.get("q") || ""
  
  const [searchQuery, setSearchQuery] = useState(searchQueryParam)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Update search query when URL parameter changes
    setSearchQuery(searchQueryParam)
    
    // If there's a search query, filter the FAQs automatically
    if (searchQueryParam) {
      const hasResults = faqs.some(category => 
        category.questions.some(q => 
          q.question.toLowerCase().includes(searchQueryParam.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQueryParam.toLowerCase())
        )
      )
      
      setIsSearching(false)
      
      // If no results are found, redirect to not found page
      if (!hasResults && searchQueryParam.trim() !== "") {
        router.push(`/help/not-found?q=${encodeURIComponent(searchQueryParam)}`)
      }
    }
  }, [searchQueryParam, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSearching(true)
    
    // Simulate a brief loading state
    setTimeout(() => {
      setIsSearching(false)
      
      if (searchQuery.trim() === "") {
        return
      }
      
      // Check if the search query matches any existing content
      const hasResults = faqs.some(category => 
        category.questions.some(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      
      if (hasResults) {
        // Update URL with search query
        router.push(`/help?q=${encodeURIComponent(searchQuery)}`)
      } else {
        // Redirect to not found page with the search query
        router.push(`/help/not-found?q=${encodeURIComponent(searchQuery)}`)
      }
    }, 500)
  }

  const faqs = [
    {
      category: "assessments",
      questions: [
        {
          question: "How accurate are the mental health assessments?",
          answer: "Our assessments are based on clinically validated screening tools and are designed to provide insights into your mental wellbeing. However, they are not a substitute for professional diagnosis. The accuracy depends on how honestly and accurately you answer the questions."
        },
        {
          question: "How often should I take an assessment?",
          answer: "We recommend taking assessments every 2-4 weeks to track changes in your mental health. However, if you're experiencing significant distress, please consult with a mental health professional rather than relying solely on our assessments."
        },
        {
          question: "Can I save or download my assessment results?",
          answer: "Yes, after completing an assessment, you can download a PDF report of your results from the results page. This allows you to track your progress over time or share the information with a healthcare provider if needed."
        },
        {
          question: "Are my assessment results private?",
          answer: "Absolutely. Your assessment results and all personal information are kept confidential and secure. We use encryption and follow HIPAA guidelines to protect your data. We never share your information without your explicit consent."
        }
      ]
    },
    {
      category: "account",
      questions: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. You'll need to provide your email address, create a password, and fill in some basic profile information. Once completed, you'll have access to all MindWell features."
        },
        {
          question: "How do I reset my password?",
          answer: "If you've forgotten your password, click on the 'Login' button and then select 'Forgot Password?' You'll be prompted to enter your email address, and we'll send you instructions to reset your password."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time. Go to your profile settings, scroll to the bottom, and click on 'Delete Account'. Please note that this action is irreversible and will permanently delete all your data."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take data security very seriously. We use industry-standard encryption to protect your personal information and follow strict privacy policies. We never sell your data to third parties."
        }
      ]
    },
    {
      category: "features",
      questions: [
        {
          question: "What relaxation activities are available?",
          answer: "MindWell offers several relaxation activities including guided breathing exercises, memory games, puzzles, color therapy, and a zen garden. These activities are designed to reduce stress and anxiety while promoting mindfulness and focus."
        },
        {
          question: "Are the relaxation activities effective?",
          answer: "Our relaxation activities are based on evidence-backed mindfulness and cognitive techniques. While individual results may vary, regular practice of these activities can help reduce stress, improve focus, and promote better mental wellbeing."
        },
        {
          question: "Can I track my progress over time?",
          answer: "Yes, MindWell allows you to track your mental health progress over time. After completing assessments, your results are saved to your profile, allowing you to see how your mental wellbeing changes with each assessment."
        },
        {
          question: "Are there any resources for emergency situations?",
          answer: "If you're experiencing a mental health emergency, please call your local emergency services (911) or mental health crisis line immediately. MindWell is not designed for emergency situations and should not replace professional care."
        }
      ]
    }
  ]

  const filteredFaqs = searchQuery.trim() === "" 
    ? faqs 
    : faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)

  const supportOptions = [
    {
      title: "Documentation",
      icon: BookOpen,
      description: "Browse our detailed documentation for in-depth learning about all MindWell features.",
      link: "/help/documentation"
    },
    {
      title: "Community Forum",
      icon: MessageCircle,
      description: "Connect with other users, share experiences, and get advice from our community.",
      link: "/help/forum"
    },
    {
      title: "Contact Support",
      icon: Phone,
      description: "Get in touch with our support team for personalized assistance with any issues.",
      link: "/contact"
    },
    {
      title: "Resources",
      icon: FileText,
      description: "Access articles, guides, and educational resources about mental health topics.",
      link: "/help/resources"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <HelpCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                How Can We Help You?
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Find answers to common questions, browse documentation, or contact our support team for assistance.
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="Search for answers..."
                  className="pl-10 py-6 text-lg rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
        
        {/* Support Options */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Support Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <option.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" asChild className="w-full">
                        <a href={option.link}>Learn More</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQs Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Find answers to common questions about MindWell's features, assessments, and account management.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="assessments" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                {filteredFaqs.map(category => (
                  <TabsContent key={category.category} value={category.category} className="space-y-4">
                    {category.questions.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No results found for "{searchQuery}". Please try a different search term.
                      </p>
                    ) : (
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 dark:text-gray-300">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Still Need Help Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Our support team is here to assist you with any questions or issues you may have. We typically respond within 24 hours.
              </p>
              <Button asChild className="btn-professional">
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Mental Health Resources */}
        <section className="py-16 bg-purple-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Mental Health Resources</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                If you're experiencing a mental health emergency, please use these resources to get immediate help.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200 dark:border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Emergency Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">For immediate emergency assistance:</p>
                  <ul className="space-y-2">
                    <li>• Call 911 (US) or your local emergency number</li>
                    <li>• National Suicide Prevention Lifeline: 988 or 1-800-273-8255</li>
                    <li>• Crisis Text Line: Text HOME to 741741</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Find Professional Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Resources to find mental health professionals:</p>
                  <ul className="space-y-2">
                    <li>• Psychology Today Therapist Directory</li>
                    <li>• SAMHSA Treatment Locator: 1-800-662-4357</li>
                    <li>• Your insurance provider's directory of in-network therapists</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 