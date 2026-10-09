import { apiFetch } from "./apiClient";

function toArray(value: any) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function normalizeDataset(dataset: any) {
  if (!dataset) return null;
  const name = dataset?.name ?? dataset?.datasetName ?? dataset?.title;
  const size = dataset?.size ?? dataset?.datasetSize;
  const source = dataset?.source ?? dataset?.origin;
  const description = dataset?.description ?? dataset?.summary;
  const preprocessing = toArray(dataset?.preprocessing).filter(Boolean);

  const cleanName = name && name !== "Dataset unavailable" ? String(name).trim() : "";
  const cleanSize = size && size !== "N/A" && size !== "Data unavailable" ? String(size).trim() : "";
  const cleanSource = source && source !== "N/A" ? String(source).trim() : "";
  const cleanDesc = description && description !== "Dataset details unavailable" ? String(description).trim() : "";

  if (!cleanName && !cleanSize && !cleanSource && !cleanDesc && preprocessing.length === 0) {
    return null;
  }

  return {
    name: cleanName,
    size: cleanSize,
    source: cleanSource,
    description: cleanDesc,
    preprocessing,
  };
}

export function normalizePublication(publication: any, fallback: any = {}) {
  const source = publication ?? {};
  const fallbackSource = fallback ?? {};
  const datasets = toArray(source.dataset ?? fallbackSource.dataset)
    .map(normalizeDataset)
    .filter(Boolean);

  const rawSummary =
    source.contributionSummary ??
    source.contribution_summary ??
    source.summary ??
    source.tldr ??
    source.problem ??
    fallbackSource.contributionSummary ??
    fallbackSource.contribution_summary ??
    fallbackSource.summary ??
    fallbackSource.tldr ??
    fallbackSource.problem ??
    "";

  const cleanSummary = String(rawSummary).trim();
  const summaryValue = cleanSummary === "Summary unavailable" ? "" : cleanSummary;

  const rawVenue = source.venue ?? fallbackSource.venue ?? "";
  const cleanVenue = String(rawVenue).trim();
  const venueValue = cleanVenue === "Venue unavailable" ? "" : cleanVenue;

  const rawPublisher = source.publisher ?? fallbackSource.publisher ?? "";
  const cleanPublisher = String(rawPublisher).trim();
  const publisherValue = cleanPublisher === "Publisher unavailable" ? "" : cleanPublisher;

  const rawYear = source.year ?? fallbackSource.year ?? "";
  const yearValue = rawYear === "N/A" ? "" : rawYear;

  return {
    id: source.id ?? fallbackSource.id,
    slug: source.slug ?? fallbackSource.slug ?? "",
    title: String(source.title ?? fallbackSource.title ?? "Untitled Publication").trim(),
    venue: venueValue,
    publisher: publisherValue,
    type: String(source.type ?? fallbackSource.type ?? "").trim(),
    year: yearValue,
    contributionSummary: summaryValue,
    contribution_summary: summaryValue,
    summary: summaryValue,
    keyResults: toArray(source.keyResults ?? source.key_results ?? fallbackSource.keyResults ?? fallbackSource.key_results).filter(Boolean),
    domain: String(source.domain ?? fallbackSource.domain ?? "").trim(),
    doiUrl: source.doiUrl ?? source.doi_url ?? fallbackSource.doiUrl ?? fallbackSource.doi_url ?? null,
    paperUrl: source.paperUrl ?? source.paper_url ?? fallbackSource.paperUrl ?? fallbackSource.paper_url ?? null,
    proofUrl: source.proofUrl ?? source.proof_url ?? fallbackSource.proofUrl ?? fallbackSource.proof_url ?? null,
    eventPhotos: toArray(source.eventPhotos ?? source.event_photos ?? fallbackSource.eventPhotos ?? fallbackSource.event_photos).filter(Boolean),
    authors: (() => {
      const raw = toArray(source.authors ?? fallbackSource.authors).filter(Boolean);
      const seen = new Set<string>();
      const deduped: string[] = [];
      for (const item of raw) {
        const str = String(item).trim();
        const key = str.toLowerCase().replace(/[\s.]+/g, " ");
        if (key && !seen.has(key)) {
          seen.add(key);
          deduped.push(str);
        }
      }
      return deduped;
    })(),
    tldr: String(source.tldr ?? fallbackSource.tldr ?? "").trim(),
    problem: String(source.problem ?? fallbackSource.problem ?? "").trim(),
    datasets,
    dataset: datasets[0] ?? null,
    methodology: String(source.methodology ?? fallbackSource.methodology ?? "").trim(),
    architecture: String(source.architecture ?? fallbackSource.architecture ?? "").trim(),
    experiments: toArray(source.experiments ?? fallbackSource.experiments).filter(Boolean),
    performanceAnalysis: String(source.performanceAnalysis ?? source.performance_analysis ?? fallbackSource.performanceAnalysis ?? fallbackSource.performance_analysis ?? "").trim(),
    resultsVisualization: toArray(source.resultsVisualization ?? source.results_visualization ?? fallbackSource.resultsVisualization ?? fallbackSource.results_visualization).filter(Boolean),
    deployment: (() => {
      const raw = String(source.deployment ?? fallbackSource.deployment ?? "").trim();
      const lower = raw.toLowerCase();
      if (!raw || lower === "no" || lower === "n/a" || lower === "none" || lower === "null" || lower === "nil") {
        return "";
      }
      return raw;
    })(),
    challenges: toArray(source.challenges ?? fallbackSource.challenges).filter(Boolean),
    insights: toArray(source.insights ?? fallbackSource.insights).filter(Boolean),
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

export async function getPublicationNeighbors(slug: string) {
  return await apiFetch<{
    previous: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
  }>(`api/v1/publications/${slug}/neighbors`);
}

export default { listPublications, getPublicationBySlug, getPublicationNeighbors };
