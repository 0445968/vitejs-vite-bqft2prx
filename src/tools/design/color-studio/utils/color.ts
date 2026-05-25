import type { AdjustmentState, ColorBlindnessMode, GradientType, HarmonyMode, HSL, RGB } from '../types';

const PALETTE_COLOR_COUNT = 5;

export const makeId = () => Math.random().toString(36).slice(2, 10);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const normalizeHex = (value: string) => {
  const cleaned = value.replace(/[^a-fA-F0-9]/g, '').slice(0, 6);

  if (cleaned.length === 3) {
    return `#${cleaned.split('').map((char) => char + char).join('')}`.toUpperCase();
  }

  return `#${cleaned.padEnd(6, '0')}`.toUpperCase();
};

export const hexToRgb = (hex: string): RGB => {
  const normalized = normalizeHex(hex).replace('#', '');
  const value = Number.parseInt(normalized, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
};

export const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();

export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
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

  return { h: (h + 360) % 360, s: s * 100, l: l * 100 };
};

export const hslToRgb = ({ h, s, l }: HSL): RGB => {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = lightness - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) [red, green, blue] = [chroma, x, 0];
  else if (hue < 120) [red, green, blue] = [x, chroma, 0];
  else if (hue < 180) [red, green, blue] = [0, chroma, x];
  else if (hue < 240) [red, green, blue] = [0, x, chroma];
  else if (hue < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return { r: (red + match) * 255, g: (green + match) * 255, b: (blue + match) * 255 };
};

export const randomHex = () => rgbToHex({ r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 });
const rotateHue = (hue: number, amount: number) => (hue + amount + 360) % 360;

export const createPaletteFromMode = (mode: HarmonyMode, baseHex: string) => {
  if (mode === 'random') return Array.from({ length: PALETTE_COLOR_COUNT }, randomHex);
  const base = rgbToHsl(hexToRgb(baseHex));
  const modes: Record<Exclude<HarmonyMode, 'random'>, HSL[]> = {
    analogous: [-36, -18, 0, 18, 36].map((offset) => ({ h: rotateHue(base.h, offset), s: clamp(base.s + Math.random() * 10 - 5, 35, 95), l: clamp(base.l + Math.random() * 14 - 7, 24, 82) })),
    monochrome: [-28, -14, 0, 14, 28].map((offset) => ({ h: base.h, s: clamp(base.s + offset / 3, 25, 92), l: clamp(base.l + offset, 18, 88) })),
    triadic: [0, 120, 240, 60, 300].map((offset, index) => ({ h: rotateHue(base.h, offset), s: clamp(base.s + (index % 2 === 0 ? 4 : -6), 32, 96), l: clamp(base.l + (index - 2) * 4, 22, 84) })),
    complementary: [0, 180, 12, 192, 348].map((offset, index) => ({ h: rotateHue(base.h, offset), s: clamp(base.s + (index % 2 === 0 ? 5 : -4), 35, 96), l: clamp(base.l + (index - 2) * 5, 22, 84) })),
  };
  return modes[mode].map((color) => rgbToHex(hslToRgb(color)));
};

export const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const convert = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
};

export const contrastRatio = (foreground: string, background: string) => {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const light = Math.max(first, second);
  const dark = Math.min(first, second);
  return (light + 0.05) / (dark + 0.05);
};

export const getContrastGrade = (ratio: number) => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'Large AA';
  return 'Fail';
};

export const getReadableText = (hex: string) =>
  contrastRatio('#111827', hex) >= 4.5 ? '#111827' : '#FFFFFF';

export const buildGradientCss = (hexes: string[], type: GradientType, angle: number) =>
  type === 'radial'
    ? `radial-gradient(circle at top left, ${hexes.join(', ')})`
    : `linear-gradient(${angle}deg, ${hexes.join(', ')})`;

const blindnessMatrix: Record<ColorBlindnessMode, number[]> = {
  normal: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

export const simulateColorBlindness = (hex: string, mode: ColorBlindnessMode) => {
  const rgb = hexToRgb(hex);
  const m = blindnessMatrix[mode];
  return rgbToHex({
    r: rgb.r * m[0] + rgb.g * m[1] + rgb.b * m[2],
    g: rgb.r * m[3] + rgb.g * m[4] + rgb.b * m[5],
    b: rgb.r * m[6] + rgb.g * m[7] + rgb.b * m[8],
  });
};

export const adjustHex = (hex: string, adjustment: AdjustmentState) => {
  const hsl = rgbToHsl(hexToRgb(hex));
  const tempShift = adjustment.temperature / 100;
  const rgb = hslToRgb({
    h: rotateHue(hsl.h, adjustment.hue),
    s: clamp(hsl.s + adjustment.saturation, 0, 100),
    l: clamp(hsl.l + adjustment.brightness, 0, 100),
  });
  return rgbToHex({
    r: clamp(rgb.r + tempShift * 22, 0, 255),
    g: clamp(rgb.g + Math.abs(tempShift) * 2, 0, 255),
    b: clamp(rgb.b - tempShift * 22, 0, 255),
  });
};

export const makeVariations = (hex: string) => {
  const hsl = rgbToHsl(hexToRgb(hex));
  return [-28, -14, 0, 14, 28].map((offset) =>
    rgbToHex(hslToRgb({ h: hsl.h, s: clamp(hsl.s + offset / 2, 5, 100), l: clamp(hsl.l + offset, 8, 92) }))
  );
};
