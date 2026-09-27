import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Achievements from "../components/Achievements";
import Articles from "../components/Articles";
import Contact from "../components/Contact";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomepageData } from "../../services/homepageApi";
import { motion } from "motion/react";
import Projects from "../components/Projects";
import Publications from "../components/Publications";

export default function HomePage() {

  const location = useLocation();
  const navigate = useNavigate();

  // Single API call fetches all homepage data at once (7 requests → 1).
  const { data: homepage } = useQuery({
    queryKey: ["homepage"],
    queryFn: fetchHomepageData,
  });

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
      <Hero profile={homepage?.profile} />
      <About profile={homepage?.profile} stats={homepage?.stats} />
      <Projects projects={homepage?.projects} />
      <Publications publications={homepage?.publications} />
      <Skills skills={homepage?.skills} />
      <Achievements achievements={homepage?.achievements} />
      <Articles articles={homepage?.blogs} />
      <Contact profile={homepage?.profile} />
    </div>
  );
}
