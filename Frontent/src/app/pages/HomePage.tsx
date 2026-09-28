import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Achievements from "../components/Achievements";
import Articles from "../components/Articles";
import Contact from "../components/Contact";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import Projects from "../components/Projects";
import Publications from "../components/Publications";

/**
 * HomePage with Progressive Section Loading:
 *
 * Rather than blocking the entire page behind a single slow aggregated query,
 * every section mounts immediately and loads its data concurrently:
 *  - Hero + Navbar + Footer: ~900ms via useProfile() (above the fold is instantly visible)
 *  - About stats: ~1s via usePortfolioStats()
 *  - Featured Projects: ~1s via listProjects()
 *  - Publications: ~1s via listPublications()
 *  - Articles / Blogs: ~1.2s via fetchArticles()
 *  - Skills & Achievements: ~1.5-2.2s
 *
 * Each section displays its own subtle shimmer skeleton while in flight,
 * so there is zero layout shift, zero blank screen, and no 4-second waiting freeze.
 */
export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div>
      <Hero />
      <About />
      <Projects />
      <Publications />
      <Skills />
      <Achievements />
      <Articles />
      <Contact />
    </div>
  );
}
