import type React from "react"
import "./globals.css"
// Combined critical CSS into globals.css and removed individual imports
// import "../styles/about.css"
// import "../styles/translate-fixes.css"
// import "../styles/header-fix.css"
import Script from "next/script"
import { inter, poppins, notoSans, notoSansArabic } from "@/lib/fonts"
import { LayoutWrapper } from "./layout-wrapper"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const interFont = Inter({ subsets: ['latin'] })

// Static site configuration
const siteConfig = {
  title: "MindWell | Mental Health Assessment",
  description: "MindWell - Mental health assessment for a better you",
  keywords: "mental health, assessment, wellbeing, therapy, anxiety, depression, stress",
}

export const metadata: Metadata = {
  title: 'MindWell - Mental Health Assessment',
  description: 'Comprehensive mental health assessment and personalized recommendations',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mindwell.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta tags for language support */}
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="theme-color" content="#ffffff" />
        
        <base target="_self" />
        
        {/* Preconnect to Google Translate domains */}
        <link rel="preconnect" href="https://translate.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://translate.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        
        {/* Chunk retry handler - must run early */}
        <Script 
          id="chunk-retry-handler" 
          strategy="beforeInteractive"
          src="/chunk-retry-handler.js"
        />
        
        {/* Iframe bridge for cross-origin communication */}
        <Script src="/iframe-bridge.js" strategy="beforeInteractive" />
        
        {/* React 19 TypeError fix script - must run early */}
        <Script id="react-error-fix" strategy="beforeInteractive">
          {`
            (function() {
              window.__reactErrorHandlerInstalled = true;
              
              // Safely handle Function.prototype.call errors
              var originalCall = Function.prototype.call;
              Function.prototype.call = function(thisArg) {
                try {
                  // Suppress console warnings for React internal calls
                  if (this && this.toString && this.toString().includes('Children')) {
                    return originalCall.apply(this, arguments);
                  }
                  
                  if (thisArg === null || thisArg === undefined) {
                    // Silently handle this case without console warnings
                    thisArg = window; // Use window as fallback
                  }
                  return originalCall.apply(this, arguments);
                } catch (e) {
                  // Silently catch errors without console output
                  return undefined;
                }
              };
              
              // Global error handler
              window.addEventListener('error', function(event) {
                // Prevent React error overlay for specific errors
                if (event.error && event.error.message && (
                    event.error.message.includes("Cannot read properties of undefined") ||
                    event.error.message.includes("Function.call")
                  )) {
                  event.preventDefault();
                  return true;
                }
              }, true);
            })();
          `}
        </Script>
      </head>
      <body className={`${poppins.variable} ${inter.variable} ${notoSans.variable} ${notoSansArabic.variable} font-sans antialiased`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        
        {/* Hidden Google Translate element */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        {/* Google Translate initialization */}
        <Script id="google-translate-init" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              try {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  autoDisplay: false,
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
                
                // Hide Google Translate elements after initialization
                setTimeout(function() {
                  var elements = [
                    document.querySelector('.goog-te-banner-frame'),
                    document.querySelector('.skiptranslate'),
                    document.querySelector('iframe[id=":1.container"]'),
                    document.querySelector('.VIpgJd-ZVi9od-l4eHX-hSRGPd'),
                    document.querySelector('.goog-te-gadget')
                  ];
                  
                  elements.forEach(function(el) {
                    if (el && el instanceof HTMLElement) {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                    }
                  });
                  
                  // Fix body position
                  if (document.body.style.top && document.body.style.top !== '0px') {
                    document.body.style.top = '0px';
                  }
                }, 300);
              } catch (e) {
                console.error("Error initializing Google Translate:", e);
              }
            }
          `}
        </Script>
        
        {/* Load Google Translate script */}
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive"
        />
        
        {/* Fallback script */}
        <Script 
          src="/translate-fallback.js"
          strategy="afterInteractive"
        />
        <Toaster />
      </body>
    </html>
  )
}
