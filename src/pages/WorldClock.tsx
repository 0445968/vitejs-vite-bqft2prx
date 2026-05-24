import { useEffect, useMemo, useState } from 'react';
import { Clock3, Plus, Trash2 } from 'lucide-react';

type City = {
  label: string;
  timeZone: string;
};

const STORAGE_KEY = 'quickutility-world-clock-cities';

const cityOptions: City[] = [
  { label: 'New York', timeZone: 'America/New_York' },
  { label: 'Los Angeles', timeZone: 'America/Los_Angeles' },
  { label: 'Chicago', timeZone: 'America/Chicago' },
  { label: 'London', timeZone: 'Europe/London' },
  { label: 'Paris', timeZone: 'Europe/Paris' },
  { label: 'Dubai', timeZone: 'Asia/Dubai' },
  { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { label: 'Sydney', timeZone: 'Australia/Sydney' },
  { label: 'Singapore', timeZone: 'Asia/Singapore' },
  { label: 'Toronto', timeZone: 'America/Toronto' },
];

function getInitialCities(): City[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : [
          { label: 'New York', timeZone: 'America/New_York' },
          { label: 'London', timeZone: 'Europe/London' },
          { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
        ];
  } catch {
    return [
      { label: 'New York', timeZone: 'America/New_York' },
      { label: 'London', timeZone: 'Europe/London' },
      { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
    ];
  }
}

export function WorldClock() {
  const [cities, setCities] = useState<City[]>(getInitialCities);
  const [selectedZone, setSelectedZone] = useState(cityOptions[0].timeZone);
  const [now, setNow] = useState(new Date());

  const selectedCity = useMemo(
    () => cityOptions.find((city) => city.timeZone === selectedZone),
    [selectedZone]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const addCity = () => {
    if (!selectedCity) return;

    const exists = cities.some((city) => city.timeZone === selectedCity.timeZone);
    if (exists) return;

    setCities((current) => [...current, selectedCity]);
  };

  const removeCity = (timeZone: string) => {
    setCities((current) => current.filter((city) => city.timeZone !== timeZone));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Time
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          World Clock
        </h2>
        <p className="mt-2 hub-muted">
          Add multiple cities and track live local times.
        </p>
      </div>

      <section className="hub-card mb-6 rounded-3xl p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label>
            <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
              Add city
            </span>

            <select
              value={selectedZone}
              onChange={(event) => setSelectedZone(event.target.value)}
              className="hub-input"
            >
              {cityOptions.map((city) => (
                <option key={city.timeZone} value={city.timeZone}>
                  {city.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button type="button" onClick={addCity} className="hub-button w-full">
              <Plus className="h-4 w-4" />
              Add clock
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => {
          const time = new Intl.DateTimeFormat(undefined, {
            timeZone: city.timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(now);

          const date = new Intl.DateTimeFormat(undefined, {
            timeZone: city.timeZone,
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          }).format(now);

          return (
            <div key={city.timeZone} className="hub-card rounded-3xl p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                  <Clock3 className="h-7 w-7" />
                </div>

                <button
                  type="button"
                  onClick={() => removeCity(city.timeZone)}
                  className="hub-icon-button"
                  aria-label={`Remove ${city.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                {city.label}
              </h3>

              <p className="mt-2 text-4xl font-black tracking-tight text-[color:var(--qu-text)]">
                {time}
              </p>

              <p className="mt-2 text-sm font-bold hub-muted">{date}</p>
              <p className="mt-4 rounded-2xl bg-[color:var(--qu-surface-soft)] p-3 text-xs font-bold hub-muted">
                {city.timeZone}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}