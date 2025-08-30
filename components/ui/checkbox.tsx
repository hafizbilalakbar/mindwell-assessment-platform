"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// Fallback checkbox component when Radix fails
const FallbackCheckbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <div className="relative flex items-center">
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    {checked && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Check className="h-3.5 w-3.5 text-white" />
      </div>
    )}
  </div>
));
FallbackCheckbox.displayName = "FallbackCheckbox";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Safety check for React 19 compatibility
  if (!CheckboxPrimitive.Root) {
    console.warn("CheckboxPrimitive.Root is undefined, using fallback");
    return <FallbackCheckbox ref={ref as any} className={className} {...(props as any)} />;
  }

  try {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
          <Check className="h-3.5 w-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  } catch (e) {
    console.error("Error rendering Checkbox:", e);
    return <FallbackCheckbox ref={ref as any} className={className} {...(props as any)} />;
  }
});

// Safely set displayName
Checkbox.displayName = CheckboxPrimitive.Root?.displayName || "Checkbox";

export { Checkbox }
