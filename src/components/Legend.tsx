import { ARTIFACT_TYPES } from "@/lib/sanitizer";
import { GlassCard } from "./GlassCard";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  dash: 'bg-[hsl(var(--artifact-dash-bg))] border-[hsl(var(--artifact-dash))] text-[hsl(var(--artifact-dash))]',
  space: 'bg-[hsl(var(--artifact-space-bg))] border-[hsl(var(--artifact-space))] text-[hsl(var(--artifact-space))]',
  invisible: 'bg-[hsl(var(--artifact-invisible-bg))] border-[hsl(var(--artifact-invisible))] text-[hsl(var(--artifact-invisible))]',
  quote: 'bg-[hsl(var(--artifact-quote-bg))] border-[hsl(var(--artifact-quote))] text-[hsl(var(--artifact-quote))]',
  control: 'bg-[hsl(var(--artifact-control-bg))] border-[hsl(var(--artifact-control))] text-[hsl(var(--artifact-control))]',
  functional: 'bg-[hsl(var(--artifact-functional-bg))] border-[hsl(var(--artifact-functional))] text-[hsl(var(--artifact-functional))]',
  special: 'bg-[hsl(var(--artifact-special-bg))] border-[hsl(var(--artifact-special))] text-[hsl(var(--artifact-special))]',
  hyphen: 'bg-[hsl(var(--artifact-hyphen-bg))] border-[hsl(var(--artifact-hyphen))] text-[hsl(var(--artifact-hyphen))]',
};

interface LegendProps {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function Legend({ activeCategory, onSelectCategory }: LegendProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="text-sm font-semibold text-foreground">Legenda Interativa</h3>
        {activeCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
          >
            Limpar Filtro
          </button>
        )}
      </div>
      
      <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
        Clique em uma categoria abaixo para isolá-la e destacá-la no texto de análise.
      </p>

      <div className="grid grid-cols-1 gap-1.5">
        {ARTIFACT_TYPES.map(({ key, label }) => {
          const isActive = activeCategory === key;
          const isAnyActive = activeCategory !== null;
          
          return (
            <button
              key={key}
              onClick={() => onSelectCategory(isActive ? null : key)}
              className={cn(
                "flex items-center justify-between w-full p-2 rounded-lg border text-left transition-all duration-200",
                isActive 
                  ? "bg-primary/5 border-primary/20 shadow-sm translate-x-1" 
                  : isAnyActive 
                    ? "opacity-45 border-transparent hover:opacity-75"
                    : "border-transparent hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn("w-3.5 h-3.5 rounded-sm border-2 shrink-0 transition-transform duration-200", colorMap[key], isActive && "scale-110")} />
                <span className={cn("text-xs transition-colors", isActive ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
              
              <div className="shrink-0 text-muted-foreground/60 transition-opacity">
                {isActive ? (
                  <Eye className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
