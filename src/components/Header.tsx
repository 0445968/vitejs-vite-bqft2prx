import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Home, Menu, Workflow, X } from 'lucide-react';

import { tools } from '../data/tools';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const availableTools = tools.filter((tool) => tool.available);
  const upcomingTools = tools.filter((tool) => !tool.available);

  return (
    <header
      className="sticky top-0 z-50 border-b bg-[color:var(--qu-surface)]/90 backdrop-blur-xl"
      style={{ borderColor: 'var(--qu-border)' }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20">
            <Workflow className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold tracking-tight text-[color:var(--qu-text)] sm:text-lg">
              QuickUtility Hub
            </h1>
            <p className="hidden truncate text-xs hub-muted sm:block">
              Workflow-style utilities
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition',
                isActive
                  ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20'
                  : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
              )
            }
          >
            <Home className="h-4 w-4" />
            Dashboard
          </NavLink>

          {availableTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <NavLink
                key={tool.path}
                to={tool.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition',
                    isActive
                      ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20'
                      : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {tool.name.replace('QR Code Generator & Scanner', 'QR Codes')}
              </NavLink>
            );
          })}

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[color:var(--qu-muted)] transition hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]"
            >
              More tools
              <ChevronDown className="h-4 w-4" />
            </button>

            <div
              className="invisible absolute right-0 top-full z-50 mt-2 w-80 translate-y-2 rounded-2xl border bg-[color:var(--qu-surface)] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
              style={{ borderColor: 'var(--qu-border)' }}
            >
              <div className="max-h-[70vh] overflow-y-auto">
                {upcomingTools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <div
                      key={tool.path}
                      className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 opacity-60"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[color:var(--qu-text)]">
                          {tool.name}
                        </p>
                        <p className="text-xs hub-muted">Phase {tool.phase}</p>
                      </div>

                      <span className="hub-badge">Soon</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="hub-icon-button lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="border-t bg-[color:var(--qu-surface)] px-4 py-4 lg:hidden"
          style={{ borderColor: 'var(--qu-border)' }}
        >
          <nav className="grid gap-2">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition',
                  isActive
                    ? 'bg-[color:var(--qu-accent)] text-white'
                    : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
                )
              }
            >
              <Home className="h-5 w-5" />
              Dashboard
            </NavLink>

            {tools.map((tool) => {
              const Icon = tool.icon;

              if (!tool.available) {
                return (
                  <div
                    key={tool.path}
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 opacity-50"
                  >
                    <Icon className="h-5 w-5" />

                    <span className="flex-1 text-sm font-bold text-[color:var(--qu-muted)]">
                      {tool.name}
                    </span>

                    <span className="hub-badge">Soon</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={tool.path}
                  to={tool.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition',
                      isActive
                        ? 'bg-[color:var(--qu-accent)] text-white'
                        : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {tool.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}