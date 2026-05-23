import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Clock3,
  Copy,
  KeyRound,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { tools } from '../data/tools';
import { ToolCard } from '../components/ToolCard';

const categoryPills = [
  'All Tools',
  'Generators',
  'Calculators',
  'Trackers',
  'Converters',
  'Productivity',
  'Finance',
];

const trustItems = [
  {
    icon: Zap,
    title: 'Fast utilities',
    description: 'Open and use tools instantly',
  },
  {
    icon: ShieldCheck,
    title: 'Local-first',
    description: 'No backend required',
  },
  {
    icon: Copy,
    title: 'Copy-ready',
    description: 'Quick outputs for daily work',
  },
  {
    icon: BadgeCheck,
    title: '17 tools planned',
    description: 'Built in clean phases',
  },
];

export function Dashboard() {
  const availableTools = tools.filter((tool) => tool.available);
  const upcomingTools = tools.filter((tool) => !tool.available);
  const featuredTools = tools.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Category pills */}
      <section className="mb-5 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-3">
          {categoryPills.map((category, index) => (
            <button
              key={category}
              type="button"
              className={
                index === 0
                  ? 'rounded-full bg-[color:var(--qu-text)] px-5 py-2.5 text-sm font-black text-[color:var(--qu-bg)] transition hover:opacity-90'
                  : 'rounded-full bg-[color:var(--qu-surface-soft)] px-5 py-2.5 text-sm font-extrabold text-[color:var(--qu-text)] transition hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* E-commerce style hero */}
      <section className="mb-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[color:var(--qu-blue)] px-6 py-8 text-white shadow-2xl sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[color:var(--qu-accent)] opacity-95" />
          <div className="absolute bottom-[-7rem] right-36 h-56 w-56 rounded-full border border-white/50" />
          <div className="absolute right-8 top-10 hidden rotate-6 lg:block">
            <div className="hub-card w-80 rounded-[2rem] border-white/20 bg-white/12 p-5 text-white backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Workflow className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                  Phase 1
                </span>
              </div>

              <p className="text-sm text-white/75">Quick access</p>
              <h3 className="mt-1 text-2xl font-black">Utility workspace</h3>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white/15 p-3">
                  <div className="mb-2 h-2 w-24 rounded-full bg-white/80" />
                  <div className="h-2 w-40 rounded-full bg-white/30" />
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  <div className="mb-2 h-2 w-20 rounded-full bg-white/80" />
                  <div className="h-2 w-52 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
              <Sparkles className="h-4 w-4" />
              New utility hub
            </div>

            <p className="mb-3 text-2xl font-light sm:text-3xl">
              Build, calculate, convert, track
            </p>

            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl">
              Everyday tools
            </h1>

            <p className="mt-4 max-w-xl text-lg font-medium text-white/85">
              A clean all-in-one toolbox with a shopping-style landing page in
              light mode and a premium SaaS dashboard feel in dark mode.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/tools/qr-code"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
              >
                <QrCode className="h-4 w-4" />
                Try QR Codes
              </Link>

              <Link
                to="/tools/password-generator"
                className="inline-flex items-center gap-2 rounded-2xl bg-black/20 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-black/30"
              >
                <KeyRound className="h-4 w-4" />
                Passwords
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-2">
              <span className="h-2 w-8 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/80" />
              <span className="h-2 w-2 rounded-full bg-white/80" />
              <span className="h-2 w-2 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
      </section>

      {/* Service strip */}
      <section className="mb-9">
        <div className="hub-card grid gap-4 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 border-[color:var(--qu-border)] p-3 lg:border-r last:lg:border-r-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-text)]">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase text-[color:var(--qu-text)]">
                    {item.title}
                  </h3>
                  <p className="text-sm hub-muted">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop by utility type */}
      <section className="mb-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--qu-text)]">
              Browse by utility
            </h2>
            <p className="mt-1 text-sm hub-muted">
              Quick categories inspired by the most popular tools on our site.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.path}
                to={tool.available ? tool.path : '/'}
                className="hub-card group rounded-2xl p-5 text-center transition hover:-translate-y-1 hover:border-[color:var(--qu-accent)]"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-accent-strong)] ring-1 ring-[color:var(--qu-border)] transition group-hover:bg-[color:var(--qu-accent-soft)]">
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="text-sm font-black text-[color:var(--qu-text)]">
                  {tool.name
                    .replace('QR Code Generator & Scanner', 'QR Codes')
                    .replace('Password Generator', 'Passwords')}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Available tools */}
      <section className="mb-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--qu-text)]">
              Today&apos;s tools of the day
            </h2>
            <p className="mt-1 text-sm hub-muted">
              Phase 1 tools are ready to use now.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-bold text-[color:var(--qu-text)] sm:block">
              Phase 2 starts after approval
            </span>
            <div className="rounded-xl bg-[color:var(--qu-accent)] px-4 py-3 text-sm font-black text-black">
              2 active
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableTools.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="mb-8">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[color:var(--qu-border)] pb-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--qu-text)]">
              Upcoming <span className="text-[color:var(--qu-accent-strong)]">tool categories</span>
            </h2>
            <p className="mt-1 text-sm hub-muted">
              The rest of the roadmap stays visible, like product categories.
            </p>
          </div>

          <button type="button" className="hub-button hidden sm:inline-flex">
            View all
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {upcomingTools.slice(0, 9).map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>

      {/* Dark SaaS-inspired panel */}
      <section>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0d1533] p-6 text-white shadow-2xl sm:p-8">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                <Boxes className="h-3.5 w-3.5" />
                Workspace mode
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Dark mode feels like a premium productivity dashboard.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/75 sm:text-base">
                The same landing page structure becomes a darker, more focused
                workspace when the user switches themes.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-black">Quick actions</span>
                  <Search className="h-4 w-4 text-blue-200" />
                </div>
                <div className="grid gap-2">
                  <div className="rounded-xl bg-blue-500/25 p-3 text-sm font-bold">
                    Generate secure password
                  </div>
                  <div className="rounded-xl bg-white/10 p-3 text-sm font-bold">
                    Create QR code
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-blue-200" />
                  <span className="font-black">Roadmap progress</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[12%] rounded-full bg-blue-400" />
                </div>
                <p className="mt-2 text-xs text-blue-100/70">
                  Phase 1 of 4 active
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}