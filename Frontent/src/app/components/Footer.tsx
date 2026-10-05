import { Link } from "react-router";
import { Github, Linkedin, Mail, Phone, ArrowUp, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { useProfile } from "../hooks/useProfile";

export default function Footer() {
  const { data: profile = { socialLinks: [] } } = useProfile();

  const otherLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Projects", href: "/#projects" },
    { label: "Publications", href: "/publications" },
    { label: "Skills", href: "/#skills" },
    { label: "Articles", href: "/#articles" },
    { label: "Contact", href: "/#contact" },
  ];

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    mail: Mail,
    phone: Phone,
    googleScholar: GraduationCap,
    scholar: GraduationCap,
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-16 pb-12 mt-20 border-t border-border/80 bg-[#080b10]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Bio / Focus */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-medium">
                Systems Telemetry: Operational
              </span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight">
              {profile.name || "Md. Mahfujur Rahman"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              {profile.tagline || "Machine Learning Engineer & Researcher specializing in Deep Learning, Computer Vision, and Production ML Systems."}
            </p>
            {(profile.email || profile.phone) && (
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Mail size={13} className="text-primary" />
                    {profile.email}
                  </a>
                )}
                {profile.email && profile.phone && <span>/</span>}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Phone size={13} className="text-primary" />
                    {profile.phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Navigation Links (2 Columns) */}
          <div className="md:col-span-4">
            <div className="w-fit md:mx-auto space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold text-center">
                Navigation
              </h4>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                {otherLinks.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/#") ? (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Network & Research Handles */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Connect & Repositories
            </h4>
            <div className="flex flex-wrap gap-2">
              {(profile.socialLinks ?? []).map((social: any) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return Icon ? (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== "Email" && social.platform !== "Phone" ? "_blank" : undefined}
                    rel={social.platform !== "Email" && social.platform !== "Phone" ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-secondary transition-all"
                    aria-label={social.platform}
                  >
                    <Icon size={16} />
                  </motion.a>
                ) : null;
              })}
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Open to research collaborations, AI consulting, and technical advisory roles.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-mono">
            &copy; {new Date().getFullYear()} {profile.name || "Md. Mahfujur Rahman"}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border-active text-xs font-medium transition-all cursor-pointer"
          >
            <ArrowUp size={13} />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
