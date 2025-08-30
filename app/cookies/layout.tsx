import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy - MindWell",
  description: "Learn how MindWell uses cookies and similar technologies to recognize and remember you when you visit our website.",
}

export default function CookieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 