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

        {/* Top Overview: Balanced 2-Column Narrative & Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
          
          {/* Bio Narrative */}
          <div className="lg:col-span-7 text-left space-y-4">
            {profile.impactStatement ? (
              <p className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed tracking-normal [word-spacing:0.16em]">
                {profile.impactStatement}
              </p>
            ) : (
              <div className="h-6 w-5/6 bg-secondary/50 rounded animate-pulse" />
            )}

            {profile.bio ? (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed tracking-normal [word-spacing:0.16em]">
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

          {/* Highlights / Stats: Clean Credential Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3 text-left">
            {highlights.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-3 sm:p-3.5 rounded-[10px] bg-[#111620] border border-border hover:border-border-active transition-colors flex items-center gap-3.5 shadow-xs"
                >
                  <div className="size-9 rounded-lg bg-[#18202E] border border-border flex items-center justify-center shrink-0">
                    <ItemIcon className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base sm:text-lg font-bold font-display text-foreground tracking-tight leading-tight">
                      {item.value}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 truncate">
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Section Divider & Pillars Label */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 select-none" aria-hidden="true">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
            Core Research &amp; Engineering Focus
          </span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        {/* Research & Engineering Pillars: Full-Width 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left">
          {researchPillars.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-4 sm:p-5 rounded-[12px] bg-[#111620] border border-border ${pillar.border} transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between shadow-xs`}
              >
                {/* Decorative circle glow in top-right corner */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${pillar.accent} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
                  aria-hidden="true"
                />

                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#18202E] border border-border flex items-center justify-center mb-3 group-hover:border-primary/40 transition-colors shrink-0">
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
    </section>
  );
}
