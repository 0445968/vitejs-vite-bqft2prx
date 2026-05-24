import { Palette } from 'lucide-react';

import { COLOR_PRESETS, DOT_SHAPES, EYE_INNER, EYE_OUTER, FRAMES } from '../constants';
import type {
  BackgroundType,
  DotShape,
  EyeInner,
  EyeOuter,
  FrameStyle,
  GradientDirection,
} from '../types';
import { StepCard } from '../components/StepCard';
import { ChoiceGrid, ColorInput, SelectInput, TextInput } from '../components/Fields';

export function DesignStep({
  open,
  onToggle,
  dotShape,
  setDotShape,
  dotColor,
  setDotColor,
  useGradient,
  setUseGradient,
  dotColor2,
  setDotColor2,
  gradDir,
  setGradDir,
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  bgColor2,
  setBgColor2,
  bgDir,
  setBgDir,
  eyeOuter,
  setEyeOuter,
  eyeInner,
  setEyeInner,
  useEyeColor,
  setUseEyeColor,
  eyeOuterColor,
  setEyeOuterColor,
  eyeInnerColor,
  setEyeInnerColor,
  frameStyle,
  setFrameStyle,
  frameColor,
  setFrameColor,
  frameText,
  setFrameText,
  frameTextColor,
  setFrameTextColor,
}: {
  open: boolean;
  onToggle: () => void;
  dotShape: DotShape;
  setDotShape: (value: DotShape) => void;
  dotColor: string;
  setDotColor: (value: string) => void;
  useGradient: boolean;
  setUseGradient: (value: boolean) => void;
  dotColor2: string;
  setDotColor2: (value: string) => void;
  gradDir: GradientDirection;
  setGradDir: (value: GradientDirection) => void;
  bgType: BackgroundType;
  setBgType: (value: BackgroundType) => void;
  bgColor: string;
  setBgColor: (value: string) => void;
  bgColor2: string;
  setBgColor2: (value: string) => void;
  bgDir: GradientDirection;
  setBgDir: (value: GradientDirection) => void;
  eyeOuter: EyeOuter;
  setEyeOuter: (value: EyeOuter) => void;
  eyeInner: EyeInner;
  setEyeInner: (value: EyeInner) => void;
  useEyeColor: boolean;
  setUseEyeColor: (value: boolean) => void;
  eyeOuterColor: string;
  setEyeOuterColor: (value: string) => void;
  eyeInnerColor: string;
  setEyeInnerColor: (value: string) => void;
  frameStyle: FrameStyle;
  setFrameStyle: (value: FrameStyle) => void;
  frameColor: string;
  setFrameColor: (value: string) => void;
  frameText: string;
  setFrameText: (value: string) => void;
  frameTextColor: string;
  setFrameTextColor: (value: string) => void;
}) {
  return (
    <StepCard
      number={2}
      title="Design QR code"
      subtitle="Choose palettes, shapes, sticker styles, and colors."
      Icon={Palette}
      open={open}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">Color palette</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_PRESETS.map((preset) => {
              const active =
                dotColor.toLowerCase() === preset.primary.toLowerCase() &&
                bgColor2.toLowerCase() === preset.secondary.toLowerCase();

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setDotColor(preset.primary);
                    setDotColor2(preset.secondary);
                    setEyeOuterColor(preset.primary);
                    setEyeInnerColor(preset.primary);
                    setFrameColor(preset.primary);
                    setBgColor2(preset.secondary);
                  }}
                  className={`rounded-2xl border p-2 text-left transition ${
                    active
                      ? 'border-[color:var(--qu-accent)] ring-2 ring-[color:var(--qu-accent-soft)]'
                      : 'border-[color:var(--qu-border)]'
                  }`}
                >
                  <div className="mb-2 flex overflow-hidden rounded-xl border border-[color:var(--qu-border)]">
                    <div className="h-10 flex-1" style={{ backgroundColor: preset.primary }} />
                    <div className="h-10 flex-1" style={{ backgroundColor: preset.secondary }} />
                  </div>
                  <span className="text-xs font-black text-[color:var(--qu-text)]">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ColorInput label="Primary color" value={dotColor} onChange={setDotColor} />
          <ColorInput label="Secondary color" value={dotColor2} onChange={setDotColor2} />
        </div>

        <div className="flex items-center gap-3 text-sm font-bold hub-muted">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={(event) => setUseGradient(event.target.checked)}
            className="h-4 w-4 accent-[color:var(--qu-accent)]"
          />
          Use gradient dots
        </div>

        {useGradient && (
          <SelectInput
            label="Gradient direction"
            value={gradDir}
            onChange={(value) => setGradDir(value as GradientDirection)}
            options={[
              { value: 'diag', label: 'Diagonal' },
              { value: 'h', label: 'Horizontal' },
              { value: 'v', label: 'Vertical' },
              { value: 'rad', label: 'Radial' },
            ]}
          />
        )}

        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">Shapes</p>
          <ChoiceGrid items={DOT_SHAPES} value={dotShape} onChange={setDotShape} />
        </div>

        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">Sticker / frame</p>
          <ChoiceGrid
            items={FRAMES}
            value={frameStyle}
            onChange={setFrameStyle}
            columns="grid-cols-2 sm:grid-cols-5"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ColorInput label="Frame color" value={frameColor} onChange={setFrameColor} />
          <ColorInput
            label="Label text color"
            value={frameTextColor}
            onChange={setFrameTextColor}
          />
        </div>

        <TextInput label="Sticker label" value={frameText} onChange={setFrameText} />

        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">Finder border</p>
          <ChoiceGrid items={EYE_OUTER} value={eyeOuter} onChange={setEyeOuter} />
        </div>

        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">Finder center</p>
          <ChoiceGrid items={EYE_INNER} value={eyeInner} onChange={setEyeInner} />
        </div>

        <div className="flex items-center gap-3 text-sm font-bold hub-muted">
          <input
            type="checkbox"
            checked={useEyeColor}
            onChange={(event) => setUseEyeColor(event.target.checked)}
            className="h-4 w-4 accent-[color:var(--qu-accent)]"
          />
          Use custom finder border color
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ColorInput
            label="Finder border color"
            value={eyeOuterColor}
            onChange={setEyeOuterColor}
          />
          <ColorInput
            label="Finder center color"
            value={eyeInnerColor}
            onChange={setEyeInnerColor}
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-black text-[color:var(--qu-text)]">Background</p>
          <SelectInput
            label="Background type"
            value={bgType}
            onChange={(value) => setBgType(value as BackgroundType)}
            options={[
              { value: 'solid', label: 'Solid color' },
              { value: 'tr', label: 'Transparent' },
              { value: 'gr', label: 'Gradient' },
            ]}
          />
        </div>

        {bgType !== 'tr' && (
          <ColorInput label="Background color" value={bgColor} onChange={setBgColor} />
        )}

        {bgType === 'gr' && (
          <div className="space-y-4">
            <ColorInput
              label="Second background color"
              value={bgColor2}
              onChange={setBgColor2}
            />
            <SelectInput
              label="Background direction"
              value={bgDir}
              onChange={(value) => setBgDir(value as GradientDirection)}
              options={[
                { value: 'diag', label: 'Diagonal' },
                { value: 'h', label: 'Horizontal' },
                { value: 'v', label: 'Vertical' },
              ]}
            />
          </div>
        )}
      </div>
    </StepCard>
  );
}