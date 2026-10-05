import { motion } from "motion/react";
import { BookOpen, FolderGit2, Trophy, Activity, Cpu, ShieldCheck, Terminal, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "../hooks/useProfile";
import { fetchPortfolioStats } from "../../services/statsApi";

export default function About({ profile: propProfile, stats: propStats }: { profile?: any; stats?: { projects: number; publications: number } }) {
  const { data: hookProfile } = useProfile();
  const profile = propProfile ?? hookProfile ?? {};
  const { data: hookStats } = useQuery({
    queryKey: ["portfolio-stats"],
    queryFn: fetchPortfolioStats,
    enabled: !propStats,
  });
  const stats = propStats ?? hookStats;
  const publicationCount = stats?.publications ?? 0;
  const projectCount = stats?.projects ?? 0;
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

  const researchPillars = [
    {
      title: "Medical AI & Oncology",
      desc: "Deep CNNs for early cancer diagnosis, histopathological classification, and automated clinical prediction.",
      tag: "PyTorch · Computer Vision",
      icon: Activity,
      accent: "from-[#00f2fe]/20 to-[#38bdf8]/10",
      border: "hover:border-[#00f2fe]/50",
      iconColor: "text-[#00f2fe]",
    },
    {
      title: "Aquatic Epidemiology",
      desc: "AI pipelines for fish disease classification and ecological resilience modeling in aquaculture.",
      tag: "Deep Learning · Bio-Informatics",
      icon: ShieldCheck,
      accent: "from-[#38bdf8]/20 to-[#818cf8]/10",
      border: "hover:border-[#38bdf8]/50",
      iconColor: "text-[#38bdf8]",
    },
    {
      title: "Production ML Systems",
      desc: "Ultra-low-latency FastAPI backends, ONNX runtime optimization, and edge inference containers.",
      tag: "FastAPI · Docker · ONNX",
      icon: Cpu,
      accent: "from-[#818cf8]/20 to-[#c084fc]/10",
      border: "hover:border-[#818cf8]/50",
      iconColor: "text-[#818cf8]",
    },
    {
      title: "Algorithmic Foundation",
      desc: "ICPC Regionalist with competitive programming background in graph theory & mathematical optimization.",
      tag: "C++ · Data Structures · ICPC",
      icon: Terminal,
      accent: "from-[#c084fc]/20 to-[#00f2fe]/10",
      border: "hover:border-[#c084fc]/50",
      iconColor: "text-[#c084fc]",
    },
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-mono text-[#00f2fe] uppercase tracking-wider mb-4">
            <Sparkles size={12} />
            Background & Research Focus
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#818cf8] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Bio & Core Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between h-full"
          >
            <div>
              {profile.impactStatement ? (
                <p className="text-xl text-gray-200 mb-6 leading-relaxed font-medium">
                  {profile.impactStatement}
                </p>
              ) : (
                <div className="h-7 w-5/6 bg-white/10 rounded-lg animate-pulse mb-6" />
              )}
              {profile.bio ? (
                <p className="text-gray-300 leading-relaxed mb-8 text-base text-justify [text-justify:inter-word]">
                  {profile.bio}
                </p>
              ) : (
                <div className="space-y-2 mb-8 animate-pulse">
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
                  <div className="h-4 w-4/6 bg-white/5 rounded" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {highlights.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-4 text-center border border-white/10 hover:border-[#00f2fe]/40 transition-all duration-300 min-h-[130px] flex flex-col justify-center"
                  >
                    <ItemIcon className="mx-auto mb-2 text-[#00f2fe]" size={22} />
                    <p className="text-2xl font-bold font-display gradient-text mb-1">{item.value}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-mono">{item.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Research & Engineering Pillars (Replaces Duplicate Photo) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {researchPillars.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`glass rounded-2xl p-5 border border-white/10 ${pillar.border} transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${pillar.accent} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity`} />
                  <div>
                    <div className="w-10 h-10 rounded-xl glass border border-white/15 flex items-center justify-center mb-3">
                      <PillarIcon className={pillar.iconColor} size={20} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-[#00f2fe] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-gray-400 group-hover:text-white transition-colors">
                      {pillar.tag}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
