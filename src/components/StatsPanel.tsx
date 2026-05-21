import { ARTIFACT_TYPES, ArtifactStats } from "@/lib/sanitizer";
import { GlassCard } from "./GlassCard";
import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsPanelProps {
  stats: ArtifactStats;
  total: number;
  charCount: number;
}

export function StatsPanel({ stats, total, charCount }: StatsPanelProps) {
  // Calcula o Índice de Pureza (0% a 100%)
  const cleanliness = charCount > 0 
    ? Math.max(0, Math.min(100, Math.round(((charCount - total) / charCount) * 1000) / 10))
    : 100;

  // Determina o status de saúde do texto
  const getStatus = () => {
    if (charCount === 0) return { label: "Aguardando Texto", color: "text-muted-foreground", bg: "bg-muted/30", icon: Sparkles };
    if (total === 0) return { label: "Texto 100% Seguro", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: ShieldCheck };
    if (cleanliness >= 98) return { label: "Muito Limpo", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: ShieldCheck };
    return { label: "Contém Anomalias", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // Determina a cor da barra de progresso
  const getProgressColor = () => {
    if (cleanliness >= 98) return "bg-emerald-500 dark:bg-emerald-400";
    if (cleanliness >= 90) return "bg-amber-500 dark:bg-amber-400";
    return "bg-destructive";
  };

  return (
    <GlassCard className="p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Painel de Estatísticas</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Métricas de qualidade e integridade do seu texto em tempo real.
        </p>
      </div>

      {/* Indicador do Índice de Pureza */}
      <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            Índice de Pureza
          </span>
          <span className={`text-base font-bold font-mono ${status.color}`}>
            {cleanliness}%
          </span>
        </div>
        
        <Progress 
          value={cleanliness} 
          className="h-2 bg-muted-foreground/10" 
          indicatorClassName={getProgressColor()}
        />

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${status.color} ${status.bg} w-fit`}>
          <StatusIcon className="w-3 h-3 shrink-0" />
          <span>{status.label.toUpperCase()}</span>
        </div>
      </div>

      {/* Linhas de Dados */}
      <div className="space-y-0.5">
        <StatRow 
          label="Total de caracteres" 
          value={charCount} 
          highlight={false} 
        />
        <StatRow 
          label="Artefatos encontrados" 
          value={total} 
          highlight={total > 0}
          negative={total > 0}
        />
        
        {total > 0 && (
          <div className="mt-2.5 pt-2 border-t border-border/30 space-y-0.5">
            {ARTIFACT_TYPES.map(({ key, label }) => {
              const count = stats[key] || 0;
              if (count === 0) return null;
              return (
                <StatRow 
                  key={key} 
                  label={label} 
                  value={count} 
                  highlight={false} 
                  isSubRow
                />
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function StatRow({ label, value, highlight, negative, isSubRow }: { 
  label: string; 
  value: number; 
  highlight: boolean;
  negative?: boolean;
  isSubRow?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-border/30 last:border-b-0 ${
      isSubRow ? "pl-2.5" : ""
    }`}>
      <span className={`text-sm ${
        highlight 
          ? 'font-semibold text-foreground' 
          : isSubRow 
            ? 'text-muted-foreground/80 before:content-["•"] before:mr-1.5 before:text-muted-foreground/45' 
            : 'text-muted-foreground'
      }`}>
        {label}
      </span>
      <span className={`text-sm font-mono font-semibold tabular ${
        negative ? 'text-destructive' : highlight ? 'text-foreground' : 'text-muted-foreground'
      }`}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}
