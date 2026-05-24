import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, WalletCards } from 'lucide-react';

type RatesCache = {
  base: string;
  date: string;
  rates: Record<string, number>;
  cachedAt: number;
};

const CACHE_KEY = 'quickutility-currency-rates';
const CACHE_DURATION = 1000 * 60 * 60 * 6;

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'CHF',
  'CNY',
  'MXN',
  'INR',
];

export function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rates, setRates] = useState<RatesCache | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const converted = useMemo(() => {
    if (!rates) return 0;

    if (from === to) return amount;

    const fromRate = from === rates.base ? 1 : rates.rates[from];
    const toRate = to === rates.base ? 1 : rates.rates[to];

    if (!fromRate || !toRate) return 0;

    const amountInBase = amount / fromRate;
    return amountInBase * toRate;
  }, [amount, from, to, rates]);

  const fetchRates = async (force = false) => {
    setLoading(true);
    setStatus('');

    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      const cached: RatesCache | null = cachedRaw ? JSON.parse(cachedRaw) : null;

      if (
        !force &&
        cached &&
        Date.now() - cached.cachedAt < CACHE_DURATION
      ) {
        setRates(cached);
        setStatus('Using cached rates');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.app/latest?from=USD&to=${currencies
          .filter((currency) => currency !== 'USD')
          .join(',')}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rates');
      }

      const data = await response.json();

      const nextRates: RatesCache = {
        base: data.base,
        date: data.date,
        rates: data.rates,
        cachedAt: Date.now(),
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(nextRates));
      setRates(nextRates);
      setStatus('Rates updated');
    } catch {
      setStatus('Unable to update rates. Try again later.');

      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) setRates(JSON.parse(cachedRaw));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(false);
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Finance
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Currency Converter
        </h2>
        <p className="mt-2 hub-muted">
          Convert currencies using public exchange-rate data with local caching.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="hub-card rounded-3xl p-6">
          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                Amount
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="hub-input"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <CurrencySelect label="From" value={from} onChange={setFrom} />
              <CurrencySelect label="To" value={to} onChange={setTo} />
            </div>

            <button
              type="button"
              onClick={() => fetchRates(true)}
              className="hub-secondary-button"
              disabled={loading}
            >
              <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Refresh rates
            </button>

            {status && <p className="text-sm font-bold hub-muted">{status}</p>}
          </div>
        </section>

        <aside className="hub-card rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <WalletCards className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Conversion result
          </h3>

          <div className="mt-6 rounded-3xl bg-[color:var(--qu-accent-soft)] p-6">
            <p className="text-sm font-bold hub-muted">
              {amount.toLocaleString()} {from} equals
            </p>
            <p className="mt-2 break-words text-4xl font-black text-[color:var(--qu-text)]">
              {converted.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-2 text-sm font-black uppercase text-[color:var(--qu-accent-strong)]">
              {to}
            </p>
          </div>

          {rates && (
            <p className="mt-4 text-sm leading-6 hub-muted">
              Rate date: <strong>{rates.date}</strong>. Cached locally for faster
              reuse.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function CurrencySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="hub-input"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </label>
  );
}