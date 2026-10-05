import { useState } from "react";
import { Link } from "react-router";
import { ExternalLink, ArrowRight, BookOpen, Quote, Copy, Check } from "lucide-react";
import { normalizePublication, getPublicationBySlug } from "../../services/publicationsApi";
import { useQueryClient } from "@tanstack/react-query";
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
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-xl max-h-[85vh] overflow-y-auto overflow-x-hidden bg-[#111620] border border-border text-foreground p-5 sm:p-6 rounded-[10px] shadow-2xl">
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
                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm"
              >
                {copiedType === "apa" ? <Check size={12} /> : <Copy size={12} />}
                {copiedType === "apa" ? "Copied" : "Copy APA"}
              </button>
            </div>
            <div className="p-3 rounded-md bg-[#0B0E14] border border-border text-xs text-foreground leading-relaxed font-sans select-all w-full min-w-0 break-words [overflow-wrap:anywhere]">
              {getApaString(data)}
            </div>
          </div>

          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">BibTeX Format</span>
              <button
                type="button"
                onClick={() => handleCopy(getBibtexString(data), "bibtex")}
                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm"
              >
                {copiedType === "bibtex" ? <Check size={12} /> : <Copy size={12} />}
                {copiedType === "bibtex" ? "Copied" : "Copy BibTeX"}
              </button>
            </div>
            <pre className="p-3 rounded-md bg-[#0B0E14] border border-border text-[11px] font-mono text-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-w-full w-full min-w-0 select-all">
              {getBibtexString(data)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // 1. Editorial Research Ledger Entry (Used in Publications.tsx)
  if (compact) {
    return (
      <article
        onMouseEnter={prefetchPublication}
        className="py-7 sm:py-8 transition-colors duration-150 group"
      >
        {/* Metadata Strip: Publication Type, Domain, Publisher, Year */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5 select-none">
          {data.type && (
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
              {data.type.trim()}
            </span>
          )}
          {data.domain && (
            <>
              <span className="text-xs text-border-active" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-muted-foreground">
                {data.domain}
              </span>
            </>
          )}
          {data.publisher && (
            <>
              <span className="text-xs text-border-active" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-muted-foreground">
                {data.publisher}
              </span>
            </>
          )}
          {data.year && (
            <>
              <span className="text-xs text-border-active" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-foreground font-semibold">
                {data.year}
              </span>
            </>
          )}
        </div>

        {/* Primary Title */}
        <Link
          to={`/publications/${data.slug}`}
          state={{ publication: data }}
          className="block group/title mb-2.5"
        >
          <h3 className="text-lg sm:text-xl font-bold font-display text-foreground group-hover/title:text-primary transition-colors leading-snug">
            {data.title}
          </h3>
        </Link>

        {/* Authors & Venue: 1 line with ellipsis on mobile, natural inline flow on desktop */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground mb-3">
          {data.authors && data.authors.length > 0 && (
            <span className="text-foreground/80 font-normal truncate block sm:inline max-w-full sm:max-w-none">
              {data.authors.join(", ")}
            </span>
          )}
          {data.venue && (
            <div className="flex items-center gap-2 min-w-0">
              {data.authors && data.authors.length > 0 && (
                <span className="text-border-active hidden sm:inline" aria-hidden="true">—</span>
              )}
              <span className="italic text-muted-foreground truncate">
                {data.venue}
              </span>
            </div>
          )}
        </div>

        {/* Contribution Summary */}
        {data.contributionSummary && data.contributionSummary !== "Summary unavailable" && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 max-w-4xl text-left line-clamp-3">
            {data.contributionSummary}
          </p>
        )}

        {/* Key Results Badges (if present) */}
        {keyResults.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {keyResults.map((result: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-[4px] border border-border bg-[#18202E] text-[11px] font-mono text-muted-foreground"
              >
                {result}
              </span>
            ))}
          </div>
        )}

        {/* Action & Identifier Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
          {/* DOI Identifier */}
          {data.doiUrl ? (
            <a
              href={data.doiUrl.startsWith("http") ? data.doiUrl : `https://doi.org/${data.doiUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm py-0.5"
            >
              <span className="text-[10px] uppercase font-semibold tracking-wider text-primary/80">DOI</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{data.doiUrl.replace("https://doi.org/", "")}</span>
              <ExternalLink size={11} className="shrink-0 text-muted-foreground/60" />
            </a>
          ) : (
            <div />
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={() => setIsCiteOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary text-foreground hover:bg-secondary/80 hover:border-border-active text-xs font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
            >
              <Quote size={12} className="text-primary" />
              <span>Cite</span>
            </button>

            {data.paperUrl && (
              <a
                href={data.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
              >
                <ExternalLink size={12} />
                <span>Paper</span>
              </a>
            )}

            <Link
              to={`/publications/${data.slug}`}
              state={{ publication: data }}
              onMouseEnter={prefetchPublication}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group/link py-1 select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm"
            >
              <span>View Details</span>
              <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {renderCiteDialog()}
      </article>
    );
  }

  // 2. Grid Card Layout (Used on AllPublicationsPage)
  return (
    <article
      onMouseEnter={prefetchPublication}
      className="h-full flex flex-col rounded-[10px] border border-border bg-[#111620] overflow-hidden transition-all duration-200 hover:border-border-active shadow-xs group"
    >
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata tags strip */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3 select-none">
            {data.type && (
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                {data.type.trim()}
              </span>
            )}
            {data.domain && (
              <>
                <span className="text-xs text-border-active" aria-hidden="true">·</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {data.domain}
                </span>
              </>
            )}
            {data.year && (
              <span className="ml-auto text-xs font-mono text-foreground font-semibold">
                {data.year}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/publications/${data.slug}`} state={{ publication: data }}>
            <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary mb-2 transition-colors line-clamp-2 leading-snug">
              {data.title}
            </h3>
          </Link>

          {/* Venue */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 font-medium">
            <BookOpen size={14} className="text-primary shrink-0" />
            <span className="truncate">{data.venue}</span>
          </div>

          {/* Summary narrative */}
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 text-left line-clamp-3">
            {data.contributionSummary}
          </p>

          {/* Key Results */}
          {keyResults.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {keyResults.slice(0, 2).map((result, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-[4px] border border-border bg-[#18202E] text-[11px] font-mono text-muted-foreground"
                >
                  {result}
                </span>
              ))}
              {keyResults.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] border border-border bg-[#18202E] text-[11px] font-mono text-muted-foreground">
                  +{keyResults.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-border/60 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCiteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 hover:border-border-active transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
          >
            <Quote size={12} className="text-primary" />
            <span>Cite</span>
          </button>

          {data.paperUrl && (
            <a
              href={data.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
            >
              <ExternalLink size={12} />
              <span>Paper</span>
            </a>
          )}

          <Link
            to={`/publications/${data.slug}`}
            state={{ publication: data }}
            onMouseEnter={prefetchPublication}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto group/link py-1 select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm"
          >
            <span>Details</span>
            <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
      {renderCiteDialog()}
    </article>
  );
}

