import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Lock,
  Paintbrush,
  Palette,
  RefreshCw,
  Shuffle,
  Sparkles,
  Unlock,
} from 'lucide-react';

import { cn } from '../../../utils/cn';

type PaletteColor = {
  id: string;
  hex: string;
  locked: boolean;
};

type HarmonyMode = 'random' | 'analogous' | 'monochrome' | 'triadic' | 'complementary';
type ExportFormat = 'css' | 'tailwind' | 'json';

type RGB = {
  r: number;
  g: number;
  b: number;
};

type HSL = {
  h: number;
  s: number;
  l: number;
};

const DEFAULT_PALETTE = ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'];
const COLOR_COUNT = 5;

const makeId = () => Math.random().toString(36).slice(2, 10);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeHex = (value: string) => {
  const cleaned = value.replace(/[^a-fA-F0-9]/g, '').slice(0, 6);

  if (cleaned.length === 3) {
    return `#${cleaned
      .split('')
      .map((char) => char + char)
      .join('')}`.toUpperCase();
  }

  return `#${cleaned.padEnd(6, '0')}`.toUpperCase();
};

const hexToRgb = (hex: string): RGB => {
  const normalized = normalizeHex(hex).replace('#', '');
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6);
    if (max === green) h = 60 * ((blue - red) / delta + 2);
    if (max === blue) h = 60 * ((red - green) / delta + 4);
  }

  return {
    h: (h + 360) % 360,
    s: s * 100,
    l: l * 100,
  };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const match = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) [red, green, blue] = [chroma, x, 0];
  else if (h < 120) [red, green, blue] = [x, chroma, 0];
  else if (h < 180) [red, green, blue] = [0, chroma, x];
  else if (h < 240) [red, green, blue] = [0, x, chroma];
  else if (h < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return {
    r: (red + match) * 255,
    g: (green + match) * 255,
    b: (blue + match) * 255,
  };
};

const randomHex = () =>
  rgbToHex({
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
  });

const rotateHue = (hue: number, amount: number) => (hue + amount + 360) % 360;

const createPaletteFromMode = (mode: HarmonyMode, baseHex: string) => {
  if (mode === 'random') {
    return Array.from({ length: COLOR_COUNT }, () => randomHex());
  }

  const base = rgbToHsl(hexToRgb(baseHex));

  const modes: Record<Exclude<HarmonyMode, 'random'>, HSL[]> = {
    analogous: [-36, -18, 0, 18, 36].map((offset) => ({
      h: rotateHue(base.h, offset),
      s: clamp(base.s + Math.random() * 10 - 5, 35, 95),
      l: clamp(base.l + Math.random() * 14 - 7, 24, 82),
    })),
    monochrome: [-28, -14, 0, 14, 28].map((offset) => ({
      h: base.h,
      s: clamp(base.s + offset / 3, 25, 92),
      l: clamp(base.l + offset, 18, 88),
    })),
    triadic: [0, 120, 240, 60, 300].map((offset, index) => ({
      h: rotateHue(base.h, offset),
      s: clamp(base.s + (index % 2 === 0 ? 4 : -6), 32, 96),
      l: clamp(base.l + (index - 2) * 4, 22, 84),
    })),
    complementary: [0, 180, 12, 192, 348].map((offset, index) => ({
      h: rotateHue(base.h, offset),
      s: clamp(base.s + (index % 2 === 0 ? 5 : -4), 35, 96),
      l: clamp(base.l + (index - 2) * 5, 22, 84),
    })),
  };

  return modes[mode].map((color) => rgbToHex(hslToRgb(color)));
};

const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);

  const convert = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
};

const contrastRatio = (foreground: string, background: string) => {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const light = Math.max(first, second);
  const dark = Math.min(first, second);

  return (light + 0.05) / (dark + 0.05);
};

const getContrastGrade = (ratio: number) => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'Large AA';
  return 'Fail';
};

const buildExportText = (colors: PaletteColor[], format: ExportFormat) => {
  const hexes = colors.map((color) => color.hex);

  if (format === 'json') {
    return JSON.stringify({ palette: hexes }, null, 2);
  }

  if (format === 'tailwind') {
    return `colors: {\n${hexes
      .map((hex, index) => `  brand${index + 1}: '${hex}',`)
      .join('\n')}\n}`;
  }

  return `:root {\n${hexes
    .map((hex, index) => `  --color-brand-${index + 1}: ${hex};`)
    .join('\n')}\n}`;
};

const initialPalette = DEFAULT_PALETTE.map((hex) => ({
  id: makeId(),
  hex,
  locked: false,
}));

function ColorTile({
  color,
  index,
  copied,
  onChange,
  onCopy,
  onToggleLock,
}: {
  color: PaletteColor;
  index: number;
  copied: boolean;
  onChange: (hex: string) => void;
  onCopy: () => void;
  onToggleLock: () => void;
}) {
  const rgb = hexToRgb(color.hex);
  const hsl = rgbToHsl(rgb);
  const readableText = contrastRatio('#111111', color.hex) >= 4.5 ? '#111111' : '#FFFFFF';

  return (
    <article className="hub-card overflow-hidden rounded-[2rem]">
      <div
        className="flex min-h-[220px] flex-col justify-between p-5"
        style={{ background: color.hex, color: readableText }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
            Color {index + 1}
          </span>

          <button
            type="button"
            onClick={onToggleLock}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:scale-105"
            aria-label={color.locked ? 'Unlock color' : 'Lock color'}
            title={color.locked ? 'Unlock color' : 'Lock color'}
          >
            {color.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
        </div>

        <button type="button" onClick={onCopy} className="text-left">
          <span className="block text-3xl font-black tracking-tight">{color.hex}</span>
          <span className="mt-1 flex items-center gap-2 text-sm font-bold opacity-80">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy HEX'}
          </span>
        </button>
      </div>

      <div className="space-y-3 p-4">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
          <input
            type="color"
            value={color.hex}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent p-0"
            aria-label={`Choose color ${index + 1}`}
          />

          <input
            value={color.hex}
            onChange={(event) => onChange(normalizeHex(event.target.value))}
            className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-950 dark:text-white outline-none"
            aria-label={`HEX value for color ${index + 1}`}
          />
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold hub-muted">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
            RGB<br />
            <span className="text-slate-950 dark:text-white">
              {rgb.r}, {rgb.g}, {rgb.b}
            </span>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
            HSL<br />
            <span className="text-slate-950 dark:text-white">
              {Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ColorStudio() {
  const [colors, setColors] = useState<PaletteColor[]>(initialPalette);
  const [mode, setMode] = useState<HarmonyMode>('random');
  const [baseColor, setBaseColor] = useState('#527AC9');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [copiedColorId, setCopiedColorId] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);
  const [foreground, setForeground] = useState('#111827');
  const [background, setBackground] = useState('#FFFFFF');

  const exportText = useMemo(
    () => buildExportText(colors, exportFormat),
    [colors, exportFormat]
  );

  const ratio = useMemo(
    () => contrastRatio(foreground, background),
    [foreground, background]
  );

  const gradient = useMemo(
    () => `linear-gradient(135deg, ${colors.map((color) => color.hex).join(', ')})`,
    [colors]
  );

  const generatePalette = () => {
    const generated = createPaletteFromMode(mode, baseColor);

    setColors((current) =>
      current.map((color, index) =>
        color.locked
          ? color
          : {
              ...color,
              hex: generated[index] ?? randomHex(),
            }
      )
    );
  };

  const updateColor = (id: string, hex: string) => {
    setColors((current) =>
      current.map((color) =>
        color.id === id ? { ...color, hex: normalizeHex(hex) } : color
      )
    );
  };

  const toggleLock = (id: string) => {
    setColors((current) =>
      current.map((color) =>
        color.id === id ? { ...color, locked: !color.locked } : color
      )
    );
  };

  const copyText = async (value: string, afterCopy?: () => void) => {
    try {
      await navigator.clipboard.writeText(value);
      afterCopy?.();
    } catch {
      // Clipboard can fail in insecure previews; keep the UI stable.
    }
  };

  const copyColor = (color: PaletteColor) => {
    void copyText(color.hex, () => {
      setCopiedColorId(color.id);
      window.setTimeout(() => setCopiedColorId(null), 1200);
    });
  };

  const copyExport = () => {
    void copyText(exportText, () => {
      setCopiedExport(true);
      window.setTimeout(() => setCopiedExport(false), 1200);
    });
  };

  const downloadPalette = () => {
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `quickutility-color-palette-${Date.now()}.${exportFormat === 'json' ? 'json' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="min-h-[calc(100dvh-4.5rem)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:ml-[76px]">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 dark:bg-blue-500/10 text-orange-600 dark:text-blue-300 sm:flex">
                <Palette className="h-5 w-5" />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="hub-badge">Palette generator</span>
                  <span className="hub-badge">Contrast checker</span>
                  <span className="hub-badge">CSS export</span>
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Color Studio
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 hub-muted">
                  Generate color palettes, lock favorite swatches, check accessible
                  contrast, preview gradients, and export design-ready tokens.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={generatePalette}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 dark:bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-blue-500/20"
            >
              <Shuffle className="h-4 w-4" />
              Generate palette
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-4">
              <div className="hub-card rounded-[2rem] p-4 sm:p-5">
                <div className="grid gap-3 md:grid-cols-[1fr_180px_180px] md:items-end">
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Harmony mode
                    </span>
                    <select
                      value={mode}
                      onChange={(event) => setMode(event.target.value as HarmonyMode)}
                      className="h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 text-sm font-bold text-slate-950 dark:text-white outline-none transition focus:border-orange-500 dark:border-blue-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-blue-500/20"
                    >
                      <option value="random">Random</option>
                      <option value="analogous">Analogous</option>
                      <option value="monochrome">Monochrome</option>
                      <option value="triadic">Triadic</option>
                      <option value="complementary">Complementary</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Base color
                    </span>
                    <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3">
                      <input
                        type="color"
                        value={baseColor}
                        onChange={(event) => setBaseColor(event.target.value)}
                        className="h-8 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        aria-label="Base color"
                      />
                      <span className="text-sm font-black text-slate-950 dark:text-white">
                        {baseColor.toUpperCase()}
                      </span>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={generatePalette}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 text-sm font-black text-slate-950 dark:text-white transition hover:bg-orange-50 dark:bg-blue-500/10 hover:text-orange-600 dark:text-blue-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {colors.map((color, index) => (
                  <ColorTile
                    key={color.id}
                    color={color}
                    index={index}
                    copied={copiedColorId === color.id}
                    onChange={(hex) => updateColor(color.id, hex)}
                    onCopy={() => copyColor(color)}
                    onToggleLock={() => toggleLock(color.id)}
                  />
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="hub-card rounded-[2rem] p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="hub-badge">Gradient</span>
                      <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                        Palette blend
                      </h3>
                    </div>
                    <Sparkles className="h-5 w-5 text-orange-600 dark:text-blue-300" />
                  </div>

                  <div className="h-48 rounded-[1.5rem] border border-slate-200 dark:border-slate-800" style={{ background: gradient }} />
                  <code className="mt-4 block overflow-x-auto rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 text-xs font-bold text-slate-950 dark:text-white">
                    {gradient}
                  </code>
                </section>

                <section className="hub-card rounded-[2rem] p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="hub-badge">Accessibility</span>
                      <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                        Contrast checker
                      </h3>
                    </div>
                    <Paintbrush className="h-5 w-5 text-orange-600 dark:text-blue-300" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Text
                      </span>
                      <input
                        type="color"
                        value={foreground}
                        onChange={(event) => setForeground(event.target.value)}
                        className="h-12 w-full cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1"
                        aria-label="Foreground color"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Background
                      </span>
                      <input
                        type="color"
                        value={background}
                        onChange={(event) => setBackground(event.target.value)}
                        className="h-12 w-full cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1"
                        aria-label="Background color"
                      />
                    </label>
                  </div>

                  <div
                    className="mt-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-5"
                    style={{ color: foreground, background }}
                  >
                    <p className="text-2xl font-black">Aa QuickUtility</p>
                    <p className="mt-2 text-sm font-bold opacity-80">
                      Preview accessible color pairs before using them in your UI.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Ratio
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                        {ratio.toFixed(2)}:1
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Grade
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                        {getContrastGrade(ratio)}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <section className="hub-card rounded-[2rem] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="hub-badge">Export</span>
                    <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                      Design tokens
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['css', 'tailwind', 'json'] as ExportFormat[]).map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setExportFormat(format)}
                      className={cn(
                        'rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wide transition',
                        exportFormat === format
                          ? 'bg-orange-500 dark:bg-blue-500 text-white'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:text-white'
                      )}
                    >
                      {format}
                    </button>
                  ))}
                </div>

                <pre className="hub-scrollbar mt-4 max-h-[280px] overflow-auto rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 p-4 text-xs font-bold leading-6 text-slate-950 dark:text-white">
                  {exportText}
                </pre>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={copyExport}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-black text-slate-950 dark:text-white transition hover:bg-orange-50 dark:bg-blue-500/10 hover:text-orange-600 dark:text-blue-300"
                  >
                    {copiedExport ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedExport ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    type="button"
                    onClick={downloadPalette}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 dark:bg-blue-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 dark:shadow-blue-500/20"
                  >
                    <Download className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </section>

              <section className="hub-card rounded-[2rem] p-5">
                <span className="hub-badge">Preview</span>
                <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                  UI sample
                </h3>

                <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                  <div className="p-5" style={{ background: colors[0]?.hex, color: '#FFFFFF' }}>
                    <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">
                      Brand header
                    </p>
                    <h4 className="mt-2 text-2xl font-black">Launch faster</h4>
                  </div>
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-5">
                    <div className="h-3 rounded-full" style={{ background: colors[1]?.hex }} />
                    <div className="h-3 w-3/4 rounded-full" style={{ background: colors[2]?.hex }} />
                    <button
                      type="button"
                      className="mt-2 rounded-2xl px-4 py-3 text-sm font-black"
                      style={{ background: colors[3]?.hex, color: '#111111' }}
                    >
                      Sample button
                    </button>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
