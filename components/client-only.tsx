"use client"

import { useState, useEffect, ReactNode } from "react"

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ClientOnly component renders its children only on the client side
 * This helps prevent hydration mismatches with animations and other client-side only features
 * 
 * @param {ReactNode} children - The content to render on the client
 * @param {ReactNode} fallback - Optional fallback content to show during SSR (defaults to null)
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (!hasMounted) {
    return fallback
  }
  
  return children
} 