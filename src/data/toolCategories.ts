import type { ElementType } from 'react';
import {
  Barcode,
  Binary,
  BriefcaseBusiness,
  Code2,
  Database,
  FileArchive,
  FileCode2,
  FileJson,
  FileText,
  Fingerprint,
  Hash,
  Image,
  KeyRound,
  Link2,
  Network,
  Paintbrush,
  QrCode,
  Regex,
  ShieldCheck,
  Wand2,
} from 'lucide-react';

import {
  Base64EncoderDecoderTool,
  HashGeneratorTool,
  JsonFormatterTool,
  JwtDecoderTool,
  RandomNumberGeneratorTool,
  SlugGeneratorTool,
  UrlEncoderDecoderTool,
  UUIDGeneratorTool,
} from '../tools/developer';

import { QRStudio } from '../tools/design';

export type ToolCategorySlug =
  | 'developer'
  | 'text'
  | 'files'
  | 'data'
  | 'security'
  | 'business'
  | 'design';

export type CategoryTool = {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
  component?: React.ComponentType;
  status: 'ready' | 'soon';
  keywords?: string[];
  layout?: 'standard' | 'immersive';
};

export type ToolCategory = {
  slug: ToolCategorySlug;
  name: string;
  eyebrow: string;
  description: string;
  icon: ElementType;
  tools: CategoryTool[];
};

export const toolCategories: ToolCategory[] = [
  {
    slug: 'developer',
    name: 'Developer Tools',
    eyebrow: 'Code utilities',
    description:
      'Format, encode, decode, generate, validate, and inspect developer-friendly data directly in your browser.',
    icon: Code2,
    tools: [
      {
        id: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate random UUIDs for apps, databases, mocks, and testing.',
        icon: KeyRound,
        component: UUIDGeneratorTool,
        status: 'ready',
        keywords: ['guid', 'id', 'random id'],
      },
      {
        id: 'random-number-generator',
        name: 'Random Number Generator',
        description: 'Generate random integers or decimals within a custom range.',
        icon: Binary,
        component: RandomNumberGeneratorTool,
        status: 'ready',
        keywords: ['rng', 'random', 'numbers'],
      },
      {
        id: 'slug-generator',
        name: 'Slug Generator',
        description: 'Convert text into clean URL-friendly slugs.',
        icon: Wand2,
        component: SlugGeneratorTool,
        status: 'ready',
        keywords: ['url', 'seo', 'permalink'],
      },
      {
        id: 'url-encoder-decoder',
        name: 'URL Encoder/Decoder',
        description: 'Encode and decode URL components.',
        icon: Link2,
        component: UrlEncoderDecoderTool,
        status: 'ready',
        keywords: ['uri', 'query string', 'percent encode'],
      },
      {
        id: 'base64-encoder-decoder',
        name: 'Base64 Encoder/Decoder',
        description: 'Encode text to Base64 or decode Base64 back to text.',
        icon: FileCode2,
        component: Base64EncoderDecoderTool,
        status: 'ready',
        keywords: ['encode', 'decode', 'binary'],
      },
      {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Validate, format, and minify JSON.',
        icon: FileJson,
        component: JsonFormatterTool,
        status: 'ready',
        keywords: ['prettify', 'minify', 'api'],
      },
      {
        id: 'hash-generator',
        name: 'Hash Generator',
        description: 'Generate MD5, SHA-1, and SHA-256 hashes.',
        icon: Hash,
        component: HashGeneratorTool,
        status: 'ready',
        keywords: ['sha256', 'sha1', 'md5', 'checksum'],
      },
      {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        description: 'Decode JWT headers and payloads locally.',
        icon: Fingerprint,
        component: JwtDecoderTool,
        status: 'ready',
        keywords: ['token', 'auth', 'claims'],
      },
      {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test regular expressions against sample text.',
        icon: Regex,
        status: 'soon',
      },
      {
        id: 'markdown-to-html',
        name: 'Markdown to HTML Converter',
        description: 'Convert Markdown into clean HTML.',
        icon: FileText,
        status: 'soon',
      },
      {
        id: 'html-formatter',
        name: 'HTML Formatter',
        description: 'Format messy HTML into readable markup.',
        icon: Code2,
        status: 'soon',
      },
      {
        id: 'css-minifier',
        name: 'CSS Minifier',
        description: 'Minify CSS for smaller files.',
        icon: Code2,
        status: 'soon',
      },
      {
        id: 'js-minifier',
        name: 'JS Minifier',
        description: 'Minify JavaScript snippets.',
        icon: Code2,
        status: 'soon',
      },
      {
        id: 'diff-checker',
        name: 'Diff Checker',
        description: 'Compare two text or code blocks.',
        icon: FileCode2,
        status: 'soon',
      },
      {
        id: 'api-tester',
        name: 'API Tester',
        description: 'Send simple API requests from the browser.',
        icon: Network,
        status: 'soon',
      },
      {
        id: 'webhook-tester',
        name: 'Webhook Tester',
        description: 'Inspect webhook payload examples and responses.',
        icon: Network,
        status: 'soon',
      },
      {
        id: 'cron-expression-generator',
        name: 'Cron Expression Generator',
        description: 'Build readable cron schedules.',
        icon: Binary,
        status: 'soon',
      },
      {
        id: 'sql-formatter',
        name: 'SQL Formatter',
        description: 'Format SQL queries.',
        icon: Database,
        status: 'soon',
      },
      {
        id: 'html-entity-converter',
        name: 'HTML Entity Converter',
        description: 'Encode and decode HTML entities.',
        icon: Code2,
        status: 'soon',
      },
      {
        id: 'json-schema-validator',
        name: 'JSON Schema Validator',
        description: 'Validate JSON against a schema.',
        icon: FileJson,
        status: 'soon',
      },
    ],
  },
  {
    slug: 'text',
    name: 'Text Tools',
    eyebrow: 'Writing utilities',
    description:
      'Clean, count, convert, extract, and analyze text for writing, SEO, and content workflows.',
    icon: FileText,
    tools: [
      'Lorem Ipsum Generator',
      'Text Case Converter',
      'Word Counter',
      'Character Counter',
      'Text Reverser',
      'Duplicate Line Remover',
      'Whitespace Cleaner',
      'Keyword Density Checker',
      'Text Similarity Checker',
      'Sentiment Analyzer',
      'URL Extractor',
      'Email Extractor',
      'Metadata Extractor',
      'Keyword Generator',
    ].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name,
      description: `${name} is planned for this category.`,
      icon: FileText,
      status: 'soon' as const,
    })),
  },
  {
    slug: 'files',
    name: 'File / PDF / Image Tools',
    eyebrow: 'Media utilities',
    description:
      'Compress, convert, inspect, resize, split, merge, and optimize files and images.',
    icon: Image,
    tools: [
      'Duplicate File Finder',
      'Image Compressor',
      'PDF Compressor',
      'PDF Merger',
      'PDF Splitter',
      'Image to PDF Converter',
      'PDF to Image Converter',
      'EXIF Metadata Viewer',
      'Favicon Generator',
      'Image Resizer',
      'Aspect Ratio Calculator',
      'SVG Optimizer',
      'Icon Generator',
    ].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name,
      description: `${name} is planned for this category.`,
      icon: FileArchive,
      status: 'soon' as const,
    })),
  },
  {
    slug: 'data',
    name: 'Data Tools',
    eyebrow: 'Data utilities',
    description:
      'Convert, clean, deduplicate, and reshape structured data formats.',
    icon: Database,
    tools: [
      'CSV to JSON Converter',
      'JSON to CSV Converter',
      'CSV Cleaner',
      'Data Deduplicator',
    ].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name,
      description: `${name} is planned for this category.`,
      icon: Database,
      status: 'soon' as const,
    })),
  },
  {
    slug: 'security',
    name: 'Security / Network Tools',
    eyebrow: 'Network utilities',
    description:
      'Validate, inspect, check, and troubleshoot web, email, DNS, SSL, and security-related data.',
    icon: ShieldCheck,
    tools: [
      'IP Address Lookup',
      'Email Validator',
      'URL Safety Checker',
      'Two-Factor Code Generator',
      'Password Breach Checker',
      'SSL Checker',
      'DNS Lookup Tool',
    ].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name,
      description: `${name} is planned for this category.`,
      icon: ShieldCheck,
      status: 'soon' as const,
    })),
  },
  {
    slug: 'business',
    name: 'Business Tools',
    eyebrow: 'Business utilities',
    description:
      'Generate business documents, planning frameworks, names, agendas, quotes, and templates.',
    icon: BriefcaseBusiness,
    tools: [
      'Invoice Generator',
      'Quote Generator',
      'Receipt Generator',
      'Task Prioritization Matrix',
      'Meeting Agenda Generator',
      'Contract Template Generator',
      'Business Name Generator',
      'Slogan Generator',
      'SWOT Generator',
      'OKR Generator',
    ].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name,
      description: `${name} is planned for this category.`,
      icon: BriefcaseBusiness,
      status: 'soon' as const,
    })),
  },
  {
    slug: 'design',
    name: 'Design Tools',
    eyebrow: 'Design utilities',
    description:
      'Generate, calculate, check, and tune design values for UI work.',
    icon: Paintbrush,
    tools: [
      {
        id: 'qr-studio',
        name: 'QR Studio',
        description:
          'Create custom QR codes with content types, colors, frames, logos, and downloadable PNG output.',
        icon: QrCode,
        component: QRStudio,
        status: 'ready',
        layout: 'immersive',
        keywords: ['qr', 'qr code', 'barcode', 'scan', 'generator'],
      },
      {
        id: 'barcode-generator',
        name: 'Barcode Generator',
        description: 'Generate EAN, UPC, and other barcode formats.',
        icon: Barcode,
        status: 'soon',
      },
      {
        id: 'contrast-checker',
        name: 'Contrast Checker',
        description: 'Check color contrast for accessible UI design.',
        icon: Paintbrush,
        status: 'soon',
      },
      {
        id: 'pixel-to-rem-converter',
        name: 'Pixel to REM Converter',
        description: 'Convert pixel values to REM units.',
        icon: Paintbrush,
        status: 'soon',
      },
      {
        id: 'shadow-generator',
        name: 'Shadow Generator',
        description: 'Create CSS box-shadow styles visually.',
        icon: Paintbrush,
        status: 'soon',
      },
      {
        id: 'border-radius-generator',
        name: 'Border Radius Generator',
        description: 'Create and preview CSS border-radius values.',
        icon: Paintbrush,
        status: 'soon',
      },
    ],
  },
];

export function getToolCategory(slug: string | undefined) {
  return toolCategories.find((category) => category.slug === slug);
}