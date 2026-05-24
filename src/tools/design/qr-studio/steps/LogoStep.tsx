import { ShieldCheck, Upload } from 'lucide-react';

import { LOGOS } from '../constants';
import type { ErrorCorrection } from '../types';
import { StepCard } from '../components/StepCard';
import { SelectInput } from '../components/Fields';

export function LogoStep({
  open,
  onToggle,
  logoType,
  setLogoType,
  onUploadLogo,
  ec,
  setEc,
}: {
  open: boolean;
  onToggle: () => void;
  logoType: string;
  setLogoType: (value: string) => void;
  onUploadLogo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ec: ErrorCorrection;
  setEc: (value: ErrorCorrection) => void;
}) {
  return (
    <StepCard
      number={3}
      title="Logo and advanced settings"
      subtitle="Add a center mark and choose error correction."
      Icon={ShieldCheck}
      open={open}
      onToggle={onToggle}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {LOGOS.map((logo) => {
            const active = logoType === logo.id;

            return (
              <button
                key={logo.id}
                type="button"
                onClick={() => setLogoType(logo.id)}
                className={`rounded-2xl border p-3 text-xs font-black transition ${
                  active
                    ? 'border-[color:var(--qu-accent)] bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]'
                    : 'border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]'
                }`}
              >
                <span
                  className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl text-white"
                  style={{
                    background:
                      logo.bg === 'transparent' ? 'var(--qu-muted)' : logo.bg,
                  }}
                >
                  {logo.sym}
                </span>
                {logo.label}
              </button>
            );
          })}
        </div>

        <label className="hub-secondary-button inline-flex cursor-pointer">
          <Upload className="h-4 w-4" />
          Upload logo
          <input
            type="file"
            accept="image/*"
            onChange={onUploadLogo}
            className="hidden"
          />
        </label>

        <SelectInput
          label="Error correction"
          value={ec}
          onChange={(value) => setEc(value as ErrorCorrection)}
          options={[
            { value: 'L', label: 'Low - 7%' },
            { value: 'M', label: 'Medium - 15%' },
            { value: 'Q', label: 'Quartile - 25%' },
            { value: 'H', label: 'High - 30%' },
          ]}
        />
      </div>
    </StepCard>
  );
}