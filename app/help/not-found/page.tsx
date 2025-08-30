"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileQuestion } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function NotFoundPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  
  const handleSearch = (e) => {
    e.preventDefault()
    
    if (searchQuery.trim() === "") {
      return
    }
    
    // Try searching again with the new query
    router.push(`/help?q=${encodeURIComponent(searchQuery)}`)
  }
  
  // Popular search topics that lead to existing content
  const suggestedTopics = [
    {
      label: "Mental health assessments",
      link: "/help?q=assessment"
    },
    {
      label: "Account settings and management",
      link: "/help?q=account"
    },
    {
      label: "MindWell features and tools",
      link: "/help?q=features"
    },
    {
      label: "Privacy and data security",
      link: "/privacy"
    },
    {
      label: "Relaxation techniques",
      link: "/relaxation"
    },
    {
      label: "Contact support",
      link: "/contact"
    }
  ]
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <FileQuestion className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {query ? (
                <>No results found for "<span className="text-purple-600 dark:text-purple-400">{query}</span>"</>
              ) : (
                "Page Not Found"
              )}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {query ? (
                "We couldn't find any content matching your search query. Please try different keywords or browse our help categories."
              ) : (
                "The page you're looking for doesn't exist or has been moved. Please check the URL or try one of the options below."
              )}
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-10">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text"
                placeholder="Try another search..."
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild>
                <Link href="/help">
                  <span>Return to Help Center</span>
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <span>Contact Support</span>
                </Link>
              </Button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg max-w-xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                <Search className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Popular Help Topics</span>
              </h2>
              
              <ul className="space-y-3 text-left">
                {suggestedTopics.map((topic, index) => (
                  <li key={index}>
                    <Link href={topic.link} className="text-purple-600 dark:text-purple-400 hover:underline">
                      {topic.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 