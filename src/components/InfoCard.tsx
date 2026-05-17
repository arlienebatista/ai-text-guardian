import { Lightbulb, Info } from "lucide-react";
import { GlassCard } from "./GlassCard";

export function InfoCard() {
  return (
    <GlassCard className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary dark:text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Lightbulb className="w-4 h-4 fill-primary/10" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Por que limpar o texto?
          </h4>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Modelos de Inteligência Artificial (como ChatGPT, Claude e Gemini) frequentemente geram caracteres Unicode especiais imperceptíveis a olho nu.
          </p>
          <div className="flex gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/30">
            <Info className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Caracteres como <strong>ZWSP</strong> (espaços de largura zero), aspas tipográficas curvas ou hífens incomuns podem agir como rastreadores invisíveis ("watermarks") ou quebrar compilações de código e layouts da web.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
