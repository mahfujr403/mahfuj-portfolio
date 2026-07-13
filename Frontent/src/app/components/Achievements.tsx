import { Badge } from "./ui/badge";
import { Award, Image, FileText, Trophy, X, ExternalLink, Calendar, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { listAchievements } from "../../services/achievementsApi";

export default function Achievements() {
  const [selected, setSelected] = useState<any | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const visibleAchievements = achievements.slice(0, 2);
  const isSingleAchievement = visibleAchievements.length === 1;

  useEffect(() => {
    let mounted = true;
    listAchievements(50, 0).then((res) => {
      if (mounted) setAchievements(res ?? []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);


  return (
    <>
      <section id="achievements" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Achievements & Awards</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Recognition for technical excellence, research contributions, and competitive programming
            </p>
          </motion.div>

          {/* Featured achievements */}
          {visibleAchievements.length > 0 ? (
            <div className={isSingleAchievement ? "mx-auto grid grid-cols-1 max-w-4xl gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
              {visibleAchievements.map((achievement, index) => {
                return (
                  <motion.button
                    key={achievement.id}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                    onClick={() => setSelected(achievement)}
                    className="text-left relative group cursor-pointer h-full"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ec4899]/20 via-[#8b5cf6]/15 to-[#00f2fe]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

                    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 glass group-hover:border-[#ec4899]/35 transition-all duration-300">
                      <div className="h-1 w-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#00f2fe] opacity-70" />

                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <Badge className="bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20 shrink-0">
                            {achievement.category}
                          </Badge>
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 to-[#8b5cf6]/20 border border-white/10 flex items-center justify-center shrink-0">
                            <Trophy size={18} className="text-[#00f2fe]" />
                          </div>
                        </div>

                        <h3 className="font-bold gradient-text mb-3 leading-snug text-xl sm:text-2xl">
                          {achievement.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-[#8b5cf6]" />
                            {achievement.organization}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#00f2fe]" />
                            {achievement.year}
                          </span>
                        </div>

                        <div className="grid gap-4">
                          <p className="text-gray-300 leading-relaxed text-sm sm:text-[15px]">
                            {achievement.description}
                          </p>

                          {(achievement.certificate_url || achievement.event_image_url) && (
                            <div className="space-y-3">
                              {achievement.event_image_url && (
                                <div className="overflow-hidden rounded-2xl border border-white/10">
                                  <img
                                    src={achievement.event_image_url}
                                    alt={achievement.title}
                                    className="h-40 sm:h-44 w-full object-cover"
                                  />
                                </div>
                              )}

                              {achievement.certificate_url && (
                                <div className="rounded-2xl border border-[#00f2fe]/15 bg-[#00f2fe]/5 p-4 flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00f2fe]/20 to-[#8b5cf6]/20 border border-[#00f2fe]/20 flex items-center justify-center shrink-0">
                                    <FileText size={18} className="text-[#00f2fe]" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-200">Certificate available</p>
                                    <p className="text-xs text-gray-500">Tap to view the full details</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/5">
                          {achievement.certificate_url && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500 px-2.5 py-1 rounded-lg bg-[#00f2fe]/5 border border-[#00f2fe]/15">
                              <FileText size={12} className="text-[#00f2fe]" />
                              Certificate
                            </span>
                          )}
                          {achievement.event_image_url && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500 px-2.5 py-1 rounded-lg bg-[#8b5cf6]/5 border border-[#8b5cf6]/15">
                              <Image size={12} className="text-[#8b5cf6]" />
                              Event Photo
                            </span>
                          )}
                          <span className="ml-auto text-xs text-gray-600 group-hover:text-[#ec4899] transition-colors">
                            Click to view →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 glass p-8 text-center text-gray-400">
              No achievements available right now.
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl border border-white/15 shadow-2xl shadow-black/60"
            >
              {/* Gradient top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#00f2fe]" />

              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg glass border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <X size={16} />
              </button>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-5 pr-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ec4899]/20 to-[#8b5cf6]/20 border border-white/10 flex items-center justify-center shrink-0">
                    <Award size={22} className="text-[#ec4899]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20 text-xs">
                        {selected.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold gradient-text leading-snug">{selected.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Building2 size={13} className="text-[#8b5cf6]" />
                        {selected.organization}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar size={13} className="text-[#00f2fe]" />
                        {selected.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">{selected.description}</p>

              

                {/* Certificate */}
                {selected.certificate_url && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={14} className="text-[#00f2fe]" />
                      <span className="text-sm font-semibold text-gray-300">
                        Certificate
                      </span>
                    </div>

                    <motion.img
                      src={selected.certificate_url.trim()}
                      alt={`${selected.title} Certificate`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open(selected.certificate_url.trim(), "_blank")}
                      className="w-full max-h-[700px] object-contain rounded-xl border border-white/10 bg-[#050814] cursor-zoom-in"
                    />
                  </div>
                )}

                  {/* Event Photo */}
                {selected.event_image_url && (
                  <div className="mb-5">
                    {/* <div className="flex items-center gap-2 mb-3">
                      <Image size={14} className="text-[#8b5cf6]" />
                      <span className="text-sm font-semibold text-gray-300">Event Photo</span>
                    </div> */}
                    <div className="rounded-xl overflow-hidden border border-white/10 relative group/img">
                      <img
                        src={selected.event_image_url.trim()}
                        alt={selected.title}
                        className="w-full h-56 object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/60 to-transparent" />
                    </div>
                  </div>
                )}

                {/* No attachments fallback */}
                {!selected.certificate_url && !selected.event_image_url && (
                  <div className="glass rounded-xl p-6 border border-white/10 text-center">
                    <Trophy size={32} className="mx-auto mb-2 text-[#00f2fe] opacity-60" />
                    <p className="text-gray-500 text-sm">No attachments available for this achievement.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
