import { Badge } from "./ui/badge";
import { Award, Image as ImageIcon, FileText, Trophy, X, Calendar, Building2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { listAchievements } from "../../services/achievementsApi";

export default function Achievements({ achievements: propAchievements }: { achievements?: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  const { data: hookAchievements = [], isLoading } = useQuery({
    queryKey: ["achievements", 2, 0],
    queryFn: () => listAchievements(2, 0),
    enabled: !propAchievements,
  });
  const visibleAchievements = propAchievements ?? hookAchievements;
  const isSingleAchievement = visibleAchievements.length === 1;
  const showSkeleton = isLoading && !propAchievements;

  return (
    <>
      <section id="achievements" className="py-20 lg:py-28 relative">
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
              <Trophy size={13} className="text-amber-400" />
              Honors & Recognition
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
              Achievements & Awards
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Recognition for algorithmic excellence, competitive programming, and applied machine learning research.
            </p>
          </motion.div>

          {/* Featured Achievements Grid */}
          {showSkeleton ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 rounded-xl border border-border bg-card p-6 space-y-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-1/2 bg-secondary/70 rounded" />
                    <div className="h-6 w-16 bg-secondary/50 rounded" />
                  </div>
                  <div className="h-4 w-1/3 bg-secondary/40 rounded" />
                  <div className="h-16 w-full bg-secondary/40 rounded" />
                </div>
              ))}
            </div>
          ) : visibleAchievements.length > 0 ? (
            <div className={isSingleAchievement ? "mx-auto grid grid-cols-1 max-w-4xl gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
              {visibleAchievements.map((achievement, index) => {
                return (
                  <motion.button
                    key={achievement.id}
                    type="button"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelected(achievement)}
                    className="text-left relative group cursor-pointer h-full"
                  >
                    <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-7 group-hover:border-primary/50 transition-all duration-200 shadow-xs">
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <Badge variant="amber" className="text-xs">
                            {achievement.category}
                          </Badge>
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <Trophy size={17} className="text-amber-400" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold font-display text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                          {achievement.title}
                        </h3>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-primary" />
                            {achievement.organization}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-primary" />
                            {achievement.year}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3 mb-4 text-left">
                          {achievement.description}
                        </p>
                      </div>

                      {/* Attachments & Action bar */}
                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/60">
                        {achievement.certificate_url && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                            <FileText size={11} />
                            Certificate Available
                          </span>
                        )}
                        {achievement.event_image_url && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground px-2.5 py-1 rounded-md bg-secondary border border-border">
                            <ImageIcon size={11} />
                            Event Photo
                          </span>
                        )}
                        <span className="ml-auto text-xs font-medium text-primary group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-popover rounded-xl border border-border p-6 sm:p-7 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-4 mb-5 pr-8">
                <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Award size={20} className="text-amber-400" />
                </div>
                <div>
                  <Badge variant="amber" className="text-xs mb-1.5">
                    {selected.category}
                  </Badge>
                  <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                    {selected.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={13} className="text-primary" />
                      {selected.organization}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      {selected.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 pt-3 border-t border-border/60">
                {selected.description}
              </p>

              {/* Certificate */}
              {selected.certificate_url && (
                <div className="mb-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold flex items-center gap-1.5">
                      <FileText size={13} className="text-primary" />
                      Official Certificate
                    </span>
                    <a
                      href={selected.certificate_url.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                    >
                      <ExternalLink size={12} />
                      Open Full Screen
                    </a>
                  </div>

                  <motion.img
                    src={selected.certificate_url.trim()}
                    alt={`${selected.title} Certificate`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => window.open(selected.certificate_url.trim(), "_blank")}
                    className="w-full max-h-[600px] object-contain rounded-lg border border-border bg-background cursor-zoom-in"
                  />
                </div>
              )}

              {/* Event Photo */}
              {selected.event_image_url && (
                <div className="mb-5">
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={selected.event_image_url.trim()}
                      alt={selected.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
