import { Github, Linkedin, Mail, Phone, Download, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { useProfile } from "../hooks/useProfile";
import { toast } from "sonner";
import { downloadAndOpen } from "../../utils/download";
import { Typewriter } from "./TypeWriter";

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
    <section id="hero" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting - architectural slate */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(14, 19, 27, 0) 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Profile Photo Column - First on mobile & desktop */}
          <div className="lg:col-span-4 flex justify-center order-1">
            <div className="relative group">
              {/* Subtle architectural ambient aura */}
              <div
                className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"
              />
              {/* Technical framed avatar */}
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 lg:w-72 lg:h-72 rounded-full overflow-hidden border border-border/80 bg-secondary/30 ring-1 ring-primary/20 shadow-xl transition-all duration-300 group-hover:border-primary/50">
                <img
                  src={profile.profileImage || "/images/profile-default.jpg"}
                  alt={profile.name || "Md. Mahfujur Rahman"}
                  width={320}
                  height={320}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              {/* Telemetry live status tag on avatar */}
              <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0e131b]/95 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 shadow-md">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Narrative Content Column */}
          <div className="lg:col-span-8 text-center lg:text-left order-2">
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5 max-w-full">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)] shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono text-emerald-300 font-medium whitespace-nowrap tracking-tight">
                <span className="sm:hidden">Available for ML & AI Research</span>
                <span className="hidden sm:inline">Available for ML Engineering & Applied AI Research</span>
              </span>
            </div>

            {/* Semantic H1: Engineer Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display mb-3 tracking-tight text-foreground leading-[1.1]">
              {profile.name || "Md. Mahfujur Rahman"}
            </h1>

            {/* Subtitle / Focus Domain with Typewriter */}
            <div className="text-xl sm:text-2xl font-semibold font-display text-primary mb-4 min-h-[2rem]">
              <Typewriter
                text={profile.tagline || "Machine Learning Engineer & Researcher"}
                speed={70}
                delay={300}
                infinite={true}
                deleteSpeed={35}
                deleteDelay={2200}
              />
            </div>

            {/* Headline statement */}
            <h2 className="mb-4 text-base sm:text-lg font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              {profile.headline || "Specializing in Deep Learning, Computer Vision, and Production ML Systems."}
            </h2>

            {/* Impact Statement */}
            {profile.impactStatement && (
              <p className="text-sm sm:text-base text-muted-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {profile.impactStatement}
              </p>
            )}

            {/* Action Bar with clear hierarchy */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                <span>Explore Projects</span>
                <ArrowRight size={15} />
              </motion.a>

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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground text-sm font-medium hover:bg-secondary hover:border-border-active transition-all cursor-pointer"
              >
                <Download size={15} className="text-primary" />
                <span>Download CV</span>
              </motion.button>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition-all"
              >
                <span>Contact</span>
              </motion.a>
            </div>

            {/* Social handles strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
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
                    className="p-2 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-secondary transition-all"
                    aria-label={social.platform}
                  >
                    <Icon size={16} />
                  </motion.a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
