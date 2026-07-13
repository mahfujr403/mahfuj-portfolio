import { motion } from "motion/react";
import { BookOpen, FolderGit2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../services/profileApi";
import { listPublications } from "../../services/publicationsApi";
import { listProjects } from "../../services/projectsApi";

export default function About() {
  const [profile, setProfile] = useState<any>({});
  const [publicationCount, setPublicationCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchProfile(), listPublications(1000, 0), listProjects(1000, 0)])
      .then(([profileData, publicationData, projectData]) => {
        if (!mounted) return;

        if (profileData) setProfile(profileData);
        setPublicationCount(Array.isArray(publicationData) ? publicationData.length : 0);
        setProjectCount(Array.isArray(projectData) ? projectData.length : 0);
      })
      .catch(() => {})
    return () => { mounted = false; };
  }, []);
  const highlights = [
    {
      icon: BookOpen,
      label: publicationCount === 1 ? "Publication" : "Publications",
      value: `${publicationCount}`,
    },
    {
      icon: FolderGit2,
      label: projectCount === 1 ? "End-to-End ML Project" : "End-to-End ML Projects",
      value: `${projectCount}`,
    },
    { icon: Trophy, label: "ICPC", value: "Regionalist" },
  ];

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl text-gray-300 mb-6 leading-relaxed font-medium">
              {profile.impactStatement}
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              {profile.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-4 text-center border border-white/10 hover:border-[#00f2fe]/50 transition-all duration-300 min-h-[140px] flex flex-col justify-center"
                >
                  <item.icon className="mx-auto mb-2 text-[#00f2fe]" size={24} />
                  <p className="text-2xl font-bold gradient-text mb-1">{item.value}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] rounded-3xl blur-2xl opacity-30" />
              <div className="relative w-80 h-80 rounded-3xl overflow-hidden glass border border-white/20 glow-cyan">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 glass px-6 py-4 rounded-2xl border border-[#00f2fe]/30 glow-cyan"
              >
                <p className="font-semibold gradient-text">{profile.tagline}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
