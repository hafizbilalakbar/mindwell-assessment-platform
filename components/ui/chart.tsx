"use client"

import * as React from "react"
import { Tooltip as RechartsTooltip, TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("w-full h-full", className)} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

type ChartTooltipProps = {
  children: (props: TooltipProps<any, any>) => React.ReactNode
}

const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return <RechartsTooltip content={children} />
}

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  ),
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps {
  name: string
  color: string
  value: number
}

const ChartLegendItem = ({ name, color, value }: ChartLegendItemProps) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-sm font-medium">{name}</span>
    <span className="text-sm text-muted-foreground ml-auto">{value}</span>
  </div>
)

export { ChartContainer, ChartTooltip, ChartLegend, ChartLegendItem }
