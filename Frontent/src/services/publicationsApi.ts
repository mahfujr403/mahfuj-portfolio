import { apiFetch } from "./apiClient";

function toArray(value: any) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function normalizeDataset(dataset: any) {
  return {
    name: dataset?.name ?? dataset?.datasetName ?? dataset?.title ?? "Dataset unavailable",
    size: dataset?.size ?? dataset?.datasetSize ?? "N/A",
    source: dataset?.source ?? dataset?.origin ?? "N/A",
    description: dataset?.description ?? dataset?.summary ?? "Dataset details unavailable",
    preprocessing: toArray(dataset?.preprocessing).filter(Boolean),
  };
}

export function normalizePublication(publication: any, fallback: any = {}) {
  const source = publication ?? {};
  const fallbackSource = fallback ?? {};
  const datasets = toArray(source.dataset ?? fallbackSource.dataset)
    .map(normalizeDataset)
    .filter((entry) => entry.name !== "Dataset unavailable");
  const rawSummary =
    source.contributionSummary ??
    source.contribution_summary ??
    source.tldr ??
    source.problem ??
    fallbackSource.contributionSummary ??
    fallbackSource.contribution_summary ??
    fallbackSource.tldr ??
    fallbackSource.problem ??
    "";

  return {
    id: source.id ?? fallbackSource.id,
    slug: source.slug ?? fallbackSource.slug ?? "",
    title: source.title ?? fallbackSource.title ?? "Untitled Publication",
    venue: source.venue ?? fallbackSource.venue ?? "Venue unavailable",
    publisher: source.publisher ?? fallbackSource.publisher ?? "Publisher unavailable",
    type: source.type ?? fallbackSource.type ?? "Publication",
    year: source.year ?? fallbackSource.year ?? "N/A",
    contributionSummary: String(rawSummary).trim() || "Summary unavailable",
    contribution_summary: String(rawSummary).trim() || "Summary unavailable",
    summary: String(rawSummary).trim() || "Summary unavailable",
    keyResults: toArray(source.keyResults ?? source.key_results ?? fallbackSource.keyResults ?? fallbackSource.key_results),
    domain: source.domain ?? fallbackSource.domain ?? "",
    doiUrl: source.doiUrl ?? source.doi_url ?? fallbackSource.doiUrl ?? fallbackSource.doi_url,
    paperUrl: source.paperUrl ?? source.paper_url ?? fallbackSource.paperUrl ?? fallbackSource.paper_url,
    proofUrl: source.proofUrl ?? source.proof_url ?? fallbackSource.proofUrl ?? fallbackSource.proof_url,
    eventPhotos: toArray(source.eventPhotos ?? source.event_photos ?? fallbackSource.eventPhotos ?? fallbackSource.event_photos),
    certificateUrl: source.certificateUrl ?? source.certificate_url ?? fallbackSource.certificateUrl ?? fallbackSource.certificate_url,
    authors: toArray(source.authors ?? fallbackSource.authors),
    tldr: source.tldr ?? fallbackSource.tldr ?? "",
    problem: source.problem ?? fallbackSource.problem ?? "",
    datasets,
    dataset: datasets[0] ?? null,
    methodology: source.methodology ?? fallbackSource.methodology ?? "",
    architecture: source.architecture ?? fallbackSource.architecture ?? "",
    experiments: toArray(source.experiments ?? fallbackSource.experiments),
    performanceAnalysis: source.performanceAnalysis ?? source.performance_analysis ?? fallbackSource.performanceAnalysis ?? fallbackSource.performance_analysis ?? "",
    resultsVisualization: toArray(source.resultsVisualization ?? source.results_visualization ?? fallbackSource.resultsVisualization ?? fallbackSource.results_visualization),
    deployment: source.deployment ?? fallbackSource.deployment ?? "",
    challenges: toArray(source.challenges ?? fallbackSource.challenges),
    insights: toArray(source.insights ?? fallbackSource.insights),
    createdAt: source.createdAt ?? fallbackSource.createdAt,
    updatedAt: source.updatedAt ?? fallbackSource.updatedAt,
  };
}

export function normalizePublications(publications: any[], fallbackMap: Record<string, any> = {}) {
  return toArray(publications).map((publication) => normalizePublication(publication, fallbackMap[publication?.slug]));
}

export async function listPublications(limit = 10, offset = 0) {
  const publications = await apiFetch<any[]>(`api/v1/publications?limit=${limit}&offset=${offset}`);
  return normalizePublications(publications);
}

export async function getPublicationBySlug(slug: string) {
  const publication = await apiFetch<any>(`api/v1/publications/${slug}`);
  return normalizePublication(publication);
}

export default { listPublications, getPublicationBySlug };
