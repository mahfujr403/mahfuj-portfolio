import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPublicationBySlug,
  getPublicationNeighbors,
  listPublications,
} from "../../services/publicationsApi";

export function usePublications(limit = 10, offset = 0) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publications", limit, offset],
    queryFn: () => listPublications(limit, offset),
    initialData: () => {
      // Only reuse cached list if it satisfies the requested limit
      const queries = queryClient.getQueriesData<any[]>({ queryKey: ["publications"] });
      for (const [, list] of queries) {
        if (Array.isArray(list) && list.length >= limit) {
          return list;
        }
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data ?? [],
    loading: isLoading && (!data || data.length === 0),
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
}

export function usePublicationDetail(slug?: string, initialPublication?: any) {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["publication", slug],
    queryFn: () => getPublicationBySlug(slug as string),
    enabled: !!slug,
    initialData: () => {
      if (initialPublication) return initialPublication;
      // Search any cached publications lists (e.g. homepage limit=3 or all limit=200)
      const queries = queryClient.getQueriesData<any[]>({ queryKey: ["publications"] });
      for (const [, list] of queries) {
        if (Array.isArray(list)) {
          const found = list.find((p) => p.slug === slug);
          if (found) return found;
        }
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Lightweight endpoint for prev/next
  const neighborsQuery = useQuery({
    queryKey: ["publication-neighbors", slug],
    queryFn: () => getPublicationNeighbors(slug as string),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

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
    loading: detailQuery.isLoading && !detailQuery.data,
    error: detailQuery.error instanceof Error ? detailQuery.error.message : null,
  };
}
