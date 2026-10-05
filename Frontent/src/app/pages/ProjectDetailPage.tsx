import { useParams, Link, useLocation } from "react-router";
import { useEffect } from "react";
import { useProjectDetail } from "../hooks/useProjects";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Github, ExternalLink, ArrowLeft, Database, Cpu, Rocket, Zap, AlertCircle, Lightbulb, Code, Laptop, Server, Activity, Copy, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const routeProject = (location.state as any)?.project;
  const { project, loading, error } = useProjectDetail(slug, routeProject);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // ignore
    }
  }, [slug]);

  if (loading && !project) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 w-32 bg-secondary/60 rounded-md mb-8" />
          <div className="w-full h-80 sm:h-96 rounded-xl bg-secondary/40 mb-8 border border-border" />
          <div className="bg-card border border-border rounded-xl p-8 mb-8 space-y-4">
            <div className="h-8 w-2/3 bg-secondary/60 rounded-md" />
            <div className="h-4 w-full bg-secondary/40 rounded" />
            <div className="h-4 w-4/5 bg-secondary/40 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!project && !loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-card border border-border rounded-xl">
          <h1 className="text-2xl font-bold font-display text-foreground mb-3">Project Dossier Not Located</h1>
          {error && <p className="text-sm font-mono text-muted-foreground mb-6">{error}</p>}
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm"
          >
            ← Return to Observatory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Projects</span>
        </Link>

        {/* Hero Media Banner */}
        {project.imageUrl && (
          <div className="w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-8 border border-border bg-secondary/30">
            <img
              src={project.imageUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header Hero Dossier */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-3">
                <Cpu size={12} />
                <span>Production Architecture</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-foreground tracking-tight mb-3">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {project.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary hover:border-border-active text-sm font-semibold transition-all"
                >
                  <Github size={16} />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold transition-all"
                >
                  <ExternalLink size={16} />
                  <span>Live Deployment</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/60">
            {(project.techStack ?? []).map((tech: string) => (
              <Badge key={tech} variant="default" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* 2-Column Technical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Problem Statement */}
            <Card className="bg-card border-border shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                  <AlertCircle className="text-amber-400 size-5" />
                  <span>Problem Statement & Clinical Objective</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base text-left">
                  {project.problemStatement}
                </p>
              </CardContent>
            </Card>

            {/* Dataset Details */}
            <Card className="bg-card border-border shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                  <Database className="text-primary size-5" />
                  <span>Dataset & Preprocessing Pipeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border">
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Name</p>
                    <p className="text-sm font-medium text-foreground">{project.dataset?.name ?? "N/A"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border">
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Scale</p>
                    <p className="text-sm font-medium text-foreground">{project.dataset?.size ?? "N/A"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border">
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Origin</p>
                    <p className="text-sm font-medium text-foreground">{project.dataset?.source ?? "N/A"}</p>
                  </div>
                </div>

                {(project.dataset?.preprocessing ?? []).length > 0 && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                      Preprocessing Transformers:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                      {(project.dataset?.preprocessing ?? []).map((step: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 p-2 rounded-md bg-secondary/30 border border-border">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model & Architecture Flow */}
            <Card className="bg-card border-border shadow-xs overflow-hidden">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                    <Cpu className="text-indigo-400 size-5" />
                    <span>Model & System Architecture</span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {project.model?.architecture && (
                      <Badge variant="indigo" className="text-xs">
                        {project.model.architecture}
                      </Badge>
                    )}
                    {project.model?.framework && (
                      <Badge variant="default" className="text-xs">
                        {project.model.framework}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.model?.details && (
                  <p className="text-muted-foreground leading-relaxed text-sm text-left">
                    {project.model.details}
                  </p>
                )}

                {/* Pipeline Flow Stages */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={15} className="text-primary" />
                    <span className="text-xs font-mono text-foreground font-semibold uppercase tracking-wider">
                      Interactive Pipeline Architecture Flow
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        step: "01",
                        title: "Client Ingestion",
                        tech: "React · TypeScript",
                        desc: "Ingests input data, applies client-side validation, and streams payload chunks.",
                        icon: Laptop,
                        iconColor: "text-primary",
                      },
                      {
                        step: "02",
                        title: "API Gateway",
                        tech: "FastAPI · Docker",
                        desc: "Handles asynchronous request routing, rate limiting, and prepares model input tensors.",
                        icon: Server,
                        iconColor: "text-emerald-400",
                      },
                      {
                        step: "03",
                        title: "Inference Engine",
                        tech: project.model?.framework || "PyTorch · ONNX",
                        desc: `Executes inference through ${project.model?.architecture || "neural networks"} with tensor acceleration.`,
                        icon: Cpu,
                        iconColor: "text-indigo-400",
                      },
                      {
                        step: "04",
                        title: "Diagnostic Output",
                        tech: "JSON Stream · Heatmaps",
                        desc: "Emits class confidence probabilities, saliency attention maps, and clinical triage.",
                        icon: Activity,
                        iconColor: "text-amber-400",
                      },
                    ].map((stage, idx) => {
                      const StageIcon = stage.icon;
                      return (
                        <div
                          key={stage.step}
                          className="relative rounded-xl p-4 border border-border bg-secondary/30 flex flex-col justify-between transition-all duration-150 hover:border-primary/40 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-mono text-muted-foreground font-bold">{stage.step}</span>
                              <StageIcon size={16} className={stage.iconColor} />
                            </div>
                            <h4 className="text-sm font-bold text-foreground font-display mb-1">{stage.title}</h4>
                            <p className="text-[11px] font-mono text-primary mb-2 truncate">{stage.tech}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{stage.desc}</p>
                          </div>
                          {idx < 3 && (
                            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                              <span className="size-4 rounded-full bg-background border border-border flex items-center justify-center text-[9px] text-muted-foreground font-mono">
                                →
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Raw Architecture Terminal Specification */}
                {project.systemArchitecture && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Architecture Specification
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(project.systemArchitecture);
                            toast.success("Architecture specification copied!");
                          } catch {
                            toast.error("Failed to copy");
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer font-mono"
                      >
                        <Copy size={12} />
                        Copy Spec
                      </button>
                    </div>
                    <div className="bg-background border border-border p-4 rounded-xl overflow-x-auto">
                      <pre className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {project.systemArchitecture}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics Visualization */}
            {(project.resultsVisualization ?? []).length > 0 && (
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-foreground font-display text-lg">Performance Metrics Telemetry</CardTitle>
                </CardHeader>
                <CardContent>
                  {(project.resultsVisualization ?? []).map((viz: any, idx: number) => {
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
                              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
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

            {/* API Documentation */}
            {(project.apiDocs ?? []).length > 0 && (
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground font-display text-lg">
                    <Code className="text-primary size-5" />
                    <span>REST API Endpoint Contracts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(project.apiDocs ?? []).map((api: any, idx: number) => (
                      <div key={idx} className="border border-border bg-secondary/30 rounded-lg p-3.5">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          <Badge variant="default" className="text-xs font-mono">
                            {api.method}
                          </Badge>
                          <code className="text-xs font-mono bg-background border border-border px-2 py-0.5 rounded text-foreground">
                            {api.endpoint}
                          </code>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">{api.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Key Metrics */}
            <Card className="bg-card border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-foreground font-display text-base">Benchmark Telemetry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(project.metrics ?? []).map((metric: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-xs text-muted-foreground">{metric.name}</span>
                      <span className="text-xs font-mono font-bold text-primary">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deployment & DevOps */}
            <Card className="bg-card border-border shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground font-display text-base">
                  <Rocket className="text-emerald-400 size-4" />
                  <span>Deployment & DevOps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-secondary/30 p-3.5">
                  <p className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground mb-1.5">Target Platform</p>
                  <p className="text-sm font-medium text-foreground">{project.deployment ?? "Dockerized Edge Container"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Optimization */}
            <Card className="bg-card border-border shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground font-display text-base">
                  <Zap className="text-amber-400 size-4" />
                  <span>Inference Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {(project.optimization ?? []).length > 0 ? (
                    (project.optimization ?? []).map((opt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                        <span className="leading-relaxed">{opt}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground text-xs">No optimization records.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Challenges & Learnings Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground font-display text-base">
                <AlertCircle className="text-amber-400 size-4" />
                <span>Engineering Challenges Solved</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                {(project.challenges ?? []).map((challenge: string, idx: number) => (
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
                <span>Key Research Learnings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                {(project.learnings ?? []).map((learning: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span className="leading-relaxed">{learning}</span>
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
