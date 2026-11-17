import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-maroon px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
