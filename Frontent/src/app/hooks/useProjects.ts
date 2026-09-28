import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectBySlug, listProjects } from "../../services/projectsApi";

export function useProjects(limit = 20, offset = 0) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects", limit, offset],
    queryFn: () => listProjects(limit, offset),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
}

export function useProjectDetail(slug?: string, initialProject?: any) {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug as string),
    enabled: !!slug,
    initialData: () => {
      if (initialProject) return initialProject;
      // Search any cached projects lists (e.g. homepage limit=6 or full list)
      const queries = queryClient.getQueriesData<any[]>({ queryKey: ["projects"] });
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

  return {
    project: detailQuery.data ?? null,
    loading: detailQuery.isLoading && !detailQuery.data,
    error: detailQuery.error instanceof Error ? detailQuery.error.message : null,
  };
}
