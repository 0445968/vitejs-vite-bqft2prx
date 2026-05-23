import { useMemo, useState } from 'react';
import { Check, Copy, RefreshCw, ShieldCheck } from 'lucide-react';

type PasswordOptions = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length: number, options: PasswordOptions) {
  const activeSets = Object.entries(options).filter(([, enabled]) => enabled);

  if (activeSets.length === 0) return '';

  const allChars = activeSets
    .map(([key]) => CHARSETS[key as keyof typeof CHARSETS])
    .join('');

  const requiredChars = activeSets.map(([key]) => {
    const chars = CHARSETS[key as keyof typeof CHARSETS];
    return chars[Math.floor(Math.random() * chars.length)];
  });

  const remainingLength = Math.max(length - requiredChars.length, 0);

  const randomChars = Array.from({ length: remainingLength }, () => {
    return allChars[Math.floor(Math.random() * allChars.length)];
  });

  return [...requiredChars, ...randomChars]
    .sort(() => Math.random() - 0.5)
    .join('');
}

function getStrengthScore(password: string, options: PasswordOptions) {
  let score = 0;

  if (password.length >= 10) score += 1;
  if (password.length >= 14) score += 1;
  if (password.length >= 18) score += 1;

  const enabledTypes = Object.values(options).filter(Boolean).length;
  score += enabledTypes;

  return Math.min(score, 6);
}

function getStrengthLabel(score: number) {
  if (score <= 2) return 'Weak';
  if (score <= 4) return 'Good';
  return 'Strong';
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const password = useMemo(() => {
    return generatePassword(length, options);
  }, [length, options, refreshKey]);

  const strengthScore = getStrengthScore(password, options);
  const strengthLabel = getStrengthLabel(strengthScore);

  const copyPassword = async () => {
    if (!password) return;

    await navigator.clipboard.writeText(password);
    setCopied(true);

    window.setTimeout(() => setCopied(false), 1500);
  };

  const updateOption = (key: keyof PasswordOptions) => {
    setOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const enabledCount = Object.values(options).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Utility
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--qu-text)]">
          Password Generator
        </h2>

        <p className="mt-2 hub-muted">
          Create strong, customizable passwords with a live strength meter.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="glass-card rounded-[2rem] p-5 sm:p-6">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Generated password
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={password}
                readOnly
                className="premium-input font-mono"
                placeholder="Select at least one option"
              />

              <button
                type="button"
                onClick={copyPassword}
                disabled={!password}
                className="premium-button shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Length
              </label>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                {length}
              </span>
            </div>

            <input
              type="range"
              min={8}
              max={32}
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
              className="w-full accent-slate-950 dark:accent-white"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PasswordOption
              label="Uppercase letters"
              checked={options.uppercase}
              onClick={() => updateOption('uppercase')}
            />

            <PasswordOption
              label="Lowercase letters"
              checked={options.lowercase}
              onClick={() => updateOption('lowercase')}
            />

            <PasswordOption
              label="Numbers"
              checked={options.numbers}
              onClick={() => updateOption('numbers')}
            />

            <PasswordOption
              label="Symbols"
              checked={options.symbols}
              onClick={() => updateOption('symbols')}
            />
          </div>

          {enabledCount === 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-400/20 dark:bg-amber-950/30 dark:text-amber-300">
              Select at least one character type to generate a password.
            </div>
          )}

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="secondary-button mt-6 w-full"
          >
            <RefreshCw className="h-4 w-4" />
            Generate new password
          </button>
        </section>

        <aside className="glass-card rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-bold text-[color:var(--qu-text)]">
            Strength: {strengthLabel}
          </h3>

          <p className="mt-2 text-sm leading-6 hub-muted">
            Longer passwords with mixed character types are much harder to
            guess. For important accounts, use at least 16 characters.
          </p>

          <div className="mt-6 grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={
                  index < strengthScore
                    ? 'h-3 rounded-full bg-slate-950 dark:bg-white'
                    : 'h-3 rounded-full bg-slate-200 dark:bg-white/10'
                }
              />
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Length</span>
              <strong>{length} characters</strong>
            </div>

            <div className="flex items-center justify-between">
              <span>Character types</span>
              <strong>{enabledCount} selected</strong>
            </div>

            <div className="flex items-center justify-between">
              <span>Local only</span>
              <strong>Yes</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

type PasswordOptionProps = {
  label: string;
  checked: boolean;
  onClick: () => void;
};

function PasswordOption({ label, checked, onClick }: PasswordOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/50 dark:hover:bg-white/10"
    >
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>

      <span
        className={
          checked
            ? 'flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950'
            : 'h-6 w-6 rounded-full border border-slate-300 dark:border-white/20'
        }
      >
        {checked && <Check className="h-4 w-4" />}
      </span>
    </button>
  );
}
