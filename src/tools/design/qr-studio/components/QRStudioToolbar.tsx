import {
    Check,
    Copy,
    Download,
    Link2,
    MoreHorizontal,
    Redo2,
    SlidersHorizontal,
    Sparkles,
    Undo2,
  } from 'lucide-react';
  
  import type { ContentType } from '../types';
  
  export function QRStudioToolbar({
    copied,
    currentType,
    destination,
    dynamicQr,
    dynamicId,
    onCopy,
    onDownload,
    onUndo,
    onRedo,
  }: {
    copied: boolean;
    currentType: ContentType;
    destination: string;
    dynamicQr: boolean;
    dynamicId: string;
    onCopy: () => void;
    onDownload: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
  }) {
    const previewText = destination?.trim() || getEmptyPreviewText(currentType);
  
    return (
      <div className="sticky top-16 z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
            {/* Dynamic content preview only */}
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <Link2 className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
  
            <p className="min-w-0 max-w-[320px] truncate text-sm font-semibold text-slate-600 dark:text-slate-400 md:max-w-[460px] xl:max-w-[620px]">
              {previewText}
            </p>
  
            {dynamicQr && (
              <span className="hidden shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 sm:inline-flex">
                {dynamicId}
              </span>
            )}
          </div>
  
          {/* Right actions */}
          <div className="ml-auto flex h-full min-w-0 items-center justify-end gap-1.5 overflow-x-auto">
            {/* Undo / Redo */}
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={onUndo}
                disabled={!onUndo}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition enabled:text-slate-500 enabled:hover:bg-slate-100 enabled:hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:text-slate-400 dark:enabled:hover:bg-slate-900 dark:enabled:hover:text-white"
                aria-label="Undo"
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </button>
  
              <button
                type="button"
                onClick={onRedo}
                disabled={!onRedo}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition enabled:text-slate-500 enabled:hover:bg-slate-100 enabled:hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:text-slate-400 dark:enabled:hover:bg-slate-900 dark:enabled:hover:text-white"
                aria-label="Redo"
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>
  
            <div className="hidden mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800 sm:block" />
  
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Generate smart QR"
              title="Generate smart QR"
            >
              <Sparkles className="h-4 w-4" />
            </button>
  
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Advanced features"
              title="Advanced features"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
  
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="More options"
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
  
            <div className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800" />
  
            <button
              type="button"
              onClick={onCopy}
              className={
                copied
                  ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-white shadow-lg shadow-blue-950/20'
                  : 'flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }
              aria-label={copied ? 'Copied' : 'Copy QR code'}
              title={copied ? 'Copied' : 'Copy QR code'}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
  
            <button
              type="button"
              onClick={onDownload}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Download QR code"
              title="Download QR code"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  function getEmptyPreviewText(type: ContentType) {
    return `No ${getTypeLabel(type).toLowerCase()} content added yet`;
  }
  
  function getTypeLabel(type: ContentType) {
    const labels: Partial<Record<ContentType, string>> = {
      link: 'Link',
      text: 'Text',
      email: 'Email',
      call: 'Call',
      sms: 'SMS',
      wifi: 'Wi-Fi',
    };
  
    return labels[type] ?? 'QR content';
  }