import type { StudioTool, StudioToolId } from '../types';

const LABELED_TOOL_IDS: StudioToolId[] = ['visualize', 'palette', 'export'];

export function StudioToolbar({
  tools,
  activeToolId,
  onSelectTool,
}: {
  tools: StudioTool[];
  activeToolId: StudioToolId;
  onSelectTool: (tool: StudioToolId) => void;
}) {
  return (
    <div className="sticky top-16 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex min-w-max items-center gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const active = activeToolId === tool.id;
            const showLabel = LABELED_TOOL_IDS.includes(tool.id);

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool.id)}
                className={
                  active
                    ? `inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20 ${showLabel ? 'px-4 py-2.5' : 'h-11 w-11 px-0 py-0'}`
                    : `inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white ${showLabel ? 'px-4 py-2.5' : 'h-11 w-11 px-0 py-0'}`
                }
                aria-label={tool.name}
                title={tool.name}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {showLabel && <span>{tool.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
