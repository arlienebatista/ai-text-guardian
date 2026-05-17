export interface ArtifactType {
  key: string;
  label: string;
  regex: RegExp;
  cssClass: string;
}

export const ARTIFACT_TYPES: ArtifactType[] = [
  { key: 'dash', label: 'Travessões', regex: /[\u2013\u2014\u2E3A]/g, cssClass: 'dash' },
  { key: 'space', label: 'Espaços Especiais', regex: /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, cssClass: 'space' },
  { key: 'invisible', label: 'Invisíveis (ZWSP)', regex: /[\u200B-\u200D\uFEFF]/g, cssClass: 'invisible' },
  { key: 'quote', label: 'Aspas Tipográficas', regex: /[\u201C\u201D\u2018\u2019\u00AB\u00BB\u2039\u203A\u201E\u201A]/g, cssClass: 'quote' },
  { key: 'control', label: 'Controles Direcionais', regex: /[\u200E\u200F\u202A-\u202E]/g, cssClass: 'control' },
  { key: 'functional', label: 'Invisíveis Funcionais', regex: /[\u2061-\u2064]/g, cssClass: 'functional' },
  { key: 'special', label: 'Caracteres Especiais', regex: /[\u2800\u3164]/g, cssClass: 'special' },
  { key: 'hyphen', label: 'Hífens Especiais', regex: /[\u00AD\u2011\u2212]/g, cssClass: 'hyphen' },
  { key: 'alien', label: 'Caracteres Não Padrão', regex: /[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, cssClass: 'special' }
];

export interface ArtifactStats {
  [key: string]: number;
}

export function analyzeText(text: string): { stats: ArtifactStats; total: number } {
  const stats: ArtifactStats = {};
  let total = 0;

  ARTIFACT_TYPES.forEach(({ key, regex }) => {
    const matches = text.match(new RegExp(regex.source, regex.flags)) || [];
    stats[key] = matches.length;
    total += matches.length;
  });

  return { stats, total };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function highlightArtifacts(text: string): string {
  let result = escapeHtml(text);

  ARTIFACT_TYPES.forEach(({ regex, cssClass, label }) => {
    result = result.replace(new RegExp(regex.source, regex.flags), (match) => {
      const code = match.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0') || '';
      const display = match.trim() === '' || /[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E\u2061-\u2064\u2800\u3164\u00AD]/.test(match) 
        ? `U+${code}` 
        : match;
      return `<span class="artifact-highlight artifact-${cssClass}" title="${label} , U+${code}">${display}</span>`;
    });
  });

  return result;
}

export function cleanText(text: string): string {
  let cleaned = text;

  ARTIFACT_TYPES.forEach(({ key, regex }) => {
    if (key === 'quote') {
      // Converte aspas duplas curvas, angulares europeias e inferiores para a aspa do teclado
      cleaned = cleaned.replace(/[\u201C\u201D\u00AB\u00BB\u201E]/g, '"');
      // Converte aspas simples equivalentes para a aspa simples do teclado
      cleaned = cleaned.replace(/[\u2018\u2019\u2039\u203A\u201A]/g, "'");
    } else if (key === 'space') {
      cleaned = cleaned.replace(new RegExp(regex.source, regex.flags), ' ');
    } else if (key === 'dash') {
      cleaned = cleaned.replace(new RegExp(regex.source, regex.flags), ', ');
    } else if (key === 'hyphen') {
      cleaned = cleaned.replace(/[\u00AD]/g, '').replace(/[\u2011]/g, '-').replace(/[\u2212]/g, '-');
    } else {
      cleaned = cleaned.replace(new RegExp(regex.source, regex.flags), '');
    }
  });

  // ETAPA DE POLIMENTO FINAL
  // 1. Remove qualquer espaço residual que tenha ficado ANTES de uma vírgula
  cleaned = cleaned.replace(/\s+,/g, ',');
  
  // 2. Remove espaços duplos ou múltiplos que podem ter sobrado após a limpeza
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  // 3. O trim() final garante que não haja espaços vazios no início ou fim do texto
  return cleaned.trim();
}
