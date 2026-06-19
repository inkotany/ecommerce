import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                role="switch"
                ref={ref}
                className="sr-only peer"
                {...props}
            />
            <div className={cn(
                "w-11 h-6 bg-input rounded-full peer peer-checked:bg-primary transition-colors",
                className
            )}>
                <div className={cn(
                    "h-5 w-5 bg-background rounded-full shadow-sm mt-0.5 transition-transform translate-x-0.5 peer-checked:translate-x-5"
                )} />
            </div>
        </label>
    )
})
Switch.displayName = "Switch"

export { Switch }