import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mental Health Resources | MindWell Help Center",
  description: "Access articles, guides, and tools to support your mental health journey and wellbeing."
}

export default function ResourcesLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 