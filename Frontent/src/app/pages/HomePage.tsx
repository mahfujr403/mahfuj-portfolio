import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Articles from "../components/Articles";
import Contact from "../components/Contact";
import { useLocation } from "react-router";
import { useEffect, useRef } from "react";
import Projects from "../components/Projects";
import Publications from "../components/Publications";

export default function HomePage() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Md. Mahfujur Rahman — AI Engineer & Researcher";
  }, []);

  useEffect(() => {
    const stateTarget = (location.state as any)?.scrollTo as string | undefined;
    const hashTarget = location.hash ? location.hash.replace(/^#/, "") : undefined;
    const target = stateTarget || hashTarget;
    if (!target) return;

    if (target === "home" || target === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let isCancelled = false;
    let userScrolled = false;

    const stopTracking = () => {
      userScrolled = true;
    };

    window.addEventListener("wheel", stopTracking, { passive: true });
    window.addEventListener("touchmove", stopTracking, { passive: true });

    const scrollToTarget = (smooth = true) => {
      if (isCancelled || userScrolled) return;
      const el = document.getElementById(target);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (Math.abs(rect.top - 80) > 15) {
        const targetY = Math.max(0, rect.top + window.scrollY - 80);
        try {
          window.scrollTo({
            top: targetY,
            behavior: smooth ? "smooth" : ("instant" as ScrollBehavior),
          });
        } catch {
          window.scrollTo(0, targetY);
        }
        if (stateTarget && typeof window !== "undefined" && window.history?.replaceState) {
          window.history.replaceState(null, "", location.pathname + (location.hash || `#${target}`));
        }
      }
    };

    // Immediate attempt
    scrollToTarget(false);

    // Observe container height changes as async query content loads
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          scrollToTarget(false);
        });
      });
      resizeObserver.observe(containerRef.current);
    }

    // Safety fallback timeouts
    const timeouts = [60, 150, 300, 600, 1000, 1500, 2200].map((delay) =>
      window.setTimeout(() => scrollToTarget(true), delay)
    );

    const stopTimeout = window.setTimeout(() => {
      if (resizeObserver) resizeObserver.disconnect();
    }, 3500);

    return () => {
      isCancelled = true;
      if (resizeObserver) resizeObserver.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(stopTimeout);
      window.removeEventListener("wheel", stopTracking);
      window.removeEventListener("touchmove", stopTracking);
    };
  }, [location.pathname, location.hash, location.state]);

  return (
    <div ref={containerRef}>
      <Hero />
      <About />
      <Projects />
      <Publications />
      <Skills />
      <Articles />
      <Contact />
    </div>
  );
}
