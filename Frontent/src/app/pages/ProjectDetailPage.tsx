import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { getProjectBySlug } from "../../services/projectsApi";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Github, ExternalLink, ArrowLeft, Database, Cpu, Rocket, Zap, AlertCircle, Lightbulb, Code } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      // ignore in non-browser environments
    }

    const load = async () => {
      if (!slug) return;
      try {
        const p = await getProjectBySlug(slug);
        if (mounted) setProject(p);
      } catch (err) {
        toast.error("Failed to load project details.");

      }
    };
    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-gray-100 mb-4">Project Not Found</h1>
          <Link to="/" className="text-gray-400 hover:text-[#00f2fe] transition-colors inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f2fe] transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {project.imageUrl && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8 border border-white/10">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="glass border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="mb-4 gradient-text">{project.title}</h1>
              <p className="text-xl text-gray-300">{project.summary}</p>
            </div>
            <div className="flex gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all"
              >
                <Github size={20} />
                GitHub
              </a>
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 glass border-2 border-[#00f2fe] text-[#00f2fe] rounded-lg hover:bg-[#00f2fe]/10 transition-all"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(project.techStack ?? []).map((tech) => (
              <Badge key={tech} className="bg-white/5 border-white/10 text-gray-300">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <AlertCircle className="text-[#ec4899]" />
                  Problem Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{project.problemStatement}</p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Database className="text-[#00f2fe]" />
                  Dataset Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-200">Name: <span className="font-normal text-gray-400">{project.dataset?.name ?? ""}</span></p>
                  <p className="font-semibold text-gray-200">Size: <span className="font-normal text-gray-400">{project.dataset?.size ?? ""}</span></p>
                  <p className="font-semibold text-gray-200">Source: <span className="font-normal text-gray-400">{project.dataset?.source ?? ""}</span></p>
                </div>
                <div>
                  <p className="font-semibold text-gray-200 mb-2">Preprocessing:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {(project.dataset?.preprocessing ?? []).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Cpu className="text-[#8b5cf6]" />
                  Model & Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-200">Architecture: <span className="font-normal text-gray-400">{project.model?.architecture ?? ""}</span></p>
                  <p className="font-semibold text-gray-200">Framework: <span className="font-normal text-gray-400">{project.model?.framework ?? ""}</span></p>
                </div>
                <p className="text-gray-400">{project.model?.details ?? ""}</p>
                <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
                  <p className="font-mono text-sm text-gray-400">{project.systemArchitecture}</p>
                </div>
              </CardContent>
            </Card>

            {(project.resultsVisualization ?? []).length > 0 && (
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  {(project.resultsVisualization ?? []).map((viz, idx) => {
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
                            <YAxis stroke="#9ca3af" />
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

            {(project.apiDocs ?? []).length > 0 && (
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Code className="text-[#6366f1]" />
                    API Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(project.apiDocs ?? []).map((api, idx) => (
                      <div key={idx} className="border border-white/10 bg-black/20 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="border-[#00f2fe] text-[#00f2fe]">{api.method}</Badge>
                          <code className="text-sm bg-black/40 border border-white/10 px-2 py-1 rounded text-gray-300">{api.endpoint}</code>
                        </div>
                        <p className="text-gray-400 text-sm">{api.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Rocket className="text-[#10b981]" />
                  Deployment & DevOps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Platform</p>
                  <p className="text-gray-300 leading-relaxed">{project.deployment ?? ""}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Zap className="text-[#fbbf24]" />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(project.optimization ?? []).length > 0 ? (
                    (project.optimization ?? []).map((opt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#10b981] mt-1">✓</span>
                        <span className="text-gray-400 leading-relaxed">{opt}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">No optimization details available.</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gray-100">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(project.metrics ?? []).map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-300">{metric.name}</span>
                        <span className="text-sm font-bold text-[#00f2fe]">{metric.value}</span>
                      </div>
                      {idx < (project.metrics ?? []).length - 1 && <div className="border-t border-white/10 mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gray-100">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(project.techStack ?? []).map((tech) => (
                    <Badge key={tech} className="bg-white/5 border-white/10 text-gray-300">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <AlertCircle className="text-[#f97316]" />
                    Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(project.challenges ?? []).map((challenge, idx) => (
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
                    Key Learnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(project.learnings ?? []).map((learning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#00f2fe] mt-1">→</span>
                        <span className="text-gray-400">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
      </div>
    </div>
  );
}
