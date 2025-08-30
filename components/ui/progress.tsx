import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Make sure value is always a number or undefined
  const safeValue = typeof value === 'number' ? value : undefined;
  
  try {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - (safeValue || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  } catch (error) {
    console.error("Error rendering Progress component:", error);
    // Return a fallback div with similar styling
    return (
      <div 
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div 
          className="h-full bg-primary transition-all"
          style={{ width: `${safeValue || 0}%` }}
        />
      </div>
    )
  }
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
