import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Camera, Copy, Download, QrCode, RefreshCw, Link, FileText, Wifi, Mail, Palette, Upload } from 'lucide-react';

import { cn } from '../utils/cn';

type Tab = 'generate' | 'scan';
type QRType = 'url' | 'text' | 'wifi' | 'email';

export function QRTool() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Utility
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--qu-text)]">
          Premium QR Code Studio
        </h2>
        <p className="mt-2 hub-muted">
          Generate enterprise-grade styled QR codes with customized palettes, logos, and specific schemas, or scan directly using machine vision.
        </p>
      </div>

      <div className="hub-card rounded-[2rem] p-4 sm:p-6">
        <div className="mb-6 grid rounded-2xl bg-[color:var(--qu-surface-soft)] p-1 sm:inline-grid sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={cn(
              'rounded-xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'generate'
                ? 'bg-[color:var(--qu-surface)] text-[color:var(--qu-text)] shadow-sm'
                : 'text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]'
            )}
          >
            Generate Studio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={cn(
              'rounded-xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'scan'
                ? 'bg-[color:var(--qu-surface)] text-[color:var(--qu-text)] shadow-sm'
                : 'text-[color:var(--qu-muted)] hover:text-[color:var(--qu-text)]'
            )}
          >
            Live Scan
          </button>
        </div>

        {activeTab === 'generate' ? <QRGenerator /> : <QRScanner />}
      </div>
    </div>
  );
}

function QRGenerator() {
  // Mode Selection
  const [qrType, setQrType] = useState<QRType>('url');
  
  // Data States
  const [url, setUrl] = useState('https://quickutilityhub.app');
  const [text, setText] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Design Engine States
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState(2);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // System States
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Helper compute logic to match professional QR schemas (like qr.io)
  const getPayload = (): string => {
    switch (qrType) {
      case 'url':
        return url.trim();
      case 'text':
        return text;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case 'email':
        return `MATMSG:TO:${emailAddress};SUB:${encodeURIComponent(emailSubject)};BODY:${encodeURIComponent(emailBody)};;`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const generate = async () => {
      const payload = getPayload();
      if (!payload.trim()) {
        setQrDataUrl('');
        return;
      }

      try {
        // Step 1: Core QR Code Generation
        const base64Code = await QRCode.toDataURL(payload, {
          width: 1024,
          margin: Number(margin),
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: logoUrl ? 'H' : 'M' // Elevate redundancy threshold if overlay image is configured
        });

        // Step 2: Overlay Image Vector Layer Manipulation
        if (logoUrl) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const qrImg = new Image();
          
          qrImg.onload = () => {
            canvas.width = qrImg.width;
            canvas.height = qrImg.height;
            if (!ctx) return;
            
            ctx.drawImage(qrImg, 0, 0);
            
            const logoImg = new Image();
            logoImg.onload = () => {
              const logoSize = canvas.width * 0.22; // Safe proportional footprint limit
              const x = (canvas.width - logoSize) / 2;
              const y = (canvas.height - logoSize) / 2;
              
              // Draw structural boundary layer mask behind custom overlay logo
              ctx.fillStyle = bgColor;
              ctx.beginPath();
              ctx.roundRect(x - 6, y - 6, logoSize + 12, logoSize + 12, 12);
              ctx.fill();
              
              ctx.drawImage(logoImg, x, y, logoSize, logoSize);
              setQrDataUrl(canvas.toDataURL());
            };
            logoImg.src = logoUrl;
          };
          qrImg.src = base64Code;
        } else {
          setQrDataUrl(base64Code);
        }
      } catch (err) {
        console.error('Generation execution block interrupted:', err);
      }
    };

    generate();
  }, [url, text, wifiSsid, wifiPassword, wifiEncryption, emailAddress, emailSubject, emailBody, qrType, fgColor, bgColor, margin, logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setLogoUrl(event.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `premium-qr-${qrType}.png`;
    link.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Schema Type Row Selector */}
        <div className="flex flex-wrap gap-2 border-b border-[color:var(--qu-border)] pb-4">
          {(['url', 'text', 'wifi', 'email'] as QRType[]).map((type) => (
            <button
              key={type}
              onClick={() => setQrType(type)}
              className={cn(
                "hub-secondary-button py-2 px-4 !rounded-xl text-xs capitalize",
                qrType === type && "border-[color:var(--qu-accent)] bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]"
              )}
            >
              {type === 'url' && <Link className="h-3.5 w-3.5 mr-1" />}
              {type === 'text' && <FileText className="h-3.5 w-3.5 mr-1" />}
              {type === 'wifi' && <Wifi className="h-3.5 w-3.5 mr-1" />}
              {type === 'email' && <Mail className="h-3.5 w-3.5 mr-1" />}
              {type}
            </button>
          ))}
        </div>

        {/* Dynamic Context Parameters Interface */}
        <div className="space-y-4">
          {qrType === 'url' && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Target Link / URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="hub-input"
                placeholder="https://example.com"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Raw Copy / Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="hub-input resize-none"
                placeholder="Type absolute standard system plain text parameters here..."
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="hub-input"
                  placeholder="Home_Wifi_Network"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Access Key / Password</label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="hub-input"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Network Architecture Type</label>
                <select
                  value={wifiEncryption}
                  onChange={(e) => setWifiEncryption(e.target.value)}
                  className="hub-input"
                >
                  <option value="WPA">WPA/WPA2/WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Unsecured / Open</option>
                </select>
              </div>
            </div>
          )}

          {qrType === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Recipient Address</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="hub-input"
                  placeholder="hello@company.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Subject Header</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="hub-input"
                  placeholder="Inquiry regarding services"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Message Template Body</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={3}
                  className="hub-input resize-none"
                  placeholder="Body content layout block goes here..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Professional Customization Parameter Blocks */}
        <div className="hub-panel rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[color:var(--qu-text)]">
            <Palette className="h-4 w-4 text-[color:var(--qu-accent-strong)]" />
            <h4>Design Engine Customizations</h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-[color:var(--qu-muted)]">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border-none bg-transparent"
                />
                <span className="text-xs font-mono tracking-tight text-[color:var(--qu-text)]">{fgColor}</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-[color:var(--qu-muted)]">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border-none bg-transparent"
                />
                <span className="text-xs font-mono tracking-tight text-[color:var(--qu-text)]">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-[color:var(--qu-muted)]">Quiet Zone Margin ({margin})</label>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-[color:var(--qu-accent)]"
              />
            </div>
          </div>

          {/* Logo Integration Section */}
          <div className="border-t border-[color:var(--qu-border)] pt-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">Brand Logo Overlay</label>
            <div className="flex items-center gap-4">
              <label className="hub-secondary-button cursor-pointer text-xs">
                <Upload className="h-3.5 w-3.5 mr-1" />
                Upload File Asset
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl(null)}
                  className="text-xs text-[color:var(--qu-danger)] hover:underline"
                >
                  Remove Brand Logo Overlay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code Generation Target Output Viewport */}
      <div className="hub-panel flex flex-col justify-between rounded-3xl p-5">
        <div>
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-white p-5 border border-[color:var(--qu-border)]">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Premium dynamic configuration payload qr vector map"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-center text-[color:var(--qu-muted)]">
                <QrCode className="mx-auto mb-3 h-12 w-12" />
                <p className="text-sm">Configuring dynamic parameters...</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(getPayload());
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              }}
              className="hub-secondary-button flex-1 text-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? 'Copied Content' : 'Copy Code Data'}
            </button>

            <button
              type="button"
              onClick={() => {
                setUrl('https://quickutilityhub.app');
                setText('');
                setWifiSsid('');
                setWifiPassword('');
                setEmailAddress('');
                setEmailSubject('');
                setEmailBody('');
                setFgColor('#000000');
                setBgColor('#ffffff');
                setMargin(2);
                setLogoUrl(null);
              }}
              className="hub-icon-button"
              title="Reset View Configuration"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadQR}
          disabled={!qrDataUrl}
          className="hub-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download Vector PNG
        </button>
      </div>
    </div>
  );
}

function QRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const stopCamera = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
  };

  const startCamera = async () => {
    setError('');
    setResult('');

    if (!('BarcodeDetector' in window)) {
      setError(
        'The native BarcodeDetector API structure is missing or permissions are blocked. Run on high-tier secure browsers.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Using standard native Chromium high performance parser matching specification criteria
      // @ts-ignore
      const detector = new BarcodeDetector({ formats: ['qr_code'] });

      timerRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            setResult(codes[0].rawValue);
            stopCamera();
          }
        } catch {
          // Captures potential sync drops during viewport frame scaling passes
        }
      }, 350);

      setIsScanning(true);
    } catch {
      setError('System hardware camera ingestion configuration was blocked or is occupied.');
      stopCamera();
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="relative overflow-hidden rounded-3xl border border-[color:var(--qu-border)] bg-[#020617]">
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          muted
          playsInline
        />

        {!isScanning && !result && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <Camera className="mb-3 h-12 w-12 text-[color:var(--qu-muted)]" />
            <p className="text-sm text-[color:var(--qu-muted)]">
              Initiate scan execution frame to trigger device optics processing array.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <button
            type="button"
            onClick={isScanning ? stopCamera : startCamera}
            className="hub-button w-full"
          >
            <Camera className="h-4 w-4" />
            {isScanning ? 'Terminate Optical Matrix' : 'Initialize Matrix Stream'}
          </button>

          {error && (
            <div className="rounded-2xl border border-[color:var(--qu-danger)] bg-[color:var(--qu-bg)] p-4 text-xs font-medium text-[color:var(--qu-danger)]">
              {error}
            </div>
          )}

          <div className="hub-panel rounded-3xl p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[color:var(--qu-muted)]">
                Decoded Output Data Block
              </h3>
              {result && <span className="hub-badge">Active</span>}
            </div>

            {result ? (
              <>
                <p className="break-words font-mono text-xs rounded-2xl bg-[color:var(--qu-surface-soft)] p-4 text-[color:var(--qu-text)]">
                  {result}
                </p>

                <button
                  type="button"
                  onClick={async () => await navigator.clipboard.writeText(result)}
                  className="hub-secondary-button mt-4 w-full text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Text Matrix
                </button>
              </>
            ) : (
              <p className="text-sm hub-muted italic">Awaiting structural payload scan data stream detection...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}