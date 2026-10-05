import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Github, ExternalLink, ArrowRight, Sparkles, Folder } from "lucide-react";
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

      const gap = 8; // gap-2 = 8px
      const moreBadgeWidth = 85; // approximate width of "+N more" badge
      let totalWidth = 0;
      let fitCount = 0;

      for (let i = 0; i < children.length; i++) {
        const itemWidth = children[i].offsetWidth;
        const widthIfAdded = totalWidth + (i > 0 ? gap : 0) + itemWidth;

        // If this is the last element and ALL items fit without a "+ more" badge:
        if (i === children.length - 1 && widthIfAdded <= containerWidth) {
          fitCount = children.length;
          break;
        }

        // If adding this item still leaves room for the "+ more" badge:
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

    // Use ResizeObserver for responsive recalculation
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      onMouseEnter={prefetchProject}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col relative group"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

      <div className="relative h-full flex flex-col glass rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#00f2fe]/40 transition-all duration-300">
        {/* Image Section */}
        {project.imageUrl && (
          <Link
            to={`/projects/${project.slug}`}
            state={{ project }}
            className="relative w-full h-56 overflow-hidden block"
          >
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/60 to-transparent z-10" />
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#050814]/80 to-transparent z-10" />

            {/* Image */}
            <img
              src={project.imageUrl}
              alt={project.title}
              width={640}
              height={224}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Tag badge */}
            <div className="absolute top-3 left-3 z-20">
              <div
                className={
                  isFeatured
                    ? "flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg border border-[#00f2fe]/40 backdrop-blur-md"
                    : "flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg border border-white/15 backdrop-blur-md"
                }
              >
                {isFeatured ? (
                  <Sparkles size={12} className="text-[#00f2fe]" />
                ) : (
                  <Folder size={12} className="text-gray-400" />
                )}
                <span
                  className={
                    isFeatured
                      ? "text-xs font-semibold text-[#00f2fe]"
                      : "text-xs font-medium text-gray-300"
                  }
                >
                  {isFeatured ? "Featured" : "Other"}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col relative">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00f2fe]/10 to-transparent rounded-bl-full opacity-50" />

          {/* Title */}
          <Link
            to={`/projects/${project.slug}`}
            state={{ project }}
            className="hover:opacity-90 transition-opacity"
          >
            <h3 className="text-xl font-bold font-display mb-2.5 text-white group-hover:text-[#00f2fe] transition-colors relative z-10 line-clamp-2">
              {project.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-300/90 mb-4 flex-1 leading-relaxed text-sm line-clamp-3 text-justify [text-justify:inter-word]">
            {project.summary}
          </p>

          {/* Tech Stack */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Tech Stack</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Hidden measuring container to get exact pixel widths of all badges */}
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

            {/* Dynamic Tech Stack Container */}
            <div
              ref={containerRef}
              className={`flex items-center gap-2 transition-all duration-300 ${
                isExpanded ? "flex-wrap" : "overflow-hidden"
              }`}
            >
              {(isExpanded ? techList : techList.slice(0, visibleCount)).map((tech: string) => (
                <Badge
                  key={tech}
                  className="bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/25 hover:bg-[#00f2fe]/20 text-xs font-mono transition-all shrink-0 px-2.5 py-0.5"
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
                  className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/15 hover:border-[#00f2fe]/40 text-xs font-mono rounded-md px-2 py-0.5 shrink-0 transition-colors cursor-pointer"
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
                  className="bg-white/5 hover:bg-white/10 text-[#00f2fe] border border-[#00f2fe]/30 text-xs font-mono rounded-md px-2 py-0.5 shrink-0 transition-colors cursor-pointer"
                >
                  - less
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/5">
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#00f2fe] via-[#38bdf8] to-[#818cf8] text-[#060913] font-semibold rounded-lg transition-all text-xs shadow-md shadow-[#00f2fe]/20 shrink-0"
              >
                <Github size={16} />
                Code
              </motion.a>
            )}

            {project.liveDemoUrl && (
              <motion.a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/20 text-gray-300 rounded-lg hover:border-[#00f2fe]/60 hover:text-white transition-all text-sm shrink-0"
              >
                <ExternalLink size={16} />
                Try It
              </motion.a>
            )}

            <Link
              to={`/projects/${project.slug}`}
              state={{ project }}
              onMouseEnter={prefetchProject}
              className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/20 text-gray-300 rounded-lg hover:border-[#8b5cf6]/60 hover:text-white transition-all text-sm ml-auto shrink-0 group/link"
            >
              Details
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}