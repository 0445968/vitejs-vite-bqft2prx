import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Camera, Copy, Download, QrCode, RefreshCw } from 'lucide-react';

import { cn } from '../utils/cn';

type Tab = 'generate' | 'scan';

export function QRTool() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Utility
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--qu-text)]">
          QR Code Generator & Scanner
        </h2>

        <p className="mt-2 thub-muted">
          Generate QR codes from text or URLs, or scan QR codes using your
          device camera.
        </p>
      </div>

      <div className="glass-card rounded-[2rem] p-4 sm:p-6">
        <div className="mb-6 grid rounded-2xl bg-slate-100 p-1 dark:bg-slate-950/70 sm:inline-grid sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={cn(
              'rounded-xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'generate'
                ? 'bg-white text-slate-950 shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            Generate
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={cn(
              'rounded-xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'scan'
                ? 'bg-white text-slate-950 shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            Scan
          </button>
        </div>

        {activeTab === 'generate' ? <QRGenerator /> : <QRScanner />}
      </div>
    </div>
  );
}

function QRGenerator() {
  const [value, setValue] = useState('https://quickutilityhub.app');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generate = async () => {
      if (!value.trim()) {
        setQrDataUrl('');
        return;
      }

      const url = await QRCode.toDataURL(value.trim(), {
        width: 720,
        margin: 2,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      });

      setQrDataUrl(url);
    };

    generate();
  }, [value]);

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'quickutility-qr-code.png';
    link.click();
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Text or URL
        </label>

        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={8}
          className="premium-input resize-none"
          placeholder="Enter text, URL, Wi-Fi info, or anything else..."
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={copyText} className="secondary-button">
            <Copy className="h-4 w-4" />
            {copied ? 'Copied' : 'Copy text'}
          </button>

          <button
            type="button"
            onClick={() => setValue('')}
            className="secondary-button"
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/50">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-slate-50 p-5 dark:bg-white">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Generated QR code"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-center text-slate-400">
              <QrCode className="mx-auto mb-3 h-12 w-12" />
              <p className="text-sm">Your QR code will appear here.</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={downloadQR}
          disabled={!qrDataUrl}
          className="premium-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download PNG
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
        'QR scanning is not supported in this browser yet. Try Chrome or Edge on a device with a camera.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const detector = new BarcodeDetector({
        formats: ['qr_code'],
      });

      timerRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;

        try {
          const codes = await detector.detect(videoRef.current);

          if (codes.length > 0) {
            setResult(codes[0].rawValue);
            stopCamera();
          }
        } catch {
          // Some browsers may fail intermittently while the video initializes.
        }
      }, 500);

      setIsScanning(true);
    } catch {
      setError('Camera access was blocked or unavailable.');
      stopCamera();
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 dark:border-white/10">
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          muted
          playsInline
        />

        {!isScanning && !result && (
          <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center text-slate-400">
            <Camera className="mb-3 h-12 w-12" />
            <p className="text-sm">
              Start the scanner and point your camera at a QR code.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={isScanning ? stopCamera : startCamera}
          className="premium-button w-full"
        >
          <Camera className="h-4 w-4" />
          {isScanning ? 'Stop scanner' : 'Start scanner'}
        </button>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/50">
          <h3 className="mb-2 text-sm font-bold text-[color:var(--qu-text)]">
            Scan result
          </h3>

          {result ? (
            <>
              <p className="break-words rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                {result}
              </p>

              <button
                type="button"
                onClick={copyResult}
                className="secondary-button mt-4 w-full"
              >
                <Copy className="h-4 w-4" />
                Copy result
              </button>
            </>
          ) : (
            <p className="text-sm hub-muted">No QR code scanned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
