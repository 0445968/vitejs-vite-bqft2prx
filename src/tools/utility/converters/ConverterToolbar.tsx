import {
    Copy,
    Download,
    MoreHorizontal,
    SlidersHorizontal,
    Sparkles,
  } from 'lucide-react';
  
  type ConverterToolbarProps = {
    title: string;
    fileName?: string;
    canDownload: boolean;
    onCopy: () => void;
    onDownload: () => void;
  };
  
  export function ConverterToolbar({
    title,
    fileName,
    canDownload,
    onCopy,
    onDownload,
  }: ConverterToolbarProps) {
    return (
      <div className="sticky top-16 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {fileName || title}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            File conversion studio
          </p>
        </div>
  
        <div className="flex items-center gap-2">
          <ToolbarButton title="Smart convert">
            <Sparkles className="h-4 w-4" />
          </ToolbarButton>
  
          <ToolbarButton title="Advanced options">
            <SlidersHorizontal className="h-4 w-4" />
          </ToolbarButton>
  
          <ToolbarButton title="Copy result" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </ToolbarButton>
  
          <ToolbarButton title="Download result" onClick={onDownload} disabled={!canDownload}>
            <Download className="h-4 w-4" />
          </ToolbarButton>
  
          <ToolbarButton title="More options">
            <MoreHorizontal className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>
    );
  }
  
  function ToolbarButton({
    title,
    children,
    disabled,
    onClick,
  }: {
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) {
    return (
      <button
        type="button"
        title={title}
        disabled={disabled}
        onClick={onClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
      >
        {children}
      </button>
    );
  }