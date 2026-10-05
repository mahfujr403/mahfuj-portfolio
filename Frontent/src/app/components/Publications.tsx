import PublicationCard from "../components/PublicationCard";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listPublications } from "../../services/publicationsApi";
import { Link } from "react-router";

export default function Publications({ publications: propPublications }: { publications?: any[] }) {
  const queryClient = useQueryClient();
  const { data: hookPublications = [], isLoading } = useQuery({
    queryKey: ["publications", 3, 0],
    queryFn: () => listPublications(3, 0),
    enabled: !propPublications,
  });

  const featuredPublications = propPublications ?? hookPublications;
  const showSkeleton = isLoading && !propPublications;

  return (
    <section id="publications" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-primary uppercase tracking-wider mb-3">
            <BookOpen size={13} />
            Academic Research
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
            Peer-Reviewed Publications
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Scientific contributions in deep learning, medical imaging oncology, and computer vision published in indexed international venues.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl mb-12">
          <div className="flex flex-col divide-y divide-border/80 rounded-xl overflow-hidden bg-card border border-border shadow-xs">
            {showSkeleton
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="p-6 space-y-3 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-2/3 bg-secondary/70 rounded-lg" />
                      <div className="h-5 w-20 bg-secondary/50 rounded-full" />
                    </div>
                    <div className="h-4 w-1/3 bg-secondary/40 rounded" />
                    <div className="h-4 w-5/6 bg-secondary/40 rounded" />
                  </div>
                ))
              : featuredPublications.map((publication) => (
                  <PublicationCard key={publication.id} publication={publication} compact />
                ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/publications"
            onMouseEnter={() => {
              queryClient.prefetchQuery({
                queryKey: ["publications", 200, 0],
                queryFn: () => listPublications(200, 0),
                staleTime: 5 * 60 * 1000,
              });
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Browse Complete Index (9 Publications)</span>
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
