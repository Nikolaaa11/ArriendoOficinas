import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] p-12 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-background-surface p-3">
        <Icon className="size-6 text-foreground-secondary" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-foreground-secondary max-w-sm">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
