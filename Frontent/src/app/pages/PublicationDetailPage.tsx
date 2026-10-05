import DOMPurify from "dompurify";
import { useParams, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ExternalLink, ArrowLeft, ArrowRight, FileText, Database, Beaker, TrendingUp, Rocket, AlertCircle, Lightbulb, Award, Camera, Image as ImageIcon, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { usePublicationDetail } from "../hooks/usePublications";

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const routePublication = (location.state as any)?.publication;
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { publication, previousPublication, nextPublication, loading, error } = usePublicationDetail(slug, routePublication);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // ignore
    }
  }, [slug]);

  if (loading && !publication) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 w-36 bg-secondary/60 rounded-md mb-8" />
          <div className="bg-card border border-border rounded-xl p-8 mb-8 space-y-6">
            <div className="flex gap-2.5">
              <div className="h-6 w-24 bg-secondary/70 rounded-md" />
              <div className="h-6 w-32 bg-secondary/50 rounded-md" />
            </div>
            <div className="h-10 w-3/4 bg-secondary/60 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-14 bg-secondary/40 rounded-lg" />
              <div className="h-14 bg-secondary/40 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && (error || !publication)) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-card border border-border rounded-[10px]">
          <h1 className="text-2xl font-bold font-display text-foreground mb-3">Publication Not Found</h1>
          {error && <p className="text-sm font-mono text-muted-foreground mb-6">{error}</p>}
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm"
          >
            ← Return to Publications
          </Link>
        </div>
      </div>
    );
  }

  const publicationDomain = publication.domain || "Deep Learning & Vision";
  const authors: string[] = Array.isArray(publication.authors) ? publication.authors : [];
  const eventPhotos: string[] = Array.isArray(publication.eventPhotos) ? publication.eventPhotos : [];
  const experiments: string[] = Array.isArray(publication.experiments) ? publication.experiments : [];
  const challenges: string[] = Array.isArray(publication.challenges) ? publication.challenges : [];
  const insights: string[] = Array.isArray(publication.insights) ? publication.insights : [];
  const keyResults: string[] = Array.isArray(publication.keyResults) ? publication.keyResults : [];
  const resultsVisualization: any[] = Array.isArray(publication.resultsVisualization) ? publication.resultsVisualization : [];
  const datasets: any[] = Array.isArray(publication.datasets) ? publication.datasets : [];

  return (
    <>
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Publications</span>
          </Link>

          {/* Header Metadata Card */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <Badge variant="indigo" className="text-xs">
                {publication.type}
              </Badge>
              <Badge variant="default" className="text-xs">
                {publicationDomain}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">{publication.year}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-foreground tracking-tight mb-6 leading-tight">
              {publication.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-lg bg-secondary/40 border border-border">
                <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Indexed Venue</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BookOpen size={15} className="text-primary" />
                  <span>{publication.venue}</span>
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-secondary/40 border border-border">
                <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Publisher</p>
                <p className="text-sm font-semibold text-foreground">{publication.publisher}</p>
              </div>
              <div className="md:col-span-2 p-3.5 rounded-lg bg-secondary/40 border border-border">
                <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Research Authors</p>
                <p className="text-sm text-foreground">
                  {authors.length > 0 ? authors.join(", ") : "Md. Mahfujur Rahman et al."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {publication.paperUrl && (
                <a
                  href={publication.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold transition-all"
                >
                  <ExternalLink size={16} />
                  <span>Read Paper</span>
                </a>
              )}
              {publication.proofUrl && (
                <button
                  onClick={() => setIsProofModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary hover:border-border-active text-sm font-medium transition-all cursor-pointer"
                >
                  <Award size={16} className="text-amber-400" />
                  <span>View Acceptance Proof</span>
                </button>
              )}
            </div>
          </div>

          {/* Event Photos and Certificate Gallery */}
          {(eventPhotos.length > 0 || publication.certificateUrl) && (
            <Card className="bg-card border-border mb-8 shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground font-display text-base">
                  <Camera size={18} className="text-primary" />
                  <span>Conference & Acceptance Gallery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {eventPhotos.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
                        <Camera size={14} className="text-indigo-400" />
                        <span>Conference Presentation Photos ({eventPhotos.length})</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {eventPhotos.map((photo: string, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedImage(photo)}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all"
                          >
                            <img
                              src={photo}
                              alt={`Event photo ${idx + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                              <p className="text-foreground text-xs font-mono font-medium">Click to Enlarge</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {publication.certificateUrl && (
                    <div>
                      <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
                        <Award size={14} className="text-amber-400" />
                        <span>Official Certificate</span>
                      </h3>
                      <div
                        onClick={() => setSelectedImage(publication.certificateUrl!)}
                        className="relative group cursor-pointer overflow-hidden rounded-lg border border-border hover:border-amber-400/50 transition-all max-w-sm"
                      >
                        <img
                          src={publication.certificateUrl}
                          alt="Certificate"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <p className="text-foreground text-xs font-mono font-medium">View Full Certificate</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2-Column Technical Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* TL;DR */}
              {publication.tldr && (
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-foreground font-display text-lg">Executive Summary (TL;DR)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base text-left">
                      {publication.tldr}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Problem Statement */}
              {publication.problem && (
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                      <AlertCircle className="text-amber-400 size-5" />
                      <span>Research Problem & Motivation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base text-left">
                      {publication.problem}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Datasets */}
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                    <Database className="text-primary size-5" />
                    <span>Experimental Datasets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {datasets.length > 0 ? (
                    datasets.map((dataset: any, idx: number) => (
                      <div key={idx} className="bg-secondary/40 border border-border rounded-lg p-3.5 space-y-1 text-xs font-mono">
                        <div className="flex flex-wrap items-center gap-4">
                          <p className="text-foreground">
                            <span className="text-muted-foreground uppercase mr-1">Dataset:</span>
                            <span className="font-semibold text-primary">{dataset.name}</span>
                          </p>
                          <p className="text-foreground">
                            <span className="text-muted-foreground uppercase mr-1">Samples:</span>
                            <span>{dataset.size}</span>
                          </p>
                        </div>
                        <p className="text-muted-foreground pt-1">
                          <span className="uppercase mr-1">Source:</span>
                          <span>{dataset.source}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Dataset details described in paper text.</p>
                  )}
                </CardContent>
              </Card>

              {/* Methodology */}
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                    <Beaker className="text-indigo-400 size-5" />
                    <span>Methodological Framework</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed text-left">
                    {publication.methodology ?? "Detailed in primary manuscript."}
                  </p>
                  {publication.architecture && (
                    <div className="bg-background border border-border p-3.5 rounded-lg">
                      <p className="font-mono text-xs text-primary mb-1 uppercase tracking-wider">Model Architecture:</p>
                      <p className="font-mono text-xs text-foreground">{publication.architecture}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Experiments */}
              {experiments.length > 0 && (
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-foreground font-display text-lg">Experiments & Benchmark Setup</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      {experiments.map((exp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="leading-relaxed">{exp}</span>
                        </li>
                      ))}
                    </ul>
                    {publication.performanceAnalysis && (
                      <div className="pt-3 border-t border-border/60">
                        <p className="font-mono text-xs uppercase text-foreground mb-1">Performance Analysis:</p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {publication.performanceAnalysis}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Results Visualization */}
              {resultsVisualization.length > 0 && (
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                      <TrendingUp className="text-emerald-400 size-5" />
                      <span>Quantitative Evaluation Results</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resultsVisualization.map((viz: any, idx: number) => {
                      if (viz.type === "bar") {
                        const chartData = viz.data.labels.map((label: string, i: number) => ({
                          name: label,
                          value: viz.data.values[i],
                        }));
                        return (
                          <div key={idx} className="w-full pt-2">
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2633" />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: '#0e131b',
                                    border: '1px solid #1e2633',
                                    borderRadius: '8px',
                                    color: '#f1f5f9',
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                  }}
                                />
                                <Bar dataKey="value" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Deployment */}
              {publication.deployment && (
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                      <Rocket className="text-emerald-400 size-5" />
                      <span>Deployment & Clinical Translation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(publication.deployment),
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Challenges and Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground font-display text-base">
                      <AlertCircle className="text-amber-400 size-4" />
                      <span>Key Challenges</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {challenges.map((challenge: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span className="leading-relaxed">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground font-display text-base">
                      <Lightbulb className="text-primary size-4" />
                      <span>Key Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {insights.map((insight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">→</span>
                          <span className="leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Key Results */}
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-foreground font-display text-base">Key Experimental Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {keyResults.map((result: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-xs font-mono text-foreground font-medium">{result}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Publication Meta Info */}
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-foreground font-display text-base">Citation Registry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs font-mono">
                  <div>
                    <p className="text-muted-foreground uppercase mb-1">DOI Identifier</p>
                    <p className="text-primary break-all">{publication.doiUrl || "Available in indexed issue"}</p>
                  </div>
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-muted-foreground uppercase mb-1">Document Type</p>
                    <p className="text-foreground">{publication.type}</p>
                  </div>
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-muted-foreground uppercase mb-1">Research Field</p>
                    <p className="text-foreground">{publicationDomain}</p>
                  </div>
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-muted-foreground uppercase mb-1">Publication Year</p>
                    <p className="text-foreground">{publication.year}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Previous / Next Navigation */}
          <div className="mt-12 pt-8 border-t border-border/60 flex items-center justify-between">
            {previousPublication ? (
              <Link
                to={`/publications/${previousPublication.slug}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <p className="text-[11px] font-mono text-muted-foreground uppercase">Previous Paper</p>
                  <p className="text-sm font-medium text-foreground line-clamp-1 max-w-xs">{previousPublication.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPublication ? (
              <Link
                to={`/publications/${nextPublication.slug}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-right"
              >
                <div>
                  <p className="text-[11px] font-mono text-muted-foreground uppercase">Next Paper</p>
                  <p className="text-sm font-medium text-foreground line-clamp-1 max-w-xs">{nextPublication.title}</p>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Proof Modal */}
      <Dialog open={isProofModalOpen} onOpenChange={setIsProofModalOpen}>
        <DialogContent className="max-w-2xl bg-popover border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display text-base">Acceptance Proof Document</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-muted-foreground text-xs mb-4">Official publication proof or acceptance verification document.</p>
            {publication.proofUrl && (
              <div className="bg-background border border-border rounded-xl p-8 text-center">
                <FileText size={48} className="mx-auto mb-3 text-primary opacity-80" />
                <p className="text-foreground text-sm font-mono mb-4">Verification Document Available</p>
                <a
                  href={publication.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs"
                >
                  <ExternalLink size={13} />
                  <span>Open Full PDF Document</span>
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl bg-background border border-border p-4">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-foreground font-display text-sm flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              <span>Full Resolution Exhibit</span>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={selectedImage}
                alt="Full size preview"
                className="w-full max-h-[80vh] object-contain mx-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
