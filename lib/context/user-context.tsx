"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserAssessment = {
  id: string
  title: string
  date: string
  score: number
  change?: number
  category: string
  status?: string
}

export type UserProfile = {
  id: string
  name: string
  email: string
  age: number
  gender: string
  occupation: string
  location: string
  joined: string
  assessments: UserAssessment[]
}

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  deleteAssessment: (id: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  useEffect(() => {
    // Simulate fetching user data from API
    const fetchUser = async () => {
      try {
        // Check if we're coming from a logout
        const justLoggedOut = sessionStorage.getItem("just_logged_out");
        
        if (justLoggedOut) {
          // Don't load user data after logout
          setIsLoading(false);
          return;
        }
        
        // In a real app, this would be an API call
        // For demo purposes, we'll use localStorage or mock data
        const storedUser = localStorage.getItem("mindwell_user")
        
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        // No else block - don't create demo user automatically
        
        // Load theme preference
        const storedTheme = localStorage.getItem("mindwell_theme")
        if (storedTheme) {
          setTheme(storedTheme as "light" | "dark" | "system")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("mindwell_theme", theme)
  }, [theme])

  // Delete an assessment
  const deleteAssessment = (id: string) => {
    if (!user) return
    
    const updatedAssessments = user.assessments.filter(assessment => assessment.id !== id)
    const updatedUser = { ...user, assessments: updatedAssessments }
    
    setUser(updatedUser)
    localStorage.setItem("mindwell_user", JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ user, isLoading, theme, setTheme, deleteAssessment }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
} 