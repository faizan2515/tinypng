export type Settings = {
  quality: number;
  scale: number;
  format: "original" | "image/png" | "image/jpeg" | "image/webp";
};
export type Result = {
  blob: Blob;
  name: string;
  width: number;
  height: number;
  unchanged: boolean;
};
export function bytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
}
export async function compress(
  file: File,
  settings: Settings,
): Promise<Result> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This image could not be decoded. Try another file.");
  });
  const canvas = document.createElement("canvas");
  try {
    const width = Math.max(
        1,
        Math.round((bitmap.width * settings.scale) / 100),
      ),
      height = Math.max(1, Math.round((bitmap.height * settings.scale) / 100));
    if (width * height > 40_000_000 || width > 16384 || height > 16384)
      throw new Error(
        "Image dimensions are too large. Choose a smaller dimension setting.",
      );
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable in this browser.");
    const mime = settings.format === "original" ? file.type : settings.format;
    if (mime === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    const encoded = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(
                new Error("Could not encode image. Try smaller dimensions."),
              ),
        mime,
        settings.quality / 100,
      ),
    );
    if (encoded.type !== mime)
      throw new Error(
        "This browser does not support the selected output format.",
      );
    const unchanged =
      mime === file.type && settings.scale === 100 && encoded.size >= file.size;
    const blob = unchanged ? file : encoded;
    const extension =
      blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1];
    const name = unchanged
      ? file.name
      : `${file.name.replace(/\.[^.]+$/, "")}-tiny.${extension}`;
    return { blob, name, width, height, unchanged };
  } finally {
    bitmap.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
