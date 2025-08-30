import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation | MindWell Help Center",
  description: "Comprehensive guides and documentation to help you get the most out of MindWell."
}

export default function DocumentationLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
} 