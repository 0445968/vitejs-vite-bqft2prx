import { NavLink } from 'react-router-dom';
import { Home, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

import { tools } from '../data/tools';
import { cn } from '../utils/cn';

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-dvh flex-col border-r bg-[color:var(--qu-surface)]/92 backdrop-blur-xl transition-all duration-300 lg:sticky lg:z-20',
          collapsed ? 'lg:w-20' : 'lg:w-72',
          mobileOpen
            ? 'w-80 translate-x-0'
            : 'w-80 -translate-x-full lg:translate-x-0'
        )}
        style={{ borderColor: 'var(--qu-border)' }}
      >
        <div
          className="flex h-16 items-center justify-between border-b px-4"
          style={{ borderColor: 'var(--qu-border)' }}
        >
          {!collapsed && (
            <div>
              <p className="text-sm font-extrabold text-[color:var(--qu-text)]">
                Utilities
              </p>
              <p className="text-xs hub-muted">17 workflow tools</p>
            </div>
          )}

          <button
            type="button"
            onClick={onCloseMobile}
            className="hub-icon-button lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapsed}
            className="hub-icon-button hidden lg:inline-flex"
            aria-label="Collapse sidebar"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition',
                isActive
                  ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20'
                  : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
              )
            }
          >
            <Home className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <div
            className="my-3 h-px"
            style={{ backgroundColor: 'var(--qu-border)' }}
          />

          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <NavLink
                key={tool.path}
                to={tool.available ? tool.path : '#'}
                onClick={(event) => {
                  if (!tool.available) event.preventDefault();
                  else onCloseMobile();
                }}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition',
                    isActive && tool.available
                      ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20'
                      : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]',
                    !tool.available && 'cursor-not-allowed opacity-45'
                  )
                }
                title={collapsed ? tool.name : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <span className="line-clamp-1 flex-1">{tool.name}</span>
                )}

                {!collapsed && !tool.available && (
                  <span className="hub-badge opacity-80">Soon</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
