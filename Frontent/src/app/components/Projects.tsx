import ProjectCard from "./ProjectCard";
import { listProjects } from "../../services/projectsApi";
import { useQuery } from "@tanstack/react-query";

export default function Projects({ projects: propProjects }: { projects?: any[] }) {
  const { data: hookProjects = [], isLoading } = useQuery({
    queryKey: ["projects", 6, 0],
    queryFn: () => listProjects(6, 0),
    enabled: !propProjects,
  });

  const projectsList = propProjects ?? hookProjects;
  const showSkeleton = isLoading && !propProjects;

  // Visual hierarchy: allocate primary prominence to featured project (tag === "featured" or first project)
  const featuredProject = projectsList.find((p: any) => p.tag === "featured") ?? projectsList[0];
  const secondaryProjects = featuredProject
    ? projectsList.filter((p: any) => p.id !== featuredProject.id)
    : projectsList;

  return (
    <section id="projects" className="py-20 lg:py-28 border-b border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Editorial Section Header */}
        <div className="mb-12 lg:mb-16 text-left">
          {/* Section Index Marker */}
          <div className="flex items-center gap-2 mb-4 select-none" aria-hidden="true">
            <span className="text-xs font-mono tracking-widest text-primary font-semibold">02</span>
            <span className="text-xs text-border-active">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Projects</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight leading-[1.15] mb-4">
            Selected Work
          </h2>

          {/* Factual Context - Unmodified Existing Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Production-grade deep learning systems from applied research pipelines to low-latency edge deployment.
          </p>
        </div>

        {/* Content Area: Responsive Skeleton Loader vs Editorial Layout */}
        {showSkeleton ? (
          <div className="space-y-10">
            {/* Featured project skeleton */}
            <div className="rounded-[12px] border border-border bg-[#111620] overflow-hidden animate-pulse">
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1] bg-secondary/40" />
              <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <div className="h-8 w-3/4 bg-secondary/60 rounded" />
                  <div className="h-4 w-full bg-secondary/30 rounded" />
                  <div className="h-4 w-5/6 bg-secondary/30 rounded" />
                  <div className="flex gap-3 pt-4">
                    <div className="h-9 w-28 bg-secondary/50 rounded-md" />
                    <div className="h-9 w-28 bg-secondary/50 rounded-md" />
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-border/60 lg:pl-8">
                  <div className="h-4 w-32 bg-secondary/40 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-secondary/40 rounded" />
                    <div className="h-6 w-20 bg-secondary/40 rounded" />
                    <div className="h-6 w-14 bg-secondary/40 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary projects skeleton grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-[10px] border border-border bg-[#111620] overflow-hidden animate-pulse">
                  <div className="w-full aspect-[16/10] bg-secondary/40" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 w-3/4 bg-secondary/60 rounded" />
                    <div className="h-4 w-full bg-secondary/30 rounded" />
                    <div className="h-4 w-2/3 bg-secondary/30 rounded" />
                    <div className="flex gap-2 pt-4">
                      <div className="h-8 w-20 bg-secondary/50 rounded-md" />
                      <div className="h-8 w-20 bg-secondary/50 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12 lg:space-y-14">
            {/* 1. Featured Architectural Showcase (Full Width Dominant) */}
            {featuredProject && (
              <div>
                <ProjectCard project={featuredProject} featured={true} />
              </div>
            )}

            {/* 2. Secondary Architectural Systems Grid */}
            {secondaryProjects.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground select-none">
                    Additional Architectures &amp; Systems
                  </h3>
                  <div className="h-[1px] flex-1 bg-border/60" />
                </div>

                <div
                  className={
                    secondaryProjects.length === 1
                      ? "w-full"
                      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                  }
                >
                  {secondaryProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      featured={false}
                      orientation={secondaryProjects.length === 1 ? "horizontal" : "vertical"}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}