import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  FileImage,
  ImagePlus,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import JSZip from "jszip";
import {
  compress,
  bytes,
  download,
  type Settings,
  type Result,
} from "./compression";

type Item = { id: string; file: File; preview: string };
const defaults: Settings = { quality: 75, scale: 100, format: "original" };
function Panda({ small = false }: { small?: boolean }) {
  return (
    <div className={`panda ${small ? "small" : ""}`} aria-hidden="true">
      <i className="ear left" />
      <i className="ear right" />
      <div className="panda-face">
        <i className="eye left" />
        <i className="eye right" />
        <i className="nose" />
        <i className="mouth" />
        <i className="cheek left" />
        <i className="cheek right" />
      </div>
      {!small && (
        <>
          <div className="panda-body" />
          <i className="paw left" />
          <i className="paw right" />
          <div className="bamboo">🌿</div>
        </>
      )}
    </div>
  );
}
function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<Settings>(defaults);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const [zipping, setZipping] = useState(false);
  const input = useRef<HTMLInputElement>(null);
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
    const accepted: Item[] = [],
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
  return (
    <>
      <header>
        <a className="brand" href="#" aria-label="Tiny home">
          <Panda small />
          <span>
            tiny<span className="brand-green">png</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <nav>
          <a className="active" href="#compress">
            Image compressor
          </a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQs</a>
        </nav>
        <div className="header-note">
          <LockKeyhole size={14} /> Your images stay yours
        </div>
      </header>
      <main>
        <section className="hero" id="compress">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> SMALLER FILES. BIG POSSIBILITIES.
            </div>
            <h1>
              Less weight.
              <br />
              <span>Same wow.</span>
              <svg
                className="accent"
                width="47"
                height="47"
                viewBox="0 0 47 47"
                aria-hidden="true"
              >
                <path
                  d="M7 28L24 10M20 36L40 30M3 17L6 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </h1>
            <p>
              Make your images lighter, without losing the magic.
              <br className="desktop-break" /> Free, private image compression.
              Right in your browser.
            </p>
            <div className="hero-pills">
              <span>
                <ShieldCheck size={15} /> 100% private
              </span>
              <span>
                <Zap size={15} /> No uploads
              </span>
              <span>
                <Check size={15} /> No sign-up
              </span>
            </div>
          </div>
          <div className="panda-scene">
            <div className="scene-circle" />
            <span className="float-leaf leaf-one">✦</span>
            <span className="float-leaf leaf-two">✦</span>
            <Panda />
            <div className="panda-caption">
              A little lighter. A lot happier.
            </div>
          </div>
        </section>
        <section className="workspace" aria-label="Image compressor">
          <div
            className={`dropzone ${dragging ? "dragging" : ""}`}
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
              className="drop-button"
              onClick={() => input.current?.click()}
            >
              <div className="upload-art">
                <div className="back-picture" />
                <div className="front-picture">
                  <ImagePlus size={33} strokeWidth={1.5} />
                </div>
                <span>
                  <Plus size={15} />
                </span>
              </div>
              <h2>
                {dragging
                  ? "Drop them like they’re heavy."
                  : "Drop your images here"}
              </h2>
              <p>
                or{" "}
                <span className="browse">
                  browse files <ArrowRight size={14} />
                </span>{" "}
                from your device
              </p>
              <div className="file-types">
                <span>PNG</span>
                <span>JPG</span>
                <span>WEBP</span>
                <i />
                Up to 50 MB per image
              </div>
            </button>
            <div className="drop-privacy">
              <LockKeyhole size={12} /> Files never leave your device. That’s a
              promise.
            </div>
          </div>
          <div className="settings">
            <div className="settings-heading">
              <span>
                <SlidersHorizontal size={17} /> Make it your size
              </span>
              <button onClick={() => updateSettings(defaults)}>
                Reset defaults
              </button>
            </div>
            <div className="settings-grid">
              <div className="quality-control">
                <label htmlFor="quality">
                  Image quality <strong>{settings.quality}%</strong>
                </label>
                <input
                  id="quality"
                  type="range"
                  min="10"
                  max="100"
                  value={settings.quality}
                  style={
                    {
                      "--progress": `${((settings.quality - 10) / 90) * 100}%`,
                    } as React.CSSProperties
                  }
                  onChange={(event) =>
                    updateSettings({
                      ...settings,
                      quality: +event.target.value,
                    })
                  }
                />
                <div className="range-labels">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
                </div>
              </div>
              <div className="select-control">
                <label htmlFor="format">Output format</label>
                <div>
                  <select
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
                  <ChevronDown size={14} />
                </div>
              </div>
              <div className="select-control">
                <label htmlFor="scale">Image dimensions</label>
                <div>
                  <select
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
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
            <p className="settings-tip">
              <Sparkles size={13} /> A little tip: 75% quality is a great
              balance. PNG is lossless — resize it or try WebP for smaller
              files.
            </p>
          </div>
        </section>
        {notice && (
          <div className="notice" role="alert">
            {notice}
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {items.length > 0 ? (
          <section className="results" aria-label="Compressed images">
            <div className="results-heading">
              <div>
                <div className="results-title">
                  <span className="status-dot" />
                  {pending
                    ? "Making a little room…"
                    : saved > 0
                      ? `Looking good. ${saved}% lighter!`
                      : "Your images are ready."}
                </div>
                <p aria-live="polite">
                  {ready.length} of {items.length} images ready
                  {ready.length > 0 && (
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
                className="primary"
                disabled={pending || !ready.length || zipping}
                onClick={downloadAll}
              >
                {zipping || pending ? (
                  <LoaderCircle size={17} className="spin" />
                ) : (
                  <ArrowDownToLine size={17} />
                )}{" "}
                {zipping
                  ? "Creating ZIP…"
                  : ready.length === 1 && !pending
                    ? "Download image"
                    : "Download all"}
                {ready.length > 1 && !pending && <span>.zip</span>}
              </button>
            </div>
            <div className="image-list">
              {items.map((item) => {
                const result = results[item.id];
                const saving = result
                  ? Math.round((1 - result.blob.size / item.file.size) * 100)
                  : 0;
                return (
                  <div className="image-row" key={item.id}>
                    <img className="thumbnail" src={item.preview} alt="" />
                    <div className="image-name">
                      <strong title={item.file.name}>{item.file.name}</strong>
                      <div>
                        <span className="format-tag">
                          {item.file.type.split("/")[1].toUpperCase()}
                        </span>
                        <span>{bytes(item.file.size)}</span>
                        {result && (
                          <span className="dimensions">
                            {result.width} × {result.height}
                          </span>
                        )}
                      </div>
                      {errors[item.id] && (
                        <p className="error">{errors[item.id]}</p>
                      )}
                      {result?.unchanged && (
                        <p className="row-note">
                          Already optimized; original kept. Try resizing or
                          WebP.
                        </p>
                      )}
                    </div>
                    <div className="size-result">
                      {result ? (
                        <>
                          <span className={saving > 0 ? "saving" : "neutral"}>
                            {saving > 0
                              ? `−${saving}%`
                              : saving < 0
                                ? `+${Math.abs(saving)}%`
                                : "No size change"}
                          </span>
                          <small>{bytes(result.blob.size)}</small>
                        </>
                      ) : errors[item.id] ? (
                        <span className="error">Failed</span>
                      ) : (
                        <LoaderCircle className="spin" size={19} />
                      )}
                    </div>
                    <button
                      className="row-download"
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
                      className="remove-button"
                      aria-label={`Remove ${item.file.name}`}
                      onClick={() => remove(item.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="results-footer">
              <span>
                <ShieldCheck size={13} /> All the magic happens on your device.
              </span>
              <button onClick={() => remove()}>
                Clear all <X size={13} />
              </button>
            </div>
          </section>
        ) : (
          <div className="empty-note">
            <FileImage size={15} />
            <span>
              Your lighter images will appear here. Ready when you are.
            </span>
          </div>
        )}
        <section className="benefits" id="how-it-works">
          <article>
            <div className="benefit-icon">
              <ShieldCheck size={22} />
            </div>
            <h3>Your files. Only yours.</h3>
            <p>
              No servers, no storage, no peeking.
              <br />
              Your images stay on your device.
            </p>
          </article>
          <article>
            <div className="benefit-icon">
              <Zap size={22} />
            </div>
            <h3>Small files, in a flash.</h3>
            <p>
              Drop, fine-tune, and download.
              <br />
              Less waiting. More creating.
            </p>
          </article>
          <article>
            <div className="benefit-icon">
              <Leaf size={22} />
            </div>
            <h3>Lighter is a little greener.</h3>
            <p>
              Smaller images use less bandwidth.
              <br />
              Good for your site. Good for the planet.
            </p>
          </article>
        </section>
        <section className="faq" id="faq">
          <div>
            <span className="eyebrow">GOOD TO KNOW</span>
            <h2>A few tiny details.</h2>
            <p>Big questions, small answers.</p>
          </div>
          <div className="questions">
            <details>
              <summary>
                How does image compression work?
                <Plus size={17} />
              </summary>
              <p>
                Choose your images and we process them with your browser’s
                Canvas API. Adjust quality, dimensions, or format to see the
                actual file size. Quality is an encoding setting, not a
                guaranteed percentage reduction.
              </p>
            </details>
            <details>
              <summary>
                Will my images lose quality?
                <Plus size={17} />
              </summary>
              <p>
                JPEG and WebP use lossy compression: lower quality produces
                smaller files with less detail. PNG preserves pixel quality, so
                its quality slider has no effect. Resizing reduces detail in
                every format. We keep the original if a same-format, full-size
                export is larger.
              </p>
            </details>
            <details>
              <summary>
                Can I compress multiple images at once?
                <Plus size={17} />
              </summary>
              <p>
                Yes. Drop multiple PNG, JPEG, or WebP files, up to 50 MB each.
                Download each result individually, or download all successful
                results in one ZIP. Large batches depend on your device’s
                available memory.
              </p>
            </details>
            <details>
              <summary>
                What happens to transparency and animation?
                <Plus size={17} />
              </summary>
              <p>
                PNG and WebP keep transparency. JPEG uses a white background.
                Animated files are exported as a single still image, and exports
                may discard metadata. Your original files are never modified.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#">
          <Panda small />
          <span>
            tiny<span className="brand-green">png</span>.
          </span>
        </a>
        <span>A little less size. A little more possibility.</span>
        <span>
          Made for a lighter web <Leaf size={13} />
        </span>
      </footer>
    </>
  );
}
export default App;
