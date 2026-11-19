import type { Metadata } from "next";
import { ArrowUpRight, InstagramIcon, MailIcon, PhoneIcon, WhatsappIcon } from "@/components/icons";
import { AutoVideo } from "@/components/site/AutoVideo";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/site/Reveal";
import { getServices, getSettings } from "@/lib/data";
import { cn, instagramUrl, posterFor, telUrl, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Traffix Media. Tell us about your brand — video production, brand films, photo shoots, campaigns, social media or event coverage.",
  alternates: { canonical: "/contact" },
};

const steps = [
  { title: "Send your brief", body: "Tell us about your brand and what you want to make — a few lines is enough." },
  { title: "We get in touch", body: "Our team reaches out within one working day to understand the brief properly." },
  { title: "Lights, camera, plan", body: "We come back with the creative direction, production plan and what it will take." },
];

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const reel = settings.showreel_videos?.[1] ?? settings.showreel_videos?.[0];

  const channels = [
    settings.whatsapp && {
      icon: WhatsappIcon,
      label: "WhatsApp",
      value: "Chat with us now",
      href: whatsappUrl(settings.whatsapp)!,
      external: true,
      primary: true,
    },
    settings.phone && { icon: PhoneIcon, label: "Call", value: settings.phone, href: telUrl(settings.phone)! },
    settings.email && { icon: MailIcon, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && {
      icon: InstagramIcon,
      label: "Instagram",
      value: `@${settings.instagram.replace(/^@/, "")}`,
      href: instagramUrl(settings.instagram)!,
      external: true,
    },
  ].filter(Boolean) as { icon: typeof MailIcon; label: string; value: string; href: string; external?: boolean; primary?: boolean }[];

  return (
    <>
      <section className="px-3 pt-3 pb-20 md:px-5 md:pb-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 overflow-hidden rounded-[2.5rem] bg-ink lg:grid-cols-[1fr_1.15fr]">
          {/* ---------- Left: dark panel with reel ---------- */}
          <div className="relative flex flex-col justify-between overflow-hidden px-6 pt-14 pb-10 text-cream md:px-12 md:pt-20">
            {reel && (
              <div aria-hidden="true" className="absolute inset-0 opacity-30">
                <AutoVideo src={reel} poster={posterFor(reel)} />
              </div>
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/85 to-ink" />

            <Reveal className="relative">
              <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-cream/70 uppercase">
                <span className="size-2 animate-pulse rounded-full bg-[#ff3b3b]" /> Now booking
              </p>
              <h1 className="font-display mt-5 text-[clamp(3rem,6.5vw,5.8rem)] leading-[0.88] font-black tracking-[-0.03em] uppercase">
                Let&apos;s get
                <br />
                you <span className="text-[#f0b9bf]">seen.</span>
              </h1>
              <p className="mt-6 max-w-sm text-lg text-cream/75">
                Got a brand, a launch or an idea? Send us the brief — or skip the form and talk to us directly.
              </p>
            </Reveal>

            <Reveal delay={120} className="relative mt-12">
              <ul className="space-y-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={cn(
                        "group flex items-center gap-4 rounded-2xl border p-4 transition",
                        c.primary
                          ? "border-transparent bg-cream text-ink hover:bg-white"
                          : "border-cream/15 bg-cream/[0.04] backdrop-blur hover:border-cream/40 hover:bg-cream/10",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-full",
                          c.primary ? "bg-[#25d366] text-white" : "bg-cream/10 text-cream",
                        )}
                      >
                        <c.icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block font-mono text-[11px] tracking-[0.16em] uppercase", c.primary ? "text-muted" : "text-cream/55")}>
                          {c.label}
                        </span>
                        <span className="block text-base font-semibold [overflow-wrap:anywhere] sm:text-lg">{c.value}</span>
                      </span>
                      <ArrowUpRight className={cn("size-5 shrink-0 transition group-hover:rotate-45", c.primary ? "text-maroon" : "text-cream/60")} />
                    </a>
                  </li>
                ))}
              </ul>
              {settings.location && <p className="mt-6 text-cream/60">{settings.location}</p>}
            </Reveal>
          </div>

          {/* ---------- Right: the brief ---------- */}
          <div className="bg-cream-2 p-3 md:p-6 lg:p-8">
            <Reveal delay={180}>
              <h2 className="sr-only">Send us your brief</h2>
              <ContactForm services={services.map((s) => s.title)} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- What happens next ---------- */}
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">What happens next</p>
            <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-5xl">From brief to shoot</h2>
          </Reveal>
          <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 100}
                className="group relative overflow-hidden rounded-3xl border border-line bg-white/40 p-8 transition hover:border-maroon hover:bg-maroon hover:text-cream"
              >
                <span className="font-display absolute -top-4 -right-1 text-[7rem] leading-none font-black text-maroon/10 transition group-hover:text-cream/10">
                  {i + 1}
                </span>
                <p className="font-mono text-xs tracking-[0.18em] text-maroon uppercase transition group-hover:text-[#f0b9bf]">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display relative mt-6 text-2xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="relative mt-3 leading-relaxed text-muted transition group-hover:text-cream/80">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
