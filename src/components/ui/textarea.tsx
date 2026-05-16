import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-md border border-[var(--border)] bg-[var(--color-input)] px-3 py-2 text-sm",
      "placeholder:text-foreground-tertiary",
      "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-[var(--accent-muted)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
