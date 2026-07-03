import Image from "next/image";
import type { Project } from "@/lib/contentful";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.externalUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card border border-edge rounded-2xl overflow-hidden text-inherit no-underline transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-amber"
    >
      <div
        className="relative aspect-[16/10]"
        style={{
          background:
            "radial-gradient(120% 120% at 20% 10%, #2a3145 0%, #171b26 60%)",
        }}
      >
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        ) : null}
        <span className="absolute top-[14px] right-4 font-display text-[18px] text-muted group-hover:text-amber">
          ↗
        </span>
      </div>
      <div className="px-[22px] pt-5 pb-6">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-muted text-sm mt-1.5">{project.description}</p>
        {project.techTags.length > 0 && (
          <div className="flex gap-1.5 mt-3.5 flex-wrap">
            {project.techTags.map((tag) => (
              <span
                key={tag}
                className="text-[11.5px] text-amber bg-amber/[0.09] px-2.5 py-[3px] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
