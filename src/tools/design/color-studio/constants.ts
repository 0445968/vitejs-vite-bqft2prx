import {
    Aperture,
    Download,
    Eye,
    Glasses,
    ImagePlus,
    Layers3,
    Palette,
    SlidersHorizontal,
    Sparkles,
    SwatchBook,
  } from 'lucide-react';
  
  import type { PaletteColor, StudioTool } from './types';
  import { makeId } from './utils/color';
  
  export const DEFAULT_PALETTE = ['#29BF12', '#ABFF4F', '#08BDBD', '#F21B3F', '#FF9914'];
  
  export const initialPalette: PaletteColor[] = DEFAULT_PALETTE.map((hex) => ({
    id: makeId(),
    hex,
    locked: false,
  }));
  
  export const studioTools: StudioTool[] = [
    {
      id: 'visualize',
      name: 'Visualize',
      eyebrow: 'Color preview',
      description: 'Preview the palette in compact UI, landing page, card, and brand system examples.',
      icon: Aperture,
    },
    {
      id: 'palette',
      name: 'Generator',
      eyebrow: 'Palette builder',
      description: 'Generate palettes, lock swatches, edit HEX values, and inspect RGB/HSL values.',
      icon: Palette,
    },
    {
      id: 'blindness',
      name: 'Color blindness',
      eyebrow: 'Vision simulation',
      description: 'Simulate common color vision deficiencies and see how your palette changes.',
      icon: Glasses,
    },
    {
      id: 'quick-view',
      name: 'Quick view',
      eyebrow: 'Palette popup',
      description: 'Inspect palette details, copy color values, and review quick usage notes.',
      icon: Eye,
    },
    {
      id: 'image-extract',
      name: 'Extract image',
      eyebrow: 'Image sampling',
      description: 'Upload an image and extract a palette from its sampled pixels.',
      icon: ImagePlus,
    },
    {
      id: 'variations',
      name: 'Variations',
      eyebrow: 'Palette variations',
      description: 'View lighter, darker, warmer, and cooler palette variations.',
      icon: Layers3,
    },
    {
      id: 'palette-contrast',
      name: 'Contrast',
      eyebrow: 'Palette contrast',
      description: 'Check color-pair contrast across the full palette.',
      icon: SwatchBook,
    },
    {
      id: 'adjust',
      name: 'Adjust',
      eyebrow: 'Color tuning',
      description: 'Tune hue, saturation, brightness, and temperature across the whole palette.',
      icon: SlidersHorizontal,
    },
    {
      id: 'gradient',
      name: 'Gradient',
      eyebrow: 'Blend studio',
      description: 'Build linear and radial gradients from your active palette and copy production-ready CSS.',
      icon: Sparkles,
    },
    {
      id: 'export',
      name: 'Export',
      eyebrow: 'Design tokens',
      description: 'Export your palette as CSS variables, Tailwind config colors, or JSON tokens.',
      icon: Download,
    },
  ];
  