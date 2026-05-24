import type { ReactNode } from 'react';

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[color:var(--qu-muted)]">
      {children}
    </span>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="hub-input"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="hub-input min-h-24 resize-y"
      />
    </label>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="hub-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 cursor-pointer rounded-xl border border-[color:var(--qu-border)] bg-transparent p-1"
        />
        <code className="rounded-xl bg-[color:var(--qu-surface-soft)] px-3 py-2 text-xs font-bold hub-muted">
          {value}
        </code>
      </div>
    </label>
  );
}

export function ToggleRow({
  active,
  onChange,
  leftLabel,
  rightLabel,
}: {
  active: boolean;
  onChange: (value: boolean) => void;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={active ? 'hub-secondary-button' : 'hub-button'}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={active ? 'hub-button' : 'hub-secondary-button'}
      >
        {rightLabel}
      </button>
    </div>
  );
}

export function ChoiceGrid<T extends string>({
  items,
  value,
  onChange,
  columns = 'grid-cols-2 sm:grid-cols-4',
}: {
  items: Array<{ id: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  columns?: string;
}) {
  return (
    <div className={`grid gap-2 ${columns}`}>
      {items.map((item) => {
        const active = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-2xl border px-3 py-3 text-center text-xs font-black transition ${
              active
                ? 'border-[color:var(--qu-accent)] bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]'
                : 'border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}