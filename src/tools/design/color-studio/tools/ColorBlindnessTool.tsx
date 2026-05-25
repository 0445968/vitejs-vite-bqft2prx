import type { ColorBlindnessMode, PaletteColor } from '../types';
import { simulateColorBlindness } from '../utils/color';

const modes: { label: string; value: ColorBlindnessMode }[] = [
  { label: 'Normal vision', value: 'normal' },
  { label: 'Protanopia', value: 'protanopia' },
  { label: 'Deuteranopia', value: 'deuteranopia' },
  { label: 'Tritanopia', value: 'tritanopia' },
  { label: 'Achromatopsia', value: 'achromatopsia' },
];

export function ColorBlindnessTool({ colors, mode, onModeChange }: { colors: PaletteColor[]; mode: ColorBlindnessMode; onModeChange: (mode: ColorBlindnessMode) => void }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Color blindness simulation</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Preview how palette colors may shift for different color vision types.</p>
          <div className="mt-4 space-y-2">{modes.map((item) => <button key={item.value} type="button" onClick={() => onModeChange(item.value)} className={mode === item.value ? 'w-full rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-black text-white' : 'w-full rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-black text-slate-600 hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800'}>{item.label}</button>)}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-5">{colors.map((color) => { const simulated = simulateColorBlindness(color.hex, mode); return <div key={color.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800"><div className="h-36" style={{ background: simulated }} /><div className="p-4 text-sm font-black text-slate-950 dark:text-white"><p>{simulated}</p><p className="mt-1 text-xs text-slate-500 line-through">{color.hex}</p></div></div>; })}</div>
      </div>
    </section>
  );
}
