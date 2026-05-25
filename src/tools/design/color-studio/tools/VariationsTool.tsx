import type { PaletteColor } from '../types';
import { makeVariations } from '../utils/color';

export function VariationsTool({ colors, onApplyPalette }: { colors: PaletteColor[]; onApplyPalette: (hexes: string[]) => void }) {
  const rows = colors.map((color) => ({ source: color.hex, variations: makeVariations(color.hex) }));
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">Palette variations</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Explore tonal ramps for each active color and apply a complete variation row.</p>
      <div className="mt-5 space-y-3">{rows.map((row, rowIndex) => <div key={row.source} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-3 dark:border-slate-800 md:grid-cols-[88px_1fr_auto]"><div className="flex items-center text-sm font-black text-slate-950 dark:text-white">Color {rowIndex + 1}</div><div className="grid grid-cols-5 overflow-hidden rounded-2xl">{row.variations.map((hex) => <div key={hex} className="h-16" style={{ background: hex }} title={hex} />)}</div><button type="button" onClick={() => onApplyPalette(row.variations)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-blue-600 hover:text-white dark:bg-slate-950 dark:text-slate-300">Apply</button></div>)}</div>
    </section>
  );
}
