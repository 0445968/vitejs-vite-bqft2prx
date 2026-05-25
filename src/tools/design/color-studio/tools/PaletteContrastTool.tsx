import type { PaletteColor } from '../types';
import { contrastRatio, getContrastGrade } from '../utils/color';

export function PaletteContrastTool({ colors }: { colors: PaletteColor[] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">Palette contrast matrix</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Check every palette color against every other palette color.</p>
      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[720px] overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
          <div className="grid" style={{ gridTemplateColumns: `120px repeat(${colors.length}, 1fr)` }}>
            <div className="bg-slate-50 p-3 text-xs font-black uppercase text-slate-500 dark:bg-slate-950">Pair</div>
            {colors.map((color, index) => <div key={color.id} className="bg-slate-50 p-3 text-xs font-black text-slate-500 dark:bg-slate-950">Color {index + 1}</div>)}
            {colors.map((row, rowIndex) => <div key={row.id} className="contents"><div className="border-t border-slate-200 p-3 text-xs font-black dark:border-slate-800">Color {rowIndex + 1}</div>{colors.map((col) => { const ratio = contrastRatio(row.hex, col.hex); return <div key={`${row.id}-${col.id}`} className="border-t border-slate-200 p-3 text-xs font-black dark:border-slate-800"><span>{ratio.toFixed(2)}:1</span><br /><span className={ratio >= 4.5 ? 'text-green-500' : 'text-amber-500'}>{getContrastGrade(ratio)}</span></div>; })}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
