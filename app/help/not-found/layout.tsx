import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found | MindWell Help Center",
  description: "The page you're looking for doesn't exist or has been moved."
}

export default function NotFoundLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 