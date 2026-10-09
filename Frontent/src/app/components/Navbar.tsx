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
    { label: "About", href: "/#about" },
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
          window.history.replaceState(null, "", href);
        }
      } else {
        navigate({ pathname: "/", hash: `#${sectionId}` }, { state: { scrollTo: sectionId } });
      }
      setIsMenuOpen(false);
    } else if (href === "/") {
      e.preventDefault();
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.replaceState(null, "", "/");
      } else {
        navigate("/");
      }
      setIsMenuOpen(false);
    }
  };

  const prefetchPublications = () => {
    queryClient.prefetchQuery({
      queryKey: ["publications", 200, 0],
      queryFn: () => listPublications(200, 0),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0B0E14] border-b transition-colors duration-150 ${
        scrolled ? "border-[#222C3D] shadow-xs" : "border-[#182232]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Typographically clean brand / name */}
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm py-1"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }
            }}
          >
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
              {profile?.name || "Md. Mahfujur Rahman"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center h-full gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const linkClasses = `text-sm transition-colors duration-150 relative h-16 flex items-center cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-sm ${
                active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`;

              return link.href.startsWith("/#") || link.href === "/" ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => {
                    if (link.href.includes("publications")) prefetchPublications();
                  }}
                  className={linkClasses}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onMouseEnter={() => {
                    if (link.href === "/publications") prefetchPublications();
                  }}
                  className={linkClasses}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Restrained Resume Button */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                await handleResumeDownload(profile?.resumeUrl);
              }}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-secondary text-foreground border border-border text-xs font-medium rounded-md hover:bg-secondary/80 hover:border-border-active transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
            >
              <FileText className="size-3.5 text-muted-foreground" />
              <span>Resume</span>
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#222C3D] bg-[#111620] px-2 mb-2 rounded-b-md">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                const mobileClasses = `px-3 min-h-[44px] flex items-center text-sm font-medium transition-colors cursor-pointer rounded-sm ${
                  active
                    ? "text-foreground font-semibold border-l-2 border-primary bg-[#18202E]/60 pl-3"
                    : "text-muted-foreground hover:text-foreground hover:bg-[#18202E]/40"
                }`;

                return link.href.startsWith("/#") || link.href === "/" ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={mobileClasses}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onTouchStart={() => {
                      if (link.href === "/publications") prefetchPublications();
                    }}
                    className={mobileClasses}
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
                className="mt-2 flex items-center justify-center gap-2 min-h-[44px] px-4 bg-primary text-white font-medium rounded-md text-sm cursor-pointer hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
              >
                <FileText className="size-4" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}