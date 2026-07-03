const HSL_PATTERN = /hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i;

function parseHsl(colorHsl: string): { h: number; s: number; l: number } | null {
  const match = colorHsl.match(HSL_PATTERN);
  if (!match) return null;
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

const FALLBACK_COLOR = "hsl(0, 0%, 90%)";

export function stageBackgroundColor(colorHsl: string | undefined): string {
  return colorHsl ?? FALLBACK_COLOR;
}

// A visibly darker shade of the same hue, used for selection borders since the
// official stage colors are all very light pastels.
export function stageBorderColor(colorHsl: string | undefined): string {
  const parsed = parseHsl(colorHsl ?? FALLBACK_COLOR);
  if (!parsed) return "#999999";
  const l = Math.max(parsed.l - 35, 15);
  return `hsl(${parsed.h}, ${parsed.s}%, ${l}%)`;
}
