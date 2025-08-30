import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-100 dark:border-purple-900 shadow-xl text-center">
        <div className="relative mb-4">
          <div className="assessment-spinner flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Preparing Your Mental Wellness Report
        </h3>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full animate-loading"
          />
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we generate your personalized mental wellness assessment...
        </p>
      </div>
    </div>
  )
}
