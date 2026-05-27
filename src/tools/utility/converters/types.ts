export type ConverterGroup = 'media' | 'image' | 'document' | 'pdf' | 'gif';

export type ConverterEngine =
  | 'browser-canvas'
  | 'browser-text'
  | 'ffmpeg'
  | 'imagemagick'
  | 'libreoffice'
  | 'poppler'
  | 'hybrid';

export type ConverterDefinition = {
  id: string;
  group: ConverterGroup;
  name: string;
  title: string;
  description: string;
  inputFormats: string[];
  outputFormats: string[];
  defaultOutputFormat: string;
  requiresBackend: boolean;
  engine: ConverterEngine;
  keywords: string[];
};

export type ConversionResult = {
  fileName: string;
  blob: Blob;
  url: string;
  mimeType: string;
};