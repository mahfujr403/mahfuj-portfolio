import ProjectCard from "../components/ProjectCard";
import { listProjects } from "../../services/projectsApi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

export default function Projects({ projects: propProjects }: { projects?: any[] }) {
  const { data: hookProjects = [], isLoading } = useQuery({
    queryKey: ["projects", 6, 0],
    queryFn: () => listProjects(6, 0),
    enabled: !propProjects,
  });

  const projectsList = propProjects ?? hookProjects;
  const showSkeleton = isLoading && !propProjects;

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Production-grade ML systems from research to deployment, serving millions of users
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showSkeleton
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl glass border border-white/10 p-6 flex flex-col justify-between animate-pulse"
                >
                  <div className="h-48 w-full bg-white/5 rounded-2xl mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-2/3 bg-white/5 rounded" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <div className="h-6 w-16 bg-white/5 rounded-full" />
                    <div className="h-6 w-20 bg-white/5 rounded-full" />
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