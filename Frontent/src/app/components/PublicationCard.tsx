import { Link } from "react-router";
import { ExternalLink, ArrowRight, BookOpen, Star, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { normalizePublication } from "../../services/publicationsApi";

interface PublicationCardProps {
  publication: any;
  compact?: boolean;
}

export default function PublicationCard({ publication, compact = false }: PublicationCardProps) {
  const data = normalizePublication(publication);
  const keyResults = Array.isArray(data.keyResults) ? data.keyResults : [];

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="relative group"
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-80" />

        <div className="relative px-6 py-6 border-b border-white/10 last:border-b-0 transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8b5cf6]/10 via-[#00f2fe]/5 to-[#ec4899]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-[#00f2fe]/70 via-[#8b5cf6]/70 to-[#ec4899]/70 opacity-60" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex-1 min-w-0 pl-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/20">
                  {data.type}
                </Badge>
                <Badge className="bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20">
                  {data.domain}
                </Badge>
                <Badge className="bg-white/5 text-gray-300 border-white/10">
                  {data.publisher}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  {data.year}
                </span>
              </div>

              <h3 className="text-xl font-bold gradient-text mb-3 group-hover:scale-[1.01] transition-transform whitespace-normal break-words leading-snug">
                {data.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-3">
                <BookOpen size={14} className="text-[#8b5cf6]" />
                <span className="font-medium text-gray-300">{data.venue}</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-4xl">
                {data.contributionSummary}
              </p>

              {keyResults.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keyResults.slice(0, 2).map((result, idx) => (
                    <Badge key={idx} className="bg-white/5 text-gray-400 border-white/10 text-xs">
                      {result}
                    </Badge>
                  ))}
                  {keyResults.length > 2 && (
                    <Badge className="bg-[#00f2fe]/5 text-[#00f2fe] border-[#00f2fe]/10 text-xs">
                      +{keyResults.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[260px] lg:items-end">
              {data.doiUrl && (
                <div className="w-full lg:text-right rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm text-gray-300 break-all leading-relaxed">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mr-2 align-middle">DOI</span>
                    <span className="align-middle">{data.doiUrl}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-wrap lg:justify-end gap-2">
                {data.paperUrl && (
                  <a
                    href={data.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#00f2fe]/25 bg-[#00f2fe]/10 text-[#00f2fe] text-sm font-medium hover:bg-[#00f2fe]/15 hover:border-[#00f2fe]/40 transition-all"
                  >
                    <ExternalLink size={14} />
                    Read Paper
                  </a>
                )}

                <Link
                  to={`/publications/${data.slug}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-gray-200 text-sm font-medium hover:border-[#8b5cf6]/50 hover:text-white transition-all"
                >
                  Details
                  <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col relative group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/20 via-[#00f2fe]/20 to-[#ec4899]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

      <div className="relative h-full flex flex-col glass rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#8b5cf6]/40 transition-all duration-300">
        <div className="relative p-6 pb-4 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8b5cf6]/15 to-transparent rounded-bl-full opacity-50" />

          <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
            <Badge className="bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/20">
              {data.type}
            </Badge>
            <Badge className="bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20">
              {data.domain}
            </Badge>
            <Badge className="bg-white/5 text-gray-300 border-white/10">
              {data.publisher}
            </Badge>
            <div className="ml-auto flex items-center gap-1 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-semibold">{data.year}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold gradient-text mb-3 group-hover:scale-[1.02] transition-transform relative z-10 whitespace-normal break-words leading-snug">
            {data.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-400 relative z-10">
            <BookOpen size={14} className="text-[#8b5cf6]" />
            <span className="font-medium text-gray-300">{data.venue}</span>
          </div>
          <p className="text-xs text-gray-500 ml-6 mt-1">{data.publisher}</p>
        </div>

        <div className="p-6 pt-4 flex-1 flex flex-col">
          <div className="mb-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">Summary</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                {data.contributionSummary}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">Key Results</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="flex gap-2 overflow-hidden">
                {keyResults.slice(0, 2).map((result, idx) => (
                  <Badge key={idx} className="bg-white/5 text-gray-400 border-white/10 text-xs shrink-0">
                    {result}
                  </Badge>
                ))}
                {keyResults.length > 2 && (
                  <Badge className="bg-[#00f2fe]/5 text-[#00f2fe] border-[#00f2fe]/10 text-xs shrink-0">
                    +{keyResults.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            {data.doiUrl && (
              <a
                href={data.doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg hover:text-[#00f2fe] hover:border-[#00f2fe]/40 border border-white/10 transition-all text-xs w-fit"
              >
                <FileText size={14} />
                DOI
              </a>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-white/5">
            {data.paperUrl && (
              <motion.a
                href={data.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold rounded-lg transition-all text-sm shadow-lg shadow-[#8b5cf6]/20 shrink-0"
              >
                <ExternalLink size={16} />
                Read Paper
              </motion.a>
            )}

            <Link
              to={`/publications/${data.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/20 text-gray-300 rounded-lg hover:border-[#8b5cf6]/60 hover:text-white transition-all text-sm ml-auto shrink-0 group/link"
            >
              Details
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
