import type { ExportFormat, PaletteColor } from '../types';

export const buildExportText = (colors: PaletteColor[], format: ExportFormat) => {
  const hexes = colors.map((color) => color.hex);
  if (format === 'json') return JSON.stringify({ palette: hexes }, null, 2);
  if (format === 'tailwind') return `colors: {\n${hexes.map((hex, index) => `  brand${index + 1}: '${hex}',`).join('\n')}\n}`;
  return `:root {\n${hexes.map((hex, index) => `  --color-brand-${index + 1}: ${hex};`).join('\n')}\n}`;
};

export const copyToClipboard = (value: string) => navigator.clipboard.writeText(value);

export const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
