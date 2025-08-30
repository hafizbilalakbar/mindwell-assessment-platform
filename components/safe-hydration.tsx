"use client"

import React, { useState, useEffect, ReactNode } from 'react';

interface SafeHydrationProps {
  children: ReactNode;
}

export function SafeHydration({ children }: SafeHydrationProps) {
  const [hasMounted, setHasMounted] = useState(false);

  // Wait until component has mounted to render children
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only render children after mounting to avoid hydration errors
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // In development mode, wrap in an error boundary
  return (
    <React.Suspense fallback={null}>
      {children}
    </React.Suspense>
  );
} 