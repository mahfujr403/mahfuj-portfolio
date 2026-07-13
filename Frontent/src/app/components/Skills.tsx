import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchSkills } from "../../services/skillsApi";

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchSkills().then((res) => { if (mounted) setSkills(res ?? []); }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  return (
    <section id="skills" className="py-32 relative">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillCategory, index) => (
            <motion.div
              key={skillCategory.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-5 gradient-text-alt">
                {skillCategory.category}
              </h3>
              <div className="space-y-3">
                {skillCategory.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-300 font-medium group-hover:text-[#00f2fe] transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-xs font-bold gradient-text">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                      {/* Background glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/20 to-[#8b5cf6]/20 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 + skillIndex * 0.05 + 0.2 }}
                      />
                      {/* Main bar */}
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] rounded-full relative"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: index * 0.1 + skillIndex * 0.05 + 0.2,
                          ease: "easeOut"
                        }}
                        style={{
                          boxShadow: "0 0 10px rgba(0, 242, 254, 0.5)",
                        }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
