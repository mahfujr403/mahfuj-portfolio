import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import PublicationCard from "../components/PublicationCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Filter, ArrowLeft, BookOpen } from "lucide-react";
import { usePublications } from "../hooks/usePublications";

export default function AllPublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [sortBy, setSortBy] = useState("year-desc");
  const { data: publications, loading } = usePublications(200, 0);

  useEffect(() => {
    document.title = "Publications Index — Md. Mahfujur Rahman";
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  }, []);

  const domains = useMemo(() => {
    const uniqueDomains = Array.from(new Set(publications.map((p) => p.domain)));
    return ["all", ...uniqueDomains];
  }, [publications]);

  const filteredAndSortedPublications = useMemo(() => {
    let filtered = publications;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pub) =>
          pub.title.toLowerCase().includes(query) ||
          pub.venue.toLowerCase().includes(query) ||
          pub.contributionSummary.toLowerCase().includes(query)
      );
    }

    if (filterDomain !== "all") {
      filtered = filtered.filter((pub) => pub.domain === filterDomain);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "year-desc":
          return b.year - a.year;
        case "year-asc":
          return a.year - b.year;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [publications, searchQuery, filterDomain, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/#publications"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 mb-3 select-none" aria-hidden="true">
            <span className="text-xs font-mono tracking-widest text-primary font-semibold">ARCHIVE</span>
            <span className="text-xs text-border-active">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Publications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight mb-3">
            Complete Publications Index
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Full bibliography of scientific papers in deep learning, medical imaging oncology, and computer vision published in peer-reviewed journals and international conference proceedings.
          </p>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-[#111620] border border-border rounded-[10px] p-5 sm:p-6 mb-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={17} />
              <Input
                type="text"
                placeholder="Search by title, venue, or contribution keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="md:col-span-3">
              <Select value={filterDomain} onValueChange={setFilterDomain}>
                <SelectTrigger>
                  <div className="flex items-center gap-2 truncate">
                    <Filter size={14} className="text-primary shrink-0" />
                    <SelectValue placeholder="Domain" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain === "all" ? "All Research Domains" : domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year-desc">Year (Newest First)</SelectItem>
                  <SelectItem value="year-asc">Year (Oldest First)</SelectItem>
                  <SelectItem value="title">Title (Alphabetical)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <p>
              {loading && publications.length === 0
                ? "Indexing publications..."
                : `DISPLAYING ${filteredAndSortedPublications.length} OF ${publications.length} PAPERS`}
            </p>
            {(searchQuery || filterDomain !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterDomain("all");
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Publications List */}
        {loading && publications.length === 0 ? (
          <div className="w-full divide-y divide-border/60">
            {[1, 2, 3, 4, 5].map((i) => (
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
        ) : filteredAndSortedPublications.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-[10px] p-8">
            <p className="text-muted-foreground text-sm font-mono">No research papers match your current query.</p>
          </div>
        ) : (
          <div className="w-full divide-y divide-border/60">
            {filteredAndSortedPublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
