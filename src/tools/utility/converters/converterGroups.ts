import {
    FileVideo,
    FileImage,
    FileText,
    FileType,
    Images,
  } from 'lucide-react';
  
  import type { ConverterGroup } from './types';
  
  export const converterGroups: Record<
    ConverterGroup,
    {
      id: ConverterGroup;
      name: string;
      eyebrow: string;
      title: string;
      description: string;
      icon: typeof FileVideo;
    }
  > = {
    media: {
      id: 'media',
      name: 'Media Converter',
      eyebrow: 'Video & media',
      title: 'Media Converter',
      description:
        'Convert video and media files across popular formats and device presets.',
      icon: FileVideo,
    },
    image: {
      id: 'image',
      name: 'Image Converter',
      eyebrow: 'Image tools',
      title: 'Image Converter',
      description:
        'Convert, optimize, and prepare images for web, print, and archive workflows.',
      icon: FileImage,
    },
    document: {
      id: 'document',
      name: 'Document Converter',
      eyebrow: 'Document tools',
      title: 'Document Converter',
      description:
        'Convert documents, spreadsheets, presentations, and text-based files.',
      icon: FileText,
    },
    pdf: {
      id: 'pdf',
      name: 'PDF Converter',
      eyebrow: 'PDF tools',
      title: 'PDF Converter',
      description:
        'Convert PDFs to documents, images, ebooks, web formats, and back to PDF.',
      icon: FileType,
    },
    gif: {
      id: 'gif',
      name: 'GIF Converter',
      eyebrow: 'GIF tools',
      title: 'GIF Converter',
      description:
        'Create GIFs from video or images and convert GIFs to modern formats.',
      icon: Images,
    },
  };