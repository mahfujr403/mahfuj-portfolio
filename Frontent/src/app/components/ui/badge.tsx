import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] border px-2 py-0.5 text-xs font-sans font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-primary focus-visible:ring-primary/40 focus-visible:ring-[2px] transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-border bg-secondary/80 text-foreground [a&]:hover:bg-secondary",
        secondary:
          "border-border-subtle bg-secondary/40 text-muted-foreground [a&]:hover:text-foreground",
        outline:
          "border-border text-foreground [a&]:hover:bg-secondary/60 [a&]:hover:border-border-active",
        primary:
          "border-primary/30 bg-primary/10 text-primary [a&]:hover:bg-primary/20",
        emerald:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 [a&]:hover:bg-emerald-500/20",
        indigo:
          "border-indigo-500/25 bg-indigo-500/10 text-indigo-300 [a&]:hover:bg-indigo-500/20",
        amber:
          "border-amber-500/25 bg-amber-500/10 text-amber-300 [a&]:hover:bg-amber-500/20",
        destructive:
          "border-destructive/25 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
