"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AssessmentReportRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new report URL
    router.replace("/report")
  }, [router])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Redirecting to your report...</p>
      </div>
    </div>
  )
}
