import ProjectCard from "../components/ProjectCard";
import { listProjects } from "../../services/projectsApi";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function Projects() {

    const [projectsList, setProjectsList] = useState<any[]>([]); 


    useEffect(() => {
        let mounted = true;
        listProjects(6, 0)
        .then((res) => {
            if (mounted) setProjectsList(res ?? []);
        })
        .catch(() => setProjectsList([]));
        return () => {
        mounted = false;
        };
    }, []);

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
            {projectsList.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    )
}
  
    
    