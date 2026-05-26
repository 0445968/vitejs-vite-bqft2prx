import {
  Download,
  Eye,
  FileUp,
  Menu,
  Redo2,
  Share2,
  Shuffle,
  Undo2,
} from 'lucide-react';

import type { StudioTool, StudioToolId } from '../types';

const PRIMARY_TOOL_IDS: StudioToolId[] = ['palette', 'export'];

export function StudioToolbar({
  tools,
  activeToolId,
  canUndo = false,
  canRedo = false,
  onSelectTool,
  onUndo,
  onRedo,
  onGeneratePalette,
  onExport,
}: {
  tools: StudioTool[];
  activeToolId: StudioToolId;
  canUndo?: boolean;
  canRedo?: boolean;
  onSelectTool: (tool: StudioToolId) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onGeneratePalette?: () => void;
  onExport?: () => void;
}) {
  const iconTools = tools.filter((tool) => !PRIMARY_TOOL_IDS.includes(tool.id));
  const generatorActive = activeToolId === 'palette';
  const exportActive = activeToolId === 'export';

  return (
    <div className="sticky top-16 z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <p className="hidden min-w-0 truncate text-sm font-semibold text-slate-600 dark:text-slate-400 md:block">
          Generate new palettes by pressing the spacebar.
        </p>

        <div className="ml-auto flex h-full min-w-0 items-center justify-end gap-1.5 overflow-x-auto">
          
          {/* 1. Rest of the buttons (Icon Tools) */}
          <div className="flex items-center gap-1">
            {iconTools.map((tool) => {
              const Icon = tool.id === 'visualize' ? Eye : tool.icon;
              const active = activeToolId === tool.id;

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
                  className={
                    active
                      ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-white shadow-lg shadow-blue-950/20'
                      : 'flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                  }
                  aria-label={tool.name}
                  title={tool.name}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* 2. Divider with padding */}
          <div className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800" />

          {/* 3. Undo / Redo */}
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition enabled:text-slate-500 enabled:hover:bg-slate-100 enabled:hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:text-slate-400 dark:enabled:hover:bg-slate-900 dark:enabled:hover:text-white"
              aria-label="Undo"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition enabled:text-slate-500 enabled:hover:bg-slate-100 enabled:hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:text-slate-400 dark:enabled:hover:bg-slate-900 dark:enabled:hover:text-white"
              aria-label="Redo"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>

          {/* 4. Divider with padding */}
          <div className="hidden mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800 sm:block" />

          {/* 5. Generate */}
          <button
            type="button"
            onClick={() => {
              onSelectTool('palette');
              onGeneratePalette?.();
            }}
            className={
              generatorActive
                ? 'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-950 px-3 text-sm font-black text-white shadow-lg shadow-blue-950/20'
                : 'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
            }
            aria-label="Generate palette"
            title="Generate palette"
          >
            <Shuffle className="h-4 w-4" />
            Generate
          </button>

          {/* 6. Share (No label) */}
          <button
            type="button"
            onClick={() => onSelectTool('export')}
            className={
              exportActive
                ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-white shadow-lg shadow-blue-950/20'
                : 'flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
            }
            aria-label="Share palette"
            title="Share palette"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* 7. Export */}
          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label="Export palette"
            title="Export palette"
          >
            <FileUp className="h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* 8. Download */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label="Download"
            title="Download"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
          </button>

          {/* 9. Menu (Right End) */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label="Menu"
            title="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}