import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("glass-card overflow-hidden relative transition-all duration-300 ease-out hover:-translate-y-[2px]", className)}>
      {children}
    </div>
  );
}

export function GlassCardHeader({ children, className }: GlassCardProps) {
  return (
    <div className={cn("px-5 py-3.5 border-b border-border/40 flex justify-between items-center bg-muted/20 backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
      {children}
    </span>
  );
}
