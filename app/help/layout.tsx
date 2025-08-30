import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center - MindWell",
  description: "Find answers to common questions, browse documentation, or contact our support team for assistance with MindWell.",
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 