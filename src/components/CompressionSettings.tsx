import { ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Settings } from "../compression";
import { defaultSettings } from "../hooks/useImageCompressor";

type CompressionSettingsProps = {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
};

export default function CompressionSettings({
  settings,
  updateSettings,
}: CompressionSettingsProps) {
  return (
    <div className="px-2 pt-5 pb-1.5 md:px-4 md:pt-6">
      <div className="mb-5 flex items-center justify-between sm:mb-6">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <SlidersHorizontal className="text-stone-500" size={17} /> Make it
          your size
        </span>
        <button
          className="p-0.5 text-xs text-stone-500 hover:text-lime-700"
          onClick={() => updateSettings(defaultSettings)}
        >
          Reset defaults
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-8">
        <div className="max-sm:col-span-full">
          <label
            className="mb-2.5 flex text-xs text-stone-500"
            htmlFor="quality"
          >
            Image quality{" "}
            <strong className="ml-auto rounded-sm bg-lime-50 px-1.5 py-0.5 text-xs font-semibold text-lime-700">
              {settings.quality}%
            </strong>
          </label>
          <input
            className="my-1.5 h-4 w-full cursor-pointer accent-lime-600"
            id="quality"
            type="range"
            min="10"
            max="100"
            value={settings.quality}
            onChange={(event) =>
              updateSettings({
                ...settings,
                quality: +event.target.value,
              })
            }
          />
          <div className="mt-1 flex justify-between text-xs text-stone-500">
            <span>Smaller file</span>
            <span>Higher quality</span>
          </div>
        </div>
        <div>
          <label
            className="mb-2.5 flex text-xs text-stone-500"
            htmlFor="format"
          >
            Output format
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-md border border-stone-200 bg-white py-2.5 pr-7 pl-3 text-xs text-stone-700"
              id="format"
              value={settings.format}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  format: event.target.value as Settings["format"],
                })
              }
            >
              <option value="original">Keep original</option>
              <option value="image/webp">WebP</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-3 right-3 text-stone-500"
              size={14}
            />
          </div>
        </div>
        <div>
          <label
            className="mb-2.5 flex text-xs text-stone-500"
            htmlFor="scale"
          >
            Image dimensions
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-md border border-stone-200 bg-white py-2.5 pr-7 pl-3 text-xs text-stone-700"
              id="scale"
              value={settings.scale}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  scale: +event.target.value,
                })
              }
            >
              <option value="100">Original size (100%)</option>
              <option value="75">Resize to 75%</option>
              <option value="50">Resize to 50%</option>
              <option value="25">Resize to 25%</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-3 right-3 text-stone-500"
              size={14}
            />
          </div>
        </div>
      </div>
      <p className="mt-5 flex items-start gap-1.5 border-t border-stone-200 pt-3 text-xs leading-relaxed text-stone-500 sm:items-center">
        <Sparkles
          className="shrink-0 text-lime-500 max-sm:mt-0.5"
          size={13}
        />{" "}
        A little tip: 75% quality is a great balance. PNG is lossless — resize
        it or try WebP for smaller files.
      </p>
    </div>
  );
}
