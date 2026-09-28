import { Plus } from "lucide-react";

export default function Faq() {
  return (
    <section className="grid grid-cols-1 gap-4 py-9 sm:grid-cols-2 sm:gap-6 sm:pt-12 sm:pb-14 md:gap-10" id="faq">
      <div>
        <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-stone-500">GOOD TO KNOW</span>
        <h2 className="mt-3 mb-2 text-xl font-semibold tracking-tight sm:text-2xl">A few tiny details.</h2>
        <p className="text-xs text-stone-500">Big questions, small answers.</p>
      </div>
      <div>
        <details className="group border-b border-stone-200">
          <summary className="flex list-none items-center justify-between py-3.5 text-xs text-stone-500 [&::-webkit-details-marker]:hidden">
            How does image compression work?
            <Plus className="shrink-0 text-stone-500 group-open:rotate-45" size={17} />
          </summary>
          <p className="mb-3.5 text-xs leading-loose text-stone-500">
            Choose your images and we process them with your browser’s
            Canvas API. Adjust quality, dimensions, or format to see the
            actual file size. Quality is an encoding setting, not a
            guaranteed percentage reduction.
          </p>
        </details>
        <details className="group border-b border-stone-200">
          <summary className="flex list-none items-center justify-between py-3.5 text-xs text-stone-500 [&::-webkit-details-marker]:hidden">
            Will my images lose quality?
            <Plus className="shrink-0 text-stone-500 group-open:rotate-45" size={17} />
          </summary>
          <p className="mb-3.5 text-xs leading-loose text-stone-500">
            JPEG and WebP use lossy compression: lower quality produces
            smaller files with less detail. PNG preserves pixel quality, so
            its quality slider has no effect. Resizing reduces detail in
            every format. We keep the original if a same-format, full-size
            export is larger.
          </p>
        </details>
        <details className="group border-b border-stone-200">
          <summary className="flex list-none items-center justify-between py-3.5 text-xs text-stone-500 [&::-webkit-details-marker]:hidden">
            Can I compress multiple images at once?
            <Plus className="shrink-0 text-stone-500 group-open:rotate-45" size={17} />
          </summary>
          <p className="mb-3.5 text-xs leading-loose text-stone-500">
            Yes. Drop multiple PNG, JPEG, or WebP files, up to 50 MB each.
            Download each result individually, or download all successful
            results in one ZIP. Large batches depend on your device’s
            available memory.
          </p>
        </details>
        <details className="group border-b border-stone-200">
          <summary className="flex list-none items-center justify-between py-3.5 text-xs text-stone-500 [&::-webkit-details-marker]:hidden">
            What happens to transparency and animation?
            <Plus className="shrink-0 text-stone-500 group-open:rotate-45" size={17} />
          </summary>
          <p className="mb-3.5 text-xs leading-loose text-stone-500">
            PNG and WebP keep transparency. JPEG uses a white background.
            Animated files are exported as a single still image, and exports
            may discard metadata. Your original files are never modified.
          </p>
        </details>
      </div>
    </section>
  );
}
