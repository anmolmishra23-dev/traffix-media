import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { cn, initials, mediaUrl } from "@/lib/utils";
import { ArrowUpRight, HeartBubble, PlayIcon } from "@/components/icons";
import { AutoVideo } from "./AutoVideo";

const tones = [
  "bg-maroon text-cream",
  "bg-ink text-cream",
  "bg-cream-2 text-maroon",
  "bg-maroon-2 text-cream",
  "bg-sand text-ink",
];

export function ProjectCard({
  project,
  index = 0,
  size = "md",
}: {
  project: Project;
  index?: number;
  size?: "md" | "lg";
}) {
  const tone = tones[index % tones.length];
  const video = project.videos?.[0];
  const hasImage = Boolean(project.cover_image_url || video);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-maroon"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          size === "lg" ? "aspect-[4/5] md:aspect-[5/6]" : "aspect-[4/5]",
          !hasImage && tone,
        )}
      >
        {video ? (
          <>
            <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
              <AutoVideo src={video} poster={project.cover_image_url} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/0" />
          </>
        ) : hasImage ? (
          <>
            <Image
              src={mediaUrl(project.cover_image_url!)}
              alt={`${project.title} — ${project.category?.name ?? "project"} by Traffix Media`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <HeartBubble className="size-9 opacity-80 transition duration-500 group-hover:-translate-y-1 group-hover:rotate-[-8deg]" />
            <span
              aria-hidden="true"
              className="font-display pointer-events-none absolute -right-3 -bottom-8 text-[9rem] leading-none font-black tracking-tighter opacity-[0.12] transition duration-700 group-hover:scale-110"
            >
              {initials(project.title)}
            </span>
          </div>
        )}

        {(project.video_url || project.videos?.length > 0) && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-maroon">
            <PlayIcon className="size-3" /> Video
          </span>
        )}

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6",
            hasImage && "text-cream",
          )}
        >
          <div>
            {project.category && (
              <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-70">{project.category.name}</p>
            )}
            <h3 className="font-display mt-1.5 text-2xl leading-tight font-extrabold tracking-tight text-balance">
              {project.title}
            </h3>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-current/30 transition duration-300 group-hover:rotate-45 group-hover:bg-current/10">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
