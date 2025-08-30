import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - MindWell",
  description: "Get in touch with our mental health professionals. We're here to help you on your journey to better mental wellbeing.",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 