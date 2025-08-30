"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { UserAvatar } from "@/components/user-avatar"
import { UserCircle, Settings, Bell, Shield, ChevronRight, Key, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { user, loading: isLoading, updateUserInfo } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    occupation: "",
    location: "",
    joined: ""
  })

  // Update local state when user data is loaded
  useEffect(() => {
    if (user) {
      // Get the latest user data from localStorage to ensure we have the most recent info
      const savedUserData = localStorage.getItem("mindwell_user");
      const latestUserData = savedUserData ? JSON.parse(savedUserData) : user;
      
      setUpdatedProfile({
        name: latestUserData.name || "",
        email: latestUserData.email || "",
        age: latestUserData.age || "",
        gender: latestUserData.gender || "",
        occupation: latestUserData.occupation || "",
        location: latestUserData.location || "",
        joined: latestUserData.joined || ""
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading your profile...</p>
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

  // Format the gender display properly
  const formatGender = (gender: string | undefined) => {
    if (!gender) return 'Not specified';
    
    // Handle prefer-not-to-say specially
    if (gender === 'prefer-not-to-say') return 'Prefer not to say';
    
    // For other genders, capitalize first letter
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    try {
      // Convert age to number if it's a string
      const profileData = {
        ...updatedProfile,
        age: updatedProfile.age ? Number(updatedProfile.age) : undefined
      };
      
      const success = await updateUserInfo(profileData);
      
      if (success) {
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        toast({
          title: "Update failed",
          description: "There was a problem updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
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
                        <UserAvatar size="xl" interactive />
                        <h2 className="text-xl font-bold mt-4">{user?.name || 'User'}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Member since {user?.joined || 'N/A'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-0">
                      <nav className="flex flex-col">
                        <Button variant="ghost" className="justify-start h-14 px-4 rounded-none border-b bg-gray-100 dark:bg-gray-800" asChild>
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
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Personal Information</CardTitle>
                          <CardDescription>Manage your personal details and account information</CardDescription>
                        </div>
                        {!isEditing ? (
                          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSaveProfile}>Save Changes</Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <form className="space-y-6">
                          <div className="border-b pb-6 mb-6">
                            <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                            <div className="flex flex-col items-center space-y-4">
                              <UserAvatar size="xl" interactive />
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                                Click the camera icon to upload a custom photo or use your initials as avatar.
                                You can also change the background color of your initials avatar.
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input 
                                id="name" 
                                value={updatedProfile.name}
                                onChange={(e) => setUpdatedProfile({...updatedProfile, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input 
                                id="email" 
                                type="email" 
                                value={updatedProfile.email}
                                onChange={(e) => setUpdatedProfile({...updatedProfile, email: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="age">Age</Label>
                              <Input 
                                id="age" 
                                type="number" 
                                value={updatedProfile.age}
                                onChange={(e) => setUpdatedProfile({...updatedProfile, age: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Select 
                                value={updatedProfile.gender}
                                onValueChange={(value) => setUpdatedProfile({...updatedProfile, gender: value})}
                              >
                                <SelectTrigger id="gender">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="non-binary">Non-binary</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="occupation">Occupation</Label>
                              <Input 
                                id="occupation" 
                                value={updatedProfile.occupation}
                                onChange={(e) => setUpdatedProfile({...updatedProfile, occupation: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input 
                                id="location" 
                                value={updatedProfile.location}
                                onChange={(e) => setUpdatedProfile({...updatedProfile, location: e.target.value})}
                              />
                            </div>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                              <p className="mt-1 text-base font-medium">{updatedProfile.name || 'Not specified'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                              <p className="mt-1 text-base font-medium">{updatedProfile.email || 'Not specified'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</h3>
                              <p className="mt-1 text-base font-medium">{updatedProfile.age || 'Not specified'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h3>
                              <p className="mt-1 text-base font-medium">{formatGender(updatedProfile.gender)}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Occupation</h3>
                              <p className="mt-1 text-base font-medium">{updatedProfile.occupation || 'Not specified'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                              <p className="mt-1 text-base font-medium">{updatedProfile.location || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="mt-8">
                    <Tabs defaultValue="notifications">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                      </TabsList>
                      <TabsContent value="notifications" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Manage how you receive notifications and updates</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Assessment Reminders</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Get reminders to complete your mental health assessments</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Daily Wellness Tips</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily tips for improving your mental wellbeing</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Progress Updates</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Get updates on your mental health progress</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Email Notifications</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                                </div>
                                <Switch />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="security" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your account security and privacy</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Change Password</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your password to keep your account secure</p>
                                </div>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <Key className="h-4 w-4" />
                                  <span>Change</span>
                                </Button>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Two-Factor Authentication</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                                </div>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Setup</span>
                                </Button>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Data Privacy</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage how your data is used and stored</p>
                                </div>
                                <Button variant="outline" asChild>
                                  <a href="/privacy">View Privacy Policy</a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
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