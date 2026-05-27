import { useEffect, useMemo, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import {
  Barcode,
  Check,
  Copy,
  Download,
  MoreHorizontal,
  Palette,
  RefreshCw,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

type BarcodeFormat =
  | 'CODE128'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'CODE39'
  | 'ITF14'
  | 'MSI'
  | 'pharmacode'
  | 'codabar';

type BarcodeOptions = {
  value: string;
  format: BarcodeFormat;
  lineColor: string;
  background: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  margin: number;
};

const FORMAT_OPTIONS: Array<{
  id: BarcodeFormat;
  label: string;
  sample: string;
  description: string;
}> = [
  {
    id: 'CODE128',
    label: 'Code 128',
    sample: 'QUICK-UTILITY-2026',
    description: 'Best all-purpose barcode for text, numbers, and IDs.',
  },
  {
    id: 'EAN13',
    label: 'EAN-13',
    sample: '5901234123457',
    description: 'Retail product barcode used globally.',
  },
  {
    id: 'EAN8',
    label: 'EAN-8',
    sample: '96385074',
    description: 'Compact retail barcode for smaller packaging.',
  },
  {
    id: 'UPC',
    label: 'UPC',
    sample: '123456789999',
    description: 'Common product barcode in North America.',
  },
  {
    id: 'CODE39',
    label: 'Code 39',
    sample: 'QUICK123',
    description: 'Simple barcode for inventory and internal labels.',
  },
  {
    id: 'ITF14',
    label: 'ITF-14',
    sample: '10012345000017',
    description: 'Packaging and shipping carton barcode.',
  },
  {
    id: 'MSI',
    label: 'MSI',
    sample: '1234567890',
    description: 'Inventory and warehouse barcode.',
  },
  {
    id: 'pharmacode',
    label: 'Pharmacode',
    sample: '12345',
    description: 'Pharmaceutical packaging barcode.',
  },
  {
    id: 'codabar',
    label: 'Codabar',
    sample: 'A123456A',
    description: 'Libraries, blood banks, and older inventory systems.',
  },
];

const DEFAULT_OPTIONS: BarcodeOptions = {
  value: 'QUICK-UTILITY-2026',
  format: 'CODE128',
  lineColor: '#0f172a',
  background: '#ffffff',
  width: 2,
  height: 96,
  displayValue: true,
  fontSize: 18,
  margin: 16,
};

const RANDOM_COLORS = [
  '#0f172a',
  '#1e293b',
  '#2563eb',
  '#06b6d4',
  '#22c55e',
  '#84cc16',
  '#f97316',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
];

const RANDOM_BACKGROUNDS = [
  '#ffffff',
  '#f8fafc',
  '#eff6ff',
  '#ecfeff',
  '#f0fdf4',
  '#fff7ed',
  '#fdf2f8',
  '#f5f3ff',
];

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function getFormatSample(format: BarcodeFormat) {
  return FORMAT_OPTIONS.find((item) => item.id === format)?.sample ?? 'QUICK-UTILITY-2026';
}

export function BarcodeStudio() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [options, setOptions] = useState<BarcodeOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState('');
  const [previewKey, setPreviewKey] = useState(0);

  const selectedFormat = useMemo(
    () => FORMAT_OPTIONS.find((item) => item.id === options.format) ?? FORMAT_OPTIONS[0],
    [options.format]
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
  
    const value = options.value.trim() || getFormatSample(options.format);
  
    // Important: clear the previous broken SVG render before trying again.
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('viewBox');
  
    try {
      JsBarcode(svg, value, {
        format: options.format,
        lineColor: options.lineColor,
        background: options.background,
        width: options.width,
        height: options.height,
        displayValue: options.displayValue,
        fontSize: options.fontSize,
        margin: options.margin,
        valid: (valid) => {
          if (!valid) {
            throw new Error(`"${value}" is not valid for ${options.format}.`);
          }
        },
      });
  
      setRenderError('');
    } catch (error) {
      setRenderError(
        error instanceof Error
          ? error.message
          : `Unable to generate ${options.format} barcode.`
      );
    }
  }, [options]);

  function updateOptions(updates: Partial<BarcodeOptions>) {
    setOptions((current) => ({ ...current, ...updates }));
  }

  function selectFormat(format: BarcodeFormat) {
    setRenderError('');
    setPreviewKey((current) => current + 1);
  
    setOptions((current) => ({
      ...current,
      format,
      value: getFormatSample(format),
    }));
  }

  function randomizeBarcode() {
    updateOptions({
      lineColor: pickRandom(RANDOM_COLORS),
      background: pickRandom(RANDOM_BACKGROUNDS),
      width: pickRandom([1, 1.5, 2, 2.5, 3]),
      height: pickRandom([72, 88, 96, 112, 128, 144]),
      fontSize: pickRandom([14, 16, 18, 20, 22]),
      margin: pickRandom([8, 12, 16, 20, 24]),
      displayValue: Math.random() > 0.2,
    });
  }

  function resetBarcode() {
    setRenderError('');
    setPreviewKey((current) => current + 1);
    setOptions({ ...DEFAULT_OPTIONS });
  }
 
  function downloadBarcode() {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `quickutility-barcode-${Date.now()}.svg`;
    link.click();

    URL.revokeObjectURL(url);
  }

  async function copyBarcode() {
    try {
      await navigator.clipboard.writeText(options.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="xl:ml-[76px]">
        <BarcodeStudioToolbar
          value={options.value}
          copied={copied}
          onCopy={copyBarcode}
          onDownload={downloadBarcode}
        />

        <div className="min-h-[calc(100dvh-7.5rem)] xl:grid xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0">
            <BarcodeStudioHeader
              selectedFormat={selectedFormat.label}
              onRandomize={randomizeBarcode}
              onReset={resetBarcode}
            />

            <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
              <div className="space-y-5 pb-10">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="mb-5">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">
                      Barcode format
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Choose the barcode type that fits your product, label, or inventory workflow.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {FORMAT_OPTIONS.map((format) => {
                      const active = options.format === format.id;

                      return (
                        <button
                          key={format.id}
                          type="button"
                          onClick={() => selectFormat(format.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            active
                              ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-500/10'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-black text-slate-950 dark:text-white">
                              {format.label}
                            </p>

                            {active && (
                              <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                                Active
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            {format.description}
                          </p>

                          <p className="mt-3 truncate rounded-xl bg-white px-3 py-2 font-mono text-xs font-bold text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
                            {format.sample}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="mb-5">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">
                      Barcode data
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Enter the value that should be encoded into your barcode.
                    </p>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Encoded value
                    </span>

                    <input
                      value={options.value}
                      onChange={(event) => updateOptions({ value: event.target.value })}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-400"
                      placeholder={selectedFormat.sample}
                    />
                  </label>

                  {renderError && (
                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">
                      {renderError}
                    </div>
                  )}
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                      <Palette className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950 dark:text-white">
                        Appearance
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Customize the barcode style while keeping it scanner-friendly.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ColorField
                      label="Bar color"
                      value={options.lineColor}
                      onChange={(value) => updateOptions({ lineColor: value })}
                    />

                    <ColorField
                      label="Background"
                      value={options.background}
                      onChange={(value) => updateOptions({ background: value })}
                    />

                    <SliderField
                      label="Bar width"
                      value={options.width}
                      min={1}
                      max={4}
                      step={0.5}
                      onChange={(value) => updateOptions({ width: value })}
                    />

                    <SliderField
                      label="Height"
                      value={options.height}
                      min={48}
                      max={180}
                      step={4}
                      onChange={(value) => updateOptions({ height: value })}
                    />

                    <SliderField
                      label="Font size"
                      value={options.fontSize}
                      min={10}
                      max={28}
                      step={1}
                      onChange={(value) => updateOptions({ fontSize: value })}
                    />

                    <SliderField
                      label="Margin"
                      value={options.margin}
                      min={0}
                      max={36}
                      step={2}
                      onChange={(value) => updateOptions({ margin: value })}
                    />
                  </div>

                  <label className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <span>
                      <span className="block text-sm font-black text-slate-950 dark:text-white">
                        Display barcode value
                      </span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">
                        Show readable text below the bars.
                      </span>
                    </span>

                    <input
                      type="checkbox"
                      checked={options.displayValue}
                      onChange={(event) => updateOptions({ displayValue: event.target.checked })}
                      className="h-5 w-5 accent-blue-600"
                    />
                  </label>
                </section>
              </div>
            </main>
          </div>

          <aside className="border-t border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6 xl:sticky xl:top-[7.5rem] xl:block xl:h-[calc(100dvh-7.5rem)] xl:self-start xl:overflow-hidden xl:border-t-0">
          <BarcodePreviewPanel
            previewKey={previewKey}
            svgRef={svgRef}
            options={options}
            formatLabel={selectedFormat.label}
            error={renderError}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}


function BarcodeStudioToolbar({
  value,
  copied,
  onCopy,
  onDownload,
}: {
  value: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="sticky top-16 z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <Barcode className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />

          <p className="min-w-0 max-w-[320px] truncate text-sm font-semibold text-slate-600 dark:text-slate-400 md:max-w-[460px] xl:max-w-[620px]">
            {value || 'No barcode data added yet'}
          </p>
        </div>

        <div className="ml-auto flex h-full min-w-0 items-center justify-end gap-1.5 overflow-x-auto">
          <ToolbarIcon title="Undo">
            <RotateCcw className="h-4 w-4" />
          </ToolbarIcon>

          <div className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800" />

          <ToolbarIcon title="Smart barcode">
            <Sparkles className="h-4 w-4" />
          </ToolbarIcon>

          <ToolbarIcon title="Advanced settings">
            <SlidersHorizontal className="h-4 w-4" />
          </ToolbarIcon>

          <ToolbarIcon title="More options">
            <MoreHorizontal className="h-4 w-4" />
          </ToolbarIcon>

          <div className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800" />

          <ToolbarIcon title={copied ? 'Copied' : 'Copy barcode value'} onClick={onCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </ToolbarIcon>

          <ToolbarIcon title="Download barcode" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </ToolbarIcon>
        </div>
      </div>
    </div>
  );
}

function BarcodeStudioHeader({
  selectedFormat,
  onRandomize,
  onReset,
}: {
  selectedFormat: string;
  onRandomize: () => void;
  onReset: () => void;
}) {
  return (
    <header className="shrink-0 bg-white px-4 py-4 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 sm:flex">
            <Barcode className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Barcode Studio
              </span>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                {selectedFormat}
              </span>
            </div>

            <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Barcode Generator
            </h2>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create scanner-ready barcodes for products, inventory, labels, and packaging.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-black text-slate-700 ring-1 ring-inset ring-slate-200/60 transition hover:bg-slate-200/60 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700/50 dark:hover:bg-slate-800"
            title="Reset barcode"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRandomize}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            title="Randomize barcode style"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function BarcodePreviewPanel({
    previewKey,
    svgRef,
    options,
    formatLabel,
    error,
  }: {
    previewKey: number;
    svgRef: React.RefObject<SVGSVGElement>;
    options: BarcodeOptions;
    formatLabel: string;
    error: string;
  }) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-col justify-center">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  Live Preview
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatLabel}
                </p>
              </div>
  
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                SVG
              </span>
            </div>
  
            <div
              className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 p-4 dark:border-slate-800"
              style={{ background: options.background }}
            >
              <svg
                key={previewKey}
                ref={svgRef}
                className={`max-h-full max-w-full transition-opacity ${
                  error ? 'opacity-20' : 'opacity-100'
                }`}
              />
  
              {error && (
                <div className="absolute inset-4 flex items-center justify-center rounded-[1.25rem] bg-white/85 p-4 backdrop-blur-sm dark:bg-slate-950/85">
                  <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-center text-sm font-bold text-red-600 dark:text-red-300">
                    {error}
                  </div>
                </div>
              )}
            </div>
  
            <div className="mt-5 grid grid-cols-2 gap-3">
              <PreviewStat label="Value" value={options.value || '—'} />
              <PreviewStat label="Format" value={options.format} />
              <PreviewStat label="Width" value={`${options.width}px`} />
              <PreviewStat label="Height" value={`${options.height}px`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <span className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border-0 bg-transparent p-0"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm font-bold text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>
    </label>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {label}
        </span>

        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
          {value}
        </span>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />
    </label>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}

function ToolbarIcon({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {children}
    </button>
  );
}