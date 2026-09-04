import { apiFetch } from "./apiClient";

function normalizeProfile(p: any) {
  if (!p) return p;
  return {
    name: p.name ?? p.full_name ?? p.fullName,
    tagline: p.tagline ?? p.tag_line,
    headline: p.headline ?? p.title,
    impactStatement: p.impactStatement ?? p.impact_statement ?? p.impact,
    bio: p.bio ?? p.description,
    profileImage: p.profileImage ?? p.profile_image ?? p.avatar,
    resumeUrl: p.resumeUrl ?? p.resume_url ?? p.cv_url,
    email: p.email,
    phone: p.phone,
    location: p.location,
    socialLinks: p.socialLinks ?? p.social_links ?? p.links ?? [],
    contactCTA: p.contactCTA ?? p.contact_cta ?? p.contactCta ?? p.contact_text,
  };
}

let profilePromise: Promise<any> | null = null;

export function fetchProfile(): Promise<any> {
  // Deduplicate concurrent calls at the service boundary. This guarantees a
  // single HTTP request even if multiple independently mounted components ask
  // for the profile before React Query has populated its cache.
  if (!profilePromise) {
    profilePromise = apiFetch<any>("api/v1/profile")
      .then(normalizeProfile)
      .catch((error) => {
        // Do not permanently cache failures; a later query should be able to retry.
        profilePromise = null;
        throw error;
      });
  }

  return profilePromise;
}

export async function upsertProfile(data: any): Promise<any> {
  // Accept camelCase input and send through unchanged; backend should handle shape.
  return await apiFetch<any>("api/v1/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export default { fetchProfile, upsertProfile };
