import { Check, Copy, Download } from 'lucide-react';

import type { ExportFormat, PaletteColor } from '../types';

export function ExportTokensTool({
  colors,
  exportFormat,
  exportText,
  copied,
  onExportFormatChange,
  onCopyExport,
  onDownloadExport,
}: {
  colors: PaletteColor[];
  exportFormat: ExportFormat;
  exportText: string;
  copied: boolean;
  onExportFormatChange: (format: ExportFormat) => void;
  onCopyExport: () => void;
  onDownloadExport: () => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-3 gap-2">
          {(['css', 'tailwind', 'json'] as ExportFormat[]).map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => onExportFormatChange(format)}
              className={
                exportFormat === format
                  ? 'rounded-xl bg-blue-600 px-3 py-3 text-xs font-black uppercase tracking-wide text-white'
                  : 'rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-wide text-slate-500 transition hover:text-slate-950 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white'
              }
            >
              {format}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCopyExport}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-500/10 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={onDownloadExport}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20"
          >
            <Download className="h-4 w-4" />
            Save
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 grid h-16 overflow-hidden rounded-2xl" style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}>
          {colors.map((color) => (
            <div key={color.id} style={{ background: color.hex }} />
          ))}
        </div>

        <pre className="min-h-[360px] overflow-auto rounded-[1.7rem] bg-slate-50 p-5 text-xs font-bold leading-6 text-slate-950 dark:bg-slate-950 dark:text-white">
          {exportText}
        </pre>
      </section>
    </div>
  );
}
