import { useMemo, useState } from 'react';
import { Calculator, Receipt, Users } from 'lucide-react';

export function TipCalculator() {
  const [bill, setBill] = useState(85);
  const [tipPercent, setTipPercent] = useState(20);
  const [people, setPeople] = useState(2);

  const result = useMemo(() => {
    const tip = bill * (tipPercent / 100);
    const total = bill + tip;
    const perPerson = people > 0 ? total / people : total;

    return {
      tip,
      total,
      perPerson,
    };
  }, [bill, tipPercent, people]);

  return (
    <div className="mx-auto max-w-5xl">
      <ToolHeader
        label="Calculator"
        title="Tip Calculator"
        description="Calculate tips, totals, and split bills instantly."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="hub-card rounded-3xl p-6">
          <div className="grid gap-5">
            <NumberField
              label="Bill amount"
              value={bill}
              onChange={setBill}
              prefix="$"
            />

            <NumberField
              label="Tip percentage"
              value={tipPercent}
              onChange={setTipPercent}
              suffix="%"
            />

            <NumberField
              label="Number of people"
              value={people}
              onChange={setPeople}
            />

            <div className="grid grid-cols-4 gap-3">
              {[10, 15, 18, 20].map((percent) => (
                <button
                  key={percent}
                  type="button"
                  onClick={() => setTipPercent(percent)}
                  className={
                    tipPercent === percent
                      ? 'hub-button'
                      : 'hub-secondary-button'
                  }
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="hub-card rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Receipt className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Bill summary
          </h3>

          <div className="mt-6 space-y-4">
            <SummaryRow label="Tip amount" value={`$${result.tip.toFixed(2)}`} />
            <SummaryRow label="Total bill" value={`$${result.total.toFixed(2)}`} />
            <SummaryRow
              label="Per person"
              value={`$${result.perPerson.toFixed(2)}`}
              highlight
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToolHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
        {label}
      </p>
      <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
        {title}
      </h2>
      <p className="mt-2 hub-muted">{description}</p>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
        {label}
      </span>

      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold hub-muted">
            {prefix}
          </span>
        )}

        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`hub-input ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-10' : ''}`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold hub-muted">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-2xl bg-[color:var(--qu-accent-soft)] p-4'
          : 'rounded-2xl bg-[color:var(--qu-surface-soft)] p-4'
      }
    >
      <p className="text-sm font-bold hub-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-[color:var(--qu-text)]">
        {value}
      </p>
    </div>
  );
}