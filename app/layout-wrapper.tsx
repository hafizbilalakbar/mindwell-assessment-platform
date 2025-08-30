"use client"

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

// Lazy load non-critical providers
const ThemeProvider = dynamic(() => import("@/lib/providers/theme-provider").then(mod => mod.ThemeProvider), {
  loading: () => <div className="min-h-screen bg-white dark:bg-gray-900"></div>
})

const AuthProvider = dynamic(() => import("@/components/auth-provider").then(mod => mod.AuthProvider))

const UserProvider = dynamic(() => import("@/lib/context/user-context").then(mod => mod.UserProvider))

const TranslationProvider = dynamic(() => import("@/components/translation-provider").then(mod => mod.TranslationProvider))

const SafeHydration = dynamic(() => import("@/components/safe-hydration").then(mod => mod.SafeHydration))

const RouteGuard = dynamic(() => import("@/components/route-guard").then(mod => mod.RouteGuard))

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SafeHydration>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <AuthProvider>
            <UserProvider>
              <ThemeProvider>
                <ErrorBoundary>
                  <TranslationProvider>
                    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
                      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>}>
                      <RouteGuard>
                        {children}
                      </RouteGuard>
                    </Suspense>
                    <Toaster />
                  </TranslationProvider>
                </ErrorBoundary>
              </ThemeProvider>
            </UserProvider>
          </AuthProvider>
        </div>
      </div>
    </SafeHydration>
  )
} 