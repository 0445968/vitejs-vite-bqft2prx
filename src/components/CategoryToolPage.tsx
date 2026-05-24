import { useEffect, useMemo, useState, type ElementType } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Construction,
  ExternalLink,
  Filter,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from 'lucide-react';

import {
  toolCategories,
  type CategoryTool,
  type ToolCategory,
} from '../data/toolCategories';
import { tools as originalTools } from '../data/tools';
import { cn } from '../utils/cn';

type CategoryToolPageProps = {
  category: ToolCategory;
};

type WebsiteToolRef = {
  id: string;
  name: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  status: 'ready' | 'soon';
  icon: ElementType;
  path?: string;
};

function ComingSoonPanel({ tool }: { tool: CategoryTool }) {
  const Icon = tool.icon;

  return (
    <section className="hub-card rounded-[2rem] p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
          <Icon className="h-7 w-7" />
        </div>

        <span className="hub-badge">Coming soon</span>

        <h2 className="mt-4 text-2xl font-black tracking-tight text-[color:var(--qu-text)]">
          {tool.name}
        </h2>

        <p className="mt-3 text-sm leading-6 hub-muted">{tool.description}</p>

        <div className="mt-6 rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-5 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--qu-surface)] text-[color:var(--qu-accent-strong)]">
              <Construction className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-black text-[color:var(--qu-text)]">
                Planned for a future pass
              </h3>
              <p className="mt-1 text-sm leading-6 hub-muted">
                This placeholder keeps the category architecture ready while you
                build tools one at a time without creating more top-level pages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildWebsiteTools(): WebsiteToolRef[] {
  const categoryTools = toolCategories.flatMap((category) =>
    category.tools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      categorySlug: category.slug,
      categoryName: category.name,
      status: tool.status,
      icon: tool.icon,
    }))
  );

  const existingUtilityTools = originalTools.map((tool) => ({
    id: `original-${tool.path.replace(/[^a-z0-9]+/gi, '-')}`,
    name: tool.name,
    description: tool.description,
    categorySlug: 'original',
    categoryName: 'Original Utilities',
    status: tool.available ? ('ready' as const) : ('soon' as const),
    icon: tool.icon,
    path: tool.available ? tool.path : undefined,
  }));

  return [...categoryTools, ...existingUtilityTools];
}

function ToolBrowser({
  category,
  selectedToolId,
  onSelectTool,
  collapsed = false,
  mobile = false,
}: {
  category: ToolCategory;
  selectedToolId: string;
  onSelectTool: (tool: WebsiteToolRef) => void;
  collapsed?: boolean;
  mobile?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    category.slug,
  ]);

  useEffect(() => {
    setSelectedCategories([category.slug]);
    setQuery('');
  }, [category.slug]);

  const websiteTools = useMemo(() => buildWebsiteTools(), []);

  const filterOptions = useMemo(
    () => [
      ...toolCategories.map((c) => ({ label: c.name, value: c.slug })),
      { label: 'Original Utilities', value: 'original' },
    ],
    []
  );

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return websiteTools.filter((tool) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(tool.categorySlug);

      const haystack = [
        tool.name,
        tool.description,
        tool.categoryName,
        tool.status,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategories, query, websiteTools]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  };

  if (collapsed && !mobile) {
    return (
      <div className="hub-scrollbar h-full space-y-2 overflow-y-auto pr-1">
        {category.tools.slice(0, 10).map((tool) => {
          const Icon = tool.icon;
          const isActive = selectedToolId === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() =>
                onSelectTool({
                  id: tool.id,
                  name: tool.name,
                  description: tool.description,
                  categorySlug: category.slug,
                  categoryName: category.name,
                  status: tool.status,
                  icon: tool.icon,
                })
              }
              className={cn(
                'flex h-11 w-full items-center justify-center rounded-xl transition',
                isActive
                  ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20'
                  : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
              )}
              title={tool.name}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', !mobile && 'h-full overflow-hidden')}>
      <div className="mb-4 shrink-0 space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-3 transition-all duration-200 focus-within:border-[color:var(--qu-accent)] focus-within:ring-4 focus-within:ring-[color:var(--qu-accent-soft)]">
          <Search className="h-4 w-4 shrink-0 hub-muted" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all tools..."
            className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[color:var(--qu-text)] outline-none placeholder:text-[color:var(--qu-muted)]"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="rounded-xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-3 shadow-sm">
          <button
            type="button"
            onClick={() => setSelectedCategories([])}
            className={cn(
              'mb-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all',
              selectedCategories.length === 0
                ? 'bg-[color:var(--qu-accent)] text-white shadow-md shadow-orange-500/20 dark:shadow-blue-500/20'
                : 'border border-[color:var(--qu-border)] bg-[color:var(--qu-surface)] text-[color:var(--qu-text)] hover:border-[color:var(--qu-accent)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
            )}
          >
            <Filter className="h-4 w-4" />
            View all categories
          </button>

          <div className="hub-scrollbar max-h-[160px] space-y-1 overflow-y-auto pr-1">
            {filterOptions.map((opt) => {
              const isChecked = selectedCategories.includes(opt.value);

              return (
                <label
                  key={opt.value}
                  className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-[color:var(--qu-surface)]"
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors',
                      isChecked
                        ? 'border-[color:var(--qu-accent)] bg-[color:var(--qu-accent)] text-white'
                        : 'border-[color:var(--qu-border)] bg-[color:var(--qu-surface)] group-hover:border-[color:var(--qu-accent)]'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(opt.value)}
                      className="hidden"
                    />
                    {isChecked && (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                  </div>

                  <span
                    className={cn(
                      'text-sm font-semibold transition-colors',
                      isChecked
                        ? 'text-[color:var(--qu-text)]'
                        : 'text-[color:var(--qu-muted)] group-hover:text-[color:var(--qu-text)]'
                    )}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-2 flex shrink-0 items-center justify-between px-1">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--qu-muted)]">
          {selectedCategories.length === 0 ? 'All Tools' : 'Filtered Tools'}
        </p>

        <span className="hub-badge">{filteredTools.length}</span>
      </div>

      <div
        className={cn(
          'space-y-1',
          !mobile && 'hub-scrollbar flex-1 overflow-y-auto pb-2 pr-2'
        )}
      >
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isActive =
              tool.categorySlug === category.slug &&
              selectedToolId === tool.id;

            return (
              <button
                key={`${tool.categorySlug}-${tool.id}`}
                type="button"
                onClick={() => onSelectTool(tool)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  isActive
                    ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20'
                    : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]',
                  tool.status === 'soon' && !tool.path && 'opacity-80'
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-accent-strong)] group-hover:bg-[color:var(--qu-surface)]'
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-black">
                      {tool.name}
                    </span>

                    {tool.path && (
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    )}

                    {tool.status === 'soon' && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-black',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]'
                        )}
                      >
                        Soon
                      </span>
                    )}
                  </div>

                  <p
                    className={cn(
                      'mt-0.5 truncate text-xs',
                      isActive ? 'text-white/75' : 'hub-muted'
                    )}
                  >
                    {tool.categoryName}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-xl bg-[color:var(--qu-surface-soft)] p-4 text-center text-sm font-bold hub-muted">
            No tools match “{query}”.
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryToolPage({ category }: CategoryToolPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedToolId = searchParams.get('tool');

  const defaultToolId = category.tools[0]?.id ?? '';

  const selectedTool =
    category.tools.find((tool) => tool.id === requestedToolId) ??
    category.tools.find((tool) => tool.id === defaultToolId) ??
    category.tools[0];

  const selectedToolId = selectedTool?.id ?? defaultToolId;
  const SelectedComponent = selectedTool?.component;

  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    if (!requestedToolId && defaultToolId) {
      setSearchParams({ tool: defaultToolId }, { replace: true });
    }
  }, [defaultToolId, requestedToolId, setSearchParams]);

  const handleSelectWebsiteTool = (tool: WebsiteToolRef) => {
    setMobileToolsOpen(false);

    if (tool.path) {
      navigate(tool.path);
      return;
    }

    navigate(`/tools/${tool.categorySlug}?tool=${tool.id}`);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)]">
      {/* Desktop app-shell sidebar */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-40 hidden border-r border-[color:var(--qu-border)] bg-[color:var(--qu-surface)] transition-all duration-300 xl:block',
          sidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[color:var(--qu-border)] px-3">
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[color:var(--qu-text)]">
                  Tool Library
                </p>
                <p className="truncate text-xs hub-muted">{category.name}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="hub-icon-button h-9 w-9 shrink-0"
              aria-label={
                sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-hidden p-3">
            <ToolBrowser
              category={category}
              selectedToolId={selectedToolId}
              onSelectTool={handleSelectWebsiteTool}
              collapsed={sidebarCollapsed}
            />
          </div>

          <div className="mt-auto shrink-0 border-t border-[color:var(--qu-border)] p-3">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-3 py-2 text-sm font-black text-[color:var(--qu-muted)] transition hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]',
                sidebarCollapsed && 'px-0'
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  Collapse
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 xl:min-h-[calc(100dvh-4rem)]">
        {/* Tablet / mobile More tools drawer */}
        <div className="px-4 py-4 sm:px-6 lg:px-8 xl:hidden">
          <button
            type="button"
            onClick={() => setMobileToolsOpen((value) => !value)}
            className="hub-card flex w-full items-center justify-between rounded-[1.5rem] px-4 py-4 text-left"
          >
            <span>
              <span className="block text-sm font-black text-[color:var(--qu-text)]">
                More tools
              </span>
              <span className="block text-xs font-semibold hub-muted">
                Search and switch between all tools
              </span>
            </span>

            <ChevronDown
              className={cn(
                'h-5 w-5 text-[color:var(--qu-muted)] transition',
                mobileToolsOpen && 'rotate-180'
              )}
            />
          </button>

          {mobileToolsOpen && (
            <div className="mt-3">
              <div className="hub-card rounded-[1.5rem] p-3">
                <ToolBrowser
                  category={category}
                  selectedToolId={selectedToolId}
                  onSelectTool={handleSelectWebsiteTool}
                  mobile
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected tool renders with different spacing depending on layout */}
{selectedTool ? (
  SelectedComponent ? (
    selectedTool.layout === 'immersive' ? (
      <SelectedComponent />
    ) : (
      <div className="px-4 py-6 sm:px-6 lg:px-8 xl:ml-[76px]">
        <div className="mx-auto w-full max-w-7xl">
          <SelectedComponent />
        </div>
      </div>
    )
  ) : (
    <div className="px-4 py-6 sm:px-6 lg:px-8 xl:ml-[76px]">
      <div className="mx-auto w-full max-w-5xl">
        <ComingSoonPanel tool={selectedTool} />
      </div>
    </div>
  )
) : (
  <div className="px-4 py-6 sm:px-6 lg:px-8 xl:ml-[76px]">
    <div className="mx-auto w-full max-w-5xl">
      <section className="hub-card rounded-[2rem] p-8 text-center">
        <h2 className="text-xl font-black text-[color:var(--qu-text)]">
          No tools available
        </h2>
        <p className="mt-2 hub-muted">
          This category is ready, but tools have not been added yet.
        </p>
      </section>
    </div>
  </div>
)}
      </main>
    </div>
  );
}