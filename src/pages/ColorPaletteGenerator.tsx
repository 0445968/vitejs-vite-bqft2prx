import { useMemo, useState } from 'react';
import { Check, Copy, Palette, RefreshCw } from 'lucide-react';

type Mode = 'random' | 'analogous' | 'monochrome';

function randomHex() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
}

function hexToHsl(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const diff = max - min;
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    if (max === r) h = (g - b) / diff + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / diff + 2;
    if (max === b) h = (r - g) / diff + 4;

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number) {
  const saturation = s / 100;
  const lightness = l / 100;

  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function createPalette(mode: Mode) {
  const base = randomHex();

  if (mode === 'random') {
    return Array.from({ length: 5 }, randomHex);
  }

  const hsl = hexToHsl(base);

  if (mode === 'analogous') {
    return [-40, -20, 0, 20, 40].map((offset) =>
      hslToHex((hsl.h + offset + 360) % 360, hsl.s, hsl.l)
    );
  }

  return [22, 34, 46, 58, 70].map((lightness) =>
    hslToHex(hsl.h, hsl.s, lightness)
  );
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');

  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

export function ColorPaletteGenerator() {
  const [mode, setMode] = useState<Mode>('random');
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState('');

  const palette = useMemo(() => createPalette(mode), [mode, refreshKey]);

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopied(color);
    window.setTimeout(() => setCopied(''), 1300);
  };

  const copyPalette = async () => {
    await navigator.clipboard.writeText(palette.join(', '));
    setCopied('palette');
    window.setTimeout(() => setCopied(''), 1300);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Design
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Color Palette Generator
        </h2>
        <p className="mt-2 hub-muted">
          Generate random, analogous, or monochrome color palettes.
        </p>
      </div>

      <section className="hub-card mb-6 rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3">
            {(['random', 'analogous', 'monochrome'] as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={mode === item ? 'hub-button' : 'hub-secondary-button'}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="hub-secondary-button"
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </button>

            <button type="button" onClick={copyPalette} className="hub-button">
              {copied === 'palette' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied === 'palette' ? 'Copied' : 'Copy palette'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid overflow-hidden rounded-3xl shadow-2xl md:grid-cols-5">
        {palette.map((color) => {
          const rgb = hexToRgb(color);

          return (
            <button
              key={color}
              type="button"
              onClick={() => copyColor(color)}
              className="group min-h-64 p-5 text-left transition hover:scale-[1.02] md:min-h-[420px]"
              style={{ backgroundColor: color }}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
                  <Palette className="h-6 w-6" />
                </div>

                <div className="rounded-2xl bg-black/25 p-4 text-white backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xl font-black uppercase">{color}</p>
                    {copied === color ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5 opacity-70 transition group-hover:opacity-100" />
                    )}
                  </div>

                  <p className="mt-2 text-sm font-bold text-white/75">
                    RGB {rgb.r}, {rgb.g}, {rgb.b}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}