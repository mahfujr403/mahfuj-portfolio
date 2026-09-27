import { apiFetch } from "./apiClient";
import { normalizePublications } from "./publicationsApi";

/**
 * Fetches all homepage data in a single API call, collapsing 7 individual
 * requests (profile, stats, projects, publications, skills, achievements,
 * blogs) into 1 round-trip.
 */
export interface HomepageData {
  profile: any;
  stats: { projects: number; publications: number };
  projects: any[];
  publications: any[];
  skills: Array<{ category: string; skills: Array<{ name: string; level: number }> }>;
  achievements: any[];
  blogs: any[];
}

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

export async function fetchHomepageData(): Promise<HomepageData> {
  const raw = await apiFetch<any>("api/v1/homepage");
  return {
    profile: normalizeProfile(raw.profile),
    stats: raw.stats,
    projects: raw.projects ?? [],
    publications: normalizePublications(raw.publications ?? []),
    skills: raw.skills ?? [],
    achievements: raw.achievements ?? [],
    blogs: raw.blogs ?? [],
  };
}
