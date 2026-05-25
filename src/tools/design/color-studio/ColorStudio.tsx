import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

import { LivePreviewPanel } from './components/LivePreviewPanel';
import { StudioHeader } from './components/StudioHeader';
import { StudioToolbar } from './components/StudioToolbar';
import { initialPalette, studioTools } from './constants';
import { AdjustPaletteTool } from './tools/AdjustPaletteTool';
import { ColorBlindnessTool } from './tools/ColorBlindnessTool';
import { ExportTokensTool } from './tools/ExportTokensTool';
import { GradientPreviewTool } from './tools/GradientPreviewTool';
import { ImageExtractTool } from './tools/ImageExtractTool';
import { PaletteContrastTool } from './tools/PaletteContrastTool';
import { PaletteGeneratorTool } from './tools/PaletteGeneratorTool';
import { QuickViewTool } from './tools/QuickViewTool';
import { VariationsTool } from './tools/VariationsTool';
import { VisualizeColorsTool } from './tools/VisualizeColorsTool';
import type {
  AdjustmentState,
  ColorBlindnessMode,
  ExportFormat,
  GradientType,
  HarmonyMode,
  PaletteColor,
  PreviewTheme,
  StudioToolId,
} from './types';
import { buildExportText, copyToClipboard, downloadTextFile } from './utils/export';
import {
  adjustHex,
  buildGradientCss,
  contrastRatio,
  createPaletteFromMode,
  makeId,
  normalizeHex,
  randomHex,
  rgbToHex,
} from './utils/color';

function getInitialPreviewTheme(): PreviewTheme {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function ColorStudio() {
  const [activeToolId, setActiveToolId] = useState<StudioToolId>('palette');
  const [previewToolId, setPreviewToolId] = useState<StudioToolId>('palette');
  const [colors, setColors] = useState<PaletteColor[]>(initialPalette);
  const [history, setHistory] = useState<PaletteColor[][]>([initialPalette]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random');
  const [baseColor, setBaseColor] = useState('#527AC9');
  const [foreground, setForeground] = useState('#111827');
  const [background, setBackground] = useState('#FFFFFF');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>(() =>
    getInitialPreviewTheme()
  );
  const [blindnessMode, setBlindnessMode] =
    useState<ColorBlindnessMode>('normal');
  const [adjustment, setAdjustment] = useState<AdjustmentState>({
    hue: 0,
    saturation: 0,
    brightness: 0,
    temperature: 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [copiedColorId, setCopiedColorId] = useState<string | null>(null);
  const [copiedGradient, setCopiedGradient] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const activeTool =
    studioTools.find((tool) => tool.id === activeToolId) ?? studioTools[0];

  const gradient = useMemo(
    () =>
      buildGradientCss(
        colors.map((color) => color.hex),
        gradientType,
        gradientAngle
      ),
    [colors, gradientType, gradientAngle]
  );

  const ratio = useMemo(
    () => contrastRatio(foreground, background),
    [foreground, background]
  );

  const exportText = useMemo(
    () => buildExportText(colors, exportFormat),
    [colors, exportFormat]
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const syncPreviewTheme = (event: MediaQueryListEvent) => {
      setPreviewTheme(event.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', syncPreviewTheme);
    return () => media.removeEventListener('change', syncPreviewTheme);
  }, []);

  const commitColors = (nextColors: PaletteColor[]) => {
    setColors(nextColors);
    setHistory((current) => {
      const trimmed = current.slice(0, historyIndex + 1);
      return [...trimmed, nextColors];
    });
    setHistoryIndex((current) => current + 1);
  };

  const buildGeneratedPalette = (mode = harmonyMode, base = baseColor) => {
    const generated = createPaletteFromMode(mode, base);

    return colors.map((color, index) =>
      color.locked
        ? color
        : {
            ...color,
            hex: generated[index] ?? randomHex(),
          }
    );
  };

  const generatePalette = () => {
    commitColors(buildGeneratedPalette());
  };

  const handleHarmonyModeChange = (mode: HarmonyMode) => {
    setHarmonyMode(mode);
    commitColors(buildGeneratedPalette(mode, baseColor));
  };

  const handleBaseColorChange = (hex: string) => {
    setBaseColor(hex);
  };

  const selectTool = (toolId: StudioToolId) => {
    setPreviewToolId(toolId);

    if (toolId === 'visualize') return;

    setActiveToolId(toolId);
  };

  const undoPalette = () => {
    if (historyIndex <= 0) return;

    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setColors(history[nextIndex]);
  };

  const redoPalette = () => {
    if (historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setColors(history[nextIndex]);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (event.code === 'Space' && !isTyping) {
        event.preventDefault();
        generatePalette();
      }

      if ((event.metaKey || event.ctrlKey) && !isTyping) {
        const key = event.key.toLowerCase();

        if (key === 'z' && event.shiftKey) {
          event.preventDefault();
          redoPalette();
        } else if (key === 'z') {
          event.preventDefault();
          undoPalette();
        } else if (key === 'y') {
          event.preventDefault();
          redoPalette();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [harmonyMode, baseColor, colors, history, historyIndex]);

  const updateColor = (id: string, value: string) => {
    commitColors(
      colors.map((color) =>
        color.id === id ? { ...color, hex: normalizeHex(value) } : color
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

  const copyColor = async (color: PaletteColor) => {
    try {
      await copyToClipboard(color.hex);
      setCopiedColorId(color.id);
      window.setTimeout(() => setCopiedColorId(null), 1200);
    } catch {
      setCopiedColorId(null);
    }
  };

  const copyGradient = async () => {
    try {
      await copyToClipboard(gradient);
      setCopiedGradient(true);
      window.setTimeout(() => setCopiedGradient(false), 1200);
    } catch {
      setCopiedGradient(false);
    }
  };

  const copyExport = async () => {
    try {
      await copyToClipboard(exportText);
      setCopiedExport(true);
      window.setTimeout(() => setCopiedExport(false), 1200);
    } catch {
      setCopiedExport(false);
    }
  };

  const downloadExport = () => {
    downloadTextFile(
      exportText,
      `quickutility-color-palette-${Date.now()}.${
        exportFormat === 'json' ? 'json' : 'txt'
      }`
    );
  };

  const applyPalette = (hexes: string[]) => {
    commitColors(
      hexes.slice(0, 5).map((hex, index) => ({
        id: colors[index]?.id ?? makeId(),
        hex: normalizeHex(hex),
        locked: colors[index]?.locked ?? false,
      }))
    );
  };

  const applyAdjustment = () => {
    commitColors(
      colors.map((color) => ({
        ...color,
        hex: adjustHex(color.hex, adjustment),
      }))
    );

    setAdjustment({ hue: 0, saturation: 0, brightness: 0, temperature: 0 });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result ?? '');
      setImagePreview(result);

      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 80;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(image, 0, 0, size, size);

        const data = ctx.getImageData(0, 0, size, size).data;
        const samples: string[] = [];

        for (let i = 0; i < 5; i += 1) {
          const x = Math.floor(((i + 0.7) / 5) * size);
          const y = Math.floor((i % 2 ? 0.68 : 0.34) * size);
          const idx = (y * size + x) * 4;

          samples.push(
            rgbToHex({
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2],
            })
          );
        }

        setExtractedColors(samples);
      };

      image.src = result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="xl:ml-[76px]">
        <StudioToolbar
          tools={studioTools}
          activeToolId={previewToolId}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onSelectTool={selectTool}
          onUndo={undoPalette}
          onRedo={redoPalette}
          onExport={downloadExport}
        />

        <div className="min-h-[calc(100dvh-7.5rem)] xl:grid xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0">
            <StudioHeader
              tool={activeTool}
              harmonyMode={harmonyMode}
              baseColor={baseColor}
              onHarmonyModeChange={handleHarmonyModeChange}
              onBaseColorChange={handleBaseColorChange}
              onGeneratePalette={generatePalette}
            />

            <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
              {activeToolId === 'visualize' && (
                <VisualizeColorsTool colors={colors} />
              )}

              {activeToolId === 'palette' && (
                <PaletteGeneratorTool
                  colors={colors}
                  copiedColorId={copiedColorId}
                  onUpdateColor={updateColor}
                  onCopyColor={copyColor}
                  onToggleLock={toggleLock}
                />
              )}

              {activeToolId === 'blindness' && (
                <ColorBlindnessTool
                  colors={colors}
                  mode={blindnessMode}
                  onModeChange={setBlindnessMode}
                />
              )}

              {activeToolId === 'quick-view' && (
                <QuickViewTool colors={colors} onCopyColor={copyColor} />
              )}

              {activeToolId === 'image-extract' && (
                <ImageExtractTool
                  imagePreview={imagePreview}
                  extractedColors={extractedColors}
                  onImageUpload={handleImageUpload}
                  onUseExtracted={() => applyPalette(extractedColors)}
                />
              )}

              {activeToolId === 'variations' && (
                <VariationsTool colors={colors} onApplyPalette={applyPalette} />
              )}

              {activeToolId === 'palette-contrast' && (
                <PaletteContrastTool colors={colors} />
              )}

              {activeToolId === 'adjust' && (
                <AdjustPaletteTool
                  colors={colors}
                  adjustment={adjustment}
                  onAdjustmentChange={setAdjustment}
                  onApply={applyAdjustment}
                />
              )}

              {activeToolId === 'gradient' && (
                <GradientPreviewTool
                  colors={colors}
                  gradient={gradient}
                  gradientType={gradientType}
                  gradientAngle={gradientAngle}
                  copied={copiedGradient}
                  onGradientTypeChange={setGradientType}
                  onGradientAngleChange={setGradientAngle}
                  onCopyGradient={copyGradient}
                />
              )}

              {activeToolId === 'export' && (
                <ExportTokensTool
                  colors={colors}
                  exportFormat={exportFormat}
                  exportText={exportText}
                  copied={copiedExport}
                  onExportFormatChange={setExportFormat}
                  onCopyExport={copyExport}
                  onDownloadExport={downloadExport}
                />
              )}
            </main>
          </div>

          <aside className="hidden xl:sticky xl:top-[7.5rem] xl:block xl:h-[calc(100dvh-7.5rem)] xl:self-start">
            <LivePreviewPanel
              activeToolId={previewToolId}
              colors={colors}
              gradient={gradient}
              foreground={foreground}
              background={background}
              contrastRatio={ratio}
              previewTheme={previewTheme}
              blindnessMode={blindnessMode}
              adjustment={adjustment}
              onPreviewThemeChange={setPreviewTheme}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
