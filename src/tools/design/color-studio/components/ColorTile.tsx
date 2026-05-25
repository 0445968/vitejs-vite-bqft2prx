import { useState } from 'react';
import { Check, Copy, Lock, Unlock } from 'lucide-react';
import namer from 'color-namer';
import type { PaletteColor } from '../types';
import { getReadableText, hexToRgb, rgbToHsl } from '../utils/color';

// ----------------------------------------------------------------------
// Mini Utility for CMYK
// ----------------------------------------------------------------------
function getCmykString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const k = 1 - Math.max(r, g, b);
  
  if (k === 1) return "0 0 0 100";
  
  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  const kPct = Math.round(k * 100);
  
  return `${c} ${m} ${y} ${kPct}`;
}

// ----------------------------------------------------------------------
// Click-to-Copy Row Component
// ----------------------------------------------------------------------
function CopyableRow({ label, value, textColor }: { label: string; value: string; textColor: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex w-full items-center gap-3 text-left text-xs font-bold transition-opacity hover:opacity-70 sm:text-sm"
      style={{ color: textColor }}
      title={`Copy ${label} value`}
    >
      <span className="w-12 tracking-wider opacity-60">{label}:</span>
      <span className="font-mono tracking-wide">{value}</span>
      {copied ? (
        <Check className="ml-auto h-3.5 w-3.5 opacity-100" />
      ) : (
        <Copy className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

// ----------------------------------------------------------------------
// Main Color Tile Component
// ----------------------------------------------------------------------
export function ColorTile({
  color,
  index,
  total,
  copied,
  onChange,
  onCopy,
  onToggleLock,
}: {
  color: PaletteColor;
  index: number;
  total: number;
  copied: boolean;
  onChange: (hex: string) => void;
  onCopy: () => void;
  onToggleLock: () => void;
}) {
  const rgb = hexToRgb(color.hex);
  const hsl = rgbToHsl(rgb);
  const readableText = getReadableText(color.hex);
  
  const rgbString = `${rgb.r} ${rgb.g} ${rgb.b}`;
  const hslString = `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
  const cmykString = getCmykString(color.hex);

  // Generate the nearest color name!
  const generatedName = namer(color.hex).ntc[0].name;

  return (
    <article className="group relative flex h-[600px] min-w-0 flex-col sm:h-[65vh]">
      
      {/* Top 80%: Main Color Block */}
      <div
        className="relative flex flex-[4] flex-col justify-between p-5 transition-colors duration-300 sm:p-6"
        style={{ backgroundColor: color.hex, color: readableText }}
      >
        {/* Top Header: Editable Name & Lock Toggle */}
        <div className="flex items-start justify-between">
          <label className="relative cursor-pointer text-lg font-semibold tracking-tight transition-opacity hover:opacity-70">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={`Change color ${index + 1}`}
            />
            {color.name || generatedName}
          </label>

          <button
            type="button"
            onClick={onToggleLock}
            className="rounded-lg p-2 opacity-0 transition-all hover:bg-black/10 group-hover:opacity-100"
            style={{ color: readableText }}
            aria-label={color.locked ? 'Unlock color' : 'Lock color'}
          >
            {color.locked ? (
              <Lock className="h-5 w-5 opacity-100" />
            ) : (
              <Unlock className="h-5 w-5 opacity-60" />
            )}
          </button>
        </div>

        {/* Bottom Left: Copyable Codes */}
        <div className="flex flex-col gap-2 pb-2">
          <CopyableRow label="HEX" value={color.hex.toUpperCase()} textColor={readableText} />
          <CopyableRow label="RGB" value={rgbString} textColor={readableText} />
          <CopyableRow label="HSL" value={hslString} textColor={readableText} />
          <CopyableRow label="CMYK" value={cmykString} textColor={readableText} />
        </div>
      </div>

      {/* Bottom 20%: Simulated Shades/Tints */}
      <div 
        className="flex flex-[1] flex-col"
        style={{ backgroundColor: color.hex }}
      >
        <div className="flex-1 bg-white/60 mix-blend-overlay" />
        <div className="flex-1 bg-white/30 mix-blend-overlay" />
        <div className="flex-1 bg-black/10 mix-blend-overlay" />
        <div className="flex-1 bg-black/20 mix-blend-overlay" />
      </div>
    </article>
  );
}