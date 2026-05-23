import { Workflow, Zap } from 'lucide-react';

import { tools } from '../data/tools';
import { ToolCard } from '../components/ToolCard';

export function Dashboard() {
  const availableTools = tools.filter((tool) => tool.available);
  const upcomingTools = tools.filter((tool) => !tool.available);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <div className="hub-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--qu-accent-soft)] blur-3xl" />

          <div className="relative max-w-3xl">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[color:var(--qu-accent-strong)]"
              style={{
                borderColor: 'var(--qu-border)',
                background: 'var(--qu-accent-soft)',
              }}
            >
              <Workflow className="h-3.5 w-3.5" />
              Phase 1
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)] sm:text-5xl">
              A workflow-inspired utility hub.
            </h2>

            <p className="mt-4 text-base leading-7 hub-muted sm:text-lg">
              QuickUtility Hub brings practical everyday tools into one cohesive
              workspace with a clean n8n-inspired interface, light/dark themes,
              and a scalable phased structure.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="hub-secondary-button pointer-events-none">
                <Zap className="h-4 w-4 text-[color:var(--qu-accent)]" />2 tools
                active
              </div>

              <div className="hub-secondary-button pointer-events-none">
                15 planned
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[color:var(--qu-text)]">
              Available now
            </h3>
            <p className="text-sm hub-muted">Phase 1 tools are ready to use.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {availableTools.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Coming in future phases
          </h3>
          <p className="text-sm hub-muted">
            These are included in the roadmap but disabled for Phase 1.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {upcomingTools.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
