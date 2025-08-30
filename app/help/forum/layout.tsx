import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community Forum | MindWell Help Center",
  description: "Connect with others on their mental health journey. Share experiences, ask questions, and support each other."
}

export default function ForumLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 