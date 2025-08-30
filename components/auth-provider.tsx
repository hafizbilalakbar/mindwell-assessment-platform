"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

// Array of avatar background colors
const AVATAR_COLORS = [
  'bg-purple-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
]

// Get a random avatar color
const getRandomAvatarColor = (): string => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

// List of protected routes
const PROTECTED_ROUTES = [
  '/assessment',
  '/assessment/info',
  '/assessment/report',
  '/profile',
  '/reports',
  '/settings'
]

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  avatarType?: 'initials' | 'image'
  avatarColor?: string
  provider: "email" | "google"
  gender?: string
  age?: number
  occupation?: string
  location?: string
  joined?: string
}

// Define the interface for the user info update
interface UserInfoUpdate {
  gender?: string
  age?: number
  occupation?: string
  location?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  signupWithGoogle: () => Promise<boolean>
  updateUserInfo: (userInfo: Partial<User>) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Function to check if current route is protected
  const isProtectedRoute = (path: string) => {
    return PROTECTED_ROUTES.some(route => path.startsWith(route))
  }

  // Check for existing session and sync across tabs
  useEffect(() => {
    // Listen for storage changes (for multi-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mindwell_user") {
        if (e.newValue) {
          // User logged in in another tab
          try {
            const parsedUser = JSON.parse(e.newValue)
            setUser(parsedUser)
          } catch (error) {
            console.error("Error parsing user data from storage event:", error)
          }
        } else {
          // User logged out in another tab
          setUser(null)
          
          // Redirect to home if on a protected route
          if (isProtectedRoute(pathname)) {
            router.push("/")
          }
        }
      }
    }

    // Load user data from localStorage
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem("mindwell_user")
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          
          // If user has an avatar set to a URL path but doesn't have avatarType, set default
          if (parsedUser.avatar && !parsedUser.avatarType) {
            parsedUser.avatarType = 'image'
          }
          
          // If using the default Google avatar, don't use it as it might not exist
          if (parsedUser.avatar === "/avatars/profile.jpg") {
            // Set avatarType to initials instead and generate a random color
            parsedUser.avatarType = 'initials'
            parsedUser.avatar = undefined
            
            // Set a color if not already set
            if (!parsedUser.avatarColor) {
              parsedUser.avatarColor = getRandomAvatarColor()
            }
          }
          
          setUser(parsedUser)
        } else if (isProtectedRoute(pathname)) {
          // No user found and trying to access protected route
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        // If error loading user data, clear it to prevent future errors
        localStorage.removeItem("mindwell_user")
        
        if (isProtectedRoute(pathname)) {
          router.push("/auth/login")
        }
      } finally {
        setLoading(false)
      }
    }

    // Add storage event listener for cross-tab sync
    window.addEventListener("storage", handleStorageChange)
    
    // Load user data on initial mount
    loadUserData()
    
    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create name from email (before the @ symbol)
      const name = email.split("@")[0].split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');

      // Create a real user with unique ID instead of mock user
      const userData: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name,
        email,
        provider: "email",
        joined: new Date().toLocaleDateString(),
        avatarType: "initials",
        avatarColor: getRandomAvatarColor()
        // Not setting age, gender, occupation, location so user will be prompted
      }

      setUser(userData)
      localStorage.setItem("mindwell_user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a unique user with random details instead of fixed mock user
      const userData: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: "User " + Math.floor(Math.random() * 1000),
        email: `user${Math.floor(Math.random() * 10000)}@gmail.com`,
        avatarType: "initials",
        avatarColor: getRandomAvatarColor(),
        provider: "google",
        joined: new Date().toLocaleDateString()
        // Not setting age, gender, occupation, location so user will be prompted
      }

      setUser(userData)
      localStorage.setItem("mindwell_user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Google login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name,
        email,
        provider: "email",
        joined: new Date().toLocaleDateString(),
        avatarType: "initials",
        avatarColor: getRandomAvatarColor()
        // Not setting age, gender, occupation, location so user will be prompted
      }

      setUser(userData)
      localStorage.setItem("mindwell_user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signupWithGoogle = async (): Promise<boolean> => {
    return loginWithGoogle() // Same implementation for demo
  }

  const updateUserInfo = async (userInfo: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false

      // Create a new user object with updated fields
      const updatedUser = {
        ...user,
        ...userInfo,
        // Make sure we don't lose existing properties
        id: user.id,
        name: userInfo.name || user.name,
        email: userInfo.email || user.email,
        provider: user.provider,
        joined: user.joined,
        // Update demographic information
        age: userInfo.age !== undefined ? userInfo.age : user.age,
        gender: userInfo.gender || user.gender,
        occupation: userInfo.occupation || user.occupation,
        location: userInfo.location || user.location,
        // Avatar information
        avatar: userInfo.avatar !== undefined ? userInfo.avatar : user.avatar,
        avatarType: userInfo.avatarType || user.avatarType,
        avatarColor: userInfo.avatarColor || user.avatarColor,
      }

      // In a real app, this would call an API to update the user profile
      // For demo purposes, we'll just update the local state
      setUser(updatedUser)
      
      // Update the user in localStorage for persistence
      localStorage.setItem("mindwell_user", JSON.stringify(updatedUser))
      
      return true
    } catch (error) {
      console.error("Update user info error:", error)
      return false
    }
  }

  const logout = () => {
    // Clear all user data
    setUser(null);
    
    // Clear all localStorage data related to the user
    localStorage.removeItem("mindwell_user");
    localStorage.removeItem("mindwell_assessment_results");
    
    // Clear any other session data if present
    sessionStorage.removeItem("mindwell_user");
    sessionStorage.removeItem("mindwell_assessment_results");
    
    // Set a flag to indicate we just logged out
    // This helps prevent automatic re-login on page load
    sessionStorage.setItem("just_logged_out", "true");
    
    // Force a page reload to ensure all contexts are reset
    // This is important to prevent contexts from re-reading old data
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        signup,
        signupWithGoogle,
        updateUserInfo,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
