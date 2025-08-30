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
import { Search, BookOpen, FileText, Settings, Users, Activity, Brain, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of MindWell and how to get started with our platform.",
      documents: [
        {
          title: "Introduction to MindWell",
          description: "An overview of the MindWell platform and its features.",
          link: "/about"
        },
        {
          title: "Creating Your Account",
          description: "Step-by-step guide to setting up your MindWell account.",
          link: "/auth/signup"
        },
        {
          title: "Navigating the Dashboard",
          description: "Learn how to navigate the MindWell dashboard and access key features.",
          link: "/"
        },
        {
          title: "Understanding Your Profile",
          description: "How to view and update your profile information.",
          link: "/profile"
        }
      ]
    },
    {
      id: "assessments",
      title: "Assessments",
      icon: Activity,
      description: "Comprehensive guides to understanding and using our mental health assessments.",
      documents: [
        {
          title: "Taking Your First Assessment",
          description: "How to complete your first mental health assessment.",
          link: "/assessment"
        },
        {
          title: "Understanding Assessment Results",
          description: "How to interpret your assessment results and what they mean.",
          link: "/assessment/results"
        },
        {
          title: "Tracking Progress Over Time",
          description: "How to track changes in your mental health using assessment history.",
          link: "/assessment/history"
        },
        {
          title: "Assessment Types Explained",
          description: "Details about the different assessment types available on MindWell.",
          link: "/assessment/types"
        }
      ]
    },
    {
      id: "features",
      title: "Features & Tools",
      icon: Settings,
      description: "Detailed documentation for all MindWell features and relaxation tools.",
      documents: [
        {
          title: "Relaxation Activities",
          description: "Guide to using the various relaxation activities available on MindWell.",
          link: "/relaxation"
        },
        {
          title: "Mood Tracking",
          description: "How to use the mood tracking feature to monitor your emotional wellbeing.",
          link: "/assessment/mood"
        },
        {
          title: "Journal",
          description: "Using the journal feature to record thoughts and feelings.",
          link: "/relaxation/journal"
        },
        {
          title: "Meditation Guides",
          description: "How to access and use guided meditation resources.",
          link: "/relaxation/meditation"
        }
      ]
    },
    {
      id: "community",
      title: "Community & Support",
      icon: Users,
      description: "Learn how to engage with the MindWell community and get support.",
      documents: [
        {
          title: "Joining Community Discussions",
          description: "How to participate in community forums and discussions.",
          link: "/help/forum"
        },
        {
          title: "Finding Support Resources",
          description: "Guide to accessing mental health support resources.",
          link: "/help/resources"
        },
        {
          title: "Contacting Support",
          description: "How to get in touch with the MindWell support team.",
          link: "/contact"
        },
        {
          title: "Privacy & Data Security",
          description: "Information about how we protect your privacy and data.",
          link: "/privacy"
        }
      ]
    }
  ]

  // Filter documents based on search query
  const filteredCategories = searchQuery.trim() === ""
    ? categories
    : categories.map(category => ({
        ...category,
        documents: category.documents.filter(doc =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.documents.length > 0)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (searchQuery.trim() === "") {
      return
    }
    
    // Check if the search query matches any existing content
    const hasResults = categories.some(category => 
      category.documents.some(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    
    if (hasResults) {
      // Update the filtered categories with the search results
      // The filtering is already handled by the filteredCategories variable
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
                  <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                Documentation
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Comprehensive guides and documentation to help you get the most out of MindWell.
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="Search documentation..."
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
        
        {/* Documentation Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="flex flex-wrap mb-8 justify-center">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    We couldn't find any documentation matching "{searchQuery}".
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
                filteredCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                      <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <category.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          <span>{category.title}</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {category.description}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="quick-start">
                            <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                              Quick Start Guide
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 dark:text-gray-300">
                              <p className="mb-4">Follow these steps to quickly get started with this section:</p>
                              <ol className="list-decimal pl-5 space-y-2">
                                <li>Read through the essential documents listed below</li>
                                <li>Try out the features as you learn about them</li>
                                <li>Refer to specific guides as needed for more details</li>
                                <li>Contact support if you need additional assistance</li>
                              </ol>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {category.documents.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card className="h-full hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                              <CardTitle>{doc.title}</CardTitle>
                              <CardDescription>{doc.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <Button variant="outline" asChild className="w-full">
                                <a href={doc.link} className="flex items-center justify-between">
                                  <span>Read More</span>
                                  <ChevronRight className="h-4 w-4" />
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                ))
              )}
            </Tabs>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-purple-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Documentation FAQs</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Common questions about using MindWell documentation
                </p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    How often is the documentation updated?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    Our documentation is updated regularly to reflect new features, improvements, and based on user feedback. We typically update within 1-2 weeks of any significant platform changes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    Can I download documentation for offline reading?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    Yes, most of our documentation is available in PDF format for offline reading. Look for the download icon next to each document title to save it to your device.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    What if I can't find what I'm looking for?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    If you can't find the information you need in our documentation, you can reach out to our support team through the Contact Support page. We're happy to help and may use your feedback to improve our documentation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    Is there a glossary of terms used in MindWell?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    Yes, we have a comprehensive glossary that explains all technical and psychological terms used throughout the platform. You can find it in the Resources section or by searching for "glossary" in the search bar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Help & Support CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need More Help?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                If you couldn't find what you're looking for in our documentation, our support team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/help/forum">Visit Community Forum</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 