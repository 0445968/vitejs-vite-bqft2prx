import { useMemo, useState } from 'react';
import { CircleDollarSign, Download, ReceiptText } from 'lucide-react';

type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

function calculateLoan(
  principal: number,
  annualRate: number,
  years: number
) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;
  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(balance - principalPaid, 0);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

function money(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function LoanEMICalculator() {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const result = useMemo(
    () => calculateLoan(principal, rate, years),
    [principal, rate, years]
  );

  const downloadCsv = () => {
    const header = 'Month,Payment,Principal,Interest,Balance';
    const rows = result.schedule.map((row) =>
      [
        row.month,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2),
      ].join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'loan-amortization.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Finance
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Loan / EMI Calculator
        </h2>
        <p className="mt-2 hub-muted">
          Calculate monthly payments, total interest, and a full amortization
          schedule.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
        <aside className="hub-card h-fit rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <CircleDollarSign className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Loan details
          </h3>

          <div className="mt-6 grid gap-5">
            <NumberField
              label="Loan amount"
              value={principal}
              onChange={setPrincipal}
              prefix="$"
            />

            <NumberField
              label="Annual interest rate"
              value={rate}
              onChange={setRate}
              suffix="%"
              step="0.01"
            />

            <NumberField
              label="Loan term"
              value={years}
              onChange={setYears}
              suffix="yrs"
            />
          </div>

          <div className="mt-6 grid gap-3">
            <SummaryCard
              label="Monthly payment"
              value={money(result.monthlyPayment)}
              highlight
            />
            <SummaryCard label="Total interest" value={money(result.totalInterest)} />
            <SummaryCard label="Total payment" value={money(result.totalPayment)} />
          </div>
        </aside>

        <section className="hub-card min-w-0 rounded-3xl p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                <ReceiptText className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                Amortization table
              </h3>

              <p className="text-sm hub-muted">
                Full month-by-month payment breakdown.
              </p>
            </div>

            <button type="button" onClick={downloadCsv} className="hub-button">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="max-h-[620px] overflow-auto rounded-2xl border border-[color:var(--qu-border)]">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-[color:var(--qu-surface-soft)]">
                <tr>
                  <Th>Month</Th>
                  <Th>Payment</Th>
                  <Th>Principal</Th>
                  <Th>Interest</Th>
                  <Th>Balance</Th>
                </tr>
              </thead>

              <tbody>
                {result.schedule.map((row) => (
                  <tr
                    key={row.month}
                    className="border-t border-[color:var(--qu-border)]"
                  >
                    <Td>{row.month}</Td>
                    <Td>{money(row.payment)}</Td>
                    <Td>{money(row.principal)}</Td>
                    <Td>{money(row.interest)}</Td>
                    <Td>{money(row.balance)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = '1',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
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
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`hub-input ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-14' : ''}`}
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

function SummaryCard({
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-wide text-[color:var(--qu-muted)]">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="whitespace-nowrap px-4 py-3 font-bold text-[color:var(--qu-text)]">
      {children}
    </td>
  );
}