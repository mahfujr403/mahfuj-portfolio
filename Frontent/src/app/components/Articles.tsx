import { Badge } from "./ui/badge";
import { Clock, ArrowUpRight, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import type { Blog } from "../../types/blog";
import { fetchArticles } from "../../services/articlesApi";

const platformColor: Record<string, { bg: string; text: string; border: string }> = {
  "Medium": { bg: "bg-[#00f2fe]/10", text: "text-[#00f2fe]", border: "border-[#00f2fe]/20" },
  "Towards Data Science": { bg: "bg-[#8b5cf6]/10", text: "text-[#a78bfa]", border: "border-[#8b5cf6]/20" },
  "Dev.to": { bg: "bg-[#ec4899]/10", text: "text-[#ec4899]", border: "border-[#ec4899]/20" },
};

function getPlatformStyle(platform: string) {
  return platformColor[platform] ?? { bg: "bg-white/5", text: "text-gray-400", border: "border-white/10" };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Articles() {
  const [list, setList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchArticles()
      .then((res) => {
        if (mounted) setList(res ?? []);
      })
      .catch(() => {
        setList([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="articles" className="py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Technical Writing</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Sharing knowledge and insights about machine learning, deployment, and best practices
          </p>
        </motion.div>

        {/* List */}
        <div className="relative">
          {/* Left accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f2fe]/40 via-[#8b5cf6]/40 to-[#ec4899]/40 hidden md:block" />

          <div className="flex flex-col divide-y divide-white/5">
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading articles...</div>
            ) : (
              list.map((article, index) => {
                const platform = (article as any).platform ?? article.category ?? "Blog";
                const ps = getPlatformStyle(platform as string);
                return (
                  <Link
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="group relative md:pl-8 py-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-white/[0.02] rounded-xl transition-colors duration-200 cursor-pointer"
                    >
                      {/* Dot on timeline */}
                      <div className="absolute left-0 top-8 w-2 h-2 rounded-full bg-gradient-to-br from-[#00f2fe] to-[#8b5cf6] hidden md:block -translate-x-[3px] group-hover:scale-150 transition-transform duration-200" />

                      {/* Index number */}
                      <div className="shrink-0 w-8 text-right hidden sm:block">
                        <span className="text-xs text-gray-600 group-hover:text-[#00f2fe] transition-colors font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        {/* Top row: platform badge + meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={`${ps.bg} ${ps.text} ${ps.border} text-xs shrink-0`}>
                            <PenLine size={10} className="mr-1" />
                            {article.platform}
                          </Badge>
                          <span className="text-xs text-gray-600">{formatDate(article.publishedDate)}</span>
                          {article.readTime && (
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock size={11} />
                              {article.readTime}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-gray-100 group-hover:text-[#00f2fe] transition-colors duration-200 leading-snug mb-1.5 line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                          {article.summary}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-600 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] group-hover:border-white/10 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right arrow */}
                      <div className="shrink-0 self-center sm:self-start sm:mt-1.5">
                        <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-600 group-hover:border-[#00f2fe]/40 group-hover:text-[#00f2fe] group-hover:bg-[#00f2fe]/5 transition-all duration-200">
                          <ArrowUpRight size={15} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
