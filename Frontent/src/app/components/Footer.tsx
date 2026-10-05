import { Link } from "react-router";
import { Github, Linkedin, Mail, Phone, ArrowUp, GraduationCap } from "lucide-react";
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
    <footer className="relative pt-12 pb-12 border-t border-border-subtle bg-[#080b10]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Bio / Focus */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 select-none" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Available for Engineering &amp; Research
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
            <div className="space-y-3 md:max-w-[240px] md:mx-auto">
              <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                Navigation
              </h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
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
              Connect &amp; Repositories
            </h4>
            <div className="flex flex-wrap gap-2">
              {(profile.socialLinks ?? []).map((social: any) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== "Email" && social.platform !== "Phone" ? "_blank" : undefined}
                    rel={social.platform !== "Email" && social.platform !== "Phone" ? "noopener noreferrer" : undefined}
                    className="p-2.5 bg-[#111620] border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-border-active hover:bg-[#18202E] transition-colors focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
                    aria-label={social.platform}
                  >
                    <Icon size={16} />
                  </a>
                ) : null;
              })}
            </div>
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Open to research collaborations, AI consulting, and technical advisory roles.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
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
