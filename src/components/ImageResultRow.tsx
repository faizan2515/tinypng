import { ArrowDownToLine, LoaderCircle, X } from "lucide-react";
import { bytes, download, type Result } from "../compression";
import type { ImageItem } from "../types";

type ImageResultRowProps = {
  item: ImageItem;
  result?: Result;
  error?: string;
  remove: (id: string) => void;
};

export default function ImageResultRow({ item, result, error, remove }: ImageResultRowProps) {
  const saving = result
    ? Math.round((1 - result.blob.size / item.file.size) * 100)
    : 0;

  return (
    <div className="relative flex flex-wrap items-center gap-2 border-b border-stone-200 px-3 py-3.5 sm:flex-nowrap sm:gap-2.5 sm:p-3.5 md:gap-3.5 md:px-5 md:py-4">
      <img className="size-9 rounded-md border border-stone-200 bg-stone-100 object-cover sm:size-11" src={item.preview} alt="" />
      <div className="min-w-0 flex-1 basis-3/4 pr-3.5 sm:basis-0 sm:pr-0">
        <strong className="block truncate text-xs font-medium" title={item.file.name}>{item.file.name}</strong>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-stone-500">
          <span className="rounded-xs bg-stone-50 px-1 py-0.5 text-xs text-stone-500">
            {item.file.type.split("/")[1].toUpperCase()}
          </span>
          <span>{bytes(item.file.size)}</span>
          {result && (
            <span data-testid="image-dimensions" className="hidden md:inline">
              {result.width} × {result.height}
            </span>
          )}
        </div>
        {error && (
          <p className="my-1 text-xs text-red-600">{error}</p>
        )}
        {result?.unchanged && (
          <p className="mt-1 text-xs text-stone-500">
            Already optimized; original kept. Try resizing or
            WebP.
          </p>
        )}
      </div>
      <div className="ml-11 flex min-w-20 flex-1 items-center justify-start gap-2 text-xs sm:ml-0 sm:flex-none sm:flex-col sm:items-end sm:gap-1">
        {result ? (
          <>
            <span className={saving > 0 ? "font-semibold text-lime-600" : "text-xs text-stone-500"}>
              {saving > 0
                ? `−${saving}%`
                : saving < 0
                  ? `+${Math.abs(saving)}%`
                  : "No size change"}
            </span>
            <small className="text-xs text-stone-500">{bytes(result.blob.size)}</small>
          </>
        ) : error ? (
          <span className="my-1 text-xs text-red-600">Failed</span>
        ) : (
          <LoaderCircle className="animate-spin motion-reduce:animate-none" size={19} />
        )}
      </div>
      <button
        className="flex min-w-16 items-center justify-center gap-2 rounded-md border border-stone-200 bg-lime-50 p-1.5 text-xs font-semibold text-lime-700 hover:bg-lime-100 sm:min-w-20 sm:px-2.5 sm:py-2"
        aria-label={`Download ${item.file.name}`}
        disabled={!result}
        onClick={() =>
          result && download(result.blob, result.name)
        }
      >
        <ArrowDownToLine size={16} />
        <span>
          {result
            ? result.blob.type.split("/")[1].toUpperCase()
            : "Wait"}
        </span>
      </button>
      <button
        className="absolute top-5 right-2 p-1 text-stone-500 hover:text-red-600 sm:static"
        aria-label={`Remove ${item.file.name}`}
        onClick={() => remove(item.id)}
      >
        <X size={16} />
      </button>
    </div>
  );
}
