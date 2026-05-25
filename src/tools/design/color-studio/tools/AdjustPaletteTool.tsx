import type { AdjustmentState, PaletteColor } from '../types';
import { adjustHex } from '../utils/color';

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between"><span className="text-sm font-black text-slate-950 dark:text-white">{label}</span><span className="text-xs font-black text-slate-500">{value}</span></div>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full" />
    </label>
  );
}

export function AdjustPaletteTool({ colors, adjustment, onAdjustmentChange, onApply }: { colors: PaletteColor[]; adjustment: AdjustmentState; onAdjustmentChange: (next: AdjustmentState) => void; onApply: () => void }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Adjust palette</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tune hue, saturation, brightness, and temperature globally.</p>
          <Slider label="Hue" value={adjustment.hue} min={-180} max={180} onChange={(hue) => onAdjustmentChange({ ...adjustment, hue })} />
          <Slider label="Saturation" value={adjustment.saturation} min={-60} max={60} onChange={(saturation) => onAdjustmentChange({ ...adjustment, saturation })} />
          <Slider label="Brightness" value={adjustment.brightness} min={-40} max={40} onChange={(brightness) => onAdjustmentChange({ ...adjustment, brightness })} />
          <Slider label="Temperature" value={adjustment.temperature} min={-100} max={100} onChange={(temperature) => onAdjustmentChange({ ...adjustment, temperature })} />
          <button type="button" onClick={onApply} className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Apply adjustment</button>
        </div>
        <div className="grid gap-4 md:grid-cols-5">{colors.map((color) => { const adjusted = adjustHex(color.hex, adjustment); return <div key={color.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800"><div className="h-40" style={{ background: adjusted }} /><div className="p-4 text-sm font-black text-slate-950 dark:text-white"><p>{adjusted}</p><p className="mt-1 text-xs text-slate-500">from {color.hex}</p></div></div>; })}</div>
      </div>
    </section>
  );
}
