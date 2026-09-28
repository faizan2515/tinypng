import { useRef, useState } from "react";
import { ArrowRight, ImagePlus, LockKeyhole, Plus } from "lucide-react";

type UploadDropzoneProps = { addFiles: (files: FileList | File[]) => void };

export default function UploadDropzone({ addFiles }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      data-testid="upload-dropzone"
      className={`overflow-hidden rounded-lg border-2 border-dashed transition-colors duration-200 motion-reduce:transition-none ${dragging ? "border-lime-700 bg-lime-100" : "border-lime-300 bg-lime-50"}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        addFiles(event.dataTransfer.files);
      }}
    >
      <input
        className="hidden"
        ref={input}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        aria-label="Choose images"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        className="flex w-full flex-col items-center px-3.5 pt-7 pb-5 hover:bg-lime-100 2xl:pt-8 2xl:pb-7"
        onClick={() => input.current?.click()}
      >
        <div className="relative mb-4 h-16 w-20">
          <div className="absolute top-0.5 left-1.5 h-14 w-12 -rotate-12 rounded-lg border border-stone-200 bg-lime-100" />
          <div className="absolute top-2 left-5 grid h-14 w-12 rotate-6 place-items-center rounded-lg border border-stone-200 bg-white text-lime-600 shadow-sm">
            <ImagePlus size={33} strokeWidth={1.5} />
          </div>
          <span className="absolute -right-px bottom-0 rounded-full border-2 border-lime-50 bg-lime-600 p-0.5 text-white">
            <Plus size={15} />
          </span>
        </div>
        <h2 className="mb-2 text-xl font-semibold tracking-tight">
          {dragging
            ? "Drop them like they’re heavy."
            : "Drop your images here"}
        </h2>
        <p className="text-xs text-stone-500">
          or{" "}
          <span className="inline-flex items-center gap-1 border-b border-stone-200 font-semibold text-lime-700">
            browse files <ArrowRight size={14} />
          </span>{" "}
          from your device
        </p>
        <div className="mt-5 flex items-center gap-1.5 text-xs text-stone-500">
          <span className="rounded-sm border border-stone-200 bg-white/60 px-1.5 py-0.5 text-xs font-semibold text-stone-500">PNG</span>
          <span className="rounded-sm border border-stone-200 bg-white/60 px-1.5 py-0.5 text-xs font-semibold text-stone-500">JPG</span>
          <span className="rounded-sm border border-stone-200 bg-white/60 px-1.5 py-0.5 text-xs font-semibold text-stone-500">WEBP</span>
          <i className="mx-1.5 h-3 w-px bg-stone-50" />
          Up to 50 MB per image
        </div>
      </button>
      <div className="flex items-center justify-center gap-1.5 bg-lime-100/60 p-2.5 text-xs text-stone-500">
        <LockKeyhole size={12} /> Files never leave your device. That’s a
        promise.
      </div>
    </div>
  );
}
