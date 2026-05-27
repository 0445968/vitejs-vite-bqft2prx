import { RotateCcw, Sparkles } from 'lucide-react';

import { converterGroups } from './converterGroups';
import type { ConverterDefinition, ConverterGroup } from './types';

type ConverterHeaderProps = {
  group: ConverterGroup;
  selectedConverter?: ConverterDefinition;
  hasFile: boolean;
  isConverting: boolean;
  onReset: () => void;
  onConvert: () => void;
};

export function ConverterHeader({
  group,
  selectedConverter,
  hasFile,
  isConverting,
  onReset,
  onConvert,
}: ConverterHeaderProps) {
  const groupMeta = converterGroups[group];
  const Icon = groupMeta.icon;

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Icon className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                {groupMeta.eyebrow}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {selectedConverter?.requiresBackend
                  ? 'Server engine required'
                  : 'Browser supported'}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {groupMeta.title}
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              {groupMeta.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="button"
            disabled={!hasFile || isConverting}
            onClick={onConvert}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {isConverting ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </header>
  );
}