import { RefreshCw } from 'lucide-react';

import { ColorTile } from '../components/ColorTile';
import type { HarmonyMode, PaletteColor } from '../types';

export function PaletteGeneratorTool({
  colors,
  copiedColorId,
  harmonyMode,
  baseColor,
  onHarmonyModeChange,
  onBaseColorChange,
  onGeneratePalette,
  onUpdateColor,
  onCopyColor,
  onToggleLock,
}: {
  colors: PaletteColor[];
  copiedColorId: string | null;
  harmonyMode: HarmonyMode;
  baseColor: string;
  onHarmonyModeChange: (mode: HarmonyMode) => void;
  onBaseColorChange: (hex: string) => void;
  onGeneratePalette: () => void;
  onUpdateColor: (id: string, hex: string) => void;
  onCopyColor: (color: PaletteColor) => void;
  onToggleLock: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <section className="border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-[1fr_190px_170px] md:items-end">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Harmony mode
            </span>

            <select
              value={harmonyMode}
              onChange={(event) =>
                onHarmonyModeChange(event.target.value as HarmonyMode)
              }
              className="h-12 w-full border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
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

            <div className="flex h-12 items-center gap-3 border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-950">
              <input
                type="color"
                value={baseColor}
                onChange={(event) => onBaseColorChange(event.target.value)}
                className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
                aria-label="Base color"
              />

              <span className="text-sm font-black text-slate-950 dark:text-white">
                {baseColor.toUpperCase()}
              </span>
            </div>
          </label>

          <button
            type="button"
            onClick={onGeneratePalette}
            className="flex h-12 items-center justify-center gap-2 border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 transition hover:bg-blue-500/10 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      <section className="grid overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2 2xl:grid-cols-5">
        {colors.map((color, index) => (
          <ColorTile
            key={color.id}
            color={color}
            index={index}
            copied={copiedColorId === color.id}
            isLast={index === colors.length - 1}
            onChange={(hex) => onUpdateColor(color.id, hex)}
            onCopy={() => onCopyColor(color)}
            onToggleLock={() => onToggleLock(color.id)}
          />
        ))}
      </section>
    </div>
  );
}
