import { Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';

export function ImageExtractTool({ imagePreview, extractedColors, onImageUpload, onUseExtracted }: { imagePreview: string | null; extractedColors: string[]; onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void; onUseExtracted: () => void }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
          <Upload className="h-8 w-8 text-blue-500" />
          <span className="mt-3 text-sm font-black text-slate-950 dark:text-white">Upload image</span>
          <span className="mt-1 text-xs text-slate-500">Extract a five-color palette from sampled pixels.</span>
          <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
        </label>
        <div className="space-y-4">
          {imagePreview && <img src={imagePreview} alt="Uploaded source" className="h-56 w-full rounded-[1.75rem] object-cover" />}
          <div className="grid grid-cols-5 overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">{extractedColors.map((hex) => <div key={hex} className="h-28" style={{ background: hex }} />)}</div>
          <button type="button" onClick={onUseExtracted} disabled={extractedColors.length === 0} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Use extracted palette</button>
        </div>
      </div>
    </section>
  );
}
