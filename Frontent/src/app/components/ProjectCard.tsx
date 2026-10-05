import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Github, ExternalLink, ArrowRight, Sparkles, Cpu } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { getProjectBySlug } from "../../services/projectsApi";

interface ProjectCardProps {
  project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const queryClient = useQueryClient();
  const isFeatured = project.tag === "featured";
  const techList: string[] = project.techStack ?? [];

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
    if (isFeatured) return "Featured Architecture";
    if (project.tag && project.tag !== "Other") return project.tag;
    return "Applied ML System";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onMouseEnter={prefetchProject}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col group"
    >
      <div className="relative h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border group-hover:border-primary/50 transition-all duration-200 shadow-xs group-hover:shadow-md">
        {/* Media / Preview Section */}
        {project.imageUrl && (
          <Link
            to={`/projects/${project.slug}`}
            state={{ project }}
            className="relative w-full h-52 sm:h-56 overflow-hidden block bg-secondary/30"
          >
            {/* Subtle contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent z-10 opacity-80" />

            <img
              src={project.imageUrl}
              alt={project.title}
              width={640}
              height={224}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Architectural System Tag */}
            <div className="absolute top-3 left-3 z-20">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono backdrop-blur-md border ${
                  isFeatured
                    ? "bg-[#080b10]/85 border-primary/40 text-primary font-semibold"
                    : "bg-[#080b10]/85 border-border text-muted-foreground font-medium"
                }`}
              >
                {isFeatured ? (
                  <Sparkles size={11} className="text-primary" />
                ) : (
                  <Cpu size={11} className="text-emerald-400" />
                )}
                <span>{getTagLabel()}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Narrative & Specifications Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
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

            {/* Summary narrative without justify rivers */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-left line-clamp-3">
              {project.summary}
            </p>
          </div>

          <div>
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

              {/* Dynamic Tech Stack Badges */}
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
                    className="bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border text-[11px] font-mono rounded-md px-2 py-0.5 shrink-0 transition-colors cursor-pointer"
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
                    className="bg-secondary hover:bg-muted text-primary border border-primary/30 text-[11px] font-mono rounded-md px-2 py-0.5 shrink-0 transition-colors cursor-pointer"
                  >
                    - less
                  </button>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-border/60">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary hover:border-border-active text-xs font-medium transition-all"
                >
                  <Github size={13} />
                  <span>Code</span>
                </a>
              )}

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/25 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-all"
                >
                  <ExternalLink size={13} />
                  <span>Demo</span>
                </a>
              )}

              <Link
                to={`/projects/${project.slug}`}
                state={{ project }}
                onMouseEnter={prefetchProject}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all ml-auto group/btn shadow-xs active:scale-[0.98]"
              >
                <span>Details</span>
                <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}