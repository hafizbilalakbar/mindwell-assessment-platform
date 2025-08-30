import { Inter, Poppins, Noto_Sans, Noto_Sans_Arabic } from "next/font/google"

// Load Inter font - base Latin font
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
})

// Load Poppins font - used for headings
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
})

// For supporting all scripts, we're using the Noto Sans family
// This helps ensure consistent typography across all languages
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: 'swap',
})

// For RTL languages, load Noto Sans Arabic
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-arabic",
  display: 'swap',
}) 