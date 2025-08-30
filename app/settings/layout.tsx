import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings | MindWell",
  description: "Manage your MindWell account settings, preferences, and privacy options."
}

export default function SettingsLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 