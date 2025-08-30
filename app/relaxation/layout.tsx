import { Metadata } from "next"
import "./relaxation.css"

export const metadata: Metadata = {
  title: "MindWell Relaxation Zone - Interactive Games for Mental Wellbeing",
  description: "Explore our collection of relaxing games and activities designed to reduce stress and improve mental wellbeing. Discover puzzles, sports games, and more.",
  keywords: ["relaxation games", "mental wellbeing", "stress relief", "mindfulness activities", "puzzle games", "sports games"],
  openGraph: {
    title: "MindWell Relaxation Zone",
    description: "Interactive games and activities for stress relief and mental wellbeing",
    images: ["/Games%20Banner/BubbleTower3dTeaser.jpg"]
  }
}

export default function RelaxationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 