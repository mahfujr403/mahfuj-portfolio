import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/40 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-medium hover:bg-blue-600 active:scale-[0.99] shadow-xs",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30 active:scale-[0.99]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary/60 hover:border-border-active active:scale-[0.99]",
        secondary:
          "bg-secondary/80 text-foreground border border-border hover:bg-secondary hover:border-border-active active:scale-[0.99]",
        ghost:
          "text-muted-foreground hover:bg-secondary/50 hover:text-foreground active:scale-[0.99]",
        link: "text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors",
        cyanGhost:
          "bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 active:scale-[0.99]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 text-sm font-medium has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
