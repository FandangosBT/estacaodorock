"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const grungeButtonVariants = cva(
  "relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 overflow-hidden",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-br from-blood via-blood to-red-800",
          "text-dirtywhite",
          "border-2 border-blood",
          "shadow-[0_0_20px_rgba(255,42,42,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.3)]",
          "hover:shadow-[0_0_30px_rgba(255,42,42,0.5),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        ],
        secondary: [
          "bg-gradient-to-br from-burnt via-burnt to-yellow-700",
          "text-background",
          "border-2 border-burnt",
          "shadow-[0_0_20px_rgba(255,189,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.3)]",
          "hover:shadow-[0_0_30px_rgba(255,189,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        ],
        dark: [
          "bg-gradient-to-br from-metalgray via-gray-900 to-background",
          "text-dirtywhite",
          "border-2 border-metalgray",
          "shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.5)]",
          "hover:shadow-[0_0_30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.6)]",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        ],
        outline: [
          "bg-transparent",
          "text-dirtywhite",
          "border-2 border-dirtywhite",
          "shadow-[0_0_20px_rgba(240,240,240,0.2),inset_0_0_20px_rgba(240,240,240,0.05)]",
          "hover:bg-dirtywhite/10",
          "hover:shadow-[0_0_30px_rgba(240,240,240,0.4),inset_0_0_30px_rgba(240,240,240,0.1)]",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        ]
      },
      size: {
        sm: "px-4 py-2 text-sm h-9",
        default: "px-6 py-3 text-base h-11",
        lg: "px-8 py-4 text-lg h-14",
        xl: "px-10 py-5 text-xl h-16"
      },
      shape: {
        default: "rounded-none",
        rounded: "rounded-md",
        pill: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      shape: "default"
    }
  }
)

const grungeTextVariants = cva(
  "relative z-10 font-black text-shadow-sm",
  {
    variants: {
      variant: {
        primary: "drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]",
        secondary: "drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)]",
        dark: "drop-shadow-[2px_2px_4px_rgba(0,0,0,0.9)]",
        outline: "drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
)

export interface GrungeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof grungeButtonVariants> {
  asChild?: boolean
}

const GrungeButton = React.forwardRef<HTMLButtonElement, GrungeButtonProps>(
  ({ className, variant, size, shape, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(grungeButtonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCIvPgo8L3N2Zz4K')] bg-repeat"></div>
        </div>
        
        {/* Scratches and distress marks */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 left-2 w-8 h-0.5 bg-black/40 rotate-12"></div>
          <div className="absolute bottom-2 right-3 w-6 h-0.5 bg-black/30 -rotate-6"></div>
          <div className="absolute top-1/2 left-1 w-4 h-0.5 bg-white/20 rotate-45"></div>
        </div>
        
        {/* Content */}
        <span className={cn(grungeTextVariants({ variant }))}>
          {children}
        </span>
      </Comp>
    )
  }
)

GrungeButton.displayName = "GrungeButton"

export { GrungeButton, grungeButtonVariants }