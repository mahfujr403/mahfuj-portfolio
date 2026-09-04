import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../../services/profileApi";

/** Shared profile query prevents Hero, About and Contact from issuing duplicate requests. */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
}
