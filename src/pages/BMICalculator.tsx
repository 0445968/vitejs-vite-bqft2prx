import { useMemo, useState } from 'react';
import { HeartPulse } from 'lucide-react';

export function BMICalculator() {
  const [height, setHeight] = useState(70);
  const [weight, setWeight] = useState(170);

  const bmi = useMemo(() => {
    return (weight / (height * height)) * 703;
  }, [height, weight]);

  const category = useMemo(() => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }, [bmi]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Health
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          BMI / Health Calculator
        </h2>
        <p className="mt-2 hub-muted">
          Estimate BMI using height and weight.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="hub-card rounded-3xl p-6">
          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                Height in inches
              </span>
              <input
                type="number"
                value={height}
                onChange={(event) => setHeight(Number(event.target.value))}
                className="hub-input"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                Weight in pounds
              </span>
              <input
                type="number"
                value={weight}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="hub-input"
              />
            </label>
          </div>
        </section>

        <aside className="hub-card rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <HeartPulse className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Your BMI
          </h3>

          <div className="mt-6 rounded-3xl bg-[color:var(--qu-accent-soft)] p-6 text-center">
            <p className="text-5xl font-black text-[color:var(--qu-text)]">
              {bmi.toFixed(1)}
            </p>
            <p className="mt-2 text-sm font-black uppercase text-[color:var(--qu-accent-strong)]">
              {category}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 hub-muted">
            BMI is a general estimate and does not replace medical advice.
          </p>
        </aside>
      </div>
    </div>
  );
}