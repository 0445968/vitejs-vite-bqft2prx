import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Dices,
  FileJson,
  Hash,
  KeyRound,
  Link2,
  RefreshCw,
  Wand2,
} from 'lucide-react';

type CopyButtonProps = {
  value: string;
  label?: string;
};

function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className="hub-secondary-button disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function ToolShell({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="hub-card rounded-[2rem] p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Icon className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[color:var(--qu-text)]">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 hub-muted">
            {description}
          </p>
        </div>

        <span className="hub-badge self-start">Local only</span>
      </div>

      {children}
    </section>
  );
}

export function UUIDGeneratorTool() {
  const createUuid = () => {
    if ('randomUUID' in crypto) return crypto.randomUUID();

    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
      const value = Number(c);
      return (
        value ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (value / 4)))
      ).toString(16);
    });
  };

  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 5 }, createUuid)
  );

  const generate = () => {
    setUuids(Array.from({ length: Math.max(1, Math.min(count, 100)) }, createUuid));
  };

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate RFC-style random UUIDs for apps, databases, mocks, and test data."
      icon={KeyRound}
    >
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4">
          <label className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
            Quantity
          </label>

          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="hub-input"
          />

          <button type="button" onClick={generate} className="hub-button mt-4 w-full">
            <RefreshCw className="h-4 w-4" />
            Generate
          </button>
        </div>

        <div className="space-y-3">
          {uuids.map((uuid) => (
            <div
              key={uuid}
              className="flex flex-col gap-3 rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-3 sm:flex-row sm:items-center"
            >
              <code className="min-w-0 flex-1 break-all text-sm font-bold text-[color:var(--qu-text)]">
                {uuid}
              </code>

              <CopyButton value={uuid} />
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

export function RandomNumberGeneratorTool() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [allowDecimals, setAllowDecimals] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  const generate = () => {
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    const safeCount = Math.max(1, Math.min(count, 100));

    const next = Array.from({ length: safeCount }, () => {
      const value = Math.random() * (high - low) + low;
      return allowDecimals ? Number(value.toFixed(4)) : Math.round(value);
    });

    setNumbers(next);
  };

  const output = numbers.join(', ');

  return (
    <ToolShell
      title="Random Number Generator"
      description="Generate one or many random numbers within a custom range."
      icon={Dices}
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Min</span>
          <input
            type="number"
            value={min}
            onChange={(event) => setMin(Number(event.target.value))}
            className="hub-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">Max</span>
          <input
            type="number"
            value={max}
            onChange={(event) => setMax(Number(event.target.value))}
            className="hub-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">Quantity</span>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="hub-input"
          />
        </label>

        <div className="flex items-end">
          <button type="button" onClick={generate} className="hub-button w-full">
            <RefreshCw className="h-4 w-4" />
            Generate
          </button>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4 text-sm font-bold">
        <input
          type="checkbox"
          checked={allowDecimals}
          onChange={(event) => setAllowDecimals(event.target.checked)}
          className="h-4 w-4 accent-[color:var(--qu-accent)]"
        />
        Allow decimals
      </label>

      <div className="mt-5 rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-black text-[color:var(--qu-text)]">Result</h3>
          <CopyButton value={output} />
        </div>

        <pre className="min-h-28 whitespace-pre-wrap break-words text-sm hub-muted">
          {output || 'Click Generate to create random numbers.'}
        </pre>
      </div>
    </ToolShell>
  );
}

export function SlugGeneratorTool() {
  const [input, setInput] = useState('QuickUtility Hub Developer Tools');
  const [separator, setSeparator] = useState('-');

  const slug = useMemo(() => {
    return input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, separator)
      .replace(new RegExp(`${separator}+`, 'g'), separator)
      .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
  }, [input, separator]);

  return (
    <ToolShell
      title="Slug Generator"
      description="Convert titles, names, and phrases into clean URL-friendly slugs."
      icon={Wand2}
    >
      <div className="grid gap-5">
        <label>
          <span className="mb-2 block text-sm font-bold">Text</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="hub-input min-h-32 resize-y"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Separator</span>
          <select
            value={separator}
            onChange={(event) => setSeparator(event.target.value)}
            className="hub-input"
          >
            <option value="-">Hyphen -</option>
            <option value="_">Underscore _</option>
          </select>
        </label>

        <div className="rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-black text-[color:var(--qu-text)]">Slug</h3>
            <CopyButton value={slug} />
          </div>

          <code className="break-all text-sm font-bold text-[color:var(--qu-text)]">
            {slug || 'Your slug will appear here.'}
          </code>
        </div>
      </div>
    </ToolShell>
  );
}

export function UrlEncoderDecoderTool() {
  const [input, setInput] = useState('https://quickutility.dev/search?q=hello world');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput('Invalid encoded URL string.');
    }
  };

  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Encode or decode URL components safely for query strings and web requests."
      icon={Link2}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold">Input</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="hub-input min-h-48 resize-y font-mono"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Output</span>
          <textarea
            value={output}
            readOnly
            className="hub-input min-h-48 resize-y font-mono"
            placeholder="Result appears here..."
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={encode} className="hub-button">
          Encode
        </button>
        <button type="button" onClick={decode} className="hub-secondary-button">
          Decode
        </button>
        <CopyButton value={output} />
      </div>
    </ToolShell>
  );
}

function unicodeToBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToUnicode(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

export function Base64EncoderDecoderTool() {
  const [input, setInput] = useState('QuickUtility Hub');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(unicodeToBase64(input));

  const decode = () => {
    try {
      setOutput(base64ToUnicode(input));
    } catch {
      setOutput('Invalid Base64 input.');
    }
  };

  return (
    <ToolShell
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back into readable text."
      icon={CodeIcon}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="hub-input min-h-48 resize-y font-mono"
          placeholder="Input..."
        />

        <textarea
          value={output}
          readOnly
          className="hub-input min-h-48 resize-y font-mono"
          placeholder="Output..."
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={encode} className="hub-button">
          Encode
        </button>
        <button type="button" onClick={decode} className="hub-secondary-button">
          Decode
        </button>
        <CopyButton value={output} />
      </div>
    </ToolShell>
  );
}

function CodeIcon(props: React.ComponentProps<'svg'>) {
  return <FileJson {...props} />;
}

export function JsonFormatterTool() {
  const [input, setInput] = useState('{"name":"QuickUtility Hub","tools":17,"active":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON.');
      setOutput('');
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON.');
      setOutput('');
    }
  };

  return (
    <ToolShell
      title="JSON Formatter"
      description="Validate, format, and minify JSON for APIs, configs, and debugging."
      icon={FileJson}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="hub-input min-h-72 resize-y font-mono"
          spellCheck={false}
        />

        <textarea
          value={output}
          readOnly
          className="hub-input min-h-72 resize-y font-mono"
          placeholder="Formatted JSON appears here..."
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-500">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={format} className="hub-button">
          Format
        </button>
        <button type="button" onClick={minify} className="hub-secondary-button">
          Minify
        </button>
        <CopyButton value={output} />
      </div>
    </ToolShell>
  );
}

async function digestText(algorithm: 'SHA-1' | 'SHA-256', value: string) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest(algorithm, bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function md5(input: string) {
  function rotateLeft(value: number, amount: number) {
    return (value << amount) | (value >>> (32 - amount));
  }

  function addUnsigned(a: number, b: number) {
    const a4 = a & 0x40000000;
    const b4 = b & 0x40000000;
    const a8 = a & 0x80000000;
    const b8 = b & 0x80000000;
    const result = (a & 0x3fffffff) + (b & 0x3fffffff);

    if (a4 & b4) return result ^ 0x80000000 ^ a8 ^ b8;
    if (a4 | b4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ a8 ^ b8;
      return result ^ 0x40000000 ^ a8 ^ b8;
    }

    return result ^ a8 ^ b8;
  }

  function f(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }

  function g(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }

  function h(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }

  function i(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }

  function transform(
    fn: (x: number, y: number, z: number) => number,
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, fn(b, c, d)), addUnsigned(x, ac)), s), b);
  }

  function convertToWords(value: string) {
    const length = value.length;
    const wordCount = (((length + 8) >> 6) + 1) * 16;
    const words = Array.from({ length: wordCount }, () => 0);

    for (let index = 0; index < length; index += 1) {
      words[index >> 2] |= value.charCodeAt(index) << ((index % 4) * 8);
    }

    words[length >> 2] |= 0x80 << ((length % 4) * 8);
    words[wordCount - 2] = length << 3;
    words[wordCount - 1] = length >>> 29;

    return words;
  }

  function wordToHex(value: number) {
    let output = '';

    for (let count = 0; count <= 3; count += 1) {
      output += ((value >>> (count * 8)) & 255).toString(16).padStart(2, '0');
    }

    return output;
  }

  const utf8 = unescape(encodeURIComponent(input));
  const words = convertToWords(utf8);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < words.length; k += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;

    a = transform(f, a, b, c, d, words[k + 0], 7, 0xd76aa478);
    d = transform(f, d, a, b, c, words[k + 1], 12, 0xe8c7b756);
    c = transform(f, c, d, a, b, words[k + 2], 17, 0x242070db);
    b = transform(f, b, c, d, a, words[k + 3], 22, 0xc1bdceee);
    a = transform(f, a, b, c, d, words[k + 4], 7, 0xf57c0faf);
    d = transform(f, d, a, b, c, words[k + 5], 12, 0x4787c62a);
    c = transform(f, c, d, a, b, words[k + 6], 17, 0xa8304613);
    b = transform(f, b, c, d, a, words[k + 7], 22, 0xfd469501);
    a = transform(f, a, b, c, d, words[k + 8], 7, 0x698098d8);
    d = transform(f, d, a, b, c, words[k + 9], 12, 0x8b44f7af);
    c = transform(f, c, d, a, b, words[k + 10], 17, 0xffff5bb1);
    b = transform(f, b, c, d, a, words[k + 11], 22, 0x895cd7be);
    a = transform(f, a, b, c, d, words[k + 12], 7, 0x6b901122);
    d = transform(f, d, a, b, c, words[k + 13], 12, 0xfd987193);
    c = transform(f, c, d, a, b, words[k + 14], 17, 0xa679438e);
    b = transform(f, b, c, d, a, words[k + 15], 22, 0x49b40821);

    a = transform(g, a, b, c, d, words[k + 1], 5, 0xf61e2562);
    d = transform(g, d, a, b, c, words[k + 6], 9, 0xc040b340);
    c = transform(g, c, d, a, b, words[k + 11], 14, 0x265e5a51);
    b = transform(g, b, c, d, a, words[k + 0], 20, 0xe9b6c7aa);
    a = transform(g, a, b, c, d, words[k + 5], 5, 0xd62f105d);
    d = transform(g, d, a, b, c, words[k + 10], 9, 0x02441453);
    c = transform(g, c, d, a, b, words[k + 15], 14, 0xd8a1e681);
    b = transform(g, b, c, d, a, words[k + 4], 20, 0xe7d3fbc8);
    a = transform(g, a, b, c, d, words[k + 9], 5, 0x21e1cde6);
    d = transform(g, d, a, b, c, words[k + 14], 9, 0xc33707d6);
    c = transform(g, c, d, a, b, words[k + 3], 14, 0xf4d50d87);
    b = transform(g, b, c, d, a, words[k + 8], 20, 0x455a14ed);
    a = transform(g, a, b, c, d, words[k + 13], 5, 0xa9e3e905);
    d = transform(g, d, a, b, c, words[k + 2], 9, 0xfcefa3f8);
    c = transform(g, c, d, a, b, words[k + 7], 14, 0x676f02d9);
    b = transform(g, b, c, d, a, words[k + 12], 20, 0x8d2a4c8a);

    a = transform(h, a, b, c, d, words[k + 5], 4, 0xfffa3942);
    d = transform(h, d, a, b, c, words[k + 8], 11, 0x8771f681);
    c = transform(h, c, d, a, b, words[k + 11], 16, 0x6d9d6122);
    b = transform(h, b, c, d, a, words[k + 14], 23, 0xfde5380c);
    a = transform(h, a, b, c, d, words[k + 1], 4, 0xa4beea44);
    d = transform(h, d, a, b, c, words[k + 4], 11, 0x4bdecfa9);
    c = transform(h, c, d, a, b, words[k + 7], 16, 0xf6bb4b60);
    b = transform(h, b, c, d, a, words[k + 10], 23, 0xbebfbc70);
    a = transform(h, a, b, c, d, words[k + 13], 4, 0x289b7ec6);
    d = transform(h, d, a, b, c, words[k + 0], 11, 0xeaa127fa);
    c = transform(h, c, d, a, b, words[k + 3], 16, 0xd4ef3085);
    b = transform(h, b, c, d, a, words[k + 6], 23, 0x04881d05);
    a = transform(h, a, b, c, d, words[k + 9], 4, 0xd9d4d039);
    d = transform(h, d, a, b, c, words[k + 12], 11, 0xe6db99e5);
    c = transform(h, c, d, a, b, words[k + 15], 16, 0x1fa27cf8);
    b = transform(h, b, c, d, a, words[k + 2], 23, 0xc4ac5665);

    a = transform(i, a, b, c, d, words[k + 0], 6, 0xf4292244);
    d = transform(i, d, a, b, c, words[k + 7], 10, 0x432aff97);
    c = transform(i, c, d, a, b, words[k + 14], 15, 0xab9423a7);
    b = transform(i, b, c, d, a, words[k + 5], 21, 0xfc93a039);
    a = transform(i, a, b, c, d, words[k + 12], 6, 0x655b59c3);
    d = transform(i, d, a, b, c, words[k + 3], 10, 0x8f0ccc92);
    c = transform(i, c, d, a, b, words[k + 10], 15, 0xffeff47d);
    b = transform(i, b, c, d, a, words[k + 1], 21, 0x85845dd1);
    a = transform(i, a, b, c, d, words[k + 8], 6, 0x6fa87e4f);
    d = transform(i, d, a, b, c, words[k + 15], 10, 0xfe2ce6e0);
    c = transform(i, c, d, a, b, words[k + 6], 15, 0xa3014314);
    b = transform(i, b, c, d, a, words[k + 13], 21, 0x4e0811a1);
    a = transform(i, a, b, c, d, words[k + 4], 6, 0xf7537e82);
    d = transform(i, d, a, b, c, words[k + 11], 10, 0xbd3af235);
    c = transform(i, c, d, a, b, words[k + 2], 15, 0x2ad7d2bb);
    b = transform(i, b, c, d, a, words[k + 9], 21, 0xeb86d391);

    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  return `${wordToHex(a)}${wordToHex(b)}${wordToHex(c)}${wordToHex(d)}`.toLowerCase();
}

export function HashGeneratorTool() {
  const [input, setInput] = useState('QuickUtility Hub');
  const [algorithm, setAlgorithm] = useState<'MD5' | 'SHA-1' | 'SHA-256'>('SHA-256');
  const [output, setOutput] = useState('');

  const generate = async () => {
    if (algorithm === 'MD5') {
      setOutput(md5(input));
      return;
    }

    setOutput(await digestText(algorithm, input));
  };

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate MD5, SHA-1, or SHA-256 hashes from text."
      icon={Hash}
    >
      <div className="grid gap-5">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="hub-input min-h-40 resize-y"
        />

        <select
          value={algorithm}
          onChange={(event) =>
            setAlgorithm(event.target.value as 'MD5' | 'SHA-1' | 'SHA-256')
          }
          className="hub-input"
        >
          <option value="MD5">MD5</option>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
        </select>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={generate} className="hub-button">
            Generate hash
          </button>
          <CopyButton value={output} />
        </div>

        <div className="rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4">
          <code className="break-all text-sm font-bold text-[color:var(--qu-text)]">
            {output || 'Generated hash appears here.'}
          </code>
        </div>
      </div>
    </ToolShell>
  );
}

function decodeJwtSegment(segment: string) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const decoded = atob(padded);

  try {
    return decodeURIComponent(
      decoded
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  } catch {
    return decoded;
  }
}

export function JwtDecoderTool() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;

    try {
      const parts = token.trim().split('.');

      if (parts.length < 2) {
        throw new Error('JWT must include at least header and payload segments.');
      }

      setError('');

      return {
        header: JSON.stringify(JSON.parse(decodeJwtSegment(parts[0])), null, 2),
        payload: JSON.stringify(JSON.parse(decodeJwtSegment(parts[1])), null, 2),
        signature: parts[2] || '',
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to decode JWT.');
      return null;
    }
  }, [token]);

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode JWT header and payload locally. This does not verify the token signature."
      icon={KeyRound}
    >
      <textarea
        value={token}
        onChange={(event) => setToken(event.target.value)}
        className="hub-input min-h-36 resize-y font-mono"
        placeholder="Paste JWT here..."
        spellCheck={false}
      />

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-500">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-black">Header</h3>
            <CopyButton value={decoded?.header || ''} />
          </div>
          <pre className="min-h-64 overflow-auto rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4 text-sm hub-muted">
            {decoded?.header || 'Header appears here.'}
          </pre>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-black">Payload</h3>
            <CopyButton value={decoded?.payload || ''} />
          </div>
          <pre className="min-h-64 overflow-auto rounded-3xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4 text-sm hub-muted">
            {decoded?.payload || 'Payload appears here.'}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}