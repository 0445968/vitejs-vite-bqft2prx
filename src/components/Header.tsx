import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Home, Menu, Search, Workflow, X } from 'lucide-react';

import { toolCategories } from '../data/toolCategories';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className="sticky top-0 z-50 border-b bg-[color:var(--qu-surface)]/90 backdrop-blur-xl"
      style={{ borderColor: 'var(--qu-border)' }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20">
            <Workflow className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="truncate text-base font-extrabold tracking-tight text-[color:var(--qu-text)] sm:text-lg leading-tight">
              QuickUtility
            </h1>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[color:var(--qu-accent-strong)] leading-tight mt-0.5">
              By Crafterkite
            </p>
          </div>
        </Link>

        {/* Middle: Search Bar (Desktop/Tablet) */}
        <div className="hidden flex-1 px-4 md:flex justify-center max-w-2xl">
          <div className="flex w-full items-center gap-2 rounded-xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-3 transition-all duration-200 focus-within:border-[color:var(--qu-accent)] focus-within:ring-4 focus-within:ring-[color:var(--qu-accent-soft)]">
            <Search className="h-4 w-4 shrink-0 hub-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[color:var(--qu-text)] outline-none placeholder:text-[color:var(--qu-muted)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Navigation & Controls */}
        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[color:var(--qu-muted)] transition hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]"
              >
                Tools
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              <div
                className="invisible absolute right-0 top-full z-50 mt-2 w-[520px] translate-y-2 rounded-3xl border bg-[color:var(--qu-surface)] p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                style={{ borderColor: 'var(--qu-border)' }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {toolCategories.map((category) => {
                    const Icon = category.icon;
                    const readyCount = category.tools.filter(
                      (tool) => tool.status === 'ready'
                    ).length;

                    return (
                      <NavLink
                        key={category.slug}
                        to={`/tools/${category.slug}`}
                        className={({ isActive }) =>
                          cn(
                            'rounded-2xl p-3 transition',
                            isActive
                              ? 'bg-[color:var(--qu-accent-soft)]'
                              : 'hover:bg-[color:var(--qu-surface-soft)]'
                          )
                        }
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-[color:var(--qu-text)]">
                              {category.name}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 hub-muted">
                              {category.tools.length} tools · {readyCount} ready
                            </p>
                          </div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          <div className="ml-2 flex items-center gap-2 border-l border-[color:var(--qu-border)] pl-4">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="hub-icon-button lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="border-t bg-[color:var(--qu-surface)] px-4 py-4 lg:hidden"
          style={{ borderColor: 'var(--qu-border)' }}
        >
          {/* Mobile Search Bar */}
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-3 focus-within:border-[color:var(--qu-accent)] focus-within:ring-4 focus-within:ring-[color:var(--qu-accent-soft)] md:hidden">
            <Search className="h-4 w-4 shrink-0 hub-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[color:var(--qu-text)] outline-none placeholder:text-[color:var(--qu-muted)]"
            />
          </div>

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

            {toolCategories.map((category) => {
              const Icon = category.icon;
              const readyCount = category.tools.filter(
                (tool) => tool.status === 'ready'
              ).length;

              return (
                <NavLink
                  key={category.slug}
                  to={`/tools/${category.slug}`}
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

                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{category.name}</span>
                    <span className="block text-xs font-semibold opacity-75">
                      {category.tools.length} tools · {readyCount} ready
                    </span>
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}