import ProjectCard from "../components/ProjectCard";
import { listProjects } from "../../services/projectsApi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Layers } from "lucide-react";

export default function Projects({ projects: propProjects }: { projects?: any[] }) {
  const { data: hookProjects = [], isLoading } = useQuery({
    queryKey: ["projects", 6, 0],
    queryFn: () => listProjects(6, 0),
    enabled: !propProjects,
  });

  const projectsList = propProjects ?? hookProjects;
  const showSkeleton = isLoading && !propProjects;

  return (
    <section id="projects" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-primary uppercase tracking-wider mb-3">
            <Layers size={13} />
            Engineering Systems
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
            Featured Projects & Architectures
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Production-grade deep learning systems from applied research pipelines to low-latency edge deployment.
          </p>
        </motion.div>

        <div
          className={
            !showSkeleton && projectsList.length === 2
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          }
        >
          {showSkeleton
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-xl bg-card border border-border p-6 flex flex-col justify-between animate-pulse"
                >
                  <div className="h-48 w-full bg-secondary/50 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-secondary/70 rounded" />
                    <div className="h-4 w-full bg-secondary/40 rounded" />
                    <div className="h-4 w-2/3 bg-secondary/40 rounded" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <div className="h-6 w-16 bg-secondary/60 rounded-md" />
                    <div className="h-6 w-20 bg-secondary/60 rounded-md" />
                  </div>
                </div>
              ))
            : projectsList.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
        </div>
      </div>
    </section>
  );
}