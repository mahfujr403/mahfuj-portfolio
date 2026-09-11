import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../../services/skillsApi";
import { getSkillMeta } from "./skillIcons";
import { getCategoryMeta } from "./categoryIcons";

export default function Skills() {
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Marquee keyframes, scoped to this section via unique class names.
          Pausing on hover is handled with a plain CSS animation (not a
          Framer Motion tween) so the strip freezes in place instead of
          snapping back to its start position. */}
      <style>{`
        @keyframes skills-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.3333%); }
        }
        .skills-marquee-track {
          animation-name: skills-marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .skills-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Skills & Technologies</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Technical expertise across the full ML lifecycle from research to production deployment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skills.map((skillCategory, index) => {
            const { Icon: CategoryIcon, accent } = getCategoryMeta(skillCategory.category, index);
            const duration = Math.max(18, skillCategory.skills.length * 4);

            return (
              <motion.div
                key={skillCategory.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative"
              >
                {/* Ambient hover glow behind the card */}
                <div
                  className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${accent[0]}40, ${accent[1]}30)`,
                  }}
                />

                <div className="relative overflow-hidden rounded-3xl border border-white/10 glass group-hover:border-white/20 transition-colors duration-300">
                  {/* Top accent bar */}
                  <div
                    className="h-[3px] w-full opacity-80"
                    style={{ background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})` }}
                  />

                  {/* Soft corner glow inside the card */}
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-[0.15]"
                    style={{ background: accent[0] }}
                  />

                  <div className="relative p-6 sm:p-8">
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
                        style={{
                          backgroundColor: `${accent[0]}1A`,
                          boxShadow: `inset 0 0 0 1px ${accent[0]}40`,
                        }}
                      >
                        <CategoryIcon className="w-5 h-5" style={{ color: accent[0] }} />
                      </span>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {skillCategory.category}
                      </h3>
                    </div>

                    {/* Two independently-looping marquee rows, scrolling in
                        opposite directions for a layered, "showcase" feel.
                        Each row plays the full skill list in its original
                        order (skill1 → skill2 → ... → skill1 → skill2 ...)
                        repeated 3x, so the loop always has enough content to
                        fill the row and never shows a blank gap. */}
                    <div className="space-y-3">
                      {[0, 1].map((rowIndex) => {
                        const reverse = rowIndex === 1;

                        return (
                          <div
                            key={rowIndex}
                            className="relative overflow-hidden -mx-6 sm:-mx-8 px-6 sm:px-8 py-1"
                            style={{
                              maskImage:
                                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                              WebkitMaskImage:
                                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                            }}
                          >
                            <div
                              className="skills-marquee-track flex w-max gap-3 group-hover:[animation-play-state:paused]"
                              style={{
                                animationDuration: `${duration}s`,
                                animationDirection: reverse ? "reverse" : "normal",
                              }}
                            >
                              {[...skillCategory.skills, ...skillCategory.skills, ...skillCategory.skills].map(
                                (skill, skillIndex) => {
                                  const { Icon, color } = getSkillMeta(skill.name);
                                  return (
                                    <div
                                      key={`${skill.name}-${skillIndex}`}
                                      className="shrink-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm pl-2.5 pr-5 py-2.5 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-0.5"
                                      style={{ boxShadow: "0 1px 0 0 rgba(255,255,255,0.04) inset" }}
                                    >
                                      <span
                                        className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                                        style={{
                                          backgroundColor: `${color}1A`,
                                          boxShadow: `inset 0 0 0 1px ${color}40, 0 4px 14px -6px ${color}66`,
                                        }}
                                      >
                                        <Icon className="w-[18px] h-[18px]" style={{ color }} />
                                      </span>
                                      <span className="text-sm font-semibold text-gray-100 whitespace-nowrap">
                                        {skill.name}
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
