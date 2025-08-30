"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  UserCircle, 
  Settings, 
  ChevronRight, 
  LogOut, 
  BarChart, 
  LineChart, 
  Calendar, 
  Download, 
  Share2, 
  Clock,
  ArrowUpRight,
  Percent,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { useUser } from "@/lib/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { UserAssessment } from "@/lib/context/user-context"
import { UserAvatar } from "@/components/user-avatar"

export default function ReportsPage() {
  const { user, isLoading, deleteAssessment } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [currentTab, setCurrentTab] = useState("recent")
  const [categoryTab, setCategoryTab] = useState("all")

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading your reports...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    // Redirect to login if not authenticated
    router.push('/auth/login')
    return null
  }

  // Get recent reports (last 4)
  const recentReports = user.assessments ? user.assessments.slice(0, 4) : []
  
  // Get historical reports (older ones)
  const historicalReports = user.assessments ? user.assessments.slice(4) : []

  // Group assessments by category
  const categories = ["anxiety", "depression", "stress", "sleep", "comprehensive"]
  const assessmentsByCategory: Record<string, UserAssessment[]> = categories.reduce((acc, category) => {
    acc[category] = user.assessments ? user.assessments.filter(assessment => assessment.category === category) : []
    return acc
  }, {} as Record<string, UserAssessment[]>)
  
  // Recommended assessments based on user's history
  const recommendedAssessments = [
    {
      id: 1,
      title: "Monthly Anxiety Check-in",
      description: "Regular assessment of anxiety symptoms",
      lastCompleted: assessmentsByCategory["anxiety"].length > 0 
        ? assessmentsByCategory["anxiety"][0].date 
        : "Never",
      dueSoon: true,
      url: "/assessment/anxiety"
    },
    {
      id: 2,
      title: "Depression Screening",
      description: "Evaluate signs of depression",
      lastCompleted: assessmentsByCategory["depression"].length > 0 
        ? assessmentsByCategory["depression"][0].date 
        : "Never",
      dueSoon: true,
      url: "/assessment/depression"
    },
    {
      id: 3,
      title: "Quarterly Comprehensive Assessment",
      description: "Full mental health evaluation",
      lastCompleted: assessmentsByCategory["comprehensive"].length > 0 
        ? assessmentsByCategory["comprehensive"][0].date 
        : "Never",
      dueSoon: false,
      url: "/assessment"
    }
  ]

  // Handler for deleting a report
  const handleDeleteReport = (id: string) => {
    deleteAssessment(id)
    toast({
      title: "Report deleted",
      description: "The assessment report has been permanently deleted.",
    })
  }

  // Handle sharing a report
  const handleShareReport = (id: string) => {
    toast({
      title: "Report shared",
      description: "A secure link to this report has been copied to your clipboard.",
    })
  }

  // Handle downloading a report
  const handleDownloadReport = (id: string) => {
    toast({
      title: "Report download started",
      description: "Your assessment report is being downloaded as a PDF.",
    })
  }

  // Determine overall trend
  const getOverallTrend = () => {
    if (!user?.assessments || user.assessments.length < 2) return "Not enough data"
    
    const recentScores = user.assessments
      .filter(a => a.change !== undefined)
      .map(a => a.change as number) // Type assertion since we filtered undefined values
    
    if (recentScores.length === 0) return "Not enough data"
    
    const average = recentScores.reduce((sum, change) => sum + change, 0) / recentScores.length
    
    if (average < -2) return "Improving"
    if (average > 2) return "Declining"
    return "Stable"
  }

  // Get days since last assessment
  const getDaysSinceLastAssessment = () => {
    if (!user?.assessments || user.assessments.length === 0 || recentReports.length === 0) return "N/A"
    
    const mostRecentDate = new Date(recentReports[0].date)
    const today = new Date()
    const diffTime = today.getTime() - mostRecentDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays <= 1 ? "Today" : `${diffDays} days ago`
  }

  // Render a single assessment card
  const renderAssessmentCard = (report: UserAssessment) => (
    <Card key={report.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <CardHeader className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Badge 
                variant="outline" 
                className={`mb-2 ${
                  report.category === 'anxiety' ? 'text-blue-600 border-blue-300' : 
                  report.category === 'depression' ? 'text-purple-600 border-purple-300' :
                  report.category === 'stress' ? 'text-red-600 border-red-300' :
                  report.category === 'comprehensive' ? 'text-indigo-600 border-indigo-300' :
                  'text-green-600 border-green-300'
                }`}
              >
                {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
              </Badge>
              <CardTitle className="text-lg md:text-xl mb-1">{report.title}</CardTitle>
              <CardDescription>Completed on {report.date}</CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex items-center flex-wrap gap-2">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm flex items-center">
                <Percent className="h-3 w-3 mr-1" />
                <span>Score: {report.score}</span>
              </div>
              {report.change !== undefined && (
                <div className={`rounded-full px-3 py-1 text-sm flex items-center 
                  ${report.status === 'improved' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
                >
                  {report.status === 'improved' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(report.change)} points {report.status}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 md:w-48 flex flex-row md:flex-col justify-between items-center md:items-start">
          <Button variant="outline" size="sm" className="w-full mb-2" asChild>
            <a href={`/report/${report.id}`}>
              <ChevronRight className="h-4 w-4 mr-1" />
              View Details
            </a>
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleDownloadReport(report.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleShareReport(report.id)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => handleDeleteReport(report.id)}
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <UserAvatar size="xl" />
                        <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Member since {user?.joined || 'N/A'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-0">
                      <nav className="flex flex-col">
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b" asChild>
                          <a href="/profile" className="flex items-center">
                            <UserCircle className="mr-2 h-5 w-5" />
                            <span>Profile</span>
                          </a>
                        </Button>
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b bg-gray-100 dark:bg-gray-800" asChild>
                          <a href="/reports" className="flex items-center">
                            <ChevronRight className="mr-2 h-5 w-5" />
                            <span>My Reports</span>
                          </a>
                        </Button>
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b" asChild>
                          <a href="/settings" className="flex items-center">
                            <Settings className="mr-2 h-5 w-5" />
                            <span>Settings</span>
                          </a>
                        </Button>
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" asChild>
                          <a href="/auth/logout" className="flex items-center">
                            <LogOut className="mr-2 h-5 w-5" />
                            <span>Log Out</span>
                          </a>
                        </Button>
                      </nav>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Main Content */}
                <div className="w-full md:w-3/4">
                  <Card className="mb-8">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">Your Assessment Reports</CardTitle>
                          <CardDescription>View and manage your mental health assessment results</CardDescription>
                        </div>
                        <Button asChild>
                          <a href="/assessment">Take New Assessment</a>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                                <h3 className="font-medium">Total Assessments</h3>
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {user?.assessments?.length || 0}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                <h3 className="font-medium">Overall Trend</h3>
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{getOverallTrend()}</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                <h3 className="font-medium">Last Assessment</h3>
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{getDaysSinceLastAssessment()}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Tabs 
                    defaultValue="recent" 
                    value={currentTab}
                    onValueChange={setCurrentTab}
                  >
                    <TabsList className="mb-6">
                      <TabsTrigger value="recent">Recent Reports</TabsTrigger>
                      <TabsTrigger value="categories">By Category</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="recommended">Recommended</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="recent">
                      {recentReports.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-medium mb-2">No assessments yet</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            You haven't completed any mental health assessments yet.
                          </p>
                          <Button asChild>
                            <a href="/assessment">Take Your First Assessment</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentReports.map(report => renderAssessmentCard(report))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="categories">
                      <Tabs 
                        defaultValue="all" 
                        value={categoryTab} 
                        onValueChange={setCategoryTab}
                        className="mb-6"
                      >
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
                          <TabsTrigger value="depression">Depression</TabsTrigger>
                          <TabsTrigger value="stress">Stress</TabsTrigger>
                          <TabsTrigger value="sleep">Sleep</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      {categoryTab === "all" ? (
                        <div className="space-y-8">
                          {categories.map(category => {
                            const categoryReports = assessmentsByCategory[category]
                            if (categoryReports.length === 0) return null
                            
                            return (
                              <div key={category} className="space-y-4">
                                <h3 className="text-xl font-bold capitalize flex items-center gap-2">
                                  {category === 'anxiety' && <span className="text-blue-600 dark:text-blue-400">●</span>}
                                  {category === 'depression' && <span className="text-purple-600 dark:text-purple-400">●</span>}
                                  {category === 'stress' && <span className="text-red-600 dark:text-red-400">●</span>}
                                  {category === 'sleep' && <span className="text-green-600 dark:text-green-400">●</span>}
                                  {category === 'comprehensive' && <span className="text-indigo-600 dark:text-indigo-400">●</span>}
                                  {category.charAt(0).toUpperCase() + category.slice(1)} Assessments
                                </h3>
                                <div className="space-y-4">
                                  {categoryReports.map(report => renderAssessmentCard(report))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {assessmentsByCategory[categoryTab].length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart className="h-8 w-8 text-gray-400" />
                              </div>
                              <h3 className="text-xl font-medium mb-2">No {categoryTab} assessments</h3>
                              <p className="text-gray-500 dark:text-gray-400 mb-6">
                                You haven't completed any {categoryTab} assessments yet.
                              </p>
                              <Button asChild>
                                <a href={`/assessment/${categoryTab}`}>Take {categoryTab.charAt(0).toUpperCase() + categoryTab.slice(1)} Assessment</a>
                              </Button>
                            </div>
                          ) : (
                            assessmentsByCategory[categoryTab].map(report => renderAssessmentCard(report))
                          )}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <div className="space-y-4">
                        {historicalReports.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No historical data</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              You don't have any historical assessment data yet.
                            </p>
                          </div>
                        ) : (
                          historicalReports.map(report => renderAssessmentCard(report))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recommended">
                      <div className="space-y-4">
                        {recommendedAssessments.map((assessment) => (
                          <Card key={assessment.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <CardHeader className="flex-1 p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <CardTitle className="text-lg md:text-xl mb-1">{assessment.title}</CardTitle>
                                    <CardDescription>{assessment.description}</CardDescription>
                                  </div>
                                  <div className="mt-4 md:mt-0 flex items-center">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>Last completed: {assessment.lastCompleted}</span>
                                    </div>
                                    {assessment.dueSoon && (
                                      <Badge className="ml-3 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                        Due Soon
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 md:w-48 flex justify-center items-center">
                                <Button className="w-full" asChild>
                                  <a href={assessment.url}>
                                    Take Assessment
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 