import { motion } from "motion/react";
import { BookOpen, FolderGit2, Trophy, Activity, Cpu, ShieldCheck, Terminal, Compass } from "lucide-react";
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
      label: publicationCount === 1 ? "Peer-Reviewed Paper" : "Peer-Reviewed Papers",
      value: `${publicationCount}`,
      subtext: "Published & Under Review",
    },
    {
      icon: FolderGit2,
      label: projectCount === 1 ? "End-to-End System" : "End-to-End Systems",
      value: `${projectCount}`,
      subtext: "Production ML Architectures",
    },
    {
      icon: Trophy,
      label: "Competitive Programming",
      value: "Regionalist",
      subtext: "ICPC Asia Regional Contest",
    },
  ];

  const researchPillars = [
    {
      title: "Medical AI & Oncology",
      desc: "Deep convolutional networks for early cancer diagnosis, histopathological classification, and automated clinical prediction.",
      tag: "PyTorch · Computer Vision · ResNet/DenseNet",
      icon: Activity,
      accentColor: "text-primary",
      iconBg: "bg-primary/10 border-primary/20",
    },
    {
      title: "Aquatic Epidemiology",
      desc: "Applied deep learning pipelines for fish disease classification and ecological resilience modeling in aquaculture.",
      tag: "Deep Learning · Bio-Informatics · YOLOv8",
      icon: ShieldCheck,
      accentColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Production ML Systems",
      desc: "Ultra-low-latency FastAPI backends, ONNX runtime acceleration, Docker containerization, and edge inference pipelines.",
      tag: "FastAPI · ONNX · Docker · PostgreSQL",
      icon: Cpu,
      accentColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Algorithmic Foundation",
      desc: "Competitive programming background in advanced graph theory, dynamic programming, and mathematical optimization.",
      tag: "C++ · Algorithms · ICPC Regional Contest",
      icon: Terminal,
      accentColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-primary uppercase tracking-wider mb-3">
            <Compass size={13} />
            Background & Research Focus
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
            Research & Engineering Dossier
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Bridging algorithmic precision and clinical deep learning to deploy reliable artificial intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Narrative & Metrics Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 flex flex-col justify-between h-full space-y-6"
          >
            <div className="bg-card border border-border rounded-xl p-6 sm:p-7 shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-semibold mb-3">
                Mission Statement
              </h3>
              {profile.impactStatement ? (
                <p className="text-base sm:text-lg text-foreground font-medium mb-4 leading-relaxed">
                  {profile.impactStatement}
                </p>
              ) : (
                <div className="h-6 w-5/6 bg-secondary/60 rounded animate-pulse mb-4" />
              )}
              {profile.bio ? (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-left">
                  {profile.bio}
                </p>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-full bg-secondary/40 rounded" />
                  <div className="h-4 w-5/6 bg-secondary/40 rounded" />
                  <div className="h-4 w-4/6 bg-secondary/40 rounded" />
                </div>
              )}
            </div>

            {/* Metrics Highlights Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {highlights.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-card rounded-xl p-4 sm:p-5 text-center border border-border hover:border-primary/40 transition-all flex flex-col justify-center shadow-xs"
                  >
                    <ItemIcon className="mx-auto mb-2 text-primary" size={20} />
                    <p className="text-2xl sm:text-3xl font-extrabold font-display text-foreground tracking-tight mb-0.5">
                      {item.value}
                    </p>
                    <p className="text-xs font-semibold text-foreground/90 font-mono">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.subtext}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: 4 Research & Engineering Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {researchPillars.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all duration-200 group flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3.5 ${pillar.iconBg}`}>
                      <PillarIcon className={pillar.accentColor} size={18} />
                    </div>
                    <h3 className="font-display font-semibold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/60">
                    <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors block truncate">
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
