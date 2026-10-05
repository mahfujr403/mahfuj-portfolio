import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";
import { motion } from "motion/react";
import { handleResumeDownload } from "../../utils/download";
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

        const scrollPosition = window.scrollY + 180;
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
    if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.substring(2);

      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/", { state: { scrollTo: sectionId } });
      }
      setIsMenuOpen(false);
    } else if (href === "/") {
      e.preventDefault();
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#080b10]/85 backdrop-blur-md border-b border-border/80 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="size-2 rounded-full bg-primary/80 group-hover:bg-primary transition-colors shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
              {profile?.name || "Md. Mahfujur Rahman"}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
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
                  className={`text-sm transition-colors duration-150 relative py-1 cursor-pointer font-medium ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
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
                  className={`text-sm transition-colors duration-150 relative py-1 font-medium ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <button
              onClick={async (e) => {
                e.preventDefault();
                await handleResumeDownload(profile?.resumeUrl);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <FileText className="size-3.5" />
              Resume
            </button>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden py-4 border-t border-border/80 bg-[#0e131b]/95 backdrop-blur-xl rounded-b-xl px-2 mb-2"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return link.href.startsWith("/#") || link.href === "/" ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer font-medium ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
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
                    className={`px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
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
                  setIsMenuOpen(false);
                  await handleResumeDownload(profile?.resumeUrl);
                }}
                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm cursor-pointer hover:bg-primary/90 transition-all"
              >
                <FileText className="size-4" />
                Download Resume
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}