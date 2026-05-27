import { useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileArchive,
  FileImage,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';

type ConverterMode = 'image' | 'text';
type ImageOutputFormat = 'png' | 'jpeg' | 'webp';
type TextOutputFormat = 'txt' | 'json' | 'csv';

type ConvertedFile = {
  name: string;
  type: string;
  url?: string;
  text?: string;
  size: number;
};

const IMAGE_FORMATS: Array<{
  id: ImageOutputFormat;
  label: string;
  mime: string;
  extension: string;
}> = [
  { id: 'png', label: 'PNG', mime: 'image/png', extension: 'png' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', extension: 'jpg' },
  { id: 'webp', label: 'WEBP', mime: 'image/webp', extension: 'webp' },
];

const TEXT_FORMATS: Array<{
  id: TextOutputFormat;
  label: string;
  extension: string;
}> = [
  { id: 'txt', label: 'TXT', extension: 'txt' },
  { id: 'json', label: 'JSON', extension: 'json' },
  { id: 'csv', label: 'CSV', extension: 'csv' },
];

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFileBaseName(name: string) {
  return name.replace(/\.[^/.]+$/, '');
}

function getFileExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() || '';
}

export function FileConverter() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<ConverterMode>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageFormat, setImageFormat] = useState<ImageOutputFormat>('png');
  const [textFormat, setTextFormat] = useState<TextOutputFormat>('txt');
  const [quality, setQuality] = useState(0.92);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const selectedExtension = selectedFile ? getFileExtension(selectedFile.name) : '';

  const selectedFileKind = useMemo<ConverterMode>(() => {
    if (!selectedFile) return mode;

    if (selectedFile.type.startsWith('image/')) return 'image';

    return 'text';
  }, [selectedFile, mode]);

  function resetStudio() {
    if (convertedFile?.url) {
      URL.revokeObjectURL(convertedFile.url);
    }

    setSelectedFile(null);
    setConvertedFile(null);
    setCopied(false);
    setError('');
  }

  function handleFileSelect(file: File) {
    setError('');
    setConvertedFile(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      setMode('image');
      return;
    }

    setMode('text');
  }

  async function convertFile() {
    if (!selectedFile) {
      setError('Choose a file to convert first.');
      return;
    }

    setError('');
    setConvertedFile(null);

    try {
      if (mode === 'image') {
        await convertImage(selectedFile);
        return;
      }

      await convertText(selectedFile);
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : 'Unable to convert this file.'
      );
    }
  }

  async function convertImage(file: File) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Choose an image file for image conversion.');
    }

    const selectedFormat = IMAGE_FORMATS.find((item) => item.id === imageFormat) ?? IMAGE_FORMATS[0];

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Unable to read this image file.'));
      image.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      URL.revokeObjectURL(imageUrl);
      throw new Error('Canvas is not available in this browser.');
    }

    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(imageUrl);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error('Unable to export this image.'));
            return;
          }

          resolve(result);
        },
        selectedFormat.mime,
        quality
      );
    });

    const outputUrl = URL.createObjectURL(blob);

    setConvertedFile({
      name: `${getFileBaseName(file.name)}.${selectedFormat.extension}`,
      type: selectedFormat.mime,
      url: outputUrl,
      size: blob.size,
    });
  }

  async function convertText(file: File) {
    const rawText = await file.text();
    const selectedFormat = TEXT_FORMATS.find((item) => item.id === textFormat) ?? TEXT_FORMATS[0];

    let output = rawText;

    if (textFormat === 'json') {
      output = convertTextToJson(rawText);
    }

    if (textFormat === 'csv') {
      output = convertTextToCsv(rawText);
    }

    const blob = new Blob([output], {
      type: textFormat === 'json'
        ? 'application/json'
        : textFormat === 'csv'
          ? 'text/csv'
          : 'text/plain',
    });

    setConvertedFile({
      name: `${getFileBaseName(file.name)}.${selectedFormat.extension}`,
      type: blob.type,
      text: output,
      url: URL.createObjectURL(blob),
      size: blob.size,
    });
  }

  function convertTextToJson(value: string) {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return JSON.stringify(
        {
          content: value,
        },
        null,
        2
      );
    }
  }

  function convertTextToCsv(value: string) {
    const lines = value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return lines
      .map((line) => `"${line.replaceAll('"', '""')}"`)
      .join('\n');
  }

  function downloadConvertedFile() {
    if (!convertedFile?.url) return;

    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    link.click();
  }

  async function copyConvertedText() {
    if (!convertedFile?.text) return;

    try {
      await navigator.clipboard.writeText(convertedFile.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="xl:ml-[76px]">
        <FileConverterToolbar
          fileName={selectedFile?.name}
          convertedFile={convertedFile}
          copied={copied}
          onCopy={copyConvertedText}
          onDownload={downloadConvertedFile}
        />

        <div className="min-h-[calc(100dvh-7.5rem)] xl:grid xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0">
            <FileConverterHeader
              mode={mode}
              onReset={resetStudio}
              onConvert={convertFile}
              hasFile={Boolean(selectedFile)}
            />

            <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
              <div className="space-y-5 pb-10">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="mb-5">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">
                      Upload file
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Choose an image or text-based file to convert.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const file = event.dataTransfer.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    className="flex min-h-[180px] w-full flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/5"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                      <Upload className="h-6 w-6" />
                    </div>

                    <p className="text-sm font-black text-slate-950 dark:text-white">
                      {selectedFile ? selectedFile.name : 'Drop a file here or click to upload'}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {selectedFile
                        ? `${formatBytes(selectedFile.size)} • .${selectedExtension || 'file'}`
                        : 'Images, TXT, JSON, CSV, and text-like files'}
                    </p>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.txt,.json,.csv,.md,.xml,.html,.css,.js,.ts"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="mb-5">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">
                      Conversion type
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Select how this file should be converted.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ModeCard
                      active={mode === 'image'}
                      icon={<FileImage className="h-5 w-5" />}
                      title="Image converter"
                      description="Convert images into PNG, JPEG, or WEBP."
                      onClick={() => setMode('image')}
                    />

                    <ModeCard
                      active={mode === 'text'}
                      icon={<FileText className="h-5 w-5" />}
                      title="Text converter"
                      description="Convert text into TXT, JSON, or CSV."
                      onClick={() => setMode('text')}
                    />
                  </div>
                </section>

                {mode === 'image' ? (
                  <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="mb-5">
                      <h3 className="text-lg font-black text-slate-950 dark:text-white">
                        Image output
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Choose the output format and quality.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {IMAGE_FORMATS.map((format) => (
                        <FormatCard
                          key={format.id}
                          active={imageFormat === format.id}
                          label={format.label}
                          description={`.${format.extension}`}
                          onClick={() => setImageFormat(format.id)}
                        />
                      ))}
                    </div>

                    <label className="mt-5 block rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Quality
                        </span>

                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                          {Math.round(quality * 100)}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min={0.4}
                        max={1}
                        step={0.01}
                        value={quality}
                        onChange={(event) => setQuality(Number(event.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </label>
                  </section>
                ) : (
                  <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="mb-5">
                      <h3 className="text-lg font-black text-slate-950 dark:text-white">
                        Text output
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Choose the text format to export.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {TEXT_FORMATS.map((format) => (
                        <FormatCard
                          key={format.id}
                          active={textFormat === format.id}
                          label={format.label}
                          description={`.${format.extension}`}
                          onClick={() => setTextFormat(format.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </main>
          </div>

          <aside className="border-t border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6 xl:sticky xl:top-[7.5rem] xl:block xl:h-[calc(100dvh-7.5rem)] xl:self-start xl:overflow-hidden xl:border-t-0">
            <FileConverterPreview
              mode={selectedFileKind}
              selectedFile={selectedFile}
              convertedFile={convertedFile}
              imageFormat={imageFormat}
              textFormat={textFormat}
              onConvert={convertFile}
              onDownload={downloadConvertedFile}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

function FileConverterToolbar({
  fileName,
  convertedFile,
  copied,
  onCopy,
  onDownload,
}: {
  fileName?: string;
  convertedFile: ConvertedFile | null;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="sticky top-16 z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <FileArchive className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />

          <p className="min-w-0 max-w-[320px] truncate text-sm font-semibold text-slate-600 dark:text-slate-400 md:max-w-[460px] xl:max-w-[620px]">
            {fileName || 'No file selected yet'}
          </p>
        </div>

        <div className="ml-auto flex h-full min-w-0 items-center justify-end gap-1.5 overflow-x-auto">
          <ToolbarIcon title="Smart convert">
            <Sparkles className="h-4 w-4" />
          </ToolbarIcon>

          <ToolbarIcon title="More options">
            <MoreHorizontal className="h-4 w-4" />
          </ToolbarIcon>

          <div className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800" />

          <ToolbarIcon
            title={copied ? 'Copied' : 'Copy converted text'}
            onClick={onCopy}
            disabled={!convertedFile?.text}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </ToolbarIcon>

          <ToolbarIcon
            title="Download converted file"
            onClick={onDownload}
            disabled={!convertedFile}
          >
            <Download className="h-4 w-4" />
          </ToolbarIcon>
        </div>
      </div>
    </div>
  );
}

function FileConverterHeader({
  mode,
  hasFile,
  onReset,
  onConvert,
}: {
  mode: ConverterMode;
  hasFile: boolean;
  onReset: () => void;
  onConvert: () => void;
}) {
  return (
    <header className="shrink-0 bg-white px-4 py-4 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 sm:flex">
            <FileArchive className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                File Converter
              </span>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                {mode === 'image' ? 'Image Tools' : 'Text Tools'}
              </span>
            </div>

            <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              File Converter
            </h2>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Convert images and text-based files directly in your browser with a clean live preview.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-black text-slate-700 ring-1 ring-inset ring-slate-200/60 transition hover:bg-slate-200/60 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700/50 dark:hover:bg-slate-800"
            title="Reset converter"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onConvert}
            disabled={!hasFile}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            title="Convert file"
          >
            <Wand2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function FileConverterPreview({
  mode,
  selectedFile,
  convertedFile,
  imageFormat,
  textFormat,
  onConvert,
  onDownload,
}: {
  mode: ConverterMode;
  selectedFile: File | null;
  convertedFile: ConvertedFile | null;
  imageFormat: ImageOutputFormat;
  textFormat: TextOutputFormat;
  onConvert: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-col justify-center">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">
                Live Output
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'image'
                  ? `${imageFormat.toUpperCase()} conversion`
                  : `${textFormat.toUpperCase()} conversion`}
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              Browser
            </span>
          </div>

          <div className="flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            {!selectedFile ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  Upload a file
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your converted output will appear here.
                </p>
              </div>
            ) : convertedFile?.url && mode === 'image' ? (
              <img
                src={convertedFile.url}
                alt="Converted preview"
                className="max-h-[240px] max-w-full rounded-2xl object-contain"
              />
            ) : convertedFile?.text ? (
              <pre className="max-h-[240px] w-full overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                {convertedFile.text}
              </pre>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {mode === 'image' ? <FileImage className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                </div>
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  Ready to convert
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Click convert to generate your output.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <PreviewStat label="Input" value={selectedFile?.name || '—'} />
            <PreviewStat label="Output" value={convertedFile?.name || '—'} />
            <PreviewStat label="Input size" value={selectedFile ? formatBytes(selectedFile.size) : '—'} />
            <PreviewStat label="Output size" value={convertedFile ? formatBytes(convertedFile.size) : '—'} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onConvert}
              disabled={!selectedFile}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Wand2 className="h-4 w-4" />
              Convert
            </button>

            <button
              type="button"
              onClick={onDownload}
              disabled={!convertedFile}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-black text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-500/10'
          : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
      }`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
        {icon}
      </div>

      <p className="font-black text-slate-950 dark:text-white">{title}</p>
      <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </button>
  );
}

function FormatCard({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-500/10'
          : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
      }`}
    >
      <p className="font-black text-slate-950 dark:text-white">{label}</p>
      <p className="mt-1 font-mono text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </button>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}

function ToolbarIcon({
  children,
  title,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {children}
    </button>
  );
}