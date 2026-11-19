"use client";

import { useEffect, useState } from "react";
import { WhatsappIcon } from "@/components/icons";

const DISMISSED = "traffix-wa-bubble-closed";

/**
 * Always-visible WhatsApp button with a pulsing ring. A few seconds after the page opens a small
 * "chat with us" bubble pops up next to it; closing the bubble (×) hides only the bubble for this visit —
 * the button itself always stays.
 */
export function WhatsAppFab({ href }: { href: string }) {
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    let closed = false;
    try {
      closed = sessionStorage.getItem(DISMISSED) === "1";
    } catch {}
    if (closed) return;
    const t = setTimeout(() => setBubble(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setBubble(false);
    try {
      sessionStorage.setItem(DISMISSED, "1");
    } catch {}
  };

  const link = `${href}?text=${encodeURIComponent("Hi Traffix Media! I'd like to talk about a project.")}`;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:flex-row sm:gap-3 md:right-6 md:bottom-6">
      {bubble && (
        <div role="status" className="wa-pop relative max-w-[13.5rem] rounded-2xl rounded-br-sm sm:mb-2 sm:max-w-[15rem] bg-white py-3 pr-9 pl-4 text-sm text-ink shadow-xl shadow-ink/15">
          <p className="font-semibold">Hi there! 👋</p>
          <p className="mt-0.5 text-muted">Got a brand to grow? Chat with us on WhatsApp.</p>
          <button
            type="button"
            onClick={close}
            aria-label="Close message"
            className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-cream-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      )}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Traffix Media on WhatsApp"
        className="group relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-[#25d366]/40 transition hover:scale-105 md:size-16"
      >
        <span aria-hidden="true" className="wa-pulse absolute inset-0 rounded-full bg-[#25d366]" />
        <WhatsappIcon className="relative size-7 md:size-8" />
      </a>
    </div>
  );
}
