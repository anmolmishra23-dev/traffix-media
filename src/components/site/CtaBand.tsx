import Link from "next/link";
import { ArrowUpRight, ChatBubble, HeartBubble } from "@/components/icons";

export function CtaBand() {
  return (
    <section className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-maroon px-6 py-16 text-cream md:px-16 md:py-24">
        <HeartBubble className="animate-float absolute top-10 right-[8%] hidden size-20 text-maroon-2 md:block [--r:8deg]" />
        <ChatBubble className="animate-float absolute bottom-10 right-[22%] hidden size-14 text-maroon-2 [animation-delay:1.5s] md:block [--r:-6deg]" />
        <p className="text-sm font-semibold tracking-[0.2em] text-cream/60 uppercase">Got a brand to grow?</p>
        <h2 className="font-display mt-4 max-w-3xl text-5xl leading-[0.95] font-black tracking-tight uppercase md:text-7xl">
          Ready to be seen?
        </h2>
        <p className="mt-6 max-w-xl text-lg text-cream/75">
          Tell us about your brand and what you want to achieve. We&apos;ll get back to you within a day.
        </p>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 font-semibold text-maroon transition hover:bg-white"
        >
          Start a project
          <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
        </Link>
      </div>
    </section>
  );
}
