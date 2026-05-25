import {
    Download,
    Eye,
    Heart,
    Menu,
    MoreHorizontal,
    Redo2,
    Share2,
    Undo2,
  } from 'lucide-react';
  
  import type { StudioTool, StudioToolId } from '../types';
  
  const LABELED_TOOL_IDS: StudioToolId[] = ['palette', 'export'];
  
  export function StudioToolbar({
    tools,
    activeToolId,
    canUndo = false,
    canRedo = false,
    onSelectTool,
    onUndo,
    onRedo,
    onExport,
  }: {
    tools: StudioTool[];
    activeToolId: StudioToolId;
    canUndo?: boolean;
    canRedo?: boolean;
    onSelectTool: (tool: StudioToolId) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onExport?: () => void;
  }) {
    const iconTools = tools.filter((tool) => !LABELED_TOOL_IDS.includes(tool.id));
    const labeledTools = tools.filter((tool) => LABELED_TOOL_IDS.includes(tool.id));
  
    return (
      <div className="sticky top-16 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
          <p className="hidden min-w-0 truncate text-sm font-semibold text-slate-600 dark:text-slate-400 md:block">
            Press the spacebar to generate color palettes!
          </p>
  
          <div className="ml-auto flex h-full min-w-0 items-center justify-end gap-1">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="More options"
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
  
            <div className="flex h-full items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800">
              {iconTools.map((tool) => {
                const Icon = tool.icon;
                const active = activeToolId === tool.id;
  
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => onSelectTool(tool.id)}
                    className={
                      active
                        ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20'
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
  
            <div className="hidden h-full items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800 sm:flex">
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
  
            <div className="hidden h-full items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800 lg:flex">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="View"
                title="View"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
  
              <button
                type="button"
                onClick={onExport}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="Export palette"
                title="Export palette"
              >
                <Share2 className="h-4 w-4" />
                Export
              </button>
  
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="Save"
                title="Save"
              >
                <Heart className="h-4 w-4" />
                Save
              </button>
            </div>
  
            <div className="flex h-full items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800">
              {labeledTools.map((tool) => {
                const Icon = tool.icon;
                const active = activeToolId === tool.id;
  
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => onSelectTool(tool.id)}
                    className={
                      active
                        ? 'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-black text-white shadow-lg shadow-blue-600/20'
                        : 'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                    }
                    aria-label={tool.name}
                    title={tool.name}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tool.name}</span>
                  </button>
                );
              })}
  
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="Download"
                title="Download"
                onClick={onExport}
              >
                <Download className="h-4 w-4" />
              </button>
  
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
      </div>
    );
  }
  