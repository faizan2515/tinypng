import { Leaf } from "lucide-react";
import Panda from "./Panda";

export default function Footer() {
  return (
    <footer className="mx-5 flex max-w-6xl items-center justify-between border-t border-stone-200 py-5 sm:px-4 sm:pt-6 sm:pb-7 md:mx-auto">
      <a className="flex items-center gap-2 font-extrabold tracking-tight text-xl" href="#">
        <div className="-mr-1 scale-75"><Panda small /></div>
        <span>
          tiny<span className="text-lime-600">png</span>.
        </span>
      </a>
      <span className="hidden items-center gap-1.5 text-xs text-stone-500 md:flex">A little less size. A little more possibility.</span>
      <span className="flex items-center gap-1.5 text-xs text-stone-500">
        Made for a lighter web <Leaf size={13} />
      </span>
    </footer>
  );
}
