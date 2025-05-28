import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/core/utils/tailwind.util"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        //
        primary:
          "btn-shine bg-gradient-to-b from-purple-300 to-pink-300 text-white shadow-xs hover:from-purple-400 hover:to-pink-400 ",
        secondary:
          "btn-shine bg-gradient-to-r from-green-500 to-blue-500  text-white shadow-xs hover:from-green-400 hover:to-blue-400 ",
        danger:
          "btn-shine bg-gradient-to-r from-red-500 to-orange-500  text-white shadow-xs hover:from-red-600 hover:to-orange-600 ",
        warning:
          "btn-shine bg-gradient-to-r from-yellow-300 to-orange-300  text-white shadow-xs hover:from-yellow-400 hover:to-orange-400 ",
        success:
          "btn-shine bg-gradient-to-r from-green-300 to-blue-300  text-white shadow-xs hover:from-green-400 hover:to-blue-400 ",
        info: "btn-shine bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-xs hover:from-sky-500 hover:to-blue-600",
        neutral:
          "btn-shine bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-xs hover:from-gray-500 hover:to-gray-700",
        dark: "btn-shine bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xs hover:from-gray-900 hover:to-black",
        light:
          "btn-shine bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800 shadow-xs hover:from-gray-200 hover:to-gray-400",
        violet:
          "btn-shine bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-xs hover:from-violet-500 hover:to-fuchsia-600",
        pink: "btn-shine bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-xs hover:from-pink-500 hover:to-rose-600",
        cyan: "btn-shine bg-gradient-to-r from-cyan-400 to-teal-400 text-white shadow-xs hover:from-cyan-500 hover:to-teal-500",
        orange:
          "btn-shine bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-xs hover:from-orange-500 hover:to-amber-600",
        teal: "btn-shine bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-xs hover:from-teal-500 hover:to-emerald-600",
        indigo:
          "btn-shine bg-gradient-to-r from-indigo-400 to-blue-700 text-white shadow-xs hover:from-indigo-500 hover:to-blue-800",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
