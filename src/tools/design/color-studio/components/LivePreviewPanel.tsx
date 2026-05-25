import { Moon, Sun, MonitorSmartphone, Wand2 } from 'lucide-react';
import type { AdjustmentState, ColorBlindnessMode, PaletteColor, PreviewTheme, StudioToolId } from '../types';
import { adjustHex, getContrastGrade, makeVariations, simulateColorBlindness } from '../utils/color';

function MiniBrowser({ colors }: { colors: PaletteColor[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-inherit bg-white text-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[0]?.hex }} />
          <span className="text-xs font-black">Design Academy</span>
        </div>
        <div className="flex gap-2">
          <span className="h-2 w-10 rounded-full bg-slate-200" />
          <span className="h-2 w-10 rounded-full" style={{ background: colors[4]?.hex }} />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_128px] gap-4 p-4">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-widest" style={{ color: colors[0]?.hex }}>Palette landing</p>
          <h4 className="mt-2 text-xl font-black leading-5">Visualize colors in real UI</h4>
          <p className="mt-2 text-[0.7rem] font-semibold text-slate-500">Default preview inspired by visual color mockups.</p>
          <div className="mt-3 flex gap-2">
            <span className="h-8 w-20 rounded-xl" style={{ background: colors[3]?.hex }} />
            <span className="h-8 w-16 rounded-xl border-2" style={{ borderColor: colors[4]?.hex }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-full" style={{ background: colors[0]?.hex }} />
          <div className="rotate-45 rounded-xl" style={{ background: colors[1]?.hex }} />
          <div className="rounded-xl border-[6px] border-solid" style={{ borderColor: colors[3]?.hex }} />
          <div className="rounded-full" style={{ background: colors[4]?.hex }} />
          <div className="rounded-full" style={{ background: colors[3]?.hex }} />
          <div className="rounded-sm" style={{ background: colors[4]?.hex, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        </div>
      </div>
    </div>
  );
}

export function LivePreviewPanel({
  activeToolId,
  colors,
  gradient,
  foreground,
  background,
  contrastRatio,
  previewTheme,
  blindnessMode,
  adjustment,
  onPreviewThemeChange,
}: {
  activeToolId: StudioToolId;
  colors: PaletteColor[];
  gradient: string;
  foreground: string;
  background: string;
  contrastRatio: number;
  previewTheme: PreviewTheme;
  blindnessMode: ColorBlindnessMode;
  adjustment: AdjustmentState;
  onPreviewThemeChange: (theme: PreviewTheme) => void;
}) {
  const previewIsDark = previewTheme === 'dark';
  const panelClass = previewIsDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-950 border-slate-200';
  const softClass = previewIsDark ? 'bg-slate-900' : 'bg-slate-100';
  const mutedClass = previewIsDark ? 'text-slate-400' : 'text-slate-500';
  const visibleColors = activeToolId === 'blindness'
    ? colors.map((color) => ({ ...color, hex: simulateColorBlindness(color.hex, blindnessMode) }))
    : activeToolId === 'adjust'
      ? colors.map((color) => ({ ...color, hex: adjustHex(color.hex, adjustment) }))
      : colors;

  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden border-l ${panelClass}`}>
      <div className="flex shrink-0 items-center justify-between border-b border-inherit px-4 py-3">
        <div>
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-500">Live preview</span>
          <h3 className="mt-2 text-base font-black">{activeToolId === 'visualize' ? 'Visualize colors' : 'Output preview'}</h3>
        </div>
        <div className={`flex rounded-2xl p-1 ${softClass}`}>
        <button type="button" onClick={() => onPreviewThemeChange('dark')} className={`flex h-9 w-9 items-center justify-center rounded-xl ${previewIsDark ? 'bg-slate-800 text-blue-400 shadow-sm' : mutedClass}`} aria-label="Dark preview"><Moon className="h-4 w-4" /></button>
          <button type="button" onClick={() => onPreviewThemeChange('light')} className={`flex h-9 w-9 items-center justify-center rounded-xl ${!previewIsDark ? 'bg-white text-blue-600 shadow-sm' : mutedClass}`} aria-label="Light preview"><Sun className="h-4 w-4" /></button>
            </div>
      </div>

      <div className="grid flex-1 min-h-0 grid-rows-[auto_auto_auto_1fr] gap-3 overflow-hidden p-4">
        {activeToolId === 'visualize' && <MiniBrowser colors={visibleColors} />}

        {activeToolId !== 'visualize' && (
          <section className="overflow-hidden rounded-[1.35rem] border border-inherit">
            <div className="p-4" style={{ background: visibleColors[0]?.hex, color: '#fff' }}>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] opacity-80">Mini brand system</p>
              <h4 className="mt-2 text-xl font-black">QuickUtility palette</h4>
            </div>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className={`text-[0.65rem] font-black uppercase tracking-[0.22em] ${mutedClass}`}>Swatches</p>
            <Wand2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="grid h-12 overflow-hidden rounded-2xl border border-inherit" style={{ gridTemplateColumns: `repeat(${visibleColors.length}, minmax(0, 1fr))` }}>
            {visibleColors.map((color) => <div key={color.id} style={{ background: color.hex }} />)}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div>
            <p className={`mb-2 text-[0.65rem] font-black uppercase tracking-[0.22em] ${mutedClass}`}>Gradient</p>
            <div className="h-24 rounded-2xl border border-inherit" style={{ background: activeToolId === 'blindness' || activeToolId === 'adjust' ? `linear-gradient(135deg, ${visibleColors.map((c) => c.hex).join(', ')})` : gradient }} />
          </div>
          <div>
            <p className={`mb-2 text-[0.65rem] font-black uppercase tracking-[0.22em] ${mutedClass}`}>Contrast</p>
            <div className="h-24 rounded-2xl border border-inherit p-3" style={{ background, color: foreground }}>
              <h4 className="text-base font-black">Aa Heading</h4>
              <p className="mt-1 text-xs font-bold opacity-80">Readable body sample.</p>
            </div>
          </div>
        </section>

        <section className="grid min-h-0 grid-cols-2 gap-3 overflow-hidden">
          <div className={`rounded-2xl p-3 ${softClass}`}>
            <p className={`text-[0.6rem] font-black uppercase tracking-[0.2em] ${mutedClass}`}>Ratio</p>
            <p className="mt-1 text-xl font-black">{contrastRatio.toFixed(2)}:1</p>
          </div>
          <div className={`rounded-2xl p-3 ${softClass}`}>
            <p className={`text-[0.6rem] font-black uppercase tracking-[0.2em] ${mutedClass}`}>Grade</p>
            <p className="mt-1 text-xl font-black">{getContrastGrade(contrastRatio)}</p>
          </div>
          <div className="rounded-2xl p-3 text-white" style={{ background: visibleColors[3]?.hex }}>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-80">Card</p>
            <p className="mt-1 text-sm font-black">Surface</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: makeVariations(visibleColors[1]?.hex ?? '#ABFF4F')[3], color: '#111827' }}>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">Accent</p>
            <p className="mt-1 text-sm font-black">Variation</p>
          </div>
        </section>
      </div>
    </div>
  );
}
