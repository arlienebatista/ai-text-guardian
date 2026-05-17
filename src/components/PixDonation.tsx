import { useState } from "react";
import { toast } from "sonner";
import { Heart, Copy, Check, Gift } from "lucide-react";
import { GlassCard } from "./GlassCard";

const PIX_KEY = "bc80575b-5817-43ac-9c3a-413bbb3e6d7b";

export function PixDonation() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      toast.success("Chave Pix copiada com sucesso!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar chave Pix");
    }
  };

  return (
    <GlassCard className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/10 dark:from-emerald-500/10 dark:to-teal-500/5">
      <div className="p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <Heart className="w-4 h-4 fill-emerald-500/20" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              Apoie o Projeto
            </h4>
            <span className="text-[10px] text-muted-foreground">Contribua com a manutenção</span>
          </div>
        </div>

        {/* Text */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          O <strong>IA Text Guardian</strong> é gratuito e open source. Se ele foi útil para você, faça uma doação de qualquer valor via Pix para ajudar a cobrir custos de hospedagem!
        </p>

        {/* Copy Box */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-1">
            Chave Pix (Copia e Cola)
          </span>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 bg-muted/30 dark:bg-card/40 border border-border/40 px-3 py-2.5 rounded-xl flex items-center">
              <code className="text-xs text-foreground/90 font-mono truncate w-full">
                {PIX_KEY}
              </code>
            </div>
            
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-300 active:scale-95 ${
                copied 
                  ? "bg-emerald-500 text-white shadow-emerald-500/10" 
                  : "bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-primary/10"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
