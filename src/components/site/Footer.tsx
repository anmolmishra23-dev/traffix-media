import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { asset, instagramUrl, telUrl, whatsappUrl } from "@/lib/utils";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsappIcon } from "@/components/icons";

export function Footer({ settings }: { settings: SiteSettings }) {
  const ig = instagramUrl(settings.instagram);
  const wa = whatsappUrl(settings.whatsapp);
  const tel = telUrl(settings.phone);

  return (
    <footer className="bg-maroon-deep text-cream">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-8 md:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src={asset("/brand/logo-nav-light.png")} alt="Traffix Media" width={583} height={210} className="h-12 w-auto" />
            <p className="mt-6 max-w-sm text-cream/70">{settings.tagline ?? "Be Seen. Be Known."}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-cream/50 uppercase">Explore</h2>
            <ul className="mt-5 space-y-3">
              {[
                ["/work", "Work"],
                ["/#services", "Services"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-cream/85 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-cream/50 uppercase">Get in touch</h2>
            <ul className="mt-5 space-y-3 text-cream/85">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-white">
                    <WhatsappIcon className="size-4 shrink-0" /> WhatsApp us (fastest reply)
                  </a>
                </li>
              )}
              {settings.phone && tel && (
                <li>
                  <a href={tel} className="inline-flex items-center gap-3 hover:text-white">
                    <PhoneIcon className="size-4 shrink-0" /> {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-3 break-all hover:text-white">
                    <MailIcon className="size-4 shrink-0" /> {settings.email}
                  </a>
                </li>
              )}
              {ig && (
                <li>
                  <a href={ig} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-white">
                    <InstagramIcon className="size-4 shrink-0" /> @{settings.instagram?.replace(/^@/, "")}
                  </a>
                </li>
              )}
              {settings.location && <li className="text-cream/60">{settings.location}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <p className="font-display text-[15vw] leading-[0.8] font-black tracking-tighter text-cream/[0.07] uppercase select-none md:text-[11.5vw] lg:text-[150px]">
            Be seen. Be known.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-cream/10 pt-6 text-sm text-cream/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Traffix Media. All rights reserved.</p>
          <p>Creative marketing · Video production</p>
        </div>
      </div>
    </footer>
  );
}
