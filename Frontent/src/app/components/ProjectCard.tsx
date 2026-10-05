import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { getProjectBySlug } from "../../services/projectsApi";

interface ProjectCardProps {
  project: any;
  featured?: boolean;
  orientation?: "horizontal" | "vertical";
}

interface ProjectDescriptor {
  label: string;
  value: string;
  detail?: string;
}

function getProjectEngineeringDescriptors(project: any): {
  badgeDescriptor: string;
  highlights: ProjectDescriptor[];
} {
  const slug = (project?.slug || "").toLowerCase();

  if (slug === "oncovision-ai" || project?.tag === "featured") {
    return {
      badgeDescriptor: "Multi-Model Ensemble",
      highlights: [
        {
          label: "System Focus",
          value: "5-Class Histopathology Classification",
          detail: "Lung & Colon tissue pathology decision support",
        },
        {
          label: "Architecture",
          value: "Multi-Model Ensemble Inference",
          detail: "MobileNetV2, DenseNet121 & ResNet50 Fusion",
        },
      ],
    };
  }

  if (slug === "fish-disease" || slug.includes("fish")) {
    return {
      badgeDescriptor: "Feature Fusion · TFLite",
      highlights: [
        {
          label: "System Scope",
          value: "Multi-Class Fish Disease Classification",
          detail: "Aquaculture pathology & disease epidemiology",
        },
        {
          label: "Architecture",
          value: "ResNet50 + EfficientNetV2-B0 Fusion",
          detail: "TFLite inference with Cloudinary image pipeline",
        },
      ],
    };
  }

  const fallbackArch = project?.model?.architecture || project?.architecture || "Deep Learning Architecture";
  const fallbackFocus = project?.tag ? `${project.tag} Platform` : "Applied Machine Learning";

  return {
    badgeDescriptor: typeof fallbackArch === "string" ? fallbackArch.split(" ")[0] : "System",
    highlights: [
      {
        label: "System Scope",
        value: fallbackFocus,
      },
      {
        label: "Architecture",
        value: typeof fallbackArch === "string" ? fallbackArch : "End-to-End System",
      },
    ],
  };
}

export default function ProjectCard({ project, featured = false, orientation = "vertical" }: ProjectCardProps) {
  const queryClient = useQueryClient();
  const isFeatured = featured || project.tag === "featured";
  const techList: string[] = project.techStack ?? [];
  const descriptors = getProjectEngineeringDescriptors(project);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure || techList.length === 0) return;

    const calculateFit = () => {
      const containerWidth = container.offsetWidth;
      if (containerWidth <= 0) return;

      const children = Array.from(measure.children) as HTMLElement[];
      if (children.length === 0) return;

      const gap = 8;
      const moreBadgeWidth = 80;
      let totalWidth = 0;
      let fitCount = 0;

      for (let i = 0; i < children.length; i++) {
        const itemWidth = children[i].offsetWidth;
        const widthIfAdded = totalWidth + (i > 0 ? gap : 0) + itemWidth;

        if (i === children.length - 1 && widthIfAdded <= containerWidth) {
          fitCount = children.length;
          break;
        }

        if (widthIfAdded + gap + moreBadgeWidth <= containerWidth) {
          totalWidth = widthIfAdded;
          fitCount = i + 1;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, fitCount));
    };

    calculateFit();

    const observer = new ResizeObserver(() => {
      calculateFit();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [techList]);

  const prefetchProject = () => {
    if (project?.slug) {
      queryClient.prefetchQuery({
        queryKey: ["project", project.slug],
        queryFn: () => getProjectBySlug(project.slug),
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const getTagLabel = () => {
    if (isFeatured) return "Featured System";
    if (project.tag && project.tag !== "Other" && project.tag !== "other") return project.tag;
    return "Deep Learning";
  };

  // 1. Featured Architectural Composition (Wide editorial format)
  if (isFeatured) {
    return (
      <div
        onMouseEnter={prefetchProject}
        className="rounded-[12px] border border-border bg-[#111620] overflow-hidden transition-all duration-200 hover:border-border-active shadow-xs group"
      >
        {/* Media / Case Study Banner */}
        {project.imageUrl && (
          <Link
            to={`/projects/${project.slug}`}
            state={{ project }}
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden bg-[#0E121A] border-b border-border/80 block group/img"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              width={1280}
              height={512}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top group-hover/img:scale-[1.01] transition-transform duration-300"
            />

            {/* Architecture Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-flex items-center px-2.5 py-1 rounded-[4px] text-xs font-mono bg-[#0B0E14]/90 border border-border text-foreground/80 font-medium select-none">
                <span>Featured System</span>
              </div>
            </div>

            {/* High-Value Architecture Badge (Replacing accuracy percentage) */}
            <div className="absolute top-4 right-4 z-10 inline-flex items-center px-2.5 py-1 rounded-[4px] text-xs font-mono bg-[#0B0E14]/90 border border-border text-foreground/90 font-medium select-none">
              <span>{descriptors.badgeDescriptor}</span>
            </div>
          </Link>
        )}

        {/* Narrative & Specification Grid */}
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Title, Narrative & Primary Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <Link
                to={`/projects/${project.slug}`}
                state={{ project }}
                className="block mb-3 group/title"
              >
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground group-hover/title:text-primary transition-colors leading-tight">
                  {project.title}
                </h3>
              </Link>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5 sm:mb-8 max-w-xl line-clamp-2 sm:line-clamp-none">
                {project.summary}
              </p>
            </div>

            {/* Action Bar: Fits on 1 line on mobile, View Details does not drop to 2nd line */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2 sm:gap-3">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground text-[11px] sm:text-sm font-semibold rounded-md hover:bg-primary-hover active:scale-[0.99] transition-colors shadow-xs select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
                  >
                    <ExternalLink size={13} />
                    <span>Live Demo</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-secondary text-foreground border border-border text-[11px] sm:text-sm font-medium rounded-md hover:bg-secondary/80 hover:border-border-active active:scale-[0.99] transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
                  >
                    <Github size={13} />
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              <Link
                to={`/projects/${project.slug}`}
                state={{ project }}
                className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 group/btn select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm py-1"
              >
                <span>View Details</span>
                <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Complete Stack & Engineering Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full lg:border-l lg:border-border/60 lg:pl-8">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 mb-3 select-none">
                Technologies &amp; Frameworks
              </h4>

              {/* Complete Technical Stack: 1 line on mobile, wraps on desktop */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-1 sm:pb-0">
                {techList.map((tech: string) => (
                  <Badge
                    key={tech}
                    variant="default"
                    className="text-[11px] font-mono py-0.5 px-2.5 bg-[#18202E] border-border text-foreground/90 font-normal hover:border-primary/40 transition-colors shrink-0"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* High-Value Engineering Highlights (Replacing prominent accuracy metrics) */}
            <div className="mt-8 pt-5 border-t border-border-subtle space-y-4">
              {descriptors.highlights.map((item) => (
                <div key={item.label} className="text-left">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 block mb-1">
                    {item.label}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-foreground font-display leading-snug">
                    {item.value}
                  </p>
                  {item.detail && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Secondary Editorial Project Card
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      onMouseEnter={prefetchProject}
      className={
        isHorizontal
          ? "grid grid-cols-1 lg:grid-cols-12 rounded-[10px] border border-border bg-[#111620] overflow-hidden transition-all duration-200 hover:border-border-active shadow-xs group"
          : "h-full flex flex-col rounded-[10px] border border-border bg-[#111620] overflow-hidden transition-all duration-200 hover:border-border-active shadow-xs group"
      }
    >
      {/* Media Preview Section */}
      {project.imageUrl && (
        <Link
          to={`/projects/${project.slug}`}
          state={{ project }}
          className={
            isHorizontal
              ? "lg:col-span-5 relative w-full aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden bg-[#0E121A] border-b lg:border-b-0 lg:border-r border-border/80 block group/img min-h-[240px]"
              : "relative w-full aspect-[16/10] overflow-hidden bg-[#0E121A] border-b border-border/80 block group/img"
          }
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover/img:scale-[1.02] transition-transform duration-300"
          />

          {/* System Tag */}
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-mono bg-[#0B0E14]/90 border border-border text-muted-foreground font-medium select-none">
              <span>{getTagLabel()}</span>
            </div>
          </div>

          {/* Architecture Descriptor Badge (Replacing accuracy percentage) */}
          <div className="absolute top-3 right-3 z-10 inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-mono bg-[#0B0E14]/90 border border-border text-foreground/90 font-medium select-none">
            <span>{descriptors.badgeDescriptor}</span>
          </div>
        </Link>
      )}

      {/* Specifications Body */}
      <div className={isHorizontal ? "lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between" : "p-6 flex-1 flex flex-col justify-between"}>
        <div>
          {/* Title */}
          <Link
            to={`/projects/${project.slug}`}
            state={{ project }}
            className="block mb-2 group/title"
          >
            <h3 className="text-lg sm:text-xl font-bold font-display text-foreground group-hover/title:text-primary transition-colors leading-snug line-clamp-2">
              {project.title}
            </h3>
          </Link>

          {/* Summary narrative */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-left line-clamp-2 sm:line-clamp-3">
            {project.summary}
          </p>
        </div>

        <div>
          {/* High-Value Engineering Highlights */}
          <div className="mb-4 pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {descriptors.highlights.map((item) => (
              <div key={item.label} className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 block">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-foreground font-display truncate block mt-0.5">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Tech Stack Strip */}
          <div className="mb-5 pt-3 border-t border-border/60">
            {/* Hidden measuring container */}
            <div
              ref={measureRef}
              aria-hidden="true"
              className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 flex gap-2"
            >
              {techList.map((tech: string) => (
                <div
                  key={tech}
                  className="px-2.5 py-0.5 text-xs font-mono border whitespace-nowrap"
                >
                  {tech}
                </div>
              ))}
            </div>

            {/* Dynamic Tech Stack Badges with ResizeObserver calculation */}
            <div
              ref={containerRef}
              className={`flex items-center gap-1.5 transition-all duration-200 ${
                isExpanded ? "flex-wrap" : "overflow-hidden"
              }`}
            >
              {(isExpanded ? techList : techList.slice(0, visibleCount)).map((tech: string) => (
                <Badge
                  key={tech}
                  variant="default"
                  className="shrink-0 text-[11px]"
                >
                  {tech}
                </Badge>
              ))}

              {!isExpanded && techList.length > visibleCount && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  title={techList.slice(visibleCount).join(", ")}
                  className="bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border text-[11px] font-mono rounded-md px-2 py-0.5 shrink-0 transition-colors cursor-pointer select-none"
                >
                  +{techList.length - visibleCount} more
                </button>
              )}

              {isExpanded && techList.length > visibleCount && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="bg-secondary hover:bg-muted text-primary border border-primary/30 text-[11px] font-mono rounded-md px-2 py-0.5 shrink-0 transition-colors cursor-pointer select-none"
                >
                  - less
                </button>
              )}
            </div>
          </div>

          {/* Action Bar with approved hierarchy: Primary (Live Demo), Secondary (GitHub), Text link (View Details) */}
          <div className="flex items-center gap-2 pt-3 border-t border-border/60">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary text-foreground hover:bg-secondary/80 hover:border-border-active text-xs font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
              >
                <Github size={13} />
                <span>GitHub</span>
              </a>
            )}

            <Link
              to={`/projects/${project.slug}`}
              state={{ project }}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto group/btn select-none py-1 focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm"
            >
              <span>View Details</span>
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}