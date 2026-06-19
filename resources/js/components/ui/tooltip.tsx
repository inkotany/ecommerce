import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ ...props }, ref) => (
    <div ref={ref} {...props} />
))
TooltipProvider.displayName = "TooltipProvider"

export { TooltipProvider }