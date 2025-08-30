"use client"

import { useState, useEffect } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogPortal, 
  DialogOverlay,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"

interface AssessmentLoaderProps {
  open: boolean
  onComplete: () => void
  assessmentData?: {
    totalScore: number;
    percentage: number;
    answers: any[];
    timestamp: string;
    needsSupport: boolean;
    stress?: number;
    anxiety?: number;
    depression?: number;
  } | null;
}

// Easing function for smoother animation
const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};

// Custom CSS for loader animations
const loaderAnimations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.6; filter: blur(3px); }
    50% { opacity: 1; filter: blur(5px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-3px) rotate(5deg); }
    75% { transform: translateY(3px) rotate(-5deg); }
  }

  @keyframes progress-slide {
    0% { width: 0%; }
    10% { width: 10%; }
    30% { width: 30%; }
    60% { width: 60%; }
    75% { width: 75%; }
    90% { width: 90%; }
    100% { width: 100%; }
  }

  .spinner-outer-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid rgba(124, 58, 237, 0.1);
    border-top-color: rgba(124, 58, 237, 0.8);
    animation: spin 1.5s linear infinite;
  }

  .spinner-inner-ring {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 3px dashed rgba(124, 58, 237, 0.5);
    border-right-color: rgba(124, 58, 237, 0.1);
    animation: spin 3s ease-in-out infinite reverse;
  }

  .glow-effect {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(124, 58, 237, 0) 70%);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .sparkle-icon {
    animation: float 3s ease-in-out infinite;
  }

  .progress-animate {
    animation: progress-slide 5s ease-out forwards;
  }
`;

export function AssessmentLoader({ open, onComplete, assessmentData }: AssessmentLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your responses...')
  const [dataSaved, setDataSaved] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Handle the assessment data storage and progress animation
  useEffect(() => {
    if (!open) {
      // Reset states when loader is closed
      setProgress(0);
      setLoadingMessage('Analyzing your responses...');
      setDataSaved(false);
      setIsInitialized(false);
      return;
    }
    
    // Make sure we only initialize the animation once per open session
    if (isInitialized) return;
    setIsInitialized(true);
    
    // Store assessment data in localStorage if available
    if (assessmentData) {
      try {
        console.log("AssessmentLoader: Storing assessment data in localStorage", assessmentData);
        
        // First, clear any old assessment results
        localStorage.removeItem("mindwell_assessment_results");
        
        // Then store the new data in both localStorage and sessionStorage as backup
        localStorage.setItem("mindwell_assessment_results", JSON.stringify(assessmentData));
        sessionStorage.setItem("mindwell_assessment_results", JSON.stringify(assessmentData));
        
        // Verify the data was stored correctly
        const storedData = localStorage.getItem("mindwell_assessment_results");
        if (!storedData) {
          console.error("Failed to store assessment results in localStorage");
        } else {
          console.log("Successfully stored assessment results in localStorage");
          setDataSaved(true);
        }
      } catch (error) {
        console.error("Error saving assessment results in loader:", error);
        
        // Try sessionStorage as backup
        try {
          sessionStorage.setItem("mindwell_assessment_results", JSON.stringify(assessmentData));
          setDataSaved(true);
        } catch (e) {
          console.error("Failed to store in sessionStorage too:", e);
        }
      }
    }
    
    // Animation sequence - more detailed and smoother
    let step = 1;
    let animationFrame: number;
    let startTime: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Total animation duration: 5 seconds (increased for smoother experience)
      const totalDuration = 5000;
      
      // Create a non-linear animation curve for more natural progress feel
      const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Set the visible progress with a smoother curve
      setProgress(easeOutQuad(progressPercentage));
      
      // Update loading messages at specific points
      if (progressPercentage > 20 && step === 1) {
        setLoadingMessage('Calculating mental wellness scores...');
        step = 2;
      } else if (progressPercentage > 40 && step === 2) {
        setLoadingMessage('Generating personalized insights...');
        step = 3;
      } else if (progressPercentage > 60 && step === 3) {
        setLoadingMessage('Preparing your report...');
        step = 4;
      } else if (progressPercentage > 85 && step === 4) {
        setLoadingMessage('Almost ready...');
        step = 5;
      }
      
      // Continue animation if not complete
      if (progressPercentage < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Final verification and completion
        finishAndTransition();
      }
    };
    
    // Function to handle final verification and transition
    const finishAndTransition = () => {
      console.log("Assessment loader animation complete, checking data...");
      
      // Ensure data is saved before completing
      const ensureDataSaved = () => {
        // Double check localStorage has the data
        const storedData = localStorage.getItem("mindwell_assessment_results");
        if (storedData) {
          console.log("Data verified in localStorage, proceeding to report page");
          return true;
        }
        
        // Check sessionStorage as backup
        const sessionData = sessionStorage.getItem("mindwell_assessment_results");
        if (sessionData) {
          console.log("Data found in sessionStorage, copying to localStorage");
          localStorage.setItem("mindwell_assessment_results", sessionData);
          return true;
        }
        
        // Last resort: try to save again directly from props
        if (assessmentData) {
          console.log("Final attempt to save assessment data");
          try {
            localStorage.setItem("mindwell_assessment_results", JSON.stringify(assessmentData));
            return true;
          } catch (e) {
            console.error("Final save attempt failed:", e);
            return false;
          }
        }
        
        return false;
      };
      
      // If data is already marked as saved or we can save it now
      if (dataSaved || ensureDataSaved()) {
        // Add a small delay before calling onComplete for a smoother transition
        setTimeout(() => {
          console.log("Transitioning to report page now");
          onComplete();
        }, 500);
      } else {
        console.error("Unable to save assessment data, proceeding anyway");
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };
    
    // Start the animation
    animationFrame = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [open, assessmentData, onComplete, dataSaved, isInitialized]);
  
  if (!open) return null;
  
  return (
    <>
      <style jsx global>{loaderAnimations}</style>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogPortal>
          <DialogOverlay className="bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 p-8 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-xl border border-purple-100 dark:border-purple-900">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                Processing Assessment
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Outer spinning ring */}
                <div className="spinner-outer-ring">
                  <div className="glow-effect"></div>
                </div>
                
                {/* Inner spinning ring (opposite direction) */}
                <div className="spinner-inner-ring"></div>
                
                {/* Center loader icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                
                {/* Decorative sparkles */}
                <div className="absolute -right-2 -top-2">
                  <Sparkles className="h-5 w-5 text-purple-500 sparkle-icon" />
                </div>
                <div className="absolute -left-1 bottom-1">
                  <Sparkles className="h-4 w-4 text-indigo-400 sparkle-icon" style={{ animationDelay: '1s' }} />
                </div>
              </div>
              
              <div className="space-y-4 text-center w-full">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {loadingMessage}
                </h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Please wait while we prepare your mental wellness report
                </p>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
} 