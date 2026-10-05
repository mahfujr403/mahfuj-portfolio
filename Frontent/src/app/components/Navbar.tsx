import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";
import { motion } from "motion/react";
import { toast } from "sonner";
import { downloadAndOpen } from "../../utils/download";
import { useQueryClient } from "@tanstack/react-query";
import { listPublications } from "../../services/publicationsApi";

export default function Navbar() {
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll-spy active section detection
      if (location.pathname === "/") {
        const sections = [
          { id: "contact", name: "contact" },
          { id: "articles", name: "articles" },
          { id: "skills", name: "skills" },
          { id: "publications", name: "publications" },
          { id: "projects", name: "projects" },
          { id: "about", name: "about" },
          { id: "hero", name: "home" },
        ];

        const scrollPosition = window.scrollY + 200;
        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sec.name);
              break;
            }
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/#projects" },
    { label: "Publications", href: "/#publications" },
    { label: "Skills", href: "/#skills" },
    { label: "Writing", href: "/#articles" },
    { label: "Contact", href: "/#contact" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/#publications" || href === "/publications") {
      return (
        location.pathname.startsWith("/publications") ||
        (location.pathname === "/" && activeSection === "publications")
      );
    }
    if (location.pathname !== "/") return false;
    if (href === "/") return activeSection === "home";
    const section = href.replace("/#", "");
    return activeSection === section;
  };

  const { data: profile = { name: "", resumeUrl: "", socialLinks: [] } } = useProfile();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link (section navigation)
    if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.substring(2); // Remove "/#"

      // If we're on the homepage
      if (location.pathname === "/") {
        // Scroll to the section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to homepage and pass desired section id in navigation state
        e.preventDefault();
        navigate("/", { state: { scrollTo: sectionId } });
        setIsMenuOpen(false);
      }
      setIsMenuOpen(false);
    } else if (href === "/") {
      // Home link - navigate and scroll to top
      e.preventDefault();
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    }
    // For other links (like /publications), let default navigation happen
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="font-bold text-xl gradient-text"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {profile?.name || "Md. Mahfujur Rahman"}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return link.href.startsWith("/#") || link.href === "/" ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => {
                    if (link.href.includes("publications")) {
                      queryClient.prefetchQuery({
                        queryKey: ["publications", 200, 0],
                        queryFn: () => listPublications(200, 0),
                        staleTime: 5 * 60 * 1000,
                      });
                    }
                  }}
                  className={`text-sm transition-all duration-200 relative group cursor-pointer ${
                    active ? "text-[#00f2fe] font-semibold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#00f2fe] to-[#818cf8] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onMouseEnter={() => {
                    if (link.href === "/publications") {
                      queryClient.prefetchQuery({
                        queryKey: ["publications", 200, 0],
                        queryFn: () => listPublications(200, 0),
                        staleTime: 5 * 60 * 1000,
                      });
                    }
                  }}
                  className={`text-sm transition-all duration-200 relative group ${
                    active ? "text-[#00f2fe] font-semibold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#00f2fe] to-[#818cf8] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            <motion.button
              onClick={async (e) => {
                e.preventDefault();
                const dbResume = profile?.resumeUrl?.trim();
                if (dbResume) {
                  try {
                    toast("Downloading resume...");
                    await downloadAndOpen(dbResume);
                    toast.success("Resume download started");
                    return;
                  } catch (err) {
                    console.warn("Database resume download failed, falling back to /resume.pdf", err);
                  }
                }
                try {
                  toast("Downloading resume...");
                  await downloadAndOpen("/resume.pdf");
                  toast.success("Resume download started");
                } catch (err) {
                  toast.error("Download failed. Please contact via email.");
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-[#00f2fe] via-[#38bdf8] to-[#818cf8] text-[#060913] text-sm font-semibold rounded-lg hover:shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all duration-300 cursor-pointer"
            >
              Resume
            </motion.button>
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return link.href.startsWith("/#") || link.href === "/" ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      active
                        ? "bg-[#00f2fe]/10 text-[#00f2fe] font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onTouchStart={() => {
                      if (link.href === "/publications") {
                        queryClient.prefetchQuery({
                          queryKey: ["publications", 200, 0],
                          queryFn: () => listPublications(200, 0),
                          staleTime: 5 * 60 * 1000,
                        });
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[#00f2fe]/10 text-[#00f2fe] font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const dbResume = profile?.resumeUrl?.trim();
                  if (dbResume) {
                    try {
                      toast("Downloading resume...");
                      await downloadAndOpen(dbResume);
                      toast.success("Resume download started");
                      setIsMenuOpen(false);
                      return;
                    } catch (err) {
                      console.warn("Database resume download failed, falling back to /resume.pdf", err);
                    }
                  }
                  try {
                    toast("Downloading resume...");
                    await downloadAndOpen("/resume.pdf");
                    toast.success("Resume download started");
                  } catch (err) {
                    toast.error("Download failed. Please contact via email.");
                  }
                  setIsMenuOpen(false);
                }}
                className="mt-2 px-4 py-2.5 bg-gradient-to-r from-[#00f2fe] via-[#38bdf8] to-[#818cf8] text-[#060913] font-semibold rounded-lg text-center text-sm cursor-pointer"
              >
                Download Resume
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}