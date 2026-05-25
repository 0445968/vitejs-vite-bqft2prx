import { RefreshCw, ChevronDown } from 'lucide-react';
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
    <header className="shrink-0 bg-white px-4 py-4 dark:bg-slate-950 sm:px-6 lg:px-8">
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

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {/* Modern Select Dropdown */}
          <div className="group relative">
            <label className="sr-only" htmlFor="studio-harmony-mode">
              Harmony mode
            </label>
            <select
              id="studio-harmony-mode"
              value={harmonyMode}
              onChange={(event) =>
                onHarmonyModeChange(event.target.value as HarmonyMode)
              }
              className="h-10 w-full min-w-[160px] cursor-pointer appearance-none rounded-xl border-0 bg-slate-100 px-4 pr-10 text-sm font-bold text-slate-700 outline-none ring-1 ring-inset ring-slate-200/60 transition-all hover:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700/50 dark:hover:bg-slate-800 sm:w-auto"
              aria-label="Harmony mode"
            >
              <option value="random">Random</option>
              <option value="analogous">Analogous</option>
              <option value="monochrome">Monochrome</option>
              <option value="triadic">Triadic</option>
              <option value="complementary">Complementary</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </div>

          {/* Modern Color Picker Input */}
          <label className="flex h-10 cursor-pointer items-center gap-2.5 rounded-xl border-0 bg-slate-100 px-3 ring-1 ring-inset ring-slate-200/60 transition-all hover:bg-slate-200/50 dark:bg-slate-800/50 dark:ring-slate-700/50 dark:hover:bg-slate-800">
            <span className="sr-only">Base color</span>
            <input
              type="color"
              value={baseColor}
              onChange={(event) => onBaseColorChange(event.target.value)}
              className="h-6 w-6 cursor-pointer rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
              aria-label="Base color"
            />
            <span className="min-w-[64px] font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {baseColor}
            </span>
          </label>

          {/* Generate / Refresh Button */}
          <button
            type="button"
            onClick={onGeneratePalette}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}