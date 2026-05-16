import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-muted text-accent",
        outline: "border-[var(--border)] text-foreground",
        gold: "border-transparent bg-[var(--gold-muted)] text-[var(--gold)]",
        success:
          "border-transparent bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]",
        warning:
          "border-transparent bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[var(--warning)]",
        danger:
          "border-transparent bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-[var(--danger)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
