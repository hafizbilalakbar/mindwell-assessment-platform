"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, ExternalLink, BookOpen, Heart, Brain, Shield, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const resourceCategories = [
    {
      id: "exercises",
      title: "Mental Health Exercises",
      icon: Brain,
    },
    {
      id: "guides",
      title: "Self-Help Guides",
      icon: FileText,
    },
    {
      id: "tools",
      title: "Mental Wellness Tools",
      icon: Brain,
    },
    {
      id: "support",
      title: "Support Resources",
      icon: Heart,
    }
  ]

  const resources = [
    {
      id: 1,
      title: "Breathing Exercises for Anxiety Relief",
      category: "exercises",
      description: "Learn effective breathing techniques to manage anxiety and stress in daily life.",
      tags: ["anxiety", "breathing", "self-care"],
      url: "/relaxation/breathing",
      isPremium: false,
      dateAdded: "2023-06-15"
    },
    {
      id: 2,
      title: "Guided Visualization Practices",
      category: "exercises",
      description: "Step-by-step visualization exercises to promote relaxation and positive thinking.",
      tags: ["visualization", "relaxation", "mental health"],
      url: "/relaxation/visualization",
      isPremium: false,
      dateAdded: "2023-07-22"
    },
    {
      id: 3,
      title: "Mindfulness Meditation: Step-by-Step Guide",
      category: "guides",
      description: "A beginner-friendly guide to mindfulness meditation with practical exercises and tips.",
      tags: ["mindfulness", "meditation", "stress-reduction"],
      url: "/relaxation/meditation",
      isPremium: false,
      dateAdded: "2023-05-10"
    },
    {
      id: 4,
      title: "Cognitive Behavioral Therapy Workbook",
      category: "guides",
      description: "A downloadable workbook with CBT exercises to help manage negative thought patterns.",
      tags: ["CBT", "therapy", "worksheets"],
      url: "/relaxation/cbt",
      isPremium: true,
      dateAdded: "2023-08-05"
    },
    {
      id: 5,
      title: "Sleep Hygiene Assessment Tool",
      category: "tools",
      description: "Evaluate your sleep habits and get personalized recommendations for better sleep.",
      tags: ["sleep", "assessment", "self-help"],
      url: "/assessment/sleep",
      isPremium: false,
      dateAdded: "2023-04-18"
    },
    {
      id: 6,
      title: "Mood Tracking Templates",
      category: "tools",
      description: "Downloadable templates for tracking your mood, triggers, and coping strategies.",
      tags: ["mood tracking", "self-monitoring", "templates"],
      url: "/assessment/mood",
      isPremium: false,
      dateAdded: "2023-09-02"
    },
    {
      id: 7,
      title: "Crisis Hotlines and Emergency Resources",
      category: "support",
      description: "A comprehensive list of mental health crisis hotlines and emergency resources.",
      tags: ["crisis", "emergency", "hotlines"],
      url: "#emergency-resources",
      isPremium: false,
      dateAdded: "2023-03-30"
    },
    {
      id: 8,
      title: "Finding the Right Therapist: A Guide",
      category: "support",
      description: "Tips for finding a qualified therapist who meets your specific needs and preferences.",
      tags: ["therapy", "mental health professionals", "support"],
      url: "/contact",
      isPremium: false,
      dateAdded: "2023-07-12"
    },
    {
      id: 9,
      title: "Stress Management Techniques for Busy Professionals",
      category: "exercises",
      description: "Practical stress management strategies designed for those with demanding schedules.",
      tags: ["stress", "workplace", "self-care"],
      url: "/relaxation",
      isPremium: false,
      dateAdded: "2023-08-28"
    },
    {
      id: 10,
      title: "Nutrition and Mental Health: The Gut-Brain Connection",
      category: "exercises",
      description: "Explore the relationship between diet, gut health, and mental wellbeing.",
      tags: ["nutrition", "diet", "gut health"],
      url: "/help/resources?topic=nutrition",
      isPremium: true,
      dateAdded: "2023-09-15"
    },
    {
      id: 11,
      title: "Progressive Muscle Relaxation Audio Guide",
      category: "tools",
      description: "Guided audio sessions for progressive muscle relaxation to reduce physical tension.",
      tags: ["relaxation", "audio", "stress-reduction"],
      url: "/relaxation/pmr",
      isPremium: true,
      dateAdded: "2023-05-25"
    },
    {
      id: 12,
      title: "Grief and Loss: Coping Strategies",
      category: "guides",
      description: "A compassionate guide to navigating grief and loss with healthy coping mechanisms.",
      tags: ["grief", "loss", "coping"],
      url: "/help/resources?topic=grief",
      isPremium: false,
      dateAdded: "2023-06-30"
    }
  ]

  // Filter resources based on search query
  const filteredResources = searchQuery.trim() === ""
    ? resources
    : resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  const getResourcesByCategory = (category: string) => {
    return filteredResources.filter(resource => resource.category === category)
  }

  const emergencyResources = [
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988 or 1-800-273-8255",
      description: "24/7, free and confidential support for people in distress, plus prevention and crisis resources."
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "Free 24/7 support for those in crisis, connecting people with crisis counselors."
    },
    {
      name: "SAMHSA's National Helpline",
      contact: "1-800-662-4357",
      description: "Treatment referral and information service for individuals facing mental health or substance use disorders."
    },
    {
      name: "National Domestic Violence Hotline",
      contact: "1-800-799-7233",
      description: "Advocates available 24/7 to talk confidentially with anyone experiencing domestic violence."
    }
  ]

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (searchQuery.trim() === "") {
      return
    }
    
    // Check if the search query matches any existing content
    const hasResults = resources.some(resource => 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    
    if (hasResults) {
      // Update URL with search query
      router.push(`/help/resources?q=${encodeURIComponent(searchQuery)}`)
    } else {
      // Redirect to not found page with the search query
      router.push(`/help/not-found?q=${encodeURIComponent(searchQuery)}`)
    }
  }

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
                  <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                Mental Health Resources
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Access articles, guides, and tools to support your mental health journey and wellbeing.
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="Search resources..."
                  className="pl-10 py-6 text-lg rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
        
        {/* Emergency Resources Banner */}
        <section className="py-6 bg-red-50 dark:bg-red-900/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Need immediate help?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">If you're in crisis, please use these emergency resources</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                  <a href="#emergency-resources">View Emergency Resources</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Resources Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="exercises" className="w-full">
              <TabsList className="flex flex-wrap mb-8 justify-center">
                {resourceCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {resourceCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <category.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <span>{category.title}</span>
                    </h2>
                    <Separator className="mb-6" />
                    
                    {getResourcesByCategory(category.id).length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No resources found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          We couldn't find any resources matching "{searchQuery}" in this category.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getResourcesByCategory(category.id).map((resource) => (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                          >
                            <Card className="h-full hover:shadow-md transition-shadow duration-300">
                              <CardHeader className="pb-2">
                                {resource.isPremium && (
                                  <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                                    Premium
                                  </Badge>
                                )}
                                <CardTitle className="text-lg">{resource.title}</CardTitle>
                                <CardDescription>{resource.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {resource.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Added: {resource.dateAdded}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button 
                                  variant="outline" 
                                  asChild 
                                  className="w-full"
                                >
                                  <a href={resource.url} className="flex items-center justify-center gap-2">
                                    {resource.category === "guides" || resource.category === "tools" ? (
                                      <>
                                        <Download className="h-4 w-4" />
                                        <span>Download</span>
                                      </>
                                    ) : (
                                      <>
                                        <ExternalLink className="h-4 w-4" />
                                        <span>View Resource</span>
                                      </>
                                    )}
                                  </a>
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* Emergency Resources Section */}
        <section id="emergency-resources" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Emergency Resources</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  If you or someone you know is experiencing a mental health crisis, please use these resources to get immediate help.
                </p>
              </div>
              
              <div className="space-y-4">
                {emergencyResources.map((resource, index) => (
                  <Card key={index} className="border-red-100 dark:border-red-900/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{resource.name}</CardTitle>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          24/7 Support
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium">
                        {resource.contact}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">
                        {resource.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-400">Important Disclaimer</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  MindWell is not a crisis intervention service. The resources provided on this page are maintained by third-party organizations. 
                  If you are experiencing a mental health emergency, please call your local emergency services (911 in the US) or use one of the 
                  crisis hotlines listed above.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Resources FAQ</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Common questions about using MindWell resources
                </p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    What's the difference between free and premium resources?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    Free resources are available to all MindWell users. Premium resources are more comprehensive and specialized, available exclusively to Premium members. These include in-depth workbooks, specialized assessments, and professional-grade tools.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    How often are new resources added?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    We add new resources weekly, with a major content update monthly. Our team of mental health professionals regularly reviews and updates existing resources to ensure they reflect current best practices.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    Can I suggest topics for new resources?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    Absolutely! We welcome user suggestions for new resources. You can submit your ideas through the Contact Support page, and our content team will review them. Many of our most popular resources have come from user suggestions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    Who creates these resources?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    Our resources are developed by a team of licensed mental health professionals, including psychologists, therapists, and counselors. All content is reviewed for accuracy and effectiveness before publication.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <section className="py-16 bg-purple-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Subscribe to our newsletter to receive the latest mental health resources, articles, and tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 