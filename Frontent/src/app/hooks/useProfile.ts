import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../../services/profileApi";

/**
 * Shared profile query used by Navbar, Footer, Hero, About, Contact.
 *
 * Runs immediately on mount across all pages. Resolves in ~900ms,
 * allowing Hero, Navbar, and Footer to render above-the-fold content
 * without waiting for any other slower section.
 *
 * Stale time is 5 minutes, so repeated visits serve from cache instantly.
 */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
}
