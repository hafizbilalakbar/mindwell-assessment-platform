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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useUser } from "@/lib/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { 
  UserCircle, 
  Settings as SettingsIcon, 
  ChevronRight, 
  LogOut, 
  Bell,
  Key,
  Languages,
  Shield,
  Moon,
  Sun,
  Trash2,
  Upload,
  Download,
  Loader2
} from "lucide-react"
import { useTheme } from "next-themes"
import { UserAvatar } from "@/components/user-avatar"

export default function SettingsPage() {
  const { user, isLoading, deleteAssessment } = useUser()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading your settings...</p>
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

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    toast({
      title: "Theme updated",
      description: `Theme has been changed to ${newTheme}.`,
    })
  }

  // Handle data export
  const handleDataExport = () => {
    // In a real app, this would generate and download a file with user data
    toast({
      title: "Data export started",
      description: "Your data is being prepared for download.",
    })
    
    // Simulate download delay
    setTimeout(() => {
      const userDataJson = JSON.stringify(user, null, 2)
      const blob = new Blob([userDataJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mindwell_user_data_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Data export complete",
        description: "Your data has been downloaded successfully.",
      })
    }, 1500)
  }

  // Handle deleting all assessment reports
  const handleDeleteAllReports = () => {
    setIsDeleting(true)
    
    // In a real app, this would call an API to delete all reports
    // For demo purposes, we'll delete them one by one with a small delay
    const totalReports = user.assessments.length
    let deletedCount = 0
    
    const deleteWithDelay = () => {
      if (deletedCount < totalReports) {
        const reportId = user.assessments[deletedCount].id
        deleteAssessment(reportId)
        deletedCount++
        
        if (deletedCount < totalReports) {
          setTimeout(deleteWithDelay, 100)
        } else {
          setIsDeleting(false)
          toast({
            title: "All reports deleted",
            description: `Successfully deleted ${totalReports} assessment reports.`,
          })
        }
      }
    }
    
    if (totalReports > 0) {
      deleteWithDelay()
    } else {
      setIsDeleting(false)
      toast({
        title: "No reports to delete",
        description: "You don't have any assessment reports to delete.",
      })
    }
  }

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
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b" asChild>
                          <a href="/reports" className="flex items-center">
                            <ChevronRight className="mr-2 h-5 w-5" />
                            <span>My Reports</span>
                          </a>
                        </Button>
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b bg-gray-100 dark:bg-gray-800" asChild>
                          <a href="/settings" className="flex items-center">
                            <SettingsIcon className="mr-2 h-5 w-5" />
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
                      <CardTitle className="text-2xl">Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences and settings</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Tabs defaultValue="appearance">
                    <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                      <TabsTrigger value="data">Data Management</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="appearance">
                      <Card>
                        <CardHeader>
                          <CardTitle>Theme Settings</CardTitle>
                          <CardDescription>Customize the appearance of MindWell</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Label htmlFor="theme">Theme Mode</Label>
                            <div className="flex flex-wrap items-center gap-4">
                              <Button 
                                variant={theme === "light" ? "default" : "outline"} 
                                className="flex items-center gap-2"
                                onClick={() => handleThemeChange("light")}
                              >
                                <Sun className="h-4 w-4" />
                                <span>Light</span>
                              </Button>
                              <Button 
                                variant={theme === "dark" ? "default" : "outline"} 
                                className="flex items-center gap-2"
                                onClick={() => handleThemeChange("dark")}
                              >
                                <Moon className="h-4 w-4" />
                                <span>Dark</span>
                              </Button>
                              <Button 
                                variant={theme === "system" ? "default" : "outline"} 
                                className="flex items-center gap-2"
                                onClick={() => handleThemeChange("system")}
                              >
                                <span>System</span>
                              </Button>
                            </div>
                          </div>

                          <Separator className="my-6" />
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">Animated Transitions</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Enable smooth animations between pages and elements
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>

                          <Separator className="my-6" />
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">High Contrast Mode</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Increase contrast for better readability
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="data">
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Assessment Reports</CardTitle>
                            <CardDescription>Manage your mental health assessment data</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-medium mb-2">Your Reports Summary</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  You currently have {user?.assessments?.length || 0} assessment reports stored in your account.
                                </p>
                                <Button 
                                  variant="outline" 
                                  className="flex items-center gap-2"
                                  asChild
                                >
                                  <a href="/reports">
                                    <ChevronRight className="h-4 w-4" />
                                    <span>View All Reports</span>
                                  </a>
                                </Button>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">Delete All Reports</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  Permanently delete all your assessment reports and results. This action cannot be undone.
                                </p>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      className="flex items-center gap-2"
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? (
                                        <>
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                          <span>Deleting...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Trash2 className="h-4 w-4" />
                                          <span>Delete All Reports</span>
                                        </>
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all your assessment
                                        reports and remove the data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={handleDeleteAllReports}
                                      >
                                        Delete All
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Download Your Data</CardTitle>
                            <CardDescription>Get a copy of your personal data</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              You can download a copy of all the data we have stored about you, including your profile information,
                              assessment results, and activity history.
                            </p>
                            <Button 
                              variant="outline" 
                              className="flex items-center gap-2"
                              onClick={handleDataExport}
                            >
                              <Download className="h-4 w-4" />
                              <span>Export My Data</span>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="privacy">
                      <Card>
                        <CardHeader>
                          <CardTitle>Privacy Settings</CardTitle>
                          <CardDescription>Control how your data is used and protected</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">Anonymous Data Collection</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Allow us to collect anonymous usage data to improve our services
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">Research Participation</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Allow your anonymized data to be used in mental health research
                                </p>
                              </div>
                              <Switch />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">Email Communication</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Receive email notifications about your account and assessment reminders
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <Separator />
                            
                            <Button variant="outline" asChild>
                              <a href="/privacy">View Privacy Policy</a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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