"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect } from "react"
import { useUser } from "@/lib/context/user-context"

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize with a brief script to prevent flashing
  useEffect(() => {
    // Insert a script to prevent theme flash
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          // On page load, immediately set the theme class on documentElement
          const theme = localStorage.getItem('theme') || 'system';
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const resolvedTheme = theme === 'system' ? systemTheme : theme;
          
          if (resolvedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {
          console.error('Failed to set initial theme', e);
        }
      })();
    `;
    script.id = 'theme-init';
    
    if (!document.getElementById('theme-init')) {
      document.head.appendChild(script);
    }
    
    return () => {
      if (document.getElementById('theme-init')) {
        document.getElementById('theme-init')?.remove();
      }
    };
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeSync>{children}</ThemeSync>
    </NextThemesProvider>
  )
}

// Component to sync theme between user context and next-themes
function ThemeSync({ children }: { children: React.ReactNode }) {
  const { theme: userTheme } = useUser()
  
  // This is only used for initial load from user preferences
  useEffect(() => {
    // We don't need to do anything - next-themes will handle
    // the theme from localStorage directly
  }, [userTheme])
  
  return <>{children}</>
}

// Re-export the next-themes hook for convenience
export { useTheme } from "next-themes" 