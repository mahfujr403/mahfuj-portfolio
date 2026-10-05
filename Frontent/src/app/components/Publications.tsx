import PublicationCard from "./PublicationCard";
import { ArrowRight } from "lucide-react";
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
    <section id="publications" className="py-20 lg:py-28 border-b border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Editorial Section Header */}
        <div className="mb-12 lg:mb-16 text-left">
          {/* Section Index Marker */}
          <div className="flex items-center gap-2 mb-4 select-none" aria-hidden="true">
            <span className="text-xs font-mono tracking-widest text-primary font-semibold">03</span>
            <span className="text-xs text-border-active">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Publications</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight leading-[1.15] mb-4">
            Publications
          </h2>

          {/* Factual Context - Unmodified Existing Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Scientific contributions in deep learning, medical imaging oncology, and computer vision published in indexed international venues.
          </p>
        </div>

        {/* Publication Research Ledger */}
        <div className="max-w-5xl mx-auto mb-12">
          {showSkeleton ? (
            <div className="border-t border-border/70 divide-y divide-border/60">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-7 sm:py-8 space-y-3.5 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-secondary/60 rounded" />
                    <div className="h-4 w-24 bg-secondary/40 rounded" />
                    <div className="h-4 w-16 bg-secondary/40 rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-secondary/70 rounded" />
                  <div className="h-4 w-1/2 bg-secondary/40 rounded" />
                  <div className="h-4 w-full bg-secondary/30 rounded" />
                  <div className="flex justify-between items-center pt-3 border-t border-border/40">
                    <div className="h-4 w-44 bg-secondary/40 rounded" />
                    <div className="flex gap-2">
                      <div className="h-7 w-16 bg-secondary/50 rounded-md" />
                      <div className="h-7 w-20 bg-secondary/50 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-t border-border/70 divide-y divide-border/60">
              {featuredPublications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} compact />
              ))}
            </div>
          )}
        </div>

        {/* Index Navigation Link */}
        <div className="text-center mt-12 sm:mt-14">
          <Link
            to="/publications"
            onMouseEnter={() => {
              queryClient.prefetchQuery({
                queryKey: ["publications", 200, 0],
                queryFn: () => listPublications(200, 0),
                staleTime: 5 * 60 * 1000,
              });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-foreground border border-border text-xs sm:text-sm font-medium rounded-md hover:bg-secondary/80 hover:border-border-active transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
          >
            <span>Browse Complete Index (9 Publications)</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

