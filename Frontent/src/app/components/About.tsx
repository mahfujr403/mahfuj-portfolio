import { BookOpen, FolderGit2, Trophy, Activity, Cpu, ShieldCheck, Terminal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "../hooks/useProfile";
import { fetchPortfolioStats } from "../../services/statsApi";

export default function About({
  profile: propProfile,
  stats: propStats,
}: {
  profile?: any;
  stats?: { projects: number; publications: number };
}) {
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
      value: `${publicationCount}`,
      label: publicationCount === 1 ? "Peer-Reviewed Paper" : "Peer-Reviewed Papers",
      isNumeric: true,
    },
    {
      icon: FolderGit2,
      value: `${projectCount}`,
      label: projectCount === 1 ? "End-to-End System" : "End-to-End Systems",
      isNumeric: true,
    },
    {
      icon: Trophy,
      value: "Regional Contestant",
      label: "ICPC",
      isNumeric: false,
    },
  ];

  const researchPillars = [
    {
      title: "Medical AI & Oncology",
      desc: "Deep convolutional networks for early cancer diagnosis, histopathological classification, and automated clinical prediction.",
      tag: "PyTorch · Computer Vision · ResNet/DenseNet",
      icon: Activity,
      accent: "from-[#00f2fe]/20 to-[#38bdf8]/10",
      border: "hover:border-[#00f2fe]/40",
      iconColor: "text-[#00f2fe]",
    },
    {
      title: "Aquatic Epidemiology",
      desc: "Applied deep learning pipelines for fish disease classification and ecological resilience modeling in aquaculture.",
      tag: "Deep Learning · Bio-Informatics · YOLOv8",
      icon: ShieldCheck,
      accent: "from-[#38bdf8]/20 to-[#818cf8]/10",
      border: "hover:border-[#38bdf8]/40",
      iconColor: "text-[#38bdf8]",
    },
    {
      title: "Production ML Systems",
      desc: "Ultra-low-latency FastAPI backends, ONNX runtime acceleration, Docker containerization, and edge inference pipelines.",
      tag: "FastAPI · Docker · Render · PostgreSQL",
      icon: Cpu,
      accent: "from-[#818cf8]/20 to-[#c084fc]/10",
      border: "hover:border-[#818cf8]/40",
      iconColor: "text-[#818cf8]",
    },
    {
      title: "Algorithmic Foundation",
      desc: "ICPC Asia Regional contestant with rigorous competitive programming background in graph theory & mathematical optimization.",
      tag: "C++ · Data Structures · Algorithms",
      icon: Terminal,
      accent: "from-[#c084fc]/20 to-[#00f2fe]/10",
      border: "hover:border-[#c084fc]/40",
      iconColor: "text-[#c084fc]",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-28 border-b border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header: Left-aligned with 01 / ABOUT, identical to 02/Projects, 03/Publications */}
        <div className="mb-10 sm:mb-12 lg:mb-16 text-left">
          {/* Section Index Marker */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 select-none" aria-hidden="true">
            <span className="text-xs font-mono tracking-widest text-primary font-semibold">01</span>
            <span className="text-xs text-border-active">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">About</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight leading-[1.15] mb-3 sm:mb-4">
            About Me
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Bridging algorithmic precision and clinical deep learning to deploy reliable artificial intelligence.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Biography & Compact Stat Badges */}
          <div className="lg:col-span-6 flex flex-col justify-between text-left">
            <div>
              {/* Impact Statement */}
              {profile.impactStatement ? (
                <p className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed mb-4 sm:mb-5">
                  {profile.impactStatement}
                </p>
              ) : (
                <div className="h-6 w-5/6 bg-secondary/50 rounded mb-4 animate-pulse" />
              )}

              {/* Bio Narrative */}
              {profile.bio ? (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                  {profile.bio}
                </p>
              ) : (
                <div className="space-y-2 mb-6 sm:mb-8 animate-pulse">
                  <div className="h-4 w-full bg-secondary/40 rounded" />
                  <div className="h-4 w-5/6 bg-secondary/40 rounded" />
                  <div className="h-4 w-4/6 bg-secondary/40 rounded" />
                </div>
              )}
            </div>

            {/* Compact Highlight Cards: 3 columns on all viewports, low scroll height */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border-subtle">
              {highlights.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="p-2 sm:p-2.5 rounded-[8px] bg-[#111620] border border-border hover:border-border-active transition-colors flex flex-col items-center justify-center text-center shadow-xs"
                  >
                    <ItemIcon className="size-3.5 sm:size-4 text-primary shrink-0 mb-1" aria-hidden="true" />
                    <span
                      className={`${
                        item.isNumeric
                          ? "text-base sm:text-xl font-bold sm:font-extrabold"
                          : "text-xs sm:text-sm font-bold"
                      } font-display text-foreground tracking-tight leading-tight mb-1 text-center`}
                    >
                      {item.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 text-center leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Research & Engineering Pillars in Compact 2x2 Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
            {researchPillars.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`p-3.5 sm:p-5 rounded-[12px] bg-[#111620] border border-border ${pillar.border} transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between shadow-xs`}
                >
                  {/* Decorative circle glow in top-right corner */}
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${pillar.accent} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
                    aria-hidden="true"
                  />

                  <div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#18202E] border border-border flex items-center justify-center mb-2.5 group-hover:border-primary/40 transition-colors shrink-0">
                      <PillarIcon className={pillar.iconColor} size={16} />
                    </div>
                    <h3 className="font-display font-semibold text-sm sm:text-base text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground/80 group-hover:text-foreground transition-colors block truncate">
                      {pillar.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
