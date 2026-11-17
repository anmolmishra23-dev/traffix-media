import Link from "next/link";
import { ChatBubble } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <ChatBubble className="size-16 text-maroon" />
      <h1 className="font-display mt-6 text-6xl font-black tracking-tight uppercase md:text-8xl">404</h1>
      <p className="mt-4 max-w-sm text-lg text-muted">This page wasn&apos;t seen — or known. Let&apos;s get you back.</p>
      <Link href="/" className="mt-8 rounded-full bg-maroon px-7 py-3.5 font-semibold text-cream hover:bg-maroon-deep">
        Go home
      </Link>
    </main>
  );
}
