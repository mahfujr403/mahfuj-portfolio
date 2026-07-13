import { Link } from "react-router";
import { Github, ExternalLink, ArrowRight, TrendingUp, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Get top metrics for preview
  const topMetrics = project.metrics?.slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col relative group"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

      <div className="relative h-full flex flex-col glass rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#00f2fe]/40 transition-all duration-300">
        {/* Image Section */}
        {project.imageUrl && (
          <div className="relative w-full h-56 overflow-hidden">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/60 to-transparent z-10" />
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#050814]/80 to-transparent z-10" />

            {/* Image */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Top metrics overlay */}
            {topMetrics.length > 0 && (
              <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-2">
                {topMetrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5">
                      {idx === 0 ? (
                        <TrendingUp size={12} className="text-[#00f2fe]" />
                      ) : (
                        <Zap size={12} className="text-[#8b5cf6]" />
                      )}
                      <span className="text-xs text-gray-300 font-medium">
                        {metric.name}
                      </span>
                      <span className="text-xs font-bold gradient-text">
                        {metric.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col relative">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00f2fe]/10 to-transparent rounded-bl-full opacity-50" />

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 gradient-text group-hover:scale-[1.02] transition-transform relative z-10 line-clamp-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 mb-4 flex-1 leading-relaxed text-sm line-clamp-3">
            {project.summary}
          </p>

          {/* Tech Stack */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Tech Stack</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <div className="flex gap-2 overflow-hidden">
              {(project.techStack ?? []).slice(0, 3).map((tech: string) => (
                <Badge
                  key={tech}
                  className="bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/20 text-xs transition-all shrink-0"
                >
                  {tech}
                </Badge>
              ))}
              {(project.techStack ?? []).length > 3 && (
                <Badge className="bg-white/5 text-gray-400 border-white/10 text-xs shrink-0">
                  +{(project.techStack ?? []).length - 3} more
                </Badge>
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold rounded-lg transition-all text-sm shadow-lg shadow-[#00f2fe]/20 shrink-0"
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