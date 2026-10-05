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
export const DEFAULT_PROFILE = {
  name: "Md. Mahfujur Rahman",
  tagline: "ML Engineer & Researcher",
  headline: "Transforming Complex Data into Intelligent Solutions",
  impactStatement: "From model training to deployment — building AI systems that deliver impact",
  bio: "I specialize in building end-to-end machine learning systems — from research and model development to scalable deployment and production integration. Passionate about transforming AI research into real-world applications using deep learning, computer vision, and intelligent automation.",
  profileImage: "/images/profile-default.jpg",
  resumeUrl: "",
  email: "mahfujr403@gmail.com",
  phone: "+8801771431724",
  location: "Rajshahi, Bangladesh",
  socialLinks: [
    { url: "https://linkedin.com/in/mahfujr403", icon: "linkedin", platform: "LinkedIn" },
    { url: "https://github.com/mahfujr403", icon: "github", platform: "GitHub" },
    { url: "https://scholar.google.com/citations?user=ssuw-WEAAAAJ&hl=en", icon: "googleScholar", platform: "Scholar" }
  ],
  contactCTA: "Let's build intelligent systems together."
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    placeholderData: DEFAULT_PROFILE,
  });
}

