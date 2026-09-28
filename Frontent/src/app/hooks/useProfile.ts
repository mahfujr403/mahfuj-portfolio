import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { fetchProfile } from "../../services/profileApi";

/**
 * Shared profile query used by Navbar, Footer, Hero, About, Contact.
 *
 * On the homepage route, fetching is disabled because the aggregated
 * /api/v1/homepage endpoint already includes profile data and seeds
 * this cache via queryClient.setQueryData.  The hook still subscribes
 * to the ["profile"] cache key, so it re-renders automatically once
 * HomePage populates the cache — without ever firing a separate request.
 *
 * On every other route, it fetches /api/v1/profile normally (or serves
 * from the 5-minute staleTime cache if the visitor came from the homepage).
 */
export function useProfile() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !isHomepage,
  });
}
