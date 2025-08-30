import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Profile | MindWell",
  description: "View and manage your MindWell profile, personal information, and account settings."
}

export default function ProfileLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 