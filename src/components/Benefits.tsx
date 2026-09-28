import { Leaf, ShieldCheck, Zap } from "lucide-react";

export default function Benefits() {
  return (
    <section
      className="grid scroll-mt-6 grid-cols-1 gap-6 border-b border-stone-200 py-9 text-left sm:grid-cols-3 sm:gap-4 sm:pt-11 sm:pb-11 sm:text-center md:gap-9"
      id="how-it-works"
    >
      <article className="relative max-sm:pl-16">
        <div className="absolute top-1 left-0.5 mx-auto mb-3.5 grid size-11 place-items-center rounded-xl bg-lime-50 text-lime-600 sm:static">
          <ShieldCheck size={22} />
        </div>
        <h3 className="mb-1 text-xs font-semibold sm:mb-2">
          Your files. Only yours.
        </h3>
        <p className="text-xs leading-loose text-stone-500">
          No servers, no storage, no peeking.
          {" "}<br className="hidden sm:block" />
          Your images stay on your device.
        </p>
      </article>
      <article className="relative max-sm:pl-16">
        <div className="absolute top-1 left-0.5 mx-auto mb-3.5 grid size-11 place-items-center rounded-xl bg-lime-50 text-lime-600 sm:static">
          <Zap size={22} />
        </div>
        <h3 className="mb-1 text-xs font-semibold sm:mb-2">
          Small files, in a flash.
        </h3>
        <p className="text-xs leading-loose text-stone-500">
          Drop, fine-tune, and download.
          {" "}<br className="hidden sm:block" />
          Less waiting. More creating.
        </p>
      </article>
      <article className="relative max-sm:pl-16">
        <div className="absolute top-1 left-0.5 mx-auto mb-3.5 grid size-11 place-items-center rounded-xl bg-lime-50 text-lime-600 sm:static">
          <Leaf size={22} />
        </div>
        <h3 className="mb-1 text-xs font-semibold sm:mb-2">
          Lighter is a little greener.
        </h3>
        <p className="text-xs leading-loose text-stone-500">
          Smaller images use less bandwidth.
          {" "}<br className="hidden sm:block" />
          Good for your site. Good for the planet.
        </p>
      </article>
    </section>
  );
}
