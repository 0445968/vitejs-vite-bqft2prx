import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ToolItem } from '../data/tools';
import { cn } from '../utils/cn';

type ToolCardProps = {
  tool: ToolItem;
};

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  const content = (
    <div
      className={cn(
        'hub-card group relative h-full overflow-hidden rounded-2xl p-5 transition duration-300',
        tool.available
          ? 'hover:-translate-y-1 hover:border-[color:var(--qu-accent)]'
          : 'opacity-60'
      )}
    >
      <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-[color:var(--qu-accent-soft)] blur-2xl" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
          <Icon className="h-6 w-6" />
        </div>

        <span className="hub-badge">Phase {tool.phase}</span>
      </div>

      <h3 className="relative text-base font-extrabold text-[color:var(--qu-text)]">
        {tool.name}
      </h3>

      <p className="relative mt-2 min-h-12 text-sm leading-6 hub-muted">
        {tool.description}
      </p>

      <div className="relative mt-5 flex items-center justify-between">
        <span className="text-sm font-bold text-[color:var(--qu-text)]">
          {tool.available ? 'Open tool' : 'Coming soon'}
        </span>

        {tool.available && (
          <ArrowRight className="h-4 w-4 text-[color:var(--qu-muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--qu-accent)]" />
        )}
      </div>
    </div>
  );

  if (!tool.available) {
    return content;
  }

  return (
    <Link to={tool.path} className="block h-full">
      {content}
    </Link>
  );
}
