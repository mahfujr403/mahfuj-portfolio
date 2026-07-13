import { useCallback, useEffect, useMemo, useState } from "react";
import { getPublicationBySlug, listPublications } from "../../services/publicationsApi";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

export function usePublications(limit = 10, offset = 0) {
  const [state, setState] = useState<AsyncState<any[]>>({
    data: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))
    try {
      const publications = await listPublications(limit, offset);
      setState({ data: publications ?? [], loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : "Failed to load publications" });
    }
  }, [limit, offset]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const publications = await listPublications(limit, offset);
        if (!active) return;
        setState({ data: publications ?? [], loading: false, error: null });
      } catch (error) {
        if (!active) return;
        setState({ data: [], loading: false, error: error instanceof Error ? error.message : "Failed to load publications" });
      }
    };

    setState((current) => ({ ...current, loading: true, error: null }));
    load();

    return () => {
      active = false;
    };
  }, [limit, offset]);

  return { ...state, refresh };
}

export function usePublicationDetail(slug?: string, fallbackLimit = 200) {
  const [state, setState] = useState<AsyncState<any | null>>({
    data: null,
    loading: true,
    error: null,
  });
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!slug) {
        setState({ data: null, loading: false, error: "Missing publication slug" });
        return;
      }

      try {
        const [detail, list] = await Promise.all([
          getPublicationBySlug(slug),
          listPublications(fallbackLimit, 0),
        ]);

        if (!active) return;

        const matched = list.find((publication) => publication.slug === slug) ?? null;
        setPublications(list ?? []);
        setState({ data: detail ?? matched, loading: false, error: null });
      } catch (error) {
        if (!active) return;
        setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Failed to load publication" });
      }
    };

    setState((current) => ({ ...current, loading: true, error: null }));
    load();

    return () => {
      active = false;
    };
  }, [fallbackLimit, slug]);

  const currentIndex = useMemo(
    () => publications.findIndex((publication) => publication.slug === slug),
    [publications, slug],
  );

  const previousPublication = currentIndex > 0 ? publications[currentIndex - 1] : null;
  const nextPublication = currentIndex >= 0 && currentIndex < publications.length - 1 ? publications[currentIndex + 1] : null;

  return {
    publication: state.data,
    publications,
    previousPublication,
    nextPublication,
    loading: state.loading,
    error: state.error,
  };
}