import { Github, Linkedin, Mail, Phone, Download, ArrowRight, GraduationCap } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { handleResumeDownload } from "../../utils/download";

export default function Hero({ profile: propProfile }: { profile?: any }) {
  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    mail: Mail,
    phone: Phone,
    googleScholar: GraduationCap,
    scholar: GraduationCap,
  };

  const { data: hookProfile } = useProfile();
  const profile = propProfile ?? hookProfile ?? { socialLinks: [] };

  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Content Column: Editorial Presentation */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            
            {/* Availability Status: Static emerald dot, no pulse, subtle neutral capsule */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111620] border border-border mb-6 select-none max-w-full">
              <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono text-emerald-400 font-medium tracking-tight whitespace-nowrap">
                <span className="hidden sm:inline">Available for ML Engineering &amp; Applied AI Roles</span>
                <span className="sm:hidden">Available for ML &amp; Applied AI</span>
              </span>
            </div>

            {/* Display Name: clamp(2.5rem, 5vw, 3.75rem), font-extrabold */}
            <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold font-display tracking-tight text-foreground leading-[1.1] mb-3">
              {profile.name || "Md. Mahfujur Rahman"}
            </h1>

            {/* Static Role / Specialization (No typewriter, no blinking cursor, no gradient) */}
            <p className="text-xl sm:text-2xl font-semibold font-display text-primary tracking-tight mb-4">
              {profile.tagline || "Machine Learning Engineer & Researcher"}
            </p>

            {/* Factual Positioning Headline */}
            <h2 className="text-base sm:text-lg font-medium text-foreground/90 leading-snug tracking-normal [word-spacing:0.18em] max-w-2xl lg:max-w-3xl xl:max-w-4xl text-balance mb-3">
              {profile.headline || "Specializing in Deep Learning, Computer Vision, and Production ML Systems."}
            </h2>

            {/* Impact Statement */}
            {profile.impactStatement && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed tracking-normal [word-spacing:0.16em] max-w-2xl lg:max-w-3xl xl:max-w-4xl text-balance mb-8">
                {profile.impactStatement}
              </p>
            )}

            {/* Action Hierarchy: Primary, Secondary, Link */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary-hover active:scale-[0.99] transition-colors shadow-xs select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] w-full sm:w-auto"
              >
                <span>Explore Projects</span>
                <ArrowRight size={15} />
              </a>

              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleResumeDownload(profile?.resumeUrl);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 bg-secondary text-foreground border border-border text-sm font-medium rounded-md hover:bg-secondary/80 hover:border-border-active active:scale-[0.99] transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] w-full sm:w-auto"
                >
                  <Download size={15} className="text-muted-foreground" />
                  <span>Download CV</span>
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 bg-secondary text-foreground border border-border text-sm font-medium rounded-md hover:bg-secondary/80 hover:border-border-active active:scale-[0.99] transition-colors select-none focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] w-full sm:w-auto"
                >
                  <Mail size={15} className="text-muted-foreground" />
                  <span>Contact</span>
                </a>
              </div>
            </div>

            {/* Social Links: Clean restrained icon links with accessible labels */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5" aria-label="Professional and Academic Profiles">
              {(profile.socialLinks ?? []).map((social: any) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== "Email" && social.platform !== "Phone" ? "_blank" : undefined}
                    rel={social.platform !== "Email" && social.platform !== "Phone" ? "noopener noreferrer" : undefined}
                    className="size-9 sm:size-10 flex items-center justify-center rounded-md border border-border bg-[#111620] text-muted-foreground hover:text-foreground hover:border-border-active hover:bg-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
                    aria-label={social.platform}
                  >
                    <Icon size={16} />
                  </a>
                ) : null;
              })}
            </div>

          </div>

          {/* Portrait Column: Architectural Editorial Frame */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="w-48 sm:w-60 lg:w-full max-w-[340px] aspect-[4/5] rounded-[12px] overflow-hidden border border-border bg-[#111620] shadow-md">
              <img
                src={profile.profileImage || "/images/profile-default.jpg"}
                alt={profile.name || "Md. Mahfujur Rahman"}
                width={360}
                height={450}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
