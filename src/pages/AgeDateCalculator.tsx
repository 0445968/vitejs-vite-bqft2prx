import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function AgeDateCalculator() {
  const [birthDate, setBirthDate] = useState('1995-01-01');
  const [targetDate, setTargetDate] = useState(getTodayString());

  const result = useMemo(() => {
    const start = new Date(birthDate);
    const end = new Date(targetDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return null;
    }

    const diffMs = end.getTime() - start.getTime();
    const days = Math.floor(diffMs / 86_400_000);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (end.getDate() < start.getDate()) months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {
      years,
      months,
      days,
      weeks: Math.floor(days / 7),
    };
  }, [birthDate, targetDate]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Calculator
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Age / Date Calculator
        </h2>
        <p className="mt-2 hub-muted">
          Calculate age, duration, weeks, and total days between dates.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="hub-card rounded-3xl p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                Start date
              </span>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="hub-input"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                End date
              </span>
              <input
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                className="hub-input"
              />
            </label>
          </div>
        </section>

        <aside className="hub-card rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <CalendarDays className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Result
          </h3>

          {result ? (
            <div className="mt-6 grid gap-3">
              <Stat label="Years" value={result.years} />
              <Stat label="Months after years" value={result.months} />
              <Stat label="Total weeks" value={result.weeks} />
              <Stat label="Total days" value={result.days} />
            </div>
          ) : (
            <p className="mt-4 hub-muted">Enter valid dates.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-4">
      <p className="text-sm font-bold hub-muted">{label}</p>
      <p className="text-2xl font-black text-[color:var(--qu-text)]">
        {value}
      </p>
    </div>
  );
}