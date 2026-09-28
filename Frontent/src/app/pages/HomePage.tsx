import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Achievements from "../components/Achievements";
import Articles from "../components/Articles";
import Contact from "../components/Contact";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchHomepageData } from "../../services/homepageApi";
import Projects from "../components/Projects";
import Publications from "../components/Publications";

export default function HomePage() {

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Single API call fetches all homepage data at once (7 requests → 1).
  const { data: homepage } = useQuery({
    queryKey: ["homepage"],
    queryFn: fetchHomepageData,
  });

  // Seed individual query caches so Navbar/Footer's useProfile() (and any
  // other page that reuses these query keys) finds data already present
  // and never fires its own fetch.
  useEffect(() => {
    if (!homepage) return;
    queryClient.setQueryData(["profile"], homepage.profile);
    queryClient.setQueryData(["portfolio-stats"], homepage.stats);
    queryClient.setQueryData(["projects", 6, 0], homepage.projects);
    queryClient.setQueryData(["publications", 3, 0], homepage.publications);
    queryClient.setQueryData(["skills"], homepage.skills);
    queryClient.setQueryData(["achievements", 2, 0], homepage.achievements);
    queryClient.setQueryData(["blogs"], homepage.blogs);
  }, [homepage, queryClient]);

  useEffect(() => {
    const target = (location.state as any)?.scrollTo as string | undefined;
    if (!target) return;

    // Attempt to scroll to element; retry briefly if not found yet
    const attemptScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // clear navigation state so reloading doesn't re-scroll
        navigate(location.pathname, { replace: true, state: {} });
        return true;
      }
      return false;
    };

    if (!attemptScroll()) {
      const id = window.setTimeout(() => {
        attemptScroll();
        window.clearTimeout(id);
      }, 120);
    }
  }, [location, navigate]);

  // Don't render sections until homepage data has loaded.
  // This prevents the race condition where child components mount with
  // undefined props and fire their own individual API requests.
  if (!homepage) return null;

  return (
    <div>
      <Hero profile={homepage.profile} />
      <About profile={homepage.profile} stats={homepage.stats} />
      <Projects projects={homepage.projects} />
      <Publications publications={homepage.publications} />
      <Skills skills={homepage.skills} />
      <Achievements achievements={homepage.achievements} />
      <Articles articles={homepage.blogs} />
      <Contact profile={homepage.profile} />
    </div>
  );
}
