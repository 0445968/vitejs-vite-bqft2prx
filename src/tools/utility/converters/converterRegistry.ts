import type { ConverterDefinition, ConverterEngine, ConverterGroup } from './types';

type GeneratedConverter = {
  group: ConverterGroup;
  name: string;
  inputFormats?: string[];
  outputFormats?: string[];
  defaultOutputFormat?: string;
  engine?: ConverterEngine;
  requiresBackend?: boolean;
};

export function slugifyConverterName(name: string) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const mediaConverters =
  'M2TS Converter,MTS Converter,MPEG Converter,SWF Converter,MOD Converter,M4V Converter,QT Converter,RM Converter,MPG Converter,3GPP Converter,DIVX Converter,VOB Converter,DVR-MS Converter,RMVB Converter,ASF Converter,3G2 Converter,TS Converter,MPV Converter,WTV Converter,XVID Converter,MXF Converter,M1V Converter,F4P Converter,F4V Converter,Mobile Video Converter,iPhone Video Converter,Android Video Converter,PSP Video Converter,iPad Video Converter,Xbox Video Converter,Kindle Video Converter,MOV Converter,FLV Converter,WMV Converter,MKV Converter,WEBM Converter,3GP Converter,AVI Converter,MP4 Converter,OGV Converter'.split(
    ',',
  );

const imageConverters =
  'DJV Converter,EPS Converter,PPM Converter,ART Converter,DPX Converter,WMZ Converter,DDS Converter,HEIC Converter,AVIF Converter,PCX Converter,TIF Converter,JPEG Converter,EMZ Converter,TGA Converter,DIB Converter,DJVU Converter,CBZ Converter,HEIF Converter,JXL Converter,ICO Converter,CBR Converter,JFIF Converter,PSB Converter,ARW Converter,X3F Converter,Panasonic RAW Converter,NRW Converter,NEF Converter,RWL Converter,Sigma RAW Converter,K25 Converter,Kodak RAW Converter,CRW Converter,DCS Converter,DRF Converter,CR3 Converter,Canon RAW Converter,ORF Converter,DCR Converter,RAW Converter,Sony RAW Converter,CR2 Converter,RW2 Converter,Pentax RAW Converter,Samsung RAW Converter,SRW Converter,PEF Converter,RAF Converter,DNG Converter,KDC Converter,SRF Converter,PTX Converter,Leica RAW Converter,SR2 Converter,Nikon RAW Converter,PSD Converter,SVG Converter,WebP Converter,GIF Converter,ODD Converter,PNG Converter,BMP Converter,JPG Converter,TIFF Converter'.split(
    ',',
  );

const documentConverters =
  'DOC Converter,HTML Converter,PPT Converter,XLS Converter,EXCEL Converter,ODS Converter,WORD Converter,PPTX Converter,CSV Converter,ODP Converter,ODT Converter,TXT Converter,PDF Converter,XLSX Converter,TEXT Converter,DOCX Converter,PS Converter,XML Converter,RTF Converter,POTX Converter,VSDX Converter,VSD Converter,PPSX Converter,PPS Converter,PAGES Converter,WPS Converter,PPTM Converter,DOT Converter,Webpage Converter,XLSM Converter,HWP Converter,POT Converter,HTM Converter,PUB Converter,DOTX Converter,XPS Converter,EML Converter,DOCM Converter'.split(
    ',',
  );

const pdfConverters =
  'PDF to EPS,PDF to TIFF,PDF to JPG,PDF to BMP,PDF to PNG,PDF to ODD,PDF to GIF,PDF to WebP,PDF to PSD,PDF to JPEG,PDF to RTF,PDF to DOCX,PDF to TEXT,PDF to XLSX,PDF to TXT,PDF to ODT,PDF to WORD,PDF to EXCEL,PDF to XLS,PDF to DOC,PDF to PS,PDF to AZW3,PDF to PPTX,PDF to PPT,PDF to MOBI,PDF to EPUB,PDF to HTML,TIFF to PDF,JPG to PDF,BMP to PDF,PNG to PDF,ODD to PDF,GIF to PDF,WebP to PDF,SVG to PDF,PSD to PDF,Nikon RAW to PDF,SR2 to PDF,Leica RAW to PDF,PTX to PDF,SRF to PDF,KDC to PDF,DNG to PDF,RAF to PDF,PEF to PDF,SRW to PDF,Samsung RAW to PDF,Pentax RAW to PDF,RW2 to PDF,CR2 to PDF,Sony RAW to PDF,RAW to PDF,DCR to PDF,ORF to PDF,Canon RAW to PDF,CR3 to PDF,DRF to PDF,DCS to PDF,CRW to PDF,Kodak RAW to PDF,K25 to PDF,Sigma RAW to PDF,RWL to PDF,NEF to PDF,NRW to PDF,Panasonic RAW to PDF,X3F to PDF,ARW to PDF,PSB to PDF,JFIF to PDF,CBR to PDF,ICO to PDF,JXL to PDF,HEIF to PDF,CBZ to PDF,DJVU to PDF,DIB to PDF,TGA to PDF,EMZ to PDF,JPEG to PDF,TIF to PDF,PCX to PDF,AVIF to PDF,HEIC to PDF,DDS to PDF,WMZ to PDF,DPX to PDF,ART to PDF,PPM to PDF,EPS to PDF,SVGZ to PDF,AI to PDF,MOBI to PDF,EPUB to PDF,AZW3 to PDF,AZW4 to PDF,FB2 to PDF,AZW to PDF,CHM to PDF,LIT to PDF,DOCM to PDF,EML to PDF,XPS to PDF,DOTX to PDF,PUB to PDF,HTM to PDF,POT to PDF,XLSM to PDF,Webpage to PDF,DOT to PDF,PPTM to PDF,WPS to PDF,PAGES to PDF,PPS to PDF,PPSX to PDF,VSD to PDF,VSDX to PDF,POTX to PDF,RTF to PDF,XML to PDF,PS to PDF,DOCX to PDF,TEXT to PDF,XLSX to PDF,TXT to PDF,ODT to PDF,ODP to PDF,CSV to PDF,PPTX to PDF,WORD to PDF,ODS to PDF,EXCEL to PDF,XLS to PDF,PPT to PDF,HTML to PDF,DOC to PDF'.split(
    ',',
  );

const gifConverters =
  'Video to GIF,MP4 to GIF,WEBM to GIF,APNG to GIF,GIF to MP4,GIF to APNG,Image to GIF,MOV to GIF,AVI to GIF'.split(
    ',',
  );

const browserImageFormats = ['png', 'jpg', 'jpeg', 'webp'];
const browserTextFormats = ['txt', 'text', 'csv', 'json', 'xml', 'html', 'htm'];

function cleanName(name: string) {
  return name.replace(/\s+converter$/i, '');
}

function lowerFormat(format: string) {
  return format.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function formatsFromName(name: string, group: ConverterGroup) {
  if (name.includes(' to ')) {
    const [input, output] = name.split(' to ');

    return {
      inputFormats: [lowerFormat(input)],
      outputFormats: [lowerFormat(output)],
      defaultOutputFormat: lowerFormat(output),
    };
  }

  const input = lowerFormat(cleanName(name));

  if (group === 'media') {
    const outputs = ['mp4', 'mov', 'webm', 'avi', 'mkv', 'gif'].filter(
      (format) => format !== input,
    );

    return {
      inputFormats: [input],
      outputFormats: outputs,
      defaultOutputFormat: input === 'webm' ? 'mp4' : 'webm',
    };
  }

  if (group === 'image') {
    const browser = browserImageFormats.includes(input);

    return {
      inputFormats: [input],
      outputFormats: browser
        ? browserImageFormats.filter((format) => format !== input)
        : ['jpg', 'png', 'webp', 'pdf'],
      defaultOutputFormat: browser ? (input === 'png' ? 'webp' : 'png') : 'jpg',
    };
  }

  const text = browserTextFormats.includes(input);

  return {
    inputFormats: [input],
    outputFormats: text
      ? browserTextFormats.filter((format) => format !== input)
      : ['pdf', 'docx', 'txt', 'html'],
    defaultOutputFormat: text ? 'txt' : 'pdf',
  };
}

function inferEngine(
  group: ConverterGroup,
  inputFormats: string[],
  outputFormats: string[],
): ConverterEngine {
  const formats = [...inputFormats, ...outputFormats];

  if (group === 'media' || group === 'gif') return 'ffmpeg';

  if (group === 'pdf') {
    return inputFormats.includes('pdf') ? 'poppler' : 'libreoffice';
  }

  if (group === 'image') {
    return formats.every((format) => browserImageFormats.includes(format))
      ? 'browser-canvas'
      : 'imagemagick';
  }

  return formats.every((format) => browserTextFormats.includes(format))
    ? 'browser-text'
    : 'libreoffice';
}

function buildConverter(item: GeneratedConverter): ConverterDefinition {
  const inferred = formatsFromName(item.name, item.group);
  const inputFormats = item.inputFormats ?? inferred.inputFormats;
  const outputFormats = item.outputFormats ?? inferred.outputFormats;
  const defaultOutputFormat = item.defaultOutputFormat ?? inferred.defaultOutputFormat;
  const engine = item.engine ?? inferEngine(item.group, inputFormats, outputFormats);
  const title = /converter$/i.test(item.name) ? item.name : `${item.name} Converter`;

  return {
    id: slugifyConverterName(title),
    group: item.group,
    name: title,
    title,
    description: `Convert ${cleanName(item.name)} files to ${outputFormats
      .map((format) => format.toUpperCase())
      .join(', ')}.`,
    inputFormats,
    outputFormats,
    defaultOutputFormat,
    requiresBackend: item.requiresBackend ?? !engine.startsWith('browser'),
    engine,
    keywords: [
      ...inputFormats,
      ...outputFormats,
      cleanName(item.name).toLowerCase(),
      'converter',
      'convert',
    ],
  };
}

const manualConverters: GeneratedConverter[] = [
  {
    group: 'image',
    name: 'PNG Converter',
    inputFormats: ['png'],
    outputFormats: ['jpg', 'jpeg', 'webp'],
    defaultOutputFormat: 'webp',
    engine: 'browser-canvas',
    requiresBackend: false,
  },
  {
    group: 'image',
    name: 'JPG Converter',
    inputFormats: ['jpg', 'jpeg'],
    outputFormats: ['png', 'webp'],
    defaultOutputFormat: 'png',
    engine: 'browser-canvas',
    requiresBackend: false,
  },
  {
    group: 'image',
    name: 'WebP Converter',
    inputFormats: ['webp'],
    outputFormats: ['png', 'jpg', 'jpeg'],
    defaultOutputFormat: 'png',
    engine: 'browser-canvas',
    requiresBackend: false,
  },
  {
    group: 'document',
    name: 'TXT Converter',
    inputFormats: ['txt', 'text'],
    outputFormats: ['json', 'csv'],
    defaultOutputFormat: 'json',
    engine: 'browser-text',
    requiresBackend: false,
  },
  {
    group: 'document',
    name: 'JSON Converter',
    inputFormats: ['json'],
    outputFormats: ['txt'],
    defaultOutputFormat: 'txt',
    engine: 'browser-text',
    requiresBackend: false,
  },
  {
    group: 'document',
    name: 'CSV Converter',
    inputFormats: ['csv'],
    outputFormats: ['txt'],
    defaultOutputFormat: 'txt',
    engine: 'browser-text',
    requiresBackend: false,
  },
  {
    group: 'document',
    name: 'XML Converter',
    inputFormats: ['xml'],
    outputFormats: ['txt'],
    defaultOutputFormat: 'txt',
    engine: 'browser-text',
    requiresBackend: false,
  },
  {
    group: 'document',
    name: 'HTML Converter',
    inputFormats: ['html', 'htm'],
    outputFormats: ['txt'],
    defaultOutputFormat: 'txt',
    engine: 'browser-text',
    requiresBackend: false,
  },
];

const generatedConverters: GeneratedConverter[] = [
  ...mediaConverters.map((name) => ({ group: 'media' as const, name })),
  ...imageConverters.map((name) => ({ group: 'image' as const, name })),
  ...documentConverters.map((name) => ({ group: 'document' as const, name })),
  ...pdfConverters.map((name) => ({ group: 'pdf' as const, name })),
  ...gifConverters.map((name) => ({ group: 'gif' as const, name })),
];

export const converterRegistry: ConverterDefinition[] = Array.from(
  new Map(
    [...manualConverters, ...generatedConverters]
      .map(buildConverter)
      .map((converter) => [converter.id, converter]),
  ).values(),
);

export function getConvertersByGroup(group: ConverterGroup) {
  return converterRegistry.filter((converter) => converter.group === group);
}