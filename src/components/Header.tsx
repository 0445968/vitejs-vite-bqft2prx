import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Home, Menu, Search, Workflow, X } from 'lucide-react';

import { toolCategories } from '../data/toolCategories';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        isScrolled
          ? 'bg-[color:var(--qu-surface)] shadow-sm'
          : 'bg-[color:var(--qu-surface)]/70 backdrop-blur-xl'
      )}
      style={{ borderColor: 'var(--qu-border)' }}
    >
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left edge: Logo */}
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20">
            <Workflow className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="truncate text-base font-extrabold leading-tight tracking-tight text-[color:var(--qu-text)] sm:text-lg">
              QuickUtility
            </h1>
            <p className="mt-0.5 truncate text-[10px] font-medium uppercase leading-tight tracking-wider text-[color:var(--qu-accent-strong)]">
              By Crafterkite
            </p>
          </div>
        </Link>

        {/* Right edge: Search, navigation, controls */}
        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3 lg:gap-4">
          <div className="hidden w-[min(32vw,320px)] shrink md:block">
            <div className="flex w-full items-center gap-2 rounded-full border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-4 transition-all duration-200 focus-within:border-[color:var(--qu-accent)] focus-within:ring-4 focus-within:ring-[color:var(--qu-accent-soft)]">
              <Search className="h-3.5 w-3.5 shrink-0 hub-muted" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tools..."
                className="h-8 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[color:var(--qu-text)] outline-none placeholder:text-[color:var(--qu-muted)]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

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
                className="invisible absolute right-0 top-full z-50 mt-2 w-[520px] translate-y-2 rounded-3xl border bg-[color:var(--qu-surface)] p-3 opacity-0 shadow-xl transition-all duration-200 before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:content-[''] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
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

          <div className="flex shrink-0 items-center gap-2 border-l border-[color:var(--qu-border)] pl-3 sm:pl-4">
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

      {mobileOpen && (
        <div
          className="border-t bg-[color:var(--qu-surface)] px-4 py-4 lg:hidden"
          style={{ borderColor: 'var(--qu-border)' }}
        >
          <div className="mb-4 flex items-center gap-2 rounded-full border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-4 focus-within:border-[color:var(--qu-accent)] focus-within:ring-4 focus-within:ring-[color:var(--qu-accent-soft)] md:hidden">
            <Search className="h-3.5 w-3.5 shrink-0 hub-muted" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tools..."
              className="h-8 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[color:var(--qu-text)] outline-none placeholder:text-[color:var(--qu-muted)]"
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
