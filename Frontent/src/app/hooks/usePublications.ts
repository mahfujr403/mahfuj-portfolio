import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPublicationBySlug,
  getPublicationNeighbors,
  listPublications,
} from "../../services/publicationsApi";

// React Query gives us caching + de-duplication for free: e.g. Publications
// (homepage, limit=3) and AllPublicationsPage (limit=200) each declare their
// own query, and navigating between them no longer triggers a redundant
// fetch for data that's already in cache and still fresh.
export function usePublications(limit = 10, offset = 0) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publications", limit, offset],
    queryFn: () => listPublications(limit, offset),
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
}

export function usePublicationDetail(slug?: string) {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["publication", slug],
    queryFn: () => getPublicationBySlug(slug as string),
    enabled: !!slug,
  });

  // Lightweight endpoint (just slug+title for prev/next) instead of the old
  // pattern of fetching up to 200 full publication records on every visit.
  const neighborsQuery = useQuery({
    queryKey: ["publication-neighbors", slug],
    queryFn: () => getPublicationNeighbors(slug as string),
    enabled: !!slug,
  });

  // If the full list is already cached (e.g. visitor came from
  // AllPublicationsPage), reuse it instead of an extra request.
  const cachedList = queryClient.getQueryData<any[]>(["publications", 200, 0]) ?? [];

  const currentIndex = useMemo(
    () => cachedList.findIndex((publication) => publication.slug === slug),
    [cachedList, slug],
  );

  return {
    publication: detailQuery.data ?? null,
    publications: cachedList,
    previousPublication: neighborsQuery.data?.previous ?? (currentIndex > 0 ? cachedList[currentIndex - 1] : null),
    nextPublication:
      neighborsQuery.data?.next ??
      (currentIndex >= 0 && currentIndex < cachedList.length - 1 ? cachedList[currentIndex + 1] : null),
    loading: detailQuery.isLoading,
    error: detailQuery.error instanceof Error ? detailQuery.error.message : null,
  };
}
