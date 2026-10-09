import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

export default function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    // Preserve in-page and cross-page anchor navigation (e.g. /#projects, /#about, /#contact)
    if (location.hash || (location.state as any)?.scrollTo) return;

    // Reset scroll position instantly to top for page-level route changes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.hash, location.state]);
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden isolate">
      {/* Global ML background layer shared by all pages */}
      <AnimatedBackground />

      {/* Fixed navbar (z-50) */}
      <Navbar />

      {/* Content (z-10) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
