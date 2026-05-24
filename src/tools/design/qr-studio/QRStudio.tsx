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
import { ContentStep } from './steps/ContentStep';
import { DesignStep } from './steps/DesignStep';
import { LogoStep } from './steps/LogoStep';

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
    <section className="bg-[color:var(--qu-surface)]">
      <div className="grid min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
        {/* Left editor: regular page scroll, no internal scrollbar */}
<div className="min-w-0 border-r border-transparent lg:border-[color:var(--qu-border)]">
  <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <div className="w-full max-w-4xl xl:ml-[calc((100vw-1280px)/2)]">
              <div className="mb-6 flex items-start gap-4">
                <div className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)] sm:flex">
                  <QrCode className="h-5 w-5" />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="hub-badge">Local canvas</span>
                    <span className="hub-badge">Phone preview</span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
                    QR Code Generator
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 hub-muted">
                    Build a branded QR code with content types, colors, stickers,
                    logos, and a live mobile preview.
                  </p>
                </div>
              </div>

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
            </div>
          </div>
        </div>

        {/* Right preview: sticky while normal page scrolls */}
        <aside className="border-t border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4 sm:p-6 lg:sticky lg:top-[4.5rem] lg:h-[calc(100dvh-4.5rem)] lg:self-start lg:overflow-hidden lg:border-t-0">
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
    </section>
  );
}