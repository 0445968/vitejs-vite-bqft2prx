'use client';

import { useEffect, useMemo, useState } from 'react';
import { UploadCloud } from 'lucide-react';

import { ConverterHeader } from './ConverterHeader';
import { ConverterPreview } from './ConverterPreview';
import { ConverterToolbar } from './ConverterToolbar';
import { converterGroups } from './converterGroups';
import { getConvertersByGroup } from './converterRegistry';
import type {
  ConversionResult,
  ConverterDefinition,
  ConverterGroup,
} from './types';

type ConverterStudioProps = {
  group: ConverterGroup;
};

export function ConverterStudio({ group }: ConverterStudioProps) {
  const converters = useMemo(() => getConvertersByGroup(group), [group]);
  const groupMeta = converterGroups[group];

  const [selectedId, setSelectedId] = useState(converters[0]?.id ?? '');
  const selectedConverter = converters.find((converter) => converter.id === selectedId);

  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState(
    selectedConverter?.defaultOutputFormat ?? '',
  );
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (!selectedConverter) return;

    setOutputFormat(selectedConverter.defaultOutputFormat);
    setResult(null);
    setError(null);
  }, [selectedConverter]);

  function resetStudio() {
    setSelectedId(converters[0]?.id ?? '');
    setFile(null);
    setResult(null);
    setError(null);
    setIsConverting(false);
  }

  async function handleConvert() {
    if (!file || !selectedConverter) return;

    setIsConverting(true);
    setError(null);
    setResult(null);

    try {
      if (selectedConverter.requiresBackend) {
        throw new Error('This conversion requires a server-side engine.');
      }

      const converted =
        selectedConverter.engine === 'browser-canvas'
          ? await convertImage(file, outputFormat)
          : await convertText(file, outputFormat);

      setResult(converted);
    } catch (convertError) {
      setError(
        convertError instanceof Error
          ? convertError.message
          : 'Something went wrong while converting this file.',
      );
    } finally {
      setIsConverting(false);
    }
  }

  function handleDownload() {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.fileName;
    link.click();
  }

  async function handleCopy() {
    if (!result) return;

    try {
      const text = await result.blob.text();
      await navigator.clipboard.writeText(text);
    } catch {
      setError('This result cannot be copied as text.');
    }
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="xl:ml-[76px]">
        <ConverterToolbar
          title={selectedConverter?.name ?? groupMeta.name}
          fileName={file?.name}
          canDownload={Boolean(result)}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />

        <div className="min-h-[calc(100dvh-7.5rem)] xl:grid xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0">
            <ConverterHeader
              group={group}
              selectedConverter={selectedConverter}
              hasFile={Boolean(file)}
              isConverting={isConverting}
              onReset={resetStudio}
              onConvert={handleConvert}
            />

            <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                      Upload file
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Choose a file and select the format you want to export.
                    </p>
                  </div>

                  <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/60 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
                    <UploadCloud className="mb-4 h-10 w-10 text-blue-600 dark:text-blue-300" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {file ? file.name : 'Click to upload a file'}
                    </span>
                    <span className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Supported input: {selectedConverter?.inputFormats.join(', ').toUpperCase()}
                    </span>

                    <input
                      type="file"
                      className="hidden"
                      accept={selectedConverter?.inputFormats
                        .map((format) => `.${format}`)
                        .join(',')}
                      onChange={(event) => {
                        const nextFile = event.target.files?.[0] ?? null;
                        setFile(nextFile);
                        setResult(null);
                        setError(null);
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Converter
                    </label>

                    <select
                      value={selectedId}
                      onChange={(event) => setSelectedId(event.target.value)}
                      className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
                    >
                      {converters.length ? (
                        converters.map((converter) => (
                          <option key={converter.id} value={converter.id}>
                            {converter.name}
                          </option>
                        ))
                      ) : (
                        <option>No converters available</option>
                      )}
                    </select>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Output format
                    </label>

                    <select
                      value={outputFormat}
                      onChange={(event) => {
                        setOutputFormat(event.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
                    >
                      {(selectedConverter?.outputFormats ?? []).map((format) => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Engine status
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {selectedConverter?.requiresBackend
                        ? 'Server engine required. This converter is listed now and will connect to your conversion API later.'
                        : 'Browser supported. This converter can run locally without a backend.'}
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>

          <aside className="border-t border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6 xl:sticky xl:top-[7.5rem] xl:block xl:h-[calc(100dvh-7.5rem)] xl:self-start xl:overflow-hidden xl:border-t-0">
            <ConverterPreview
              converter={selectedConverter}
              file={file}
              outputFormat={outputFormat}
              result={result}
              error={error}
              onDownload={handleDownload}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

async function convertImage(file: File, outputFormat: string): Promise<ConversionResult> {
  const imageUrl = URL.createObjectURL(file);
  const image = new Image();

  image.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not load this image.'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    URL.revokeObjectURL(imageUrl);
    throw new Error('Canvas is not supported in this browser.');
  }

  context.drawImage(image, 0, 0);

  const mimeType =
    outputFormat === 'jpg' || outputFormat === 'jpeg'
      ? 'image/jpeg'
      : outputFormat === 'webp'
        ? 'image/webp'
        : 'image/png';

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (nextBlob) => {
        if (!nextBlob) {
          reject(new Error('Could not convert this image.'));
          return;
        }

        resolve(nextBlob);
      },
      mimeType,
      0.92,
    );
  });

  URL.revokeObjectURL(imageUrl);

  const fileName = renameFile(file.name, outputFormat);
  const url = URL.createObjectURL(blob);

  return { fileName, blob, url, mimeType };
}

async function convertText(file: File, outputFormat: string): Promise<ConversionResult> {
  const text = await file.text();
  let output = text;
  let mimeType = 'text/plain';

  if (outputFormat === 'json') {
    output = JSON.stringify(
      {
        fileName: file.name,
        convertedAt: new Date().toISOString(),
        content: text,
      },
      null,
      2,
    );
    mimeType = 'application/json';
  }

  if (outputFormat === 'csv') {
    output = text
      .split(/\r?\n/)
      .map((line) => `"${line.replace(/"/g, '""')}"`)
      .join('\n');
    mimeType = 'text/csv';
  }

  const blob = new Blob([output], { type: mimeType });
  const fileName = renameFile(file.name, outputFormat);
  const url = URL.createObjectURL(blob);

  return { fileName, blob, url, mimeType };
}

function renameFile(fileName: string, extension: string) {
  const cleanExtension = extension === 'jpeg' ? 'jpg' : extension;
  const baseName = fileName.replace(/\.[^.]+$/, '');

  return `${baseName}.${cleanExtension}`;
}