import { Shuffle } from 'lucide-react';
import type { StudioTool } from '../types';

export function StudioHeader({ tool, onGeneratePalette }: { tool: StudioTool; onGeneratePalette: () => void }) {
  const Icon = tool.icon;

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        <button
          type="button"
          onClick={onGeneratePalette}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Shuffle className="h-4 w-4" />
          Generate palette
        </button>
      </div>
    </header>
  );
}
