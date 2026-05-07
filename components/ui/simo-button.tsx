"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const simoButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-display uppercase tracking-tight",
    "border-[3px] rounded-[14px]",
    "transition-[transform,box-shadow,background-color] duration-150 ease-out",
    "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
    "disabled:opacity-50 disabled:pointer-events-none",
    "select-none whitespace-nowrap",
    "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px]",
  ].join(" "),
  {
    variants: {
      variant: {
        // primary — чёрный фон, фокус-кольцо ЖЁЛТОЕ (видно на чёрном)
        primary:
          "bg-black text-[#F4C600] border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#000] focus-visible:outline-[#F4C600]",
        secondary:
          "bg-[#F4C600] text-black border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#000] focus-visible:outline-black",
        // destructive — белый текст, фокус-кольцо БЕЛОЕ (видно на красном)
        destructive:
          "bg-[#E63946] text-white border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#000] focus-visible:outline-white",
        outline:
          "bg-transparent text-black border-black hover:bg-black hover:text-[#F4C600] focus-visible:outline-black",
        ghost:
          "bg-transparent text-black border-transparent hover:bg-black/5 focus-visible:outline-black",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-12 w-12 p-0",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface SimoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof simoButtonVariants> {
  asChild?: boolean;
}

export const SimoButton = React.forwardRef<HTMLButtonElement, SimoButtonProps>(
  ({ className, variant, size, block, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(simoButtonVariants({ variant, size, block }), className)}
        {...props}
      />
    );
  },
);
SimoButton.displayName = "SimoButton";
