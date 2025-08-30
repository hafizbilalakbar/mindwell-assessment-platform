import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assessment Reports | MindWell",
  description: "View and manage your mental health assessment reports and results."
}

export default function ReportsLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 