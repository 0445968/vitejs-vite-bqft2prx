import { ChevronDown, QrCode, RefreshCw, ShieldCheck } from 'lucide-react';

import type { ContentType, ErrorCorrection } from '../types';

export function QRStudioHeader({
  type,
  errorCorrection,
  onErrorCorrectionChange,
  onRandomize,
}: {
  type: ContentType;
  errorCorrection: ErrorCorrection;
  onErrorCorrectionChange: (value: ErrorCorrection) => void;
  onRandomize?: () => void;
}) {
  return (
    <header className="shrink-0 bg-white px-4 py-4 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 sm:flex">
            <QrCode className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                QR Studio
              </span>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                {getContentTypeLabel(type)}
              </span>
            </div>

            <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              QR Code Generator
            </h2>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Build a branded QR code with content types, colors, stickers,
              logos, and a live mobile preview.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="group relative">
            <label className="sr-only" htmlFor="qr-error-correction">
              Error correction
            </label>

            <select
              id="qr-error-correction"
              value={errorCorrection}
              onChange={(event) =>
                onErrorCorrectionChange(event.target.value as ErrorCorrection)
              }
              className="h-10 w-full min-w-[160px] cursor-pointer appearance-none rounded-xl border-0 bg-slate-100 px-4 pr-10 text-sm font-bold text-slate-700 outline-none ring-1 ring-inset ring-slate-200/60 transition-all hover:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700/50 dark:hover:bg-slate-800 sm:w-auto"
              aria-label="Error correction"
            >
              <option value="L">Low</option>
              <option value="M">Medium</option>
              <option value="Q">Quartile</option>
              <option value="H">High</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </div>

          <div className="flex h-10 cursor-default items-center gap-2.5 rounded-xl border-0 bg-slate-100 px-3 ring-1 ring-inset ring-slate-200/60 transition-all dark:bg-slate-800/50 dark:ring-slate-700/50">
            <ShieldCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />

            <span className="min-w-[64px] font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              EC: {errorCorrection}
            </span>
          </div>

          <button
            type="button"
            onClick={onRandomize}
            disabled={!onRandomize}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            title="Reset QR settings"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function getContentTypeLabel(type: ContentType) {
  const labels: Partial<Record<ContentType, string>> = {
    link: 'Link QR',
    text: 'Text QR',
    email: 'Email QR',
    call: 'Call QR',
    sms: 'SMS QR',
    wifi: 'Wi-Fi QR',
    vcard: 'vCard QR',
    whatsapp: 'WhatsApp QR',
    pdf: 'PDF QR',
    app: 'App QR',
    image: 'Image QR',
    video: 'Video QR',
    social: 'Social QR',
    event: 'Event QR',
    barcode: 'Barcode',
  };

  return labels[type] ?? 'QR Builder';
}