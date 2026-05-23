import { Menu, Workflow } from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b bg-[color:var(--qu-surface)]/80 backdrop-blur-xl"
      style={{ borderColor: 'var(--qu-border)' }}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="hub-icon-button lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20">
              <Workflow className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-base font-extrabold tracking-tight text-[color:var(--qu-text)] sm:text-lg">
                QuickUtility Hub
              </h1>
              <p className="hidden text-xs hub-muted sm:block">
                Workflow-style utilities for everyday tasks
              </p>
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
