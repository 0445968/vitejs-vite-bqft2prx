/// <reference types="vite/client" />

interface BarcodeDetectorOptions {
  formats?: string[];
}

interface BarcodeDetectorResult {
  rawValue: string;
  format: string;
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  detect(source: CanvasImageSource): Promise<BarcodeDetectorResult[]>;
}
