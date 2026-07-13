import DOMPurify from "dompurify";
import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ExternalLink, ArrowLeft, ArrowRight, FileText, Database, Beaker, TrendingUp, Rocket, AlertCircle, Lightbulb, Award, Camera, Image as ImageIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { usePublicationDetail } from "../hooks/usePublications";

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { publication, publications: allPublications, previousPublication, nextPublication, loading, error } = usePublicationDetail(slug, 200);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-gray-100 mb-4">Loading publication...</h1>
        </div>
      </div>
    );
  }


  if (error || !publication) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-gray-100 mb-4">Publication Not Found</h1>
          {error && <p className="text-gray-400 mb-4">{error}</p>}
          <Link to="/publications" className="text-gray-400 hover:text-[#00f2fe] transition-colors inline-block">
            ← Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  let publicationDomain;
  if(publication.domain){
    publicationDomain = publication.domain;
  }else {
    publicationDomain = "Domain unavailable";
  }
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

    
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/publications" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f2fe] transition-colors mb-8">
            <ArrowLeft size={20} />
            Back to Publications
          </Link>

          <div className="glass border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="border-[#00f2fe] text-[#00f2fe]">{publication.type}</Badge>
              <Badge className="bg-white/5 border-white/10 text-gray-300">{publicationDomain}</Badge>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">{publication.year}</span>
            </div>

            <h1 className="mb-6 gradient-text">{publication.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-200">Venue</p>
                <p className="text-gray-400">{publication.venue}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">Publisher</p>
                <p className="text-gray-400">{publication.publisher}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-200 mb-1">Authors</p>
                <p className="text-gray-400">{authors.length > 0 ? authors.join(", ") : "Author details unavailable"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {publication.paperUrl && (
                <a
                  href={publication.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 glass border-2 border-[#00f2fe] text-[#00f2fe] rounded-lg hover:bg-[#00f2fe]/10 transition-all"
                >
                  <ExternalLink size={20} />
                  Read Paper
                </a>
              )}
              {publication.proofUrl && (
                <button
                  onClick={() => setIsProofModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/20 text-gray-300 rounded-lg hover:border-[#8b5cf6] hover:text-[#8b5cf6] transition-all"
                >
                  <Award size={20} />
                  View Proof
                </button>
              )}
            </div>
          </div>

          {/* Event Photos and Certificate Gallery */}
          {eventPhotos.length > 0 || publication.certificateUrl ? (
            <Card className="glass border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Camera size={20} className="text-[#00f2fe]" />
                  Event Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Event Photos */}
                  {eventPhotos.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Camera size={16} className="text-[#8b5cf6]" />
                        Event Photos ({eventPhotos.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {eventPhotos.map((photo: string, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedImage(photo)}
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 hover:border-[#00f2fe]/50 transition-all duration-300"
                          >
                            <img
                              src={photo}
                              alt={`Event photo ${idx + 1}`}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <p className="text-white text-sm font-medium">View Photo</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificate */}
                  {publication.certificateUrl && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Award size={16} className="text-[#fbbf24]" />
                        Certificate
                      </h3>
                      <div
                        onClick={() => setSelectedImage(publication.certificateUrl!)}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 hover:border-[#fbbf24]/50 transition-all duration-300 max-w-md"
                      >
                        <img
                          src={publication.certificateUrl}
                          alt="Certificate"
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm font-medium">View Certificate</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">TL;DR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{publication.tldr}</p>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <AlertCircle className="text-[#ec4899]" />
                    Problem Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{publication.problem}</p>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Database className="text-[#00f2fe]" />
                    {datasets.length > 1 ? "Datasets" : "Dataset"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {datasets.length > 0 ? (
                    datasets.map((dataset, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 rounded-lg p-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-200">
                            Name: <span className="font-normal text-gray-400">{dataset.name}</span>
                          </p>
                          <p className="font-semibold text-gray-200">
                            Size: <span className="font-normal text-gray-400">{dataset.size}</span>
                          </p>
                        </div>
                        <p className="font-semibold text-gray-200">
                          Source: <span className="font-normal text-gray-400">{dataset.source}</span>
                        </p>
                      
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Dataset details unavailable</p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Beaker className="text-[#8b5cf6]" />
                    Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400">{publication.methodology ?? "Methodology details unavailable"}</p>
                  <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
                    <p className="font-semibold text-gray-200 mb-2">Architecture:</p>
                    <p className="font-mono text-sm text-gray-400">{publication.architecture ?? "Architecture details unavailable"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Experiments & Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-200 mb-2">Experiments Conducted:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      {experiments.map((exp: string, idx: number) => (
                        <li key={idx}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-2">Performance Analysis:</p>
                    <p className="text-gray-400">{publication.performanceAnalysis ?? "Performance analysis unavailable"}</p>
                  </div>
                </CardContent>
              </Card>

              {resultsVisualization.length > 0 && (
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <TrendingUp className="text-[#10b981]" />
                      Results Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resultsVisualization.map((viz: any, idx: number) => {
                      if (viz.type === "bar") {
                        const chartData = viz.data.labels.map((label: string, i: number) => ({
                          name: label,
                          value: viz.data.values[i]
                        }));
                        return (
                          <ResponsiveContainer key={idx} width="100%" height={300}>
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="name" stroke="#9ca3af" />
                              <YAxis domain={[0, 100]} stroke="#9ca3af" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '8px',
                                  color: '#e5e7eb'
                                }}
                              />
                              <Bar dataKey="value" fill="url(#colorGradient)" />
                              <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#00f2fe" />
                                  <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        );
                      }
                      return null;
                    })}
                  </CardContent>
                </Card>
              )}

              {/* {publication.deployment && (
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <Rocket className="text-[#10b981]" />
                      Deployment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{publication.deployment ?? "Deployment details unavailable"}</p>
                  </CardContent>
                </Card>
              )} */}


              {publication.deployment && (
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-100">
                        <Rocket className="text-[#10b981]" />
                        Deployment
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div
                        className="text-gray-400"
                        dangerouslySetInnerHTML={{
                           __html: DOMPurify.sanitize(publication.deployment)
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <AlertCircle className="text-[#f97316]" />
                      Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {challenges.map((challenge: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#f97316] mt-1">•</span>
                          <span className="text-gray-400">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <Lightbulb className="text-[#fbbf24]" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.map((insight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#00f2fe] mt-1">→</span>
                          <span className="text-gray-400">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Key Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {keyResults.map((result: string, idx: number) => (
                      <div key={idx} className="bg-black/30 border border-white/5 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-gray-300">{result}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Publication Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-200">DOI</p>
                    <p className="text-gray-400 break-all">{publication.doiUrl || "DOI unavailable"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Type</p>
                    <p className="text-gray-400">{publication.type}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Domain</p>
                    <p className="text-gray-400">{publicationDomain}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Year</p>
                    <p className="text-gray-400">{publication.year}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
            {previousPublication ? (
              <Link
                to={`/publications/${previousPublication.slug}`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f2fe] transition-colors"
              >
                <ArrowLeft size={20} />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Previous</p>
                  <p className="font-medium text-gray-300">{previousPublication.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPublication ? (
              <Link
                to={`/publications/${nextPublication.slug}`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f2fe] transition-colors"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500">Next</p>
                  <p className="font-medium text-gray-300">{nextPublication.title}</p>
                </div>
                <ArrowRight size={20} />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isProofModalOpen} onOpenChange={setIsProofModalOpen}>
        <DialogContent className="max-w-4xl bg-[#0f172a] border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Publication Proof - {publication.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-400 mb-4">Certificate or acceptance letter for this publication.</p>
            {publication.proofUrl && (
              <div className="bg-black/30 border border-white/10 rounded-lg p-8 text-center">
                <FileText size={64} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">Certificate/Proof Document</p>
                <a
                  href={publication.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold rounded-md hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all"
                >
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl bg-black/95 border border-white/20 p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-gray-100 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#00f2fe]" />
              Image Preview
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size preview"
                className="w-full h-auto rounded-lg border border-white/10"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
