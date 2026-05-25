import { RefreshCw } from 'lucide-react';
import type { HarmonyMode, StudioTool } from '../types';

export function StudioHeader({
  tool,
  harmonyMode,
  baseColor,
  onHarmonyModeChange,
  onBaseColorChange,
  onGeneratePalette,
}: {
  tool: StudioTool;
  harmonyMode: HarmonyMode;
  baseColor: string;
  onHarmonyModeChange: (mode: HarmonyMode) => void;
  onBaseColorChange: (hex: string) => void;
  onGeneratePalette: () => void;
}) {
  const Icon = tool.icon;

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 sm:flex">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Color Studio
              </span>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                {tool.eyebrow}
              </span>
            </div>

            <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {tool.name === 'Generator' ? 'Palette Generator' : tool.name}
            </h2>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/80 sm:w-auto sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="studio-harmony-mode">
            Harmony mode
          </label>
          <select
            id="studio-harmony-mode"
            value={harmonyMode}
            onChange={(event) =>
              onHarmonyModeChange(event.target.value as HarmonyMode)
            }
            className="h-10 min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            aria-label="Harmony mode"
          >
            <option value="random">Random</option>
            <option value="analogous">Analogous</option>
            <option value="monochrome">Monochrome</option>
            <option value="triadic">Triadic</option>
            <option value="complementary">Complementary</option>
          </select>

          <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-slate-950">
            <span className="sr-only">Base color</span>
            <input
              type="color"
              value={baseColor}
              onChange={(event) => onBaseColorChange(event.target.value)}
              className="h-7 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              aria-label="Base color"
            />
            <span className="min-w-[72px] text-xs font-black text-slate-950 dark:text-white">
              {baseColor.toUpperCase()}
            </span>
          </label>

          <button
            type="button"
            onClick={onGeneratePalette}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
