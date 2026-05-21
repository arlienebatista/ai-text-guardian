import { useState, useCallback, useRef, useEffect } from "react";
import { GlassCard, GlassCardHeader, CardLabel } from "@/components/GlassCard";
import { StatsPanel } from "@/components/StatsPanel";
import { Legend } from "@/components/Legend";
import { InfoCard } from "@/components/InfoCard";
import { PixDonation } from "@/components/PixDonation";
import { analyzeText, highlightArtifacts, cleanText, escapeHtml } from "@/lib/sanitizer";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Columns, 
  Layers, 
  Type, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Exemplo interativo contendo múltiplos tipos de artefatos de IA
const DEMO_TEXT = `“Olá, mundo!”\u200B Este texto contém artefatos invisíveis gerados por modelos de inteligência artificial.\u200C

Aqui temos um espaço inquebrável\u00A0que quebra layouts e travessões especiais\u2014que alteram a formatação do texto.

Quer testar o guardião\u2212agora mesmo? Cole seu próprio texto ou utilize este exemplo para ver a mágica acontecer! \u2800`;

const Index = () => {
  const [text, setText] = useState("");
  const [showCleaned, setShowCleaned] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copiar Texto Limpo");
  const [isCopied, setIsCopied] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"split" | "tabs">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workspaceMode");
      if (saved === "split" || saved === "tabs") return saved;
    }
    return "split"; // Default split (Lado a Lado)
  });
  const [useMonospace, setUseMonospace] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Controle do Tema Inteligente - Inicializa no Tema Sol por padrão
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return "light"; // Default light (Tema Sol)
    }
    return "light"; // Default light (Tema Sol)
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Efeito para aplicar a classe dark no documento
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Efeito para salvar a preferência do modo de visualização (Lado a Lado ou Abas)
  useEffect(() => {
    localStorage.setItem("workspaceMode", workspaceMode);
  }, [workspaceMode]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Analisa o texto limpo se showCleaned for true, caso contrário analisa o original
  const displayedText = showCleaned ? cleanText(text) : text;
  const { stats, total } = analyzeText(displayedText);
  
  // Se estiver no modo limpo, mostra apenas o texto seguro sem marcações de erro
  const highlighted = text 
    ? (showCleaned ? escapeHtml(cleanText(text)) : highlightArtifacts(text)) 
    : "";

  const handleClean = useCallback(() => {
    setShowCleaned(true);
    toast.success("Texto limpo com sucesso! Veja o resultado na aba de visualização.");
  }, []);

  const handleClear = useCallback(() => {
    setText("");
    setShowCleaned(false);
    setActiveCategory(null);
    toast.info("Texto limpo da área de trabalho");
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setShowCleaned(false); // Volta a mostrar a análise com marcações ao digitar algo novo
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cleanText(text));
      setCopyLabel("Copiado!");
      setIsCopied(true);
      toast.success("Texto limpo copiado para a área de transferência!");
      setTimeout(() => {
        setCopyLabel("Copiar Texto Limpo");
        setIsCopied(false);
      }, 2500);
    } catch {
      toast.error("Erro ao copiar o texto limpo");
    }
  }, [text]);

  const handleLoadDemo = useCallback(() => {
    setText(DEMO_TEXT);
    setShowCleaned(false);
    setActiveCategory(null);
    toast.success("Texto demo carregado! Explore os artefatos destacados.");
  }, []);

  // Determina se o texto possui anomalias de IA
  const isSafeText = total === 0;

  return (
    <div className="min-h-screen pb-12 flex flex-col relative transition-colors duration-300">
      {/* Elementos de fundo brilhantes (Glowing Blobs) */}
      <div className="bg-blobs-container">
        <div className="bg-blob bg-blob-primary" />
        <div className="bg-blob bg-blob-secondary" />
        <div className="bg-blob bg-blob-accent" />
      </div>

      {/* Navbar Premium */}
      <header className="sticky top-0 z-50 w-full bg-background/55 backdrop-blur-md border-b border-border/40 px-4 py-3.5 mb-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className={cn(
              "p-2.5 rounded-xl transition-all duration-500 scale-100 group-hover:scale-105 shadow-sm",
              text === "" 
                ? "bg-primary/10 text-primary" 
                : isSafeText 
                  ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" 
                  : "bg-amber-500/10 text-amber-500 dark:text-amber-400"
            )}>
              {text !== "" && isSafeText ? (
                <ShieldCheck className="w-6 h-6" />
              ) : text !== "" && !isSafeText ? (
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-1.5">
                AI Text Guardian
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  v1.1
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                Limpador inteligente de anomalias invisíveis de IA
              </p>
            </div>
          </div>

          {/* Controles rápidos do cabeçalho */}
          <div className="flex items-center gap-3">
            {text && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 text-xs font-bold transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
            
            {/* Seletor de Tema Animado */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border/40 bg-card hover:bg-muted/40 text-foreground transition-all duration-300 active:scale-90 hover:rotate-12"
              title={theme === "dark" ? "Ativar Modo Claro (Sol)" : "Ativar Modo Escuro (Lua)"}
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto flex-1 w-full px-4 sm:px-6">
        {/* Banner de Apresentação Hero */}
        <section className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
                Higienize seus Textos de Inteligência Artificial
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Detecte e filtre instantaneamente marcações d'água de Unicode, hífens especiais, aspas tipográficas e espaços invisíveis gerados por IAs.
              </p>
            </div>
            <div className="shrink-0 z-10 flex justify-start sm:justify-center">
              <button
                onClick={handleLoadDemo}
                className="flex items-center gap-2 bg-primary text-primary-foreground text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-primary/95 shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 active:scale-95 hover:translate-x-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Carregar Texto Demo</span>
              </button>
            </div>
          </div>
        </section>

        {/* Grade Principal de 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna do Workspace (Esquerda) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Barra de Ferramentas da Área de Trabalho */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 p-2 rounded-2xl border border-border/30 backdrop-blur-sm">
              <div className="flex gap-1 bg-muted/40 p-0.5 rounded-xl border border-border/10">
                <button
                  onClick={() => setWorkspaceMode("split")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95",
                    workspaceMode === "split" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Lado a Lado</span>
                </button>
                <button
                  onClick={() => setWorkspaceMode("tabs")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95",
                    workspaceMode === "tabs" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Abas</span>
                </button>
              </div>

              {/* Botões rápidos de visualização */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseMonospace(!useMonospace)}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-xl border transition-all active:scale-95",
                    useMonospace 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "border-border/40 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  )}
                  title="Alternar Fonte (Sans-serif / Monospace)"
                >
                  <Type className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Renderizador Dinâmico dos Editores baseados no Modo selecionado */}
            {workspaceMode === "split" ? (
              /* MODO LADO A LADO - Responsivo para empilhamento vertical em celulares */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Editor Original */}
                <GlassCard className="flex flex-col h-full">
                  <GlassCardHeader>
                    <CardLabel>📝 Texto Original</CardLabel>
                    <span className="text-[10px] sm:text-xs tabular text-muted-foreground/80 font-mono">
                      {text.length.toLocaleString()} carac.
                    </span>
                  </GlassCardHeader>
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Cole seu texto gerado por IA aqui para iniciar a análise..."
                    className={cn(
                      "w-full h-80 p-4 sm:p-5 text-[15px] sm:text-base leading-relaxed bg-transparent text-card-foreground resize-none outline-none focus:ring-0 rounded-b-xl border-none",
                      useMonospace ? "font-mono" : "font-sans"
                    )}
                  />
                </GlassCard>

                {/* Painel de Análise Visual */}
                <GlassCard className="flex flex-col h-full">
                  <GlassCardHeader>
                    <CardLabel>
                      {showCleaned ? "✨ Resultado Higienizado" : "🔍 Análise Visual"}
                    </CardLabel>
                    {text && (
                      <div className="flex gap-2.5">
                        {!showCleaned && total > 0 && (
                          <button
                            onClick={handleClean}
                            className="text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                          >
                            Limpar Tudo
                          </button>
                        )}
                        <button
                          onClick={handleCopy}
                          className={cn(
                            "text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all uppercase tracking-wider",
                            isCopied ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copyLabel}
                        </button>
                      </div>
                    )}
                  </GlassCardHeader>
                  <div
                    className={cn(
                      "w-full h-80 p-4 sm:p-5 text-[15px] sm:text-base leading-relaxed overflow-y-auto whitespace-pre-wrap break-words border-none rounded-b-xl transition-all duration-300",
                      useMonospace ? "font-mono" : "font-sans",
                      activeCategory ? `isolate-${activeCategory}` : "",
                      text ? "text-foreground" : "text-muted-foreground/50"
                    )}
                    dangerouslySetInnerHTML={{
                      __html: highlighted || '<span class="text-muted-foreground/45 flex items-center justify-center h-full text-center p-6 italic select-none">O texto higienizado aparecerá aqui com os caracteres suspeitos coloridos e listados.</span>',
                    }}
                  />
                </GlassCard>
              </div>
            ) : (
              /* MODO EM ABAS */
              <Tabs defaultValue="original" className="w-full animate-fade-in">
                <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/20 border border-border/30 rounded-2xl h-12 mb-4 backdrop-blur-sm">
                  <TabsTrigger value="original" className="rounded-xl font-bold py-2.5 text-xs tracking-wide">
                    📝 Editor de Origem
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="rounded-xl font-bold py-2.5 text-xs tracking-wide">
                    🔍 Análise Visual
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="original">
                  <GlassCard>
                    <GlassCardHeader>
                      <CardLabel>📝 Texto Original</CardLabel>
                      <span className="text-[10px] sm:text-xs tabular text-muted-foreground font-mono">
                        {text.length.toLocaleString()} caracteres
                      </span>
                    </GlassCardHeader>
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Cole seu texto de IA aqui..."
                      className={cn(
                        "w-full h-96 p-4 sm:p-5 text-[15px] sm:text-base leading-relaxed bg-transparent text-card-foreground resize-none outline-none focus:ring-0 rounded-b-xl border-none",
                        useMonospace ? "font-mono" : "font-sans"
                      )}
                    />
                  </GlassCard>
                </TabsContent>
                
                <TabsContent value="analysis">
                  <GlassCard>
                    <GlassCardHeader>
                      <CardLabel>{showCleaned ? "✨ Resultado Higienizado" : "🔍 Análise Visual"}</CardLabel>
                      {text && (
                        <div className="flex gap-2">
                          {!showCleaned && total > 0 && (
                            <button
                              onClick={handleClean}
                              className="text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                            >
                              Limpar Tudo
                            </button>
                          )}
                          <button
                            onClick={handleCopy}
                            className={cn(
                              "text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all uppercase tracking-wider",
                              isCopied ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copyLabel}
                          </button>
                        </div>
                      )}
                    </GlassCardHeader>
                    <div
                      className={cn(
                        "w-full h-96 p-4 sm:p-5 text-[15px] sm:text-base leading-relaxed overflow-y-auto whitespace-pre-wrap break-words border-none rounded-b-xl",
                        useMonospace ? "font-mono" : "font-sans",
                        activeCategory ? `isolate-${activeCategory}` : "",
                        text ? "text-foreground" : "text-muted-foreground/50"
                      )}
                      dangerouslySetInnerHTML={{
                        __html: highlighted || '<span class="text-muted-foreground/45 flex items-center justify-center h-full text-center p-6 italic select-none">Digite ou cole um texto no Editor de Origem para iniciar...</span>',
                      }}
                    />
                  </GlassCard>
                </TabsContent>
              </Tabs>
            )}

            {/* Caixa de Texto Exemplo Inicial (Se o usuário estiver sem nada digitado) */}
            {!text && (
              <div className="p-6 rounded-2xl border border-dashed border-border/60 bg-muted/10 flex flex-col items-center gap-4 text-center backdrop-blur-sm animate-fade-in">
                <div className="p-3 rounded-full bg-primary/5 text-primary">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Sua área de trabalho está vazia</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                    Cole seu texto copiado do ChatGPT, Claude ou Gemini acima. Ou, se preferir, carregue nosso exemplo interativo para ver o Guardião funcionando.
                  </p>
                </div>
                <button
                  onClick={handleLoadDemo}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl transition-all duration-200 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Carregar Exemplo com Artefatos</span>
                </button>
              </div>
            )}

            {/* Cards Secundários colocados DEBAIXO das caixas de texto (Pix e InfoCard) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Apoio Financeiro / Pix */}
              <PixDonation />
              
              {/* Caixa Informativa */}
              <InfoCard />
            </div>
          </div>

          {/* Coluna da Barra Lateral (Direita) - Focada estritamente em Métricas e Filtros */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Painel de Análise */}
            <StatsPanel stats={stats} total={total} charCount={displayedText.length} />
            
            {/* Botão de Limpeza Rápida Lateral */}
            {text && total > 0 && !showCleaned && (
              <button
                onClick={handleClean}
                className="w-full bg-foreground text-background dark:bg-foreground dark:text-background text-xs sm:text-sm font-bold py-4 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] shadow-md hover:shadow-lg will-change-transform flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                <span>Limpar Caracteres Suspeitos</span>
              </button>
            )}

            {/* Legenda Interativa */}
            <Legend activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
          </aside>
        </div>
      </main>
      
      {/* Rodapé Modernizado */}
      <footer className="max-w-6xl mx-auto mt-16 py-6 text-center text-[11px] sm:text-xs text-muted-foreground/80 border-t border-border/30 w-full px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AI Text Guardian. Todos os direitos reservados.</p>
          <p>
            Desenvolvido com 💚 por{" "}
            <a
              href="https://www.instagram.com/arlienebatista/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline underline-offset-2 transition-all"
            >
              Arliene Batista
            </a>
            . Licença MIT.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
