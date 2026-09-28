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
  // The queryFn seeds every individual cache key as soon as data arrives,
  // so Navbar/Footer's useProfile() (which subscribes to ["profile"] but
  // has fetching disabled on "/") gets the data without a separate request.
  const { data: homepage, isLoading } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const data = await fetchHomepageData();
      // Seed individual caches synchronously before the re-render.
      queryClient.setQueryData(["profile"], data.profile);
      queryClient.setQueryData(["portfolio-stats"], data.stats);
      queryClient.setQueryData(["projects", 6, 0], data.projects);
      queryClient.setQueryData(["publications", 3, 0], data.publications);
      queryClient.setQueryData(["skills"], data.skills);
      queryClient.setQueryData(["achievements", 2, 0], data.achievements);
      queryClient.setQueryData(["blogs"], data.blogs);
      return data;
    },
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

  // Show a loading skeleton while the aggregated API call is in flight,
  // so the page doesn't appear blank between Navbar and Footer.
  if (!homepage) {
    return (
      <div className="min-h-screen">
        {/* Hero skeleton */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="flex justify-center order-2 lg:order-1">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full glass border border-white/10 animate-pulse" />
              </div>
              <div className="lg:col-span-2 text-center lg:text-left order-1 lg:order-2 space-y-4">
                <div className="h-6 w-40 rounded-full glass animate-pulse" />
                <div className="h-14 w-3/4 rounded-xl glass animate-pulse" />
                <div className="h-8 w-1/2 rounded-lg glass animate-pulse" />
                <div className="h-20 w-full rounded-lg glass animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-12 w-36 rounded-xl glass animate-pulse" />
                  <div className="h-12 w-44 rounded-xl glass animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section skeletons */}
        {[1, 2, 3].map((i) => (
          <section key={i} className="py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 space-y-4">
                <div className="h-10 w-64 mx-auto rounded-xl glass animate-pulse" />
                <div className="w-20 h-1 mx-auto rounded glass animate-pulse" />
                <div className="h-5 w-96 max-w-full mx-auto rounded-lg glass animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-64 rounded-3xl glass border border-white/10 animate-pulse" />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

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
