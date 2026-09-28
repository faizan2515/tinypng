import { LockKeyhole } from "lucide-react";
import Panda from "./Panda";
import { useState } from "react";

export default function Header() {
  const [active, setActive] = useState<"compress" | "how-it-works" | "faq">(
    "compress",
  );

  return (
    <header className="mx-auto sticky top-0 z-10 bg-stone-50 flex h-16 max-w-7xl items-center justify-between border-b border-stone-200 px-5 md:h-20 md:px-8">
      <a
        className="flex items-center gap-2 font-extrabold tracking-tight text-2xl"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        aria-label="Tiny home"
      >
        <Panda small />
        <span>
          tiny<span className="text-lime-600">png</span>
          <span className="text-lime-600">.</span>
        </span>
      </a>
      <nav className="flex h-full items-center gap-4 text-xs font-medium md:gap-8">
        <a
          className={`hidden h-full items-center border-b-2 sm:flex ${active === "compress" ? "border-lime-600 text-lime-700" : "border-transparent hover:text-lime-700"}`}
          href="#compress"
          onClick={(e) => {
            setActive("compress");
            e.preventDefault();
            document
              .getElementById(e.currentTarget.href.split("#")[1])
              ?.scrollIntoView();
          }}
        >
          Image compressor
        </a>
        <a
          className={`flex h-full items-center border-b-2 ${active === "how-it-works" ? "border-lime-600 text-lime-700" : "border-transparent hover:text-lime-700"}`}
          href="#how-it-works"
          onClick={(e) => {
            setActive("how-it-works");
            e.preventDefault();
            document
              .getElementById(e.currentTarget.href.split("#")[1])
              ?.scrollIntoView();
          }}
        >
          How it works
        </a>
        <a
          className={`flex h-full items-center border-b-2 ${active === "faq" ? "border-lime-600 text-lime-700" : "border-transparent hover:text-lime-700"}`}
          href="#faq"
          onClick={(e) => {
            setActive("faq");
            e.preventDefault();
            document
              .getElementById(e.currentTarget.href.split("#")[1])
              ?.scrollIntoView();
          }}
        >
          FAQs
        </a>
      </nav>
      <div className="hidden items-center gap-1.5 text-xs text-stone-500 md:flex">
        <LockKeyhole size={14} /> Your images stay yours
      </div>
    </header>
  );
}
