import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import PublicationCard from "../components/PublicationCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { usePublications } from "../hooks/usePublications";

export default function AllPublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [sortBy, setSortBy] = useState("year-desc");
  const { data: publications } = usePublications(200, 0);

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/#publications" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f2fe] transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="mb-4 gradient-text">All Publications</h1>
          <p className="text-xl text-gray-400">
            Research contributions in machine learning, deep learning, and AI ({publications.length} publications)
          </p>
        </div>

        <div className="glass border border-white/10 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
              />
            </div>

            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="bg-black/30 border-white/10 text-gray-100">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Filter by domain" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#0f172a] border-white/10">
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain} className="text-gray-300 focus:bg-white/10 focus:text-[#00f2fe]">
                    {domain === "all" ? "All Domains" : domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-black/30 border-white/10 text-gray-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f172a] border-white/10">
                <SelectItem value="year-desc" className="text-gray-300 focus:bg-white/10 focus:text-[#00f2fe]">Year (Newest First)</SelectItem>
                <SelectItem value="year-asc" className="text-gray-300 focus:bg-white/10 focus:text-[#00f2fe]">Year (Oldest First)</SelectItem>
                <SelectItem value="title" className="text-gray-300 focus:bg-white/10 focus:text-[#00f2fe]">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <p>
              Showing {filteredAndSortedPublications.length} of {publications.length} publications
            </p>
            {(searchQuery || filterDomain !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterDomain("all");
                }}
                className="text-gray-300 hover:text-[#00f2fe] font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredAndSortedPublications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No publications found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedPublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
