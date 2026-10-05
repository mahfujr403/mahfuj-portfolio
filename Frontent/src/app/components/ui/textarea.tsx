import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border border-input bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal transition-all duration-150 outline-none resize-y",
        "focus-visible:border-primary/60 focus-visible:ring-primary/20 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
