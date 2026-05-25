import { Check, Copy, Lock, Unlock } from 'lucide-react';

import type { PaletteColor } from '../types';
import { getReadableText, hexToRgb, rgbToHsl } from '../utils/color';

export function ColorTile({
  color,
  index,
  copied,
  isLast = false,
  onChange,
  onCopy,
  onToggleLock,
}: {
  color: PaletteColor;
  index: number;
  copied: boolean;
  isLast?: boolean;
  onChange: (hex: string) => void;
  onCopy: () => void;
  onToggleLock: () => void;
}) {
  const rgb = hexToRgb(color.hex);
  const hsl = rgbToHsl(rgb);
  const readableText = getReadableText(color.hex);

  return (
    <article className="min-w-0 overflow-hidden bg-white dark:bg-slate-900">
      <div
        className="flex min-h-[280px] flex-col justify-between p-5"
        style={{ background: color.hex, color: readableText }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="bg-white/25 px-3 py-1 text-xs font-black backdrop-blur">
            Color {index + 1}
          </span>

          <button
            type="button"
            onClick={onToggleLock}
            className="flex h-10 w-10 items-center justify-center bg-white/25 backdrop-blur transition hover:scale-105"
            aria-label={color.locked ? 'Unlock color' : 'Lock color'}
            title={color.locked ? 'Unlock color' : 'Lock color'}
          >
            {color.locked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </button>
        </div>

        <button type="button" onClick={onCopy} className="text-left">
          <span className="block text-3xl font-black tracking-tight">
            {color.hex.replace('#', '')}
          </span>
          <span className="mt-2 flex items-center gap-2 text-sm font-bold opacity-85">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy HEX'}
          </span>
        </button>
      </div>

      <div
        className={
          isLast
            ? 'space-y-3 bg-white p-4 dark:bg-slate-900'
            : 'space-y-3 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'
        }
      >
        <label className="flex items-center gap-3 border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <input
            type="color"
            value={color.hex}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 w-11 cursor-pointer border-0 bg-transparent p-0"
            aria-label={`Choose color ${index + 1}`}
          />

          <input
            value={color.hex}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-950 outline-none dark:text-white"
            aria-label={`HEX value for color ${index + 1}`}
          />
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="bg-slate-50 p-3 dark:bg-slate-950">
            RGB
            <br />
            <span className="text-slate-950 dark:text-white">
              {rgb.r}, {rgb.g}, {rgb.b}
            </span>
          </div>

          <div className="bg-slate-50 p-3 dark:bg-slate-950">
            HSL
            <br />
            <span className="text-slate-950 dark:text-white">
              {Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
