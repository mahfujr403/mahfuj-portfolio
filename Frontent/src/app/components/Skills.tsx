import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../../services/skillsApi";
import { getSkillMeta } from "./skillIcons";
import { getCategoryMeta } from "./categoryIcons";
import { Cpu, Terminal } from "lucide-react";

export default function Skills({ skills: propSkills }: { skills?: Array<{ category: string; skills: Array<{ name: string; level: number }> }> }) {
  const { data: hookSkills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    enabled: !propSkills,
  });

  const skills = propSkills ?? hookSkills;
  const showSkeleton = isLoading && !propSkills;

  return (
    <section id="skills" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-primary uppercase tracking-wider mb-3">
            <Cpu size={13} />
            Technical Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
            Skills & Technical Stack
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Comprehensive toolkit spanning mathematical model research, deep learning frameworks, and production MLOps systems.
          </p>
        </motion.div>

        {/* Structured Capability Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {showSkeleton
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 sm:p-7 space-y-5 animate-pulse">
                  <div className="flex items-center justify-between pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/70" />
                      <div className="space-y-1.5">
                        <div className="h-5 w-40 bg-secondary/70 rounded" />
                        <div className="h-3 w-24 bg-secondary/50 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-12 rounded-lg bg-secondary/40 border border-border/40" />
                    ))}
                  </div>
                </div>
              ))
            : skills.map((skillCategory, index) => {
                const { Icon: CategoryIcon, accent } = getCategoryMeta(skillCategory.category, index);

                return (
                  <motion.div
                    key={skillCategory.category}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    className="bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-200 p-4 sm:p-6 flex flex-col justify-between shadow-xs group"
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 border"
                            style={{
                              backgroundColor: `${accent[0]}15`,
                              borderColor: `${accent[0]}35`,
                            }}
                          >
                            <CategoryIcon className="w-5 h-5" style={{ color: accent[0] }} />
                          </span>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                              {skillCategory.category}
                            </h3>
                            <span className="text-xs font-mono text-muted-foreground">
                              {skillCategory.skills.length} core competencies
                            </span>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/60 border border-border text-[11px] font-mono text-muted-foreground">
                          <Terminal size={11} className="text-primary" />
                          <span>Production Ready</span>
                        </div>
                      </div>

                      {/* Unified 2x2 Architectural Capability Tiles: 2 columns on all devices */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {skillCategory.skills.map((skill) => {
                          const { Icon, color } = getSkillMeta(skill.name);
                          return (
                            <div
                              key={skill.name}
                              className="group/tile flex items-center gap-1.5 sm:gap-2 rounded-lg border border-border/70 bg-secondary/35 hover:bg-secondary/80 hover:border-primary/50 transition-all duration-200 px-2 py-2 sm:px-2.5 sm:py-2.5 select-none cursor-default shadow-xs min-w-0"
                            >
                              <span
                                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md shrink-0 border transition-transform duration-200 group-hover/tile:scale-105"
                                style={{
                                  backgroundColor: `${color}15`,
                                  borderColor: `${color}30`,
                                }}
                              >
                                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color }} />
                              </span>
                              <span
                                className="text-[11px] sm:text-xs font-medium text-foreground group-hover/tile:text-primary transition-colors tracking-tight whitespace-nowrap overflow-hidden text-ellipsis min-w-0"
                                title={skill.name}
                              >
                                {skill.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Telemetry bottom status indicator */}
                    <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>VERIFIED IN BENCHMARKS & CODEBASES</span>
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
