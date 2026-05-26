import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { QrCode } from 'lucide-react';

import { INITIAL_DATA } from './constants';
import { buildPayload } from './payload';
import { ensureQrEngine, renderQR } from './qrRenderer';
import type {
  BackgroundType,
  ContentType,
  DotShape,
  ErrorCorrection,
  EyeInner,
  EyeOuter,
  FrameStyle,
  GradientDirection,
  PreviewMode,
  QRData,
  QRRenderState,
} from './types';
import { PhonePreview } from './components/PhonePreview';
import { QRStudioToolbar } from './components/QRStudioToolbar';
import { QRStudioHeader } from './components/QRStudioHeader';
import { ContentStep } from './steps/ContentStep';
import { DesignStep } from './steps/DesignStep';
import { LogoStep } from './steps/LogoStep';

const RANDOM_COLORS = [
  '#2563eb',
  '#06b6d4',
  '#22c55e',
  '#84cc16',
  '#f97316',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
  '#0f172a',
  '#111827',
];

const RANDOM_BG_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#eff6ff',
  '#ecfeff',
  '#f0fdf4',
  '#fff7ed',
  '#fdf2f8',
  '#f5f3ff',
];

const DOT_SHAPES: DotShape[] = [
  'square',
  'rounded',
  'circle',
  'diamond',
  'star',
  'cross',
  'heart',
  'leaf',
];

const EYE_OUTERS: EyeOuter[] = [
  'sq',
  'rnd',
  'cir',
  'dbl',
  'brk',
  'dia',
  'dts',
  'shld',
];

const EYE_INNERS: EyeInner[] = [
  'sq',
  'rnd',
  'cir',
  'dia',
  'str',
  'crs',
  'rng',
  'hrt',
];

const FRAME_STYLES: FrameStyle[] = [
  'none',
  'thin',
  'round',
  'dbl',
  'scan',
  'lblb',
  'lblt',
  'pol',
  'badge',
  'cert',
];

const GRADIENT_DIRECTIONS: GradientDirection[] = [
  'diag',
  'h',
  'v',
  'rad',
];

const ERROR_CORRECTION_LEVELS: ErrorCorrection[] = [
  'M',
  'Q',
  'H',
];

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function QRStudio() {
  const [type, setType] = useState<ContentType>('link');
  const [data, setData] = useState<QRData>(INITIAL_DATA);
  const [dynamicQr, setDynamicQr] = useState(false);
  const [dynamicId] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  const [qrReady, setQrReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('qr');

  const [openStep, setOpenStep] = useState<'content' | 'design' | 'logo'>(
    'content'
  );

  const [dotShape, setDotShape] = useState<DotShape>('rounded');
  const [dotColor, setDotColor] = useState('#000000');
  const [useGradient, setUseGradient] = useState(false);
  const [dotColor2, setDotColor2] = useState('#527AC9');
  const [gradDir, setGradDir] = useState<GradientDirection>('diag');

  const [bgType, setBgType] = useState<BackgroundType>('solid');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgColor2, setBgColor2] = useState('#7EC09F');
  const [bgDir, setBgDir] = useState<GradientDirection>('diag');

  const [eyeOuter, setEyeOuter] = useState<EyeOuter>('sq');
  const [eyeInner, setEyeInner] = useState<EyeInner>('sq');
  const [useEyeColor, setUseEyeColor] = useState(false);
  const [eyeOuterColor, setEyeOuterColor] = useState('#000000');
  const [eyeInnerColor, setEyeInnerColor] = useState('#000000');

  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [frameColor, setFrameColor] = useState('#527AC9');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameTextColor, setFrameTextColor] = useState('#ffffff');

  const [logoType, setLogoType] = useState('none');
  const [ec, setEc] = useState<ErrorCorrection>('M');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    ensureQrEngine(() => setQrReady(true));
  }, []);

  const updateData = useCallback((changes: Partial<QRData>) => {
    setData((current) => ({ ...current, ...changes }));
  }, []);

  const renderState = useMemo<QRRenderState>(
    () => ({
      payload: buildPayload(type, data),
      dyn: dynamicQr,
      dynId: dynamicId,

      dotShape,
      dotColor,
      useGradient,
      dotColor2,
      gradDir,

      bgType,
      bgColor,
      bgColor2,
      bgDir,

      eyeOuter,
      eyeInner,
      useEyeColor,
      eyeOuterColor,
      eyeInnerColor,

      frameStyle,
      frameColor,
      frameText,
      frameTextColor,

      logoType,
      ec,
    }),
    [
      type,
      data,
      dynamicQr,
      dynamicId,
      dotShape,
      dotColor,
      useGradient,
      dotColor2,
      gradDir,
      bgType,
      bgColor,
      bgColor2,
      bgDir,
      eyeOuter,
      eyeInner,
      useEyeColor,
      eyeOuterColor,
      eyeInnerColor,
      frameStyle,
      frameColor,
      frameText,
      frameTextColor,
      logoType,
      ec,
    ]
  );

  useEffect(() => {
    if (!qrReady || !canvasRef.current) return;
    renderQR(canvasRef.current, renderState, logoImageRef.current);
  }, [qrReady, renderState]);

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const result = String(readerEvent.target?.result ?? '');
      const image = new window.Image();

      image.onload = () => {
        logoImageRef.current = image;

        if (canvasRef.current) {
          renderQR(canvasRef.current, renderState, image);
        }
      };

      image.src = result;
      setLogoType('upload');
    };

    reader.readAsDataURL(file);
  };

  const download = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `quickutility-qr-${Date.now()}.png`;
    link.click();
  };

  const randomizeQrDesign = () => {
    const primary = pickRandom(RANDOM_COLORS);
    const secondary = pickRandom(RANDOM_COLORS);
    const accent = pickRandom(RANDOM_COLORS);
    const background = pickRandom(RANDOM_BG_COLORS);
    const backgroundAccent = pickRandom(RANDOM_BG_COLORS);
  
    setDotShape(pickRandom(DOT_SHAPES));
    setDotColor(primary);
    setUseGradient(Math.random() > 0.35);
    setDotColor2(secondary);
    setGradDir(pickRandom(GRADIENT_DIRECTIONS));
  
    setBgType(Math.random() > 0.65 ? 'gr' : 'solid');
    setBgColor(background);
    setBgColor2(backgroundAccent);
    setBgDir(pickRandom(GRADIENT_DIRECTIONS));
  
    setEyeOuter(pickRandom(EYE_OUTERS));
    setEyeInner(pickRandom(EYE_INNERS));
    setUseEyeColor(Math.random() > 0.3);
    setEyeOuterColor(accent);
    setEyeInnerColor(primary);
  
    setFrameStyle(pickRandom(FRAME_STYLES));
    setFrameColor(secondary);
    setFrameTextColor('#ffffff');
  
    setEc(pickRandom(ERROR_CORRECTION_LEVELS));
  };

  const copyToClipboard = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);

        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        setCopied(false);
      }
    });
  };

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="xl:ml-[76px]">
        <QRStudioToolbar
          copied={copied}
          currentType={type}
          destination={getToolbarDestination(type, data)}
          dynamicQr={dynamicQr}
          dynamicId={dynamicId}
          onCopy={copyToClipboard}
          onDownload={download}
        />
  
        <div className="min-h-[calc(100dvh-7.5rem)] xl:grid xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          {/* Left editor: page scroll only, no internal scrollbar */}
          <div className="min-w-0">
          <QRStudioHeader
          type={type}
          errorCorrection={ec}
          onErrorCorrectionChange={setEc}
          onRandomize={randomizeQrDesign}
          />
           <main className="min-w-0 bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 lg:px-8">
                
              <div className="space-y-4 pb-10">
                <ContentStep
                  open={openStep === 'content'}
                  onToggle={() =>
                    setOpenStep((current) =>
                      current === 'content' ? 'design' : 'content'
                    )
                  }
                  type={type}
                  setType={setType}
                  data={data}
                  updateData={updateData}
                  dynamicQr={dynamicQr}
                  setDynamicQr={setDynamicQr}
                  dynamicId={dynamicId}
                />
  
                <DesignStep
                  open={openStep === 'design'}
                  onToggle={() =>
                    setOpenStep((current) =>
                      current === 'design' ? 'logo' : 'design'
                    )
                  }
                  dotShape={dotShape}
                  setDotShape={setDotShape}
                  dotColor={dotColor}
                  setDotColor={setDotColor}
                  useGradient={useGradient}
                  setUseGradient={setUseGradient}
                  dotColor2={dotColor2}
                  setDotColor2={setDotColor2}
                  gradDir={gradDir}
                  setGradDir={setGradDir}
                  bgType={bgType}
                  setBgType={setBgType}
                  bgColor={bgColor}
                  setBgColor={setBgColor}
                  bgColor2={bgColor2}
                  setBgColor2={setBgColor2}
                  bgDir={bgDir}
                  setBgDir={setBgDir}
                  eyeOuter={eyeOuter}
                  setEyeOuter={setEyeOuter}
                  eyeInner={eyeInner}
                  setEyeInner={setEyeInner}
                  useEyeColor={useEyeColor}
                  setUseEyeColor={setUseEyeColor}
                  eyeOuterColor={eyeOuterColor}
                  setEyeOuterColor={setEyeOuterColor}
                  eyeInnerColor={eyeInnerColor}
                  setEyeInnerColor={setEyeInnerColor}
                  frameStyle={frameStyle}
                  setFrameStyle={setFrameStyle}
                  frameColor={frameColor}
                  setFrameColor={setFrameColor}
                  frameText={frameText}
                  setFrameText={setFrameText}
                  frameTextColor={frameTextColor}
                  setFrameTextColor={setFrameTextColor}
                />
  
                <LogoStep
                  open={openStep === 'logo'}
                  onToggle={() =>
                    setOpenStep((current) =>
                      current === 'logo' ? 'content' : 'logo'
                    )
                  }
                  logoType={logoType}
                  setLogoType={setLogoType}
                  onUploadLogo={handleLogoUpload}
                  ec={ec}
                  setEc={setEc}
                />
              </div>
            </main>
          </div>
  
          {/* Right preview: sticky, not collapsible */}
          <aside className="border-t border-slate-200 bg-slate-100 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-[7.5rem] xl:block xl:h-[calc(100dvh-7.5rem)] xl:self-start xl:overflow-hidden xl:border-t-0">
            <PhonePreview
              mode={previewMode}
              onModeChange={setPreviewMode}
              canvasRef={canvasRef}
              qrReady={qrReady}
              title={data.evTitle || data.vcFirst || 'QuickUtility QR'}
              subtitle={
                data.text ||
                data.link ||
                data.socialUrl ||
                'Branded QR destination preview'
              }
              primaryColor={dotColor2}
              secondaryColor={bgColor2}
              frameColor={frameColor}
              onDownload={download}
              onCopy={copyToClipboard}
              copied={copied}
            />
          </aside>
        </div>
      </div>
    </section>
  );

  function getToolbarDestination(type: ContentType, data: QRData) {
    switch (type) {
      case 'link':
        return data.link || '';
  
      case 'text':
        return data.text || '';
  
      case 'email':
        return data.email || '';
  
      case 'call':
        return data.phone || '';
  
      case 'sms':
        return data.smsPhone || data.phone || '';
  
      case 'wifi':
        return data.wifiSsid || '';
  
      default:
        return (
          data.link ||
          data.socialUrl ||
          data.text ||
          data.email ||
          data.phone ||
          data.evTitle ||
          data.vcFirst ||
          ''
        );
    }
  }
}