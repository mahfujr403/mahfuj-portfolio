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
  tagline: "AI/ML Engineer & Researcher",
  headline: "Building Production Ready Machine Learning Systems from Data to Deployment",
  impactStatement: "From model training to deployment, building AI systems that deliver real world impact.",
  bio: "I build end-to-end machine learning systems, from research and model development to scalable deployment and production integration. My work focuses on translating AI research into real-world applications across deep learning, computer vision, and intelligent automation.",
  profileImage: "https://res.cloudinary.com/dmpjh1aqa/image/upload/v1763322584/team-members/jpxxzw55sdnkfbyjmong.jpg",
  resumeUrl: "https://res.cloudinary.com/dmpjh1aqa/image/upload/v1778866131/Md__Mahfujur_Rahman_Resume_ML_Engineer_bc0r1i.pdf",
  email: "mahfujr403@gmail.com",
  phone: "+8801771431724",
  location: "Rajshahi, Bangladesh",
  socialLinks: [
    { url: "https://linkedin.com/in/mahfujr403", icon: "linkedin", platform: "LinkedIn" },
    { url: "https://github.com/mahfujr403", icon: "github", platform: "GitHub" },
    { url: "https://scholar.google.com/citations?user=ssuw-WEAAAAJ&hl=en", icon: "googleScholar", platform: "Google Scholar" }
  ],
  contactCTA: "Let’s turn research into real-world systems."
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    placeholderData: DEFAULT_PROFILE,
  });
}

