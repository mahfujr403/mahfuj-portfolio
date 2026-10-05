import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../../services/skillsApi";
import { getSkillMeta } from "./skillIcons";
import { getCategoryMeta } from "./categoryIcons";

export default function Skills({ skills: propSkills }: { skills?: Array<{ category: string; skills: Array<{ name: string; level: number }> }> }) {
  const { data: hookSkills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    enabled: !propSkills,
  });

  const skills = propSkills ?? hookSkills;
  const showSkeleton = isLoading && !propSkills;

  return (
    <section id="skills" className="py-20 lg:py-28 border-b border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Editorial Section Header */}
        <div className="mb-12 lg:mb-16 text-left">
          {/* Section Index Marker */}
          <div className="flex items-center gap-2 mb-4 select-none" aria-hidden="true">
            <span className="text-xs font-mono tracking-widest text-primary font-semibold">04</span>
            <span className="text-xs text-border-active">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Skills</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight leading-[1.15] mb-4">
            Skills
          </h2>

          {/* Factual Context - Unmodified Existing Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Comprehensive toolkit spanning mathematical model research, deep learning frameworks, and production MLOps systems.
          </p>
        </div>

        {/* Editorial Technical Taxonomy */}
        <div className="w-full border-t border-border-subtle divide-y divide-border/60">
          {showSkeleton ? (
            <div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 animate-pulse">
                  <div className="md:col-span-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-secondary/60 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <div className="h-5 w-36 bg-secondary/70 rounded" />
                      <div className="h-3 w-24 bg-secondary/40 rounded" />
                    </div>
                  </div>
                  <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2.5 sm:gap-y-3.5">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center gap-3 py-1">
                        <div className="w-4 h-4 rounded bg-secondary/60 shrink-0" />
                        <div className="h-4 w-32 bg-secondary/60 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            skills.map((skillCategory, index) => {
              const { Icon: CategoryIcon } = getCategoryMeta(skillCategory.category, index);

              return (
                <div
                  key={skillCategory.category}
                  className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start group"
                >
                  {/* Category Column */}
                  <div className="md:col-span-4 lg:col-span-4 flex items-start gap-3">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary/70 border border-border text-primary shrink-0 select-none mt-0.5"
                      aria-hidden="true"
                    >
                      <CategoryIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors leading-snug">
                        {skillCategory.category}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground mt-0.5 block">
                        {skillCategory.skills.length} technologies
                      </span>
                    </div>
                  </div>

                  {/* Technologies Column - Pure Name and Restrained Icon Presentation */}
                  <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2.5 sm:gap-y-3.5">
                    {skillCategory.skills.map((skill) => {
                      const { Icon } = getSkillMeta(skill.name);
                      return (
                        <div
                          key={skill.name}
                          data-skill-name={skill.name}
                          className="flex items-center gap-2 sm:gap-3 group/skill py-1 select-none min-w-0"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground group-hover/skill:text-primary transition-colors shrink-0" />
                          <span className="text-xs sm:text-base font-medium text-foreground group-hover/skill:text-primary transition-colors truncate">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
