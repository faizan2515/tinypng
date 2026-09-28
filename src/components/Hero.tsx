import { Check, ShieldCheck, Zap } from "lucide-react";
import Panda from "./Panda";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-between px-1 pt-8 pb-8 sm:pt-9 md:px-5 md:pt-12 md:pb-11 2xl:pt-14 2xl:pb-12" id="compress">
      <div className="max-sm:relative max-sm:z-2">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-stone-500">
          <span className="size-1.5 rounded-full bg-lime-500" /> SMALLER FILES. BIG POSSIBILITIES.
        </div>
        <h1 className="relative my-5 w-max text-5xl leading-none font-bold tracking-tight md:text-7xl">
          Less weight.
          <br />
          <span className="text-lime-600">Same wow.</span>
          <svg
            className="absolute top-10 -right-11 hidden scale-75 text-lime-300 sm:block md:top-14 md:-right-16 md:scale-100"
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
        <p className="max-w-64 text-xs leading-loose text-stone-500 sm:max-w-none md:text-sm">
          Make your images lighter, without losing the magic.
          <br className="hidden sm:block" /> Free, private image compression.
          Right in your browser.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5 text-xs font-medium text-stone-500 sm:gap-3 md:gap-5">
          <span className="flex items-center gap-1">
            <ShieldCheck size={15} className="text-lime-600 max-sm:w-3" /> 100% private
          </span>
          <span className="flex items-center gap-1">
            <Zap size={15} className="text-lime-600 max-sm:w-3" /> No uploads
          </span>
          <span className="flex items-center gap-1">
            <Check size={15} className="text-lime-600 max-sm:w-3" /> No sign-up
          </span>
        </div>
      </div>
      <div className="absolute -top-1 -right-2 hidden h-64 w-60 origin-right scale-50 items-center justify-center sm:relative sm:flex sm:top-auto sm:right-auto sm:-mr-5 sm:w-48 sm:origin-center sm:scale-75 md:mr-6 md:w-72 md:scale-100">
        <div className="absolute size-60 rounded-full border-8 border-stone-200 bg-radial from-lime-50 to-lime-100" />
        <span className="absolute top-6 right-3 text-3xl text-lime-500">✦</span>
        <span className="absolute bottom-16 left-0 text-xl text-lime-500">✦</span>
        <Panda />
        <div className="absolute bottom-0 hidden -rotate-6 text-xs tracking-wide text-stone-500 italic sm:block">
          A little lighter. A lot happier.
        </div>
      </div>
    </section>
  );
}
