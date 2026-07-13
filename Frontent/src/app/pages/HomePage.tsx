import Hero from "../components/Hero";
import About from "../components/About";
// import ProjectCard from "../components/ProjectCard";
// import PublicationCard from "../components/PublicationCard";
import Skills from "../components/Skills";
import Achievements from "../components/Achievements";
import Articles from "../components/Articles";
import Contact from "../components/Contact";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
// import { listProjects } from "../../services/projectsApi";
import { usePublications } from "../hooks/usePublications";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Projects from "../components/Projects";
import Publications from "../components/Publications";

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
