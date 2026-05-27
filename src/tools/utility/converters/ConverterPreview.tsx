import { Download, FileCheck2, Server, Sparkles } from 'lucide-react';

import type { ConversionResult, ConverterDefinition } from './types';

type ConverterPreviewProps = {
  converter?: ConverterDefinition;
  file?: File | null;
  outputFormat: string;
  result?: ConversionResult | null;
  error?: string | null;
  onDownload: () => void;
};

export function ConverterPreview({
  converter,
  file,
  outputFormat,
  result,
  error,
  onDownload,
}: ConverterPreviewProps) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            Live Preview
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Conversion status and output
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <FileCheck2 className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-3">
        <PreviewRow label="Selected converter" value={converter?.name ?? 'None'} />
        <PreviewRow label="Uploaded file" value={file?.name ?? 'No file uploaded'} />
        <PreviewRow
          label="Input format"
          value={converter?.inputFormats.join(', ').toUpperCase() ?? '—'}
        />
        <PreviewRow label="Output format" value={outputFormat.toUpperCase()} />
        <PreviewRow label="File size" value={file ? formatBytes(file.size) : '—'} />
        <PreviewRow label="Engine" value={converter?.engine ?? '—'} />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        {converter?.requiresBackend ? (
          <div className="flex gap-3">
            <Server className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Backend conversion coming soon
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                This conversion requires a server-side engine before it can run.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Browser-supported conversion
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                This conversion can run locally in the browser.
              </p>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="mt-auto pt-5">
        <button
          type="button"
          disabled={!result}
          onClick={onDownload}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download result
        </button>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Number.parseFloat((bytes / Math.pow(1024, index)).toFixed(2))} ${
    sizes[index]
  }`;
}