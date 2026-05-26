import { QrCode, Smartphone } from 'lucide-react';

import type { PreviewMode } from '../types';

export function PhonePreview({
  mode,
  onModeChange,
  canvasRef,
  qrReady,
  title,
  subtitle,
  primaryColor,
  secondaryColor,
  frameColor,
}: {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  qrReady: boolean;
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  frameColor: string;
  onDownload?: () => void;
  onCopy?: () => void;
  copied?: boolean;
}) {
  const qrCanvasClass = '!h-full !w-full rounded-xl object-contain';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[340px] flex-col justify-center">
        <div className="mb-4 flex shrink-0 items-center justify-center">
          <div className="inline-flex rounded-full bg-slate-950/70 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onModeChange('preview')}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                mode === 'preview'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-label="Show mobile preview"
              title="Preview"
            >
              <Smartphone className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onModeChange('qr')}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                mode === 'qr'
                  ? 'bg-[color:var(--qu-accent)] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-label="Show QR code"
              title="QR code"
            >
              <QrCode className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mx-auto w-[min(100%,300px)] shrink rounded-[2.7rem] border-[5px] border-zinc-950 bg-zinc-950 p-[6px] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[9/18.7] overflow-hidden rounded-[2.25rem] bg-white">
            <div className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

            <div className="relative z-10 flex items-center justify-between px-7 pt-7 text-[10px] font-bold text-zinc-800">
              <span>9:41</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                {mode === 'qr' ? 'QR code' : 'Preview'}
              </span>
            </div>

            <div className="flex h-[calc(100%-54px)] flex-col px-5 pb-4 pt-4">
              {mode === 'preview' ? (
                <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
                  <div
                    className="shrink-0 rounded-[1.5rem] p-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    }}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                      <Smartphone className="h-5 w-5" />
                    </div>

                    <h4 className="line-clamp-2 text-lg font-black">
                      {title || 'Your QR experience'}
                    </h4>

                    <p className="mt-1 line-clamp-2 text-xs text-white/85">
                      {subtitle || 'Custom page preview for your QR destination.'}
                    </p>
                  </div>

                  <div className="min-h-0 flex-1 rounded-[1.5rem] border border-zinc-200 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{ backgroundColor: frameColor }}
                      >
                        <QrCode className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-zinc-900">
                          Scan to open
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          Mobile-friendly destination
                        </p>
                      </div>
                    </div>

                    <div className="mx-auto flex aspect-square w-[min(100%,175px)] items-center justify-center rounded-[1.25rem] bg-zinc-50 p-3">
                      {qrReady ? (
                        <canvas ref={canvasRef} className={qrCanvasClass} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-zinc-100">
                          <QrCode className="h-8 w-8 animate-pulse text-zinc-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-xs font-black text-zinc-900">
                      Live mobile preview
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                      Your QR destination stays visible while editing.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex aspect-square w-[min(100%,230px)] items-center justify-center rounded-[1.75rem] bg-white">
                    {qrReady ? (
                      <canvas ref={canvasRef} className={qrCanvasClass} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.75rem] bg-zinc-100">
                        <QrCode className="h-10 w-10 animate-pulse text-zinc-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mx-auto mt-auto h-1.5 w-24 shrink-0 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}