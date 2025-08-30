import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About MindWell - Our Mission & Team",
  description: "Learn about MindWell's mission to make professional mental health assessment and support accessible to everyone through technology.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 