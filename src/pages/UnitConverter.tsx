import { useMemo, useState } from 'react';
import { Scale } from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature';

const units = {
  length: {
    label: 'Length',
    options: {
      meters: 1,
      kilometers: 1000,
      miles: 1609.344,
      feet: 0.3048,
      inches: 0.0254,
    },
  },
  weight: {
    label: 'Weight',
    options: {
      grams: 1,
      kilograms: 1000,
      pounds: 453.59237,
      ounces: 28.3495,
    },
  },
  temperature: {
    label: 'Temperature',
    options: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
    },
  },
};

function convertTemperature(value: number, from: string, to: string) {
  let celsius = value;

  if (from === 'fahrenheit') celsius = (value - 32) * (5 / 9);
  if (from === 'kelvin') celsius = value - 273.15;

  if (to === 'fahrenheit') return celsius * (9 / 5) + 32;
  if (to === 'kelvin') return celsius + 273.15;

  return celsius;
}

export function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [value, setValue] = useState(100);
  const [from, setFrom] = useState('meters');
  const [to, setTo] = useState('feet');

  const options = Object.keys(units[category].options);

  const result = useMemo(() => {
    if (category === 'temperature') {
      return convertTemperature(value, from, to);
    }

    const optionMap = units[category].options as Record<string, number>;
    return (value * optionMap[from]) / optionMap[to];
  }, [category, value, from, to]);

  const changeCategory = (next: Category) => {
    setCategory(next);
    const nextOptions = Object.keys(units[next].options);
    setFrom(nextOptions[0]);
    setTo(nextOptions[1]);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Converter
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Unit Converter
        </h2>
        <p className="mt-2 hub-muted">
          Convert length, weight, and temperature.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="hub-card rounded-3xl p-6">
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {Object.entries(units).map(([key, item]) => (
              <button
                key={key}
                onClick={() => changeCategory(key as Category)}
                className={category === key ? 'hub-button' : 'hub-secondary-button'}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                Value
              </span>
              <input
                type="number"
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
                className="hub-input"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  From
                </span>
                <select
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="hub-input"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  To
                </span>
                <select
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="hub-input"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <aside className="hub-card rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Scale className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Result
          </h3>

          <div className="mt-6 rounded-3xl bg-[color:var(--qu-accent-soft)] p-6">
            <p className="text-sm font-bold hub-muted">
              {value} {from} equals
            </p>
            <p className="mt-2 break-words text-4xl font-black text-[color:var(--qu-text)]">
              {Number.isFinite(result) ? result.toFixed(4) : '0'}
            </p>
            <p className="mt-2 text-sm font-black uppercase text-[color:var(--qu-accent-strong)]">
              {to}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}