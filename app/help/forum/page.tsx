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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Search, MessageCircle, TrendingUp, Clock, Heart, MessageSquare, Users, User, Shield, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CommunityForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const categories = [
    {
      id: "mental-wellness",
      title: "Mental Wellness",
      description: "Discussions about mental health, wellness strategies, and personal experiences.",
      topics: 257,
      posts: 1432,
      link: "/help/forum?category=mental-wellness"
    },
    {
      id: "meditation",
      title: "Meditation & Mindfulness",
      description: "Share meditation techniques, mindfulness practices, and experiences.",
      topics: 189,
      posts: 976,
      link: "/relaxation/meditation"
    },
    {
      id: "assessments",
      title: "Assessments & Tracking",
      description: "Discuss MindWell assessments, results interpretation, and progress tracking.",
      topics: 143,
      posts: 812,
      link: "/assessment"
    },
    {
      id: "support",
      title: "Support & Resources",
      description: "Find and share mental health resources, support options, and professional help.",
      topics: 215,
      posts: 1024,
      link: "/help/resources"
    }
  ]

  const trendingTopics = [
    {
      id: 1,
      title: "How do you incorporate mindfulness into your daily routine?",
      category: "Meditation & Mindfulness",
      author: {
        name: "Emily Chen",
        avatar: "/avatars/emily.jpg"
      },
      replies: 28,
      views: 342,
      lastActivity: "2 hours ago",
      link: "/relaxation/meditation"
    },
    {
      id: 2,
      title: "Understanding anxiety assessment results - what do the numbers mean?",
      category: "Assessments & Tracking",
      author: {
        name: "Marcus Johnson",
        avatar: "/avatars/marcus.jpg"
      },
      replies: 17,
      views: 203,
      lastActivity: "5 hours ago",
      link: "/assessment/results"
    },
    {
      id: 3,
      title: "Resources for helping a loved one with depression",
      category: "Support & Resources",
      author: {
        name: "Sarah Williams",
        avatar: "/avatars/sarah.jpg"
      },
      replies: 32,
      views: 489,
      lastActivity: "1 day ago",
      link: "/help/resources"
    },
    {
      id: 4,
      title: "Success stories: How MindWell has helped my mental health journey",
      category: "Mental Wellness",
      author: {
        name: "David Miller",
        avatar: "/avatars/david.jpg"
      },
      replies: 45,
      views: 627,
      lastActivity: "3 days ago",
      link: "/about"
    }
  ]

  const recentTopics = [
    {
      id: 5,
      title: "First-time meditation experiences - share yours!",
      category: "Meditation & Mindfulness",
      author: {
        name: "Jordan Taylor",
        avatar: "/avatars/jordan.jpg"
      },
      replies: 5,
      views: 42,
      lastActivity: "15 minutes ago",
      link: "/relaxation/meditation"
    },
    {
      id: 6,
      title: "Weekly mental wellness check-in: How are you feeling?",
      category: "Mental Wellness",
      author: {
        name: "Admin",
        avatar: "/avatars/admin.jpg"
      },
      replies: 12,
      views: 87,
      lastActivity: "30 minutes ago",
      link: "/help/forum?category=mental-wellness"
    },
    {
      id: 7,
      title: "Question about the stress assessment methodology",
      category: "Assessments & Tracking",
      author: {
        name: "Alex Rodriguez",
        avatar: "/avatars/alex.jpg"
      },
      replies: 2,
      views: 35,
      lastActivity: "1 hour ago",
      link: "/assessment"
    },
    {
      id: 8,
      title: "Looking for therapist recommendations in NYC",
      category: "Support & Resources",
      author: {
        name: "Jamie Smith",
        avatar: "/avatars/jamie.jpg"
      },
      replies: 8,
      views: 93,
      lastActivity: "2 hours ago",
      link: "/help/resources#emergency-resources"
    }
  ]

  const communityGuides = [
    {
      id: 1,
      title: "Forum Guidelines",
      description: "Learn about our community rules and guidelines for respectful discussions.",
      link: "/help#forum-guidelines"
    },
    {
      id: 2,
      title: "How to Use the Forum",
      description: "A beginner's guide to navigating and participating in the MindWell community forum.",
      link: "/help/forum"
    },
    {
      id: 3,
      title: "Content Policies",
      description: "Important information about what content is allowed and prohibited on our forum.",
      link: "/terms"
    },
    {
      id: 4,
      title: "Support Resources",
      description: "Find additional support resources and professional help options.",
      link: "/help/resources"
    }
  ]

  // Filter topics based on search query
  const filteredTrending = searchQuery.trim() === ""
    ? trendingTopics
    : trendingTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const filteredRecent = searchQuery.trim() === ""
    ? recentTopics
    : recentTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (searchQuery.trim() === "") {
      return
    }
    
    // Check if the search query matches any existing content
    const hasResults = trendingTopics.some(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) || recentTopics.some(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (hasResults) {
      // Update URL with search query to maintain state
      router.push(`/help/forum?q=${encodeURIComponent(searchQuery)}`)
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
                  <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                Community Forum
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Connect with others on their mental health journey. Share experiences, ask questions, and support each other.
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="Search forum topics..."
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
        
        {/* Forum Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Forum Categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{category.topics} Topics</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{category.posts} Posts</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <a href={category.link}>Browse Topics</a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Forum Topics */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="trending" className="w-full">
              <div className="flex justify-between items-center mb-8">
                <TabsList>
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending Topics</span>
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Recent Activity</span>
                  </TabsTrigger>
                </TabsList>
                
                <Button asChild>
                  <a href="/auth/login">Start New Topic</a>
                </Button>
              </div>
              
              <TabsContent value="trending">
                {filteredTrending.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We couldn't find any topics matching "{searchQuery}".
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
                  <div className="space-y-4">
                    {filteredTrending.map((topic, index) => (
                      <Card key={topic.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <CardHeader className="md:flex-1 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {topic.category}
                                </Badge>
                                <CardTitle className="text-lg md:text-xl hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                  <a href={topic.link}>{topic.title}</a>
                                </CardTitle>
                                <CardDescription className="mt-2 flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                                    <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{topic.author.name}</span>
                                </CardDescription>
                              </div>
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-md">
                                <TrendingUp className="h-3 w-3 mr-1 inline" />
                                Trending
                              </Badge>
                            </div>
                          </CardHeader>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 md:w-64 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-4 md:gap-2">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent">
                {filteredRecent.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We couldn't find any topics matching "{searchQuery}".
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
                  <div className="space-y-4">
                    {filteredRecent.map((topic, index) => (
                      <Card key={topic.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <CardHeader className="md:flex-1 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {topic.category}
                                </Badge>
                                <CardTitle className="text-lg md:text-xl hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                  <a href={topic.link}>{topic.title}</a>
                                </CardTitle>
                                <CardDescription className="mt-2 flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                                    <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{topic.author.name}</span>
                                </CardDescription>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3 mr-1 inline" />
                                Recent
                              </Badge>
                            </div>
                          </CardHeader>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 md:w-64 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-4 md:gap-2">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Community Guidelines */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Community Guidelines</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Resources to help you navigate and participate in our community
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communityGuides.map((guide, index) => (
                  <Card key={guide.id} className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <a href={guide.link}>Read More</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Community Stats */}
        <section className="py-16 bg-purple-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Community Statistics</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">15,420</p>
                    <p className="text-gray-500 dark:text-gray-400">Community Members</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">804</p>
                    <p className="text-gray-500 dark:text-gray-400">Active Topics</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">4,244</p>
                    <p className="text-gray-500 dark:text-gray-400">Total Posts</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">143</p>
                    <p className="text-gray-500 dark:text-gray-400">Online Now</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Community CTA */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community Today</h2>
              <p className="text-purple-100 dark:text-purple-200 mb-8">
                Connect with others, share your experiences, and get support on your mental health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-purple-600 hover:bg-gray-100">
                  <a href="/auth/signup">Create Account</a>
                </Button>
                <Button variant="outline" asChild className="text-white border-white hover:bg-purple-700">
                  <a href="/auth/login">Sign In</a>
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