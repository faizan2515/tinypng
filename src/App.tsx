import { FileImage, X } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UploadDropzone from "./components/UploadDropzone";
import CompressionSettings from "./components/CompressionSettings";
import CompressionResults from "./components/CompressionResults";
import Benefits from "./components/Benefits";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import { useImageCompressor } from "./hooks/useImageCompressor";

export default function App() {
  const compressor = useImageCompressor();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 md:px-7 2xl:max-w-6xl">
        <Hero />
        <section
          className="rounded-xl border border-stone-200 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3"
          aria-label="Image compressor"
        >
          <UploadDropzone addFiles={compressor.addFiles} />
          <CompressionSettings
            settings={compressor.settings}
            updateSettings={compressor.updateSettings}
          />
        </section>
        {compressor.notice && (
          <div
            className="mt-3 flex justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
            role="alert"
          >
            {compressor.notice}
            <button
              aria-label="Dismiss notification"
              onClick={compressor.dismissNotice}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {compressor.items.length > 0 ? (
          <CompressionResults
            items={compressor.items}
            results={compressor.results}
            errors={compressor.errors}
            readyCount={compressor.readyCount}
            pending={compressor.pending}
            zipping={compressor.zipping}
            before={compressor.before}
            after={compressor.after}
            saved={compressor.saved}
            downloadAll={compressor.downloadAll}
            remove={compressor.remove}
          />
        ) : (
          <div className="flex items-center justify-center gap-1.5 pt-6 pb-2.5 text-xs text-stone-500 sm:gap-2 sm:text-xs">
            <FileImage size={15} />
            <span>
              Your lighter images will appear here. Ready when you are.
            </span>
          </div>
        )}
        <Benefits />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
