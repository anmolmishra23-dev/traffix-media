import type { Metadata } from "next";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsappIcon } from "@/components/icons";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/site/Reveal";
import { getServices, getSettings } from "@/lib/data";
import { instagramUrl, telUrl, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Traffix Media. Tell us about your brand — video production, brand films, campaigns, social media or event coverage.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const channels = [
    settings.email && { icon: MailIcon, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { icon: PhoneIcon, label: "Call", value: settings.phone, href: telUrl(settings.phone) },
    settings.whatsapp && { icon: WhatsappIcon, label: "WhatsApp", value: "Chat with us", href: whatsappUrl(settings.whatsapp), external: true },
    settings.instagram && {
      icon: InstagramIcon,
      label: "Instagram",
      value: `@${settings.instagram.replace(/^@/, "")}`,
      href: instagramUrl(settings.instagram),
      external: true,
    },
  ].filter(Boolean) as { icon: typeof MailIcon; label: string; value: string; href: string; external?: boolean }[];

  return (
    <section className="px-5 pt-10 pb-24 md:px-8 md:pt-16 md:pb-32">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-16 lg:grid-cols-[1fr_1.35fr]">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">Contact</p>
          <h1 className="font-display mt-4 text-[clamp(3rem,7vw,6rem)] leading-[0.88] font-black tracking-[-0.03em] uppercase">
            Let&apos;s get you <span className="text-maroon">seen.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Fill in the form or reach us directly — we usually reply within one working day.
          </p>

          <ul className="mt-12 space-y-3">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-white/40 p-4 transition hover:border-maroon hover:bg-white"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-maroon text-cream">
                    <c.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted">{c.label}</span>
                    <span className="block font-semibold break-all group-hover:text-maroon">{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {settings.location && <p className="mt-6 text-muted">{settings.location}</p>}
        </Reveal>

        <Reveal delay={120} className="rounded-[2rem] border border-line bg-cream-2/50 p-6 md:p-10">
          <h2 className="font-display mb-8 text-2xl font-extrabold tracking-tight uppercase">Tell us about your brand</h2>
          <ContactForm services={services.map((s) => s.title)} />
        </Reveal>
      </div>
    </section>
  );
}
