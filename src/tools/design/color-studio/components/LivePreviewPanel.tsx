import React, { useState } from 'react';
import {
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react';

import type {
  AdjustmentState,
  ColorBlindnessMode,
  PaletteColor,
  PreviewTheme,
  StudioToolId,
} from '../types';

import {
  adjustHex,
  simulateColorBlindness,
} from '../utils/color';

// Simple luminance calculation to provide accurate relative contrast outputs
function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function AppMockup({
  colors,
  isDark,
}: {
  colors: PaletteColor[];
  isDark: boolean;
}) {
  const skeletonClass = isDark ? 'bg-slate-800' : 'bg-slate-200';

  const c0 = colors[0]?.hex ?? '#22c55e';
  const c1 = colors[1]?.hex ?? '#ABFF4F';
  const c2 = colors[2]?.hex ?? '#06b6d4';
  const c3 = colors[3]?.hex ?? '#f59e0b';
  const c4 = colors[4]?.hex ?? '#1e293b';

  return (
    <div className="overflow-hidden bg-transparent">
      <div className="p-4">
        <div
          className={`overflow-hidden rounded-[24px] border ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex gap-4 p-4">
            <div className="hidden w-12 shrink-0 flex-col gap-3 sm:flex">
              <div
                className="h-8 w-full rounded-xl shadow-sm"
                style={{ background: c1 }}
              />
              <div className={`h-8 w-full rounded-xl opacity-100 ${skeletonClass}`} 
              style={{ background: c0 }}
              />
              <div className={`h-8 w-full rounded-xl opacity-40 ${skeletonClass}`} />
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div
                className="flex h-24 w-full flex-col justify-end rounded-2xl p-4 shadow-sm"
                style={{ background: c2 }}
              >
                <div className="h-2 w-1/3 rounded-full bg-white/30" />
              </div>

              <div className="flex gap-3">
                <div
                  className="h-16 flex-1 rounded-2xl shadow-sm"
                  style={{ background: c3 }}
                />

                <div
                  className="h-16 flex-1 rounded-2xl border-2 border-dashed"
                  style={{
                    borderColor: c0,
                    background: c4,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPreviewContent({
  colors,
  rawColors,
  isDark,
  onShuffle,
}: {
  colors: PaletteColor[];
  rawColors: PaletteColor[];
  isDark: boolean;
  onShuffle: () => void;
}) {
  const [contrastColorIndex, setContrastColorIndex] = useState(0);

  const c0 = colors[0]?.hex ?? '#22c55e';
  const c1 = colors[1]?.hex ?? '#a3e635';
  const c2 = colors[2]?.hex ?? '#06b6d4';
  const c3 = colors[3]?.hex ?? '#f59e0b';
  const c4 = colors[4]?.hex ?? '#1e293b';

  const activeContrastColor = rawColors[contrastColorIndex]?.hex || c0;

  const handlePrevColor = () => {
    if (rawColors.length === 0) return;
    setContrastColorIndex((prev) => (prev === 0 ? rawColors.length - 1 : prev - 1));
  };

  const handleNextColor = () => {
    if (rawColors.length === 0) return;
    setContrastColorIndex((prev) => (prev === rawColors.length - 1 ? 0 : prev + 1));
  };

  const whiteRatio = getContrastRatio(activeContrastColor, '#ffffff');
  const blackRatio = getContrastRatio(activeContrastColor, '#000000');

  const getGradeLabel = (ratio: number) => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'Large';
    return 'Fail';
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppMockup colors={colors} isDark={isDark} />

      <div className="space-y-4 px-4 py-2">
        {/* Buttons Section */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: isDark ? '#94a3b8' : '#64748b' }}
            >
              Buttons
            </div>
            
            <button
              type="button"
              onClick={onShuffle}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
            >
              <RefreshCw className="h-2.5 w-2.5" />
              Shuffle
            </button>
          </div>

          {/* Clean alignment with outer container borders and individual component labels removed */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-full rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90"
              style={{ background: c0, color: '#fff' }}
            >
              Call to Action
            </button>

            <button
              className="w-full rounded-xl py-2.5 text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                border: `2px solid ${c2}`,
                color: c2,
                background: 'transparent',
              }}
            >
              Outline Style
            </button>
          </div>
        </div>

        {/* Patterns Section */}
        <div>
          <div
            className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Patterns
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="relative h-16 overflow-hidden rounded-xl"
              style={{
                background: `repeating-linear-gradient(
                  135deg,
                  ${c0} 0 12px,
                  ${c1} 12px 24px,
                  ${c2} 24px 36px,
                  ${c3} 36px 48px,
                  ${c4} 48px 60px
                )`,
              }}
            />

            <div
              className="relative h-16 overflow-hidden rounded-xl"
              style={{ backgroundColor: c3 }}
            >
              <div className="absolute left-4 top-2 h-3 w-3 rounded-full" style={{ background: c0 }} />
              <div className="absolute left-5 top-7 h-2 w-6 rounded-full" style={{ background: c1 }} />
              <div className="absolute left-10 bottom-2 h-3 w-3 rounded-full" style={{ background: c2 }} />
              <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: c0 }} />
              <div className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-sm" style={{ background: c4 }} />
              <div className="absolute right-4 top-2 h-3 w-3 rounded-full" style={{ background: c1 }} />
              <div className="absolute right-5 bottom-3 h-2.5 w-2.5 rounded-full" style={{ background: c4 }} />
              <div className="absolute right-6 bottom-6 h-2 w-6 rounded-full" style={{ background: c2 }} />
            </div>
          </div>
        </div>

        {/* Contrast Checker Section */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: isDark ? '#94a3b8' : '#64748b' }}
            >
              Contrast Checker
            </div>

            <div className="flex items-center gap-1">
              <span 
                className="mr-1 font-mono text-[10px] font-bold"
                style={{ color: isDark ? '#64748b' : '#94a3b8' }}
              >
                {contrastColorIndex + 1}/{rawColors.length || 5}
              </span>
              <button
                type="button"
                onClick={handlePrevColor}
                className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-2.5 w-2.5" />
              </button>
              <button
                type="button"
                onClick={handleNextColor}
                className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="flex h-16 flex-col justify-between rounded-xl p-2.5 shadow-inner transition-colors"
              style={{ backgroundColor: activeContrastColor, color: '#ffffff' }}
            >
              <span className="text-[10px] font-bold tracking-wide opacity-90">White Text</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black tracking-tight">{whiteRatio.toFixed(1)}:1</span>
                <span className="rounded bg-white/20 px-1 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                  {getGradeLabel(whiteRatio)}
                </span>
              </div>
            </div>

            <div
              className="flex h-16 flex-col justify-between rounded-xl p-2.5 shadow-inner transition-colors"
              style={{ backgroundColor: activeContrastColor, color: '#000000' }}
            >
              <span className="text-[10px] font-bold tracking-wide opacity-80">Black Text</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black tracking-tight">{blackRatio.toFixed(1)}:1</span>
                <span className="rounded bg-black/10 px-1 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                  {getGradeLabel(blackRatio)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LivePreviewPanel({
  activeToolId,
  colors,
  previewTheme,
  blindnessMode,
  adjustment,
  onPreviewThemeChange,
}: {
  activeToolId: StudioToolId;
  colors: PaletteColor[];
  previewTheme: PreviewTheme;
  blindnessMode: ColorBlindnessMode;
  adjustment: AdjustmentState;
  onPreviewThemeChange: (theme: PreviewTheme) => void;
}) {
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [shuffleOffset, setShuffleOffset] = useState(0);
  const previewIsDark = previewTheme === 'dark';

  const visibleColors =
    activeToolId === 'blindness'
      ? colors.map((color) => ({
          ...color,
          hex: simulateColorBlindness(color.hex, blindnessMode),
        }))
      : activeToolId === 'adjust'
        ? colors.map((color) => ({
            ...color,
            hex: adjustHex(color.hex, adjustment),
          }))
        : colors;

  const shuffledColors = [...visibleColors];
  if (shuffledColors.length > 0) {
    for (let i = 0; i < shuffleOffset % shuffledColors.length; i++) {
      const current = shuffledColors.shift();
      if (current) shuffledColors.push(current);
    }
  }

  const handleShuffle = () => {
    setShuffleOffset((prev) => prev + 1);
  };

  const panelBg = previewIsDark
    ? 'bg-[#0F172A] text-white'
    : 'bg-white text-slate-900';

  const borderColor = previewIsDark
    ? 'border-slate-800'
    : 'border-slate-200';

  const brandC0 = visibleColors[0]?.hex ?? 'currentColor';
  const brandC2 = visibleColors[2]?.hex ?? 'currentColor';

  return (
    <aside
      className={`relative ml-auto flex h-full min-h-0 shrink-0 justify-end overflow-hidden border-l transition-[width] duration-300 ease-in-out ${panelBg} ${borderColor}`}
      style={{
        width: isPreviewCollapsed ? 56 : 'min(460px, calc(100vw - 72px))',
        maxWidth: '100%',
      }}
    >
      {isPreviewCollapsed ? (
        <div className={`flex h-full w-[56px] shrink-0 flex-col items-center py-3 ${panelBg}`}>
          <button
            type="button"
            onClick={() => setIsPreviewCollapsed(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className={`flex h-full min-h-0 w-full flex-col overflow-hidden ${panelBg}`}>
          
          {/* Header Panel */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3">
            <div className="leading-none select-none">
              <span className="text-sm font-bold tracking-tight" style={{ color: brandC0 }}>
                Quick
              </span>
              <span className="ml-0.5 text-base font-black italic tracking-[-0.75px]" style={{ color: brandC2 }}>
                Utility
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => onPreviewThemeChange('light')}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    !previewIsDark ? 'bg-white shadow-sm' : 'text-slate-400'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onPreviewThemeChange('dark')}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    previewIsDark ? 'bg-slate-700 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewCollapsed(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Layout Area - Completely scroll-free on standard panels */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <BrandPreviewContent 
              colors={shuffledColors}
              rawColors={visibleColors} 
              isDark={previewIsDark} 
              onShuffle={handleShuffle} 
            />
          </div>

          {/* Footer Divider link */}
          <div
            className="flex shrink-0 items-center justify-between gap-3 border-t px-4 py-2.5 text-[11px]"
            style={{
              borderColor: previewIsDark ? '#233148' : '#e2e8f0',
              background: previewIsDark ? '#0F172A' : '#fff',
            }}
          >
            <span className="truncate opacity-80">Quick Utility by Crafterkite</span>
            <span className="shrink-0 font-mono opacity-60">{visibleColors.length} colors</span>
          </div>
        </div>
      )}
    </aside>
  );
}