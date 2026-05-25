import type { ElementType } from 'react';

export type PaletteColor = {
  id: string;
  hex: string;
  locked: boolean;
};

export type StudioToolId =
  | 'visualize'
  | 'palette'
  | 'blindness'
  | 'quick-view'
  | 'image-extract'
  | 'variations'
  | 'palette-contrast'
  | 'adjust'
  | 'gradient'
  | 'export';

export type HarmonyMode = 'random' | 'analogous' | 'monochrome' | 'triadic' | 'complementary';
export type ExportFormat = 'css' | 'tailwind' | 'json';
export type GradientType = 'linear' | 'radial';
export type PreviewTheme = 'light' | 'dark';
export type ColorBlindnessMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export type AdjustmentState = {
  hue: number;
  saturation: number;
  brightness: number;
  temperature: number;
};

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

export type StudioTool = {
  id: StudioToolId;
  name: string;
  eyebrow: string;
  description: string;
  icon: ElementType;
};
