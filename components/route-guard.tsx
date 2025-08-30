"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

// List of routes that require authentication
const PROTECTED_ROUTES = [
  '/assessment',
  '/assessment/info',
  '/assessment/report',
  '/profile',
  '/reports',
  '/settings'
]

// List of routes that should be accessible only for non-authenticated users
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/signup'
]

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip route guard on initial loading
    if (loading) return

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.some(route => pathname === route)

    if (isProtectedRoute && !user) {
      // Redirect to login if trying to access protected route without being logged in
      router.push('/auth/login')
    } else if (isAuthRoute && user) {
      // Redirect to home if trying to access auth routes while logged in
      router.push('/')
    }
  }, [user, loading, pathname, router])

  // Show loading or the children content
  return loading ? (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
    </div>
  ) : (
    <>{children}</>
  )
} 