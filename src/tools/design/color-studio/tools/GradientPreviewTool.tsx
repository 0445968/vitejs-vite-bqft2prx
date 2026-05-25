import { Check, Copy } from 'lucide-react';

import type { GradientType, PaletteColor } from '../types';

export function GradientPreviewTool({
  colors,
  gradient,
  gradientType,
  gradientAngle,
  copied,
  onGradientTypeChange,
  onGradientAngleChange,
  onCopyGradient,
}: {
  colors: PaletteColor[];
  gradient: string;
  gradientType: GradientType;
  gradientAngle: number;
  copied: boolean;
  onGradientTypeChange: (type: GradientType) => void;
  onGradientAngleChange: (angle: number) => void;
  onCopyGradient: () => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-5">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Gradient type
            </span>
            <select
              value={gradientType}
              onChange={(event) => onGradientTypeChange(event.target.value as GradientType)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Angle: {gradientAngle}°
            </span>
            <input
              type="range"
              min={0}
              max={360}
              value={gradientAngle}
              onChange={(event) => onGradientAngleChange(Number(event.target.value))}
              className="w-full accent-blue-600"
              disabled={gradientType === 'radial'}
            />
          </label>

          <button
            type="button"
            onClick={onCopyGradient}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied CSS' : 'Copy gradient CSS'}
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-[360px] rounded-[1.7rem] border border-slate-200 dark:border-slate-800" style={{ background: gradient }} />

        <div className="mt-5 grid h-14 overflow-hidden rounded-2xl" style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}>
          {colors.map((color) => (
            <div key={color.id} style={{ background: color.hex }} />
          ))}
        </div>

        <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-50 p-4 text-xs font-bold leading-6 text-slate-950 dark:bg-slate-950 dark:text-white">
          {gradient}
        </pre>
      </section>
    </div>
  );
}
