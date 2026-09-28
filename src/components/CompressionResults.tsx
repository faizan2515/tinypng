import {
  ArrowDownToLine,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { bytes, type Result } from "../compression";
import type { ImageItem } from "../types";
import ImageResultRow from "./ImageResultRow";

type CompressionResultsProps = {
  items: ImageItem[];
  results: Record<string, Result>;
  errors: Record<string, string>;
  readyCount: number;
  pending: boolean;
  zipping: boolean;
  before: number;
  after: number;
  saved: number;
  downloadAll: () => Promise<void>;
  remove: (id?: string) => void;
};

export default function CompressionResults({
  items,
  results,
  errors,
  readyCount,
  pending,
  zipping,
  before,
  after,
  saved,
  downloadAll,
  remove,
}: CompressionResultsProps) {
  return (
    <section
      className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white"
      aria-label="Compressed images"
    >
      <div className="flex flex-col items-start justify-between gap-3.5 bg-lime-50 p-4 sm:flex-row sm:items-center sm:gap-0 md:p-6">
        <div>
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight md:text-lg">
            <span className="size-1.5 rounded-full bg-lime-600" />
            {pending
              ? "Making a little room…"
              : saved > 0
                ? `Looking good. ${saved}% lighter!`
                : "Your images are ready."}
          </div>
          <p
            className="mt-2 flex flex-wrap items-center gap-1 text-xs text-stone-500 sm:ml-3.5 sm:flex-nowrap md:gap-2"
            aria-live="polite"
          >
            {readyCount} of {items.length} images ready
            {readyCount > 0 && (
              <>
                {" "}
                <span>·</span> {bytes(before)} <ArrowRight size={12} />{" "}
                {bytes(after)} <span>·</span>{" "}
                {bytes(Math.max(0, before - after))} saved
              </>
            )}
          </p>
        </div>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-lime-600 p-2.5 text-xs font-semibold text-white enabled:hover:bg-lime-700 sm:w-auto md:px-4 md:py-3"
          disabled={pending || !readyCount || zipping}
          onClick={downloadAll}
        >
          {zipping || pending ? (
            <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" />
          ) : (
            <ArrowDownToLine size={17} />
          )}{" "}
          {zipping
            ? "Creating ZIP…"
            : readyCount === 1 && !pending
              ? "Download image"
              : "Download all"}
          {readyCount > 1 && !pending && (
            <span className="text-xs opacity-70">.zip</span>
          )}
        </button>
      </div>
      <div>
        {items.map((item) => (
          <ImageResultRow
            key={item.id}
            item={item}
            result={results[item.id]}
            error={errors[item.id]}
            remove={remove}
          />
        ))}
      </div>
      <div className="flex items-center justify-between bg-stone-50 p-2.5 text-xs text-stone-500 sm:px-5 sm:py-3">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} /> All the magic happens on your device.
        </span>
        <button className="flex items-center gap-1.5" onClick={() => remove()}>
          Clear all <X size={13} />
        </button>
      </div>
    </section>
  );
}
