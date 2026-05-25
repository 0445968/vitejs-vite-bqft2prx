import { Copy } from 'lucide-react';
import type { PaletteColor } from '../types';

export function QuickViewTool({ colors, onCopyColor }: { colors: PaletteColor[]; onCopyColor: (color: PaletteColor) => void }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">Quick view popup</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A compact inspection panel for copying colors and reviewing palette roles.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-5">{colors.map((color, index) => <button key={color.id} type="button" onClick={() => onCopyColor(color)} className="group overflow-hidden rounded-[1.5rem] border border-slate-200 text-left dark:border-slate-800"><div className="h-32" style={{ background: color.hex }} /><div className="flex items-center justify-between p-4"><div><p className="text-sm font-black text-slate-950 dark:text-white">Role {index + 1}</p><p className="text-xs font-bold text-slate-500">{color.hex}</p></div><Copy className="h-4 w-4 text-slate-400 group-hover:text-blue-500" /></div></button>)}</div>
    </section>
  );
}
