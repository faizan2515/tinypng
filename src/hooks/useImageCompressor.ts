import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { compress, download, type Settings, type Result } from "../compression";
import type { ImageItem } from "../types";

export const defaultSettings: Settings = {
  quality: 75,
  scale: 100,
  format: "original",
};

export function useImageCompressor() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [zipping, setZipping] = useState(false);

  const urls = useRef(new Set<string>());
  const generation = useRef(0);

  useEffect(
    () => () => {
      urls.current.forEach(URL.revokeObjectURL);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const version = generation.current;
    const timer = setTimeout(async () => {
      for (const item of items) {
        if (cancelled) break;
        try {
          const result = await compress(item.file, settings);
          if (!cancelled && version === generation.current)
            setResults((previous) => ({ ...previous, [item.id]: result }));
        } catch (error) {
          if (!cancelled && version === generation.current)
            setErrors((previous) => ({
              ...previous,
              [item.id]:
                error instanceof Error
                  ? error.message
                  : "Unable to process image.",
            }));
        }
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [items, settings]);

  function updateSettings(next: Settings) {
    generation.current++;
    setResults({});
    setErrors({});
    setSettings({ ...next });
  }

  function addFiles(files: FileList | File[]) {
    const accepted: ImageItem[] = [],
      rejected: string[] = [];
    Array.from(files).forEach((file) => {
      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
        rejected.push(`${file.name}: use PNG, JPEG, or WebP.`);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        rejected.push(`${file.name}: exceeds 50 MB.`);
        return;
      }
      const preview = URL.createObjectURL(file);
      urls.current.add(preview);
      accepted.push({ id: crypto.randomUUID(), file, preview });
    });
    setNotice(rejected.join(" "));
    setItems((previous) => [...previous, ...accepted]);
  }

  function remove(id?: string) {
    generation.current++;
    items
      .filter((item) => !id || item.id === id)
      .forEach((item) => {
        URL.revokeObjectURL(item.preview);
        urls.current.delete(item.preview);
      });
    setItems((previous) =>
      id ? previous.filter((item) => item.id !== id) : [],
    );
    if (id) {
      setResults((previous) =>
        Object.fromEntries(
          Object.entries(previous).filter(([key]) => key !== id),
        ),
      );
      setErrors((previous) =>
        Object.fromEntries(
          Object.entries(previous).filter(([key]) => key !== id),
        ),
      );
    }
    if (!id) {
      setResults({});
      setErrors({});
      setNotice("");
    }
  }

  const ready = items.filter((item) => results[item.id]);
  const pending = items.some((item) => !results[item.id] && !errors[item.id]);
  const before = ready.reduce((sum, item) => sum + item.file.size, 0);
  const after = ready.reduce(
    (sum, item) => sum + results[item.id].blob.size,
    0,
  );
  const saved = before ? Math.round((1 - after / before) * 100) : 0;

  async function downloadAll() {
    if (!ready.length || pending) return;
    if (ready.length === 1) {
      const result = results[ready[0].id];
      download(result.blob, result.name);
      return;
    }
    setZipping(true);
    const version = generation.current;
    try {
      const zip = new JSZip(),
        names = new Set<string>();
      ready.forEach((item) => {
        const result = results[item.id];
        let name = result.name,
          index = 2;
        const dot = result.name.lastIndexOf(".");
        const stem = dot > 0 ? result.name.slice(0, dot) : result.name;
        const extension = dot > 0 ? result.name.slice(dot) : "";
        while (names.has(name.toLowerCase()))
          name = `${stem}-${index++}${extension}`;
        names.add(name.toLowerCase());
        zip.file(name, result.blob);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      if (version === generation.current) download(blob, "tiny-images.zip");
    } catch {
      setNotice(
        "Could not create the ZIP. You can still download images individually.",
      );
    } finally {
      setZipping(false);
    }
  }

  return {
    items,
    settings,
    results,
    errors,
    notice,
    zipping,
    readyCount: ready.length,
    pending,
    before,
    after,
    saved,
    addFiles,
    updateSettings,
    remove,
    downloadAll,
    dismissNotice: () => setNotice(""),
  };
}
