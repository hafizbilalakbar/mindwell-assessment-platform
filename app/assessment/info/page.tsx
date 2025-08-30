"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Brain, ArrowLeft, ArrowRight, User, Briefcase, MapPin, CalendarDays, Loader2, Shield } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function UserInfoPage() {
  const router = useRouter()
  const { user, updateUserInfo } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    age: user?.age || "",
    gender: user?.gender || "",
    occupation: user?.occupation || "",
    location: user?.location || ""
  })

  // Check if we already have all the user info
  useEffect(() => {
    if (user) {
      // If user already has all the required info, redirect to assessment
      if (user.age && user.gender && user.occupation && user.location) {
        router.push("/assessment")
      } else {
        // Update form with any existing data
        setFormData({
          age: user.age || "",
          gender: user.gender || "",
          occupation: user.occupation || "",
          location: user.location || ""
        })
      }
    } else {
      // If no user, redirect to login
      router.push("/auth/login")
    }
  }, [user, router])

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.age || !formData.gender || !formData.occupation || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to continue.",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)

    try {
      // Update user info in context and localStorage
      await updateUserInfo({
        age: Number(formData.age),
        gender: formData.gender,
        occupation: formData.occupation,
        location: formData.location
      })
      
      toast({
        title: "Information Saved",
        description: "Your information has been saved successfully."
      })
      
      // Redirect to assessment
      router.push("/assessment")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4 py-10 md:py-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl relative z-10 px-4 sm:px-0"
        >
          {/* Logo and Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600" />
              </motion.div>
              <span className="text-2xl sm:text-3xl font-bold text-gradient">MindWell</span>
            </div>
            <h2 className="mt-3 text-lg sm:text-xl text-gray-600 dark:text-gray-300">Complete Your Profile</h2>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            {/* Progress bar at the top of card */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800">
              <motion.div 
                initial={{ width: "30%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
            
            <CardHeader className="text-center pb-4 pt-6 md:pb-6 md:pt-8">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Tell Us About Yourself</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                This information helps us personalize your mental wellness experience
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 md:px-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <Label htmlFor="age" className="text-sm sm:text-base font-medium">Your Age</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      className="focus-ring pl-3 pr-3 py-5 sm:py-6 text-sm sm:text-base"
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      min={12}
                      max={120}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-6 sm:ml-7">
                    We use this to provide age-appropriate recommendations
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <Label htmlFor="gender" className="text-sm sm:text-base font-medium">Gender</Label>
                  </div>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                  >
                    <SelectTrigger id="gender" className="focus-ring py-5 sm:py-6 text-sm sm:text-base">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-6 sm:ml-7">
                    Helps us understand demographic patterns in mental health
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <Label htmlFor="occupation" className="text-sm sm:text-base font-medium">Occupation</Label>
                  </div>
                  <Input
                    id="occupation"
                    placeholder="What do you do?"
                    className="focus-ring pl-3 pr-3 py-5 sm:py-6 text-sm sm:text-base"
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-6 sm:ml-7">
                    Different occupations face different mental challenges
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <Label htmlFor="location" className="text-sm sm:text-base font-medium">Location</Label>
                  </div>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    className="focus-ring pl-3 pr-3 py-5 sm:py-6 text-sm sm:text-base"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-6 sm:ml-7">
                    Cultural context can be important for mental wellbeing
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4 pt-3 sm:pt-4">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-5 sm:py-6 text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          Saving Your Information...
                        </>
                      ) : (
                        <>
                          Continue to Assessment
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base"
                  >
                    <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Return to Home
                  </Button>
                </div>
              </form>
            </CardContent>

            <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 sm:p-4 border border-purple-100 dark:border-purple-800">
                <div className="flex gap-2 sm:gap-3">
                  <div className="text-purple-600 dark:text-purple-400 mt-0.5">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-300">Privacy Assured</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                      Your information is secure and will only be used to personalize your experience. We never share your personal data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
} 