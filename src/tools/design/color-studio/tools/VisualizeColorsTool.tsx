import type { PaletteColor } from '../types';

export function VisualizeColorsTool({ colors }: { colors: PaletteColor[] }) {
  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Default preview</span>
            <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">Visualize colors</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">See the palette as a landing page, abstract graphic, and compact brand system.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-slate-950 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-2 text-xs font-black"><span className="h-3 w-3 rounded-full" style={{ background: colors[0]?.hex }} />Design Academy</div>
              <div className="flex gap-2"><span className="rounded-full border px-3 py-1 text-[0.65rem] font-bold">Explore</span><span className="rounded-full px-3 py-1 text-[0.65rem] font-bold" style={{ background: colors[1]?.hex }}>Enroll</span></div>
            </div>
            <div className="grid gap-8 p-6 md:grid-cols-2 md:items-center">
              <div><h4 className="text-4xl font-black leading-none">Unleash your creativity with <span style={{ color: colors[3]?.hex }}>color systems</span></h4><p className="mt-4 text-sm font-semibold text-slate-500">A realistic preview for generated palettes.</p></div>
              <div className="grid h-64 grid-cols-3 gap-3">
                <div className="rounded-full" style={{ background: colors[0]?.hex }} />
                <div className="rotate-45 rounded-2xl" style={{ background: colors[1]?.hex }} />
                <div className="rounded-r-full" style={{ background: colors[2]?.hex }} />
                <div className="rounded-2xl border-8" style={{ borderColor: colors[3]?.hex }} />
                <div className="rounded-full" style={{ background: colors[4]?.hex }} />
                <div className="rounded-b-full" style={{ background: colors[3]?.hex }} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-52 rounded-[1.75rem]" style={{ background: `linear-gradient(135deg, ${colors.map((c) => c.hex).join(', ')})` }} />
            <div className="grid grid-cols-5 overflow-hidden rounded-[1.75rem] border border-slate-200 dark:border-slate-800">{colors.map((color) => <div key={color.id} className="h-24" style={{ background: color.hex }} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
