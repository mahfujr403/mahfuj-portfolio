import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProfile } from "../../services/profileApi";
import { motion } from "motion/react";
import { toast } from "sonner";
import { downloadAndOpen } from "../../utils/download";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/#projects" },
    { label: "Publications", href: "/publications" },
    { label: "Skills", href: "/#skills" },
    { label: "Writing", href: "/#articles" },
    { label: "Contact", href: "/#contact" },
  ];

  const [profile, setProfile] = useState<any>({ name: "", resumeUrl: "" });

  useEffect(() => {
    let mounted = true;
    fetchProfile()
      .then((p) => {
        if (mounted && p) setProfile(p);
      })
      .catch(() => {})
    return () => { mounted = false; };
  }, []);

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
            {profile?.name ?? ""}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/#") || link.href === "/" ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-300 hover:text-[#00f2fe] transition-colors relative group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-300 hover:text-[#00f2fe] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] group-hover:w-full transition-all duration-300" />
                </Link>
              )
            ))}
            <motion.button
              onClick={async (e) => {
                e.preventDefault();
                if (!profile?.resumeUrl) return toast.error("Resume not available");
                try {
                  toast("Downloading...");
                  await downloadAndOpen(profile.resumeUrl);
                  toast.success("Download started");
                } catch (err) {
                  toast.error("Download failed");
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-medium rounded-lg hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all duration-300"
            >
              Resume
            </motion.button>
          </div>

          <button
            className="md:hidden p-2 text-gray-300"
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
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/#") || link.href === "/" ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-300 hover:text-[#00f2fe] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-gray-300 hover:text-[#00f2fe] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}

              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (!profile?.resumeUrl) return toast.error("Resume not available");
                  try {
                      toast("Downloading...");
                      await downloadAndOpen(profile.resumeUrl);
                      toast.success("Download started");
                    } catch (err) {
                      toast.error("Download failed");
                    }
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-medium rounded-lg text-center"
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