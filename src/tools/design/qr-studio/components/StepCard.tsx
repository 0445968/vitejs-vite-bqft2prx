import type { ElementType, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function StepCard({
  number,
  title,
  subtitle,
  Icon,
  open,
  onToggle,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  Icon: ElementType;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[color:var(--qu-border)] bg-[color:var(--qu-surface)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--qu-accent-soft)] text-xs font-black text-[color:var(--qu-accent-strong)]">
                {number}
              </span>
              <h3 className="truncate text-lg font-black text-[color:var(--qu-text)]">
                {title}
              </h3>
            </div>

            <p className="text-sm hub-muted">{subtitle}</p>
          </div>
        </div>

        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-[color:var(--qu-muted)] transition ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-[color:var(--qu-border)] px-5 py-5">
          {children}
        </div>
      )}
    </section>
  );
}