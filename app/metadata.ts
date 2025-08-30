import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MindWell | Mental Health Assessment",
  description: "MindWell - Mental health assessment for a better you",
  keywords: "mental health, assessment, wellbeing, therapy, anxiety, depression, stress",
  generator: 'v0.dev',
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
} 