import { ChevronDown, Link2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TYPES } from '../constants';
import type { ContentType, QRData } from '../types';
import { StepCard } from '../components/StepCard';
import {
  SelectInput,
  TextArea,
  TextInput,
  ToggleRow,
} from '../components/Fields';

const FEATURED_TYPE_IDS: ContentType[] = [
  'link',
  'text',
  'email',
  'call',
  'sms',
  'wifi',
];

function ContentForm({
  type,
  data,
  update,
}: {
  type: ContentType;
  data: QRData;
  update: (changes: Partial<QRData>) => void;
}) {
  if (type === 'link') {
    return (
      <TextInput
        label="URL"
        type="url"
        value={data.link}
        onChange={(value) => update({ link: value })}
        placeholder="https://example.com"
      />
    );
  }

  if (type === 'text') {
    return (
      <TextArea
        label="Text"
        value={data.text}
        onChange={(value) => update({ text: value })}
        placeholder="Enter your text..."
      />
    );
  }

  if (type === 'email') {
    return (
      <div className="space-y-4">
        <TextInput
          label="To"
          type="email"
          value={data.emailTo}
          onChange={(value) => update({ emailTo: value })}
        />
        <TextInput
          label="Subject"
          value={data.emailSub}
          onChange={(value) => update({ emailSub: value })}
        />
        <TextArea
          label="Body"
          value={data.emailBody}
          onChange={(value) => update({ emailBody: value })}
        />
      </div>
    );
  }

  if (type === 'call') {
    return (
      <TextInput
        label="Phone number"
        type="tel"
        value={data.phone}
        onChange={(value) => update({ phone: value })}
      />
    );
  }

  if (type === 'sms') {
    return (
      <div className="space-y-4">
        <TextInput
          label="To"
          type="tel"
          value={data.smsTo}
          onChange={(value) => update({ smsTo: value })}
        />
        <TextArea
          label="Message"
          value={data.smsMsg}
          onChange={(value) => update({ smsMsg: value })}
        />
      </div>
    );
  }

  if (type === 'vcard') {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="First name"
            value={data.vcFirst}
            onChange={(value) => update({ vcFirst: value })}
          />
          <TextInput
            label="Last name"
            value={data.vcLast}
            onChange={(value) => update({ vcLast: value })}
          />
        </div>
        <TextInput
          label="Phone"
          type="tel"
          value={data.vcPhone}
          onChange={(value) => update({ vcPhone: value })}
        />
        <TextInput
          label="Email"
          type="email"
          value={data.vcEmail}
          onChange={(value) => update({ vcEmail: value })}
        />
        <TextInput
          label="Organization"
          value={data.vcOrg}
          onChange={(value) => update({ vcOrg: value })}
        />
        <TextInput
          label="Website"
          type="url"
          value={data.vcUrl}
          onChange={(value) => update({ vcUrl: value })}
        />
      </div>
    );
  }

  if (type === 'whatsapp') {
    return (
      <div className="space-y-4">
        <TextInput
          label="Phone with country code"
          type="tel"
          value={data.waPhone}
          onChange={(value) => update({ waPhone: value })}
        />
        <TextArea
          label="Pre-filled message"
          value={data.waMsg}
          onChange={(value) => update({ waMsg: value })}
        />
      </div>
    );
  }

  if (type === 'wifi') {
    return (
      <div className="space-y-4">
        <TextInput
          label="Network name"
          value={data.wSsid}
          onChange={(value) => update({ wSsid: value })}
        />
        <TextInput
          label="Password"
          type="password"
          value={data.wPass}
          onChange={(value) => update({ wPass: value })}
        />
        <SelectInput
          label="Security"
          value={data.wEnc}
          onChange={(value) => update({ wEnc: value })}
          options={[
            { value: 'WPA', label: 'WPA/WPA2/WPA3' },
            { value: 'WEP', label: 'WEP' },
            { value: 'nopass', label: 'Open' },
          ]}
        />
      </div>
    );
  }

  if (type === 'pdf') {
    return (
      <TextInput
        label="PDF URL"
        type="url"
        value={data.pdfUrl}
        onChange={(value) => update({ pdfUrl: value })}
      />
    );
  }

  if (type === 'app') {
    return (
      <div className="space-y-4">
        <SelectInput
          label="Store"
          value={data.appStore}
          onChange={(value) => update({ appStore: value })}
          options={[
            { value: 'google', label: 'Google Play' },
            { value: 'apple', label: 'App Store' },
          ]}
        />
        <TextInput
          label="App ID / Bundle ID"
          value={data.appId}
          onChange={(value) => update({ appId: value })}
        />
      </div>
    );
  }

  if (type === 'image') {
    return (
      <TextInput
        label="Image URL"
        type="url"
        value={data.imgUrl}
        onChange={(value) => update({ imgUrl: value })}
      />
    );
  }

  if (type === 'video') {
    return (
      <TextInput
        label="Video URL"
        type="url"
        value={data.vidUrl}
        onChange={(value) => update({ vidUrl: value })}
      />
    );
  }

  if (type === 'social') {
    return (
      <div className="space-y-4">
        <SelectInput
          label="Platform"
          value={data.socialNet}
          onChange={(value) => update({ socialNet: value })}
          options={[
            'instagram',
            'twitter',
            'facebook',
            'linkedin',
            'tiktok',
            'youtube',
          ].map((item) => ({
            value: item,
            label: item.charAt(0).toUpperCase() + item.slice(1),
          }))}
        />
        <TextInput
          label="Profile URL"
          type="url"
          value={data.socialUrl}
          onChange={(value) => update({ socialUrl: value })}
        />
      </div>
    );
  }

  if (type === 'event') {
    return (
      <div className="space-y-4">
        <TextInput
          label="Event title"
          value={data.evTitle}
          onChange={(value) => update({ evTitle: value })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Start"
            type="datetime-local"
            value={data.evStart}
            onChange={(value) => update({ evStart: value })}
          />
          <TextInput
            label="End"
            type="datetime-local"
            value={data.evEnd}
            onChange={(value) => update({ evEnd: value })}
          />
        </div>
        <TextInput
          label="Location"
          value={data.evLoc}
          onChange={(value) => update({ evLoc: value })}
        />
        <TextArea
          label="Description"
          value={data.evDesc}
          onChange={(value) => update({ evDesc: value })}
        />
      </div>
    );
  }

  return (
    <TextInput
      label="Barcode data"
      value={data.barcodeData}
      onChange={(value) => update({ barcodeData: value })}
      placeholder="BARCODE-001"
    />
  );
}

function TypeButton({
  typeId,
  active,
  onClick,
}: {
  typeId: ContentType;
  active: boolean;
  onClick: () => void;
}) {
  const item = TYPES.find((option) => option.id === typeId);

  if (!item) return null;

  const Icon = item.Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
        active
          ? 'bg-[color:var(--qu-accent)] text-white shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20'
          : 'bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
      }`}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </button>
  );
}

export function ContentStep({
  open,
  onToggle,
  type,
  setType,
  data,
  updateData,
  dynamicQr,
  setDynamicQr,
  dynamicId,
}: {
  open: boolean;
  onToggle: () => void;
  type: ContentType;
  setType: (value: ContentType) => void;
  data: QRData;
  updateData: (changes: Partial<QRData>) => void;
  dynamicQr: boolean;
  setDynamicQr: (value: boolean) => void;
  dynamicId: string;
}) {
  const [moreTypesOpen, setMoreTypesOpen] = useState(false);

  const featuredTypes = useMemo(
    () => TYPES.filter((item) => FEATURED_TYPE_IDS.includes(item.id)),
    []
  );

  const moreTypes = useMemo(
    () => TYPES.filter((item) => !FEATURED_TYPE_IDS.includes(item.id)),
    []
  );

  const selectedMoreType = moreTypes.find((item) => item.id === type);
  const MoreTypeIcon = selectedMoreType?.Icon ?? ChevronDown;

  return (
    <StepCard
      number={1}
      title="Add content to your QR code"
      subtitle="Choose what the QR code should open or contain."
      Icon={Link2}
      open={open}
      onToggle={onToggle}
    >
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">
            QR type
          </p>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {featuredTypes.map((item) => (
              <TypeButton
                key={item.id}
                typeId={item.id}
                active={type === item.id}
                onClick={() => setType(item.id)}
              />
            ))}

            <div className="relative sm:col-span-2 xl:col-span-2">
              <button
                type="button"
                onClick={() => setMoreTypesOpen((value) => !value)}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2 text-sm font-black transition ${
                  selectedMoreType
                    ? 'border-[color:var(--qu-accent)] bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]'
                    : 'border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <MoreTypeIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {selectedMoreType
                      ? selectedMoreType.label
                      : `More types (${moreTypes.length})`}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition ${
                    moreTypesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreTypesOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface)] p-2 shadow-2xl shadow-black/15 dark:shadow-black/40">
                  <div className="grid gap-1 sm:grid-cols-2">
                    {moreTypes.map((item) => {
                      const Icon = item.Icon;
                      const active = type === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setType(item.id);
                            setMoreTypesOpen(false);
                          }}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-black transition ${
                            active
                              ? 'bg-[color:var(--qu-accent)] text-white'
                              : 'text-[color:var(--qu-muted)] hover:bg-[color:var(--qu-accent-soft)] hover:text-[color:var(--qu-accent-strong)]'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ContentForm type={type} data={data} update={updateData} />

        <ToggleRow
          active={dynamicQr}
          onChange={setDynamicQr}
          leftLabel="Static"
          rightLabel="Dynamic"
        />

        {dynamicQr && (
          <div className="rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] hub-muted">
              Simulated short URL
            </p>
            <p className="mt-2 break-all font-mono text-sm font-bold text-[color:var(--qu-accent-strong)]">
              https://qrs.to/{dynamicId}
            </p>
            <p className="mt-2 text-xs hub-muted">
              Dynamic QR editing would need a backend later. The preview still
              works locally.
            </p>
          </div>
        )}
      </div>
    </StepCard>
  );
}