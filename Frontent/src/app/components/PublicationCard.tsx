import { useState } from "react";
import { Link } from "react-router";
import { ExternalLink, ArrowRight, BookOpen, Star, Quote, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { normalizePublication, getPublicationBySlug } from "../../services/publicationsApi";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface PublicationCardProps {
  publication: any;
  compact?: boolean;
}

function getBibtexString(data: any): string {
  const authorList = Array.isArray(data.authors) && data.authors.length > 0
    ? data.authors.join(" and ")
    : "Rahman, Md. Mahfujur and others";
  const citeKey = `rahman${data.year || "2024"}${data.slug ? data.slug.split("-")[0] : "research"}`;
  
  return `@article{${citeKey},
  title = {${data.title || "Research Publication"}},
  author = {${authorList}},
  journal = {${data.venue || data.publisher || "Peer-Reviewed Publication"}},
  year = {${data.year || "2024"}}${data.doiUrl ? `,\n  doi = {${data.doiUrl.replace("https://doi.org/", "")}}` : ""}${data.paperUrl ? `,\n  url = {${data.paperUrl}}` : ""}
}`;
}

function getApaString(data: any): string {
  const authorList = Array.isArray(data.authors) && data.authors.length > 0
    ? data.authors.join(", ")
    : "Rahman, M. M., et al.";
  return `${authorList} (${data.year || "2024"}). ${data.title}. ${data.venue || data.publisher || "Peer-Reviewed Publication"}.${data.doiUrl ? ` ${data.doiUrl}` : ""}`;
}

export default function PublicationCard({ publication, compact = false }: PublicationCardProps) {
  const queryClient = useQueryClient();
  const data = normalizePublication(publication);
  const keyResults = Array.isArray(data.keyResults) ? data.keyResults : [];

  const [isCiteOpen, setIsCiteOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<"bibtex" | "apa" | null>(null);

  const handleCopy = async (text: string, type: "bibtex" | "apa") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      toast.success(type === "bibtex" ? "BibTeX citation copied to clipboard" : "APA citation copied to clipboard");
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      toast.error("Failed to copy citation");
    }
  };

  const prefetchPublication = () => {
    if (data?.slug) {
      queryClient.prefetchQuery({
        queryKey: ["publication", data.slug],
        queryFn: () => getPublicationBySlug(data.slug),
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const renderCiteDialog = () => (
    <Dialog open={isCiteOpen} onOpenChange={setIsCiteOpen}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-xl max-h-[85vh] overflow-y-auto overflow-x-hidden bg-popover border border-border text-foreground p-5 sm:p-6 rounded-xl shadow-2xl">
        <DialogHeader className="w-full min-w-0 text-left">
          <DialogTitle className="flex items-center gap-2 font-display text-base sm:text-lg text-foreground">
            <Quote size={17} className="text-primary shrink-0" />
            <span>Academic Citation Export</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs mt-1">
            Reference this work in standard BibTeX or APA formats
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 w-full min-w-0">
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">APA Format</span>
              <button
                type="button"
                onClick={() => handleCopy(getApaString(data), "apa")}
                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline cursor-pointer shrink-0"
              >
                {copiedType === "apa" ? <Check size={12} /> : <Copy size={12} />}
                {copiedType === "apa" ? "Copied" : "Copy APA"}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border text-xs text-foreground leading-relaxed font-sans select-all w-full min-w-0 break-words [overflow-wrap:anywhere]">
              {getApaString(data)}
            </div>
          </div>

          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">BibTeX Format</span>
              <button
                type="button"
                onClick={() => handleCopy(getBibtexString(data), "bibtex")}
                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline cursor-pointer shrink-0"
              >
                {copiedType === "bibtex" ? <Check size={12} /> : <Copy size={12} />}
                {copiedType === "bibtex" ? "Copied" : "Copy BibTeX"}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-background border border-border text-[11px] font-mono text-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-w-full w-full min-w-0 select-all">
              {getBibtexString(data)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseEnter={prefetchPublication}
        className="relative group transition-colors duration-150"
      >
        <div className="relative px-5 sm:px-7 py-6 transition-all duration-200 hover:bg-secondary/20">
          {/* Subtle left indicator hairline */}
          <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:w-1 transition-all" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex-1 min-w-0 pl-2 sm:pl-3">
              {/* Badges metadata strip */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="indigo" className="text-[11px]">
                  {data.type}
                </Badge>
                <Badge variant="default" className="text-[11px]">
                  {data.domain}
                </Badge>
                <Badge variant="secondary" className="text-[11px]">
                  {data.publisher}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground ml-auto sm:ml-0 flex items-center gap-1">
                  <Star size={11} className="text-amber-400" fill="currentColor" />
                  {data.year}
                </span>
              </div>

              {/* Title */}
              <Link to={`/publications/${data.slug}`} state={{ publication: data }}>
                <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary mb-2 transition-colors whitespace-normal break-words leading-snug">
                  {data.title}
                </h3>
              </Link>

              {/* Venue */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 font-medium">
                <BookOpen size={14} className="text-primary shrink-0" />
                <span className="truncate">{data.venue}</span>
              </div>

              {/* Contribution summary without justify rivers */}
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 max-w-4xl text-left line-clamp-3">
                {data.contributionSummary}
              </p>

              {/* Key Results */}
              {keyResults.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keyResults.slice(0, 2).map((result, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[11px]">
                      {result}
                    </Badge>
                  ))}
                  {keyResults.length > 2 && (
                    <Badge variant="default" className="text-[11px]">
                      +{keyResults.length - 2} more results
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Right action / DOI column */}
            <div className="flex flex-col gap-3 lg:min-w-[240px] lg:items-end pl-2 sm:pl-3 lg:pl-0">
              {data.doiUrl && (
                <div className="w-full lg:text-right rounded-lg border border-border/80 bg-secondary/40 px-3 py-2">
                  <p className="text-xs font-mono text-muted-foreground break-all leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-primary mr-1.5">DOI</span>
                    <span>{data.doiUrl}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-wrap lg:justify-end gap-2 items-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsCiteOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-foreground text-xs font-medium hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                >
                  <Quote size={12} className="text-primary" />
                  <span>Cite</span>
                </button>

                {data.paperUrl && (
                  <a
                    href={data.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/25 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
                  >
                    <ExternalLink size={12} />
                    <span>Paper</span>
                  </a>
                )}

                <Link
                  to={`/publications/${data.slug}`}
                  state={{ publication: data }}
                  onMouseEnter={prefetchPublication}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all group/link"
                >
                  <span>Details</span>
                  <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {renderCiteDialog()}
      </motion.div>
    );
  }

  /* Grid Card Layout (Used on AllPublicationsPage) */
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onMouseEnter={prefetchPublication}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col group"
    >
      <div className="relative h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border group-hover:border-primary/50 transition-all duration-200 shadow-xs flex-1 justify-between p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="indigo" className="text-[11px]">
              {data.type}
            </Badge>
            <Badge variant="default" className="text-[11px]">
              {data.domain}
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              {data.publisher}
            </Badge>
            <div className="ml-auto flex items-center gap-1 text-amber-400 font-mono text-xs">
              <Star size={11} fill="currentColor" />
              <span>{data.year}</span>
            </div>
          </div>

          <Link to={`/publications/${data.slug}`} state={{ publication: data }}>
            <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary mb-2.5 transition-colors line-clamp-2 leading-snug">
              {data.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 font-medium">
            <BookOpen size={14} className="text-primary shrink-0" />
            <span className="truncate">{data.venue}</span>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 text-left line-clamp-3">
            {data.contributionSummary}
          </p>

          {keyResults.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {keyResults.slice(0, 2).map((result, idx) => (
                <Badge key={idx} variant="secondary" className="text-[11px]">
                  {result}
                </Badge>
              ))}
              {keyResults.length > 2 && (
                <Badge variant="default" className="text-[11px]">
                  +{keyResults.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCiteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-foreground text-xs font-medium hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <Quote size={12} className="text-primary" />
            <span>Cite</span>
          </button>

          {data.paperUrl && (
            <a
              href={data.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/25 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
            >
              <ExternalLink size={12} />
              <span>Paper</span>
            </a>
          )}

          <Link
            to={`/publications/${data.slug}`}
            state={{ publication: data }}
            onMouseEnter={prefetchPublication}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all ml-auto group/link"
          >
            <span>Details</span>
            <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
      {renderCiteDialog()}
    </motion.div>
  );
}
