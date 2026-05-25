import { ArrowLeftRight } from 'lucide-react';

import { getContrastGrade } from '../utils/color';

export function ContrastCheckerTool({
  foreground,
  background,
  ratio,
  onForegroundChange,
  onBackgroundChange,
}: {
  foreground: string;
  background: string;
  ratio: number;
  onForegroundChange: (hex: string) => void;
  onBackgroundChange: (hex: string) => void;
}) {
  const swap = () => {
    onForegroundChange(background);
    onBackgroundChange(foreground);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Text color
            </span>
            <input
              type="color"
              value={foreground}
              onChange={(event) => onForegroundChange(event.target.value)}
              className="h-14 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950"
            />
          </label>

          <button
            type="button"
            onClick={swap}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-500/10 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Swap colors
          </button>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Background
            </span>
            <input
              type="color"
              value={background}
              onChange={(event) => onBackgroundChange(event.target.value)}
              className="h-14 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="rounded-[1.7rem] border border-slate-200 p-8 dark:border-slate-800" style={{ color: foreground, background }}>
          <h3 className="text-4xl font-black tracking-tight">Readable heading</h3>
          <p className="mt-3 max-w-xl text-base font-semibold opacity-80">
            Test headings, paragraph text, badges, and buttons against your chosen color pair.
          </p>
          <button type="button" className="mt-6 rounded-2xl px-5 py-3 text-sm font-black" style={{ background: foreground, color: background }}>
            Button preview
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Ratio
            </p>
            <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
              {ratio.toFixed(2)}:1
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Grade
            </p>
            <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
              {getContrastGrade(ratio)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
