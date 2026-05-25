import { ColorTile } from '../components/ColorTile';
import type { PaletteColor } from '../types';

export function PaletteGeneratorTool({
  colors,
  copiedColorId,
  onUpdateColor,
  onCopyColor,
  onToggleLock,
}: {
  colors: PaletteColor[];
  copiedColorId: string | null;
  onUpdateColor: (id: string, hex: string) => void;
  onCopyColor: (color: PaletteColor) => void;
  onToggleLock: (id: string) => void;
}) {
  return (
    <div className="w-full space-y-6">
      {/* Modernized Container:
        - rounded-3xl & overflow-hidden handles the perfect corner rounding for the tiles.
        - Diffused shadow-2xl gives it a premium floating effect.
        - Softened the border opacity (/80 and /50) to blend better with backgrounds.
      */}
      <section className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-black/40 md:grid-cols-2 2xl:grid-cols-5">
        {colors.map((color, index) => (
          <ColorTile
            key={color.id}
            color={color}
            index={index}
            copied={copiedColorId === color.id}
            isFirst={index === 0}
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