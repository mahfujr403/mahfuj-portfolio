import { Github, Linkedin, Mail, Phone, Download, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
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
    <section id="hero" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Hero-specific background effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0f1e] via-[#050814] to-transparent" />

      {/* Background ambient lighting - optimized */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Floating particles specific to hero - lightweight */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(i * 18 + 10) % 100}%`,
              top: `${(i * 15 + 20) % 100}%`,
              background: i % 2 === 0 ? "rgba(0, 242, 254, 0.25)" : "rgba(139, 92, 246, 0.25)",
              boxShadow: i % 2 === 0
                ? "0 0 10px rgba(0, 242, 254, 0.4)"
                : "0 0 10px rgba(139, 92, 246, 0.4)",
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid overlay specific to hero */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 242, 254, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 254, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left column: Profile Image (1/3) */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative">
              {/* Glow background - circular */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/30 via-[#38bdf8]/20 to-[#818cf8]/30 rounded-full blur-2xl opacity-40"
              />
              {/* Image container - circular */}
              <div
                className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden glass border-2 border-white/25 glow-cyan transition-transform duration-300 hover:scale-105 shadow-2xl shadow-[#00f2fe]/10"
              >
                <img
                  src={profile.profileImage || "/images/profile-default.jpg"}
                  alt={profile.name || "Md. Mahfujur Rahman"}
                  width={320}
                  height={320}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right column: Text Content (2/3) */}
          <div className="lg:col-span-2 text-center lg:text-left max-w-3xl order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-mono text-gray-300 tracking-wide">Available for ML Engineer & AI Research Roles</span>
            </div>

            {/* Name from database - renders instantly for 0ms LCP */}
            <h2 className="text-5xl lg:text-7xl font-bold font-display mb-4 gradient-text leading-tight tracking-tight">
              {profile.name || "Md. Mahfujur Rahman"}
            </h2>

            {/* Tagline with infinite typewriter animation */}
            <div className="text-2xl lg:text-3xl font-semibold font-display text-[#00f2fe] mb-6 min-h-[2.5rem]">
              <Typewriter
                text={profile.tagline || "AI Engineer & Researcher"}
                speed={80}
                delay={400}
                infinite={true}
                deleteSpeed={40}
                deleteDelay={2000}
              />
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-xl lg:text-2xl font-medium leading-relaxed text-gray-300">
              {profile.headline || "Transforming Complex Data into Intelligent Solutions"}
            </h1>

            <p className="text-base lg:text-lg text-gray-400 mb-8 leading-relaxed">
              {profile.impactStatement}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 bg-gradient-to-r from-[#00f2fe] via-[#38bdf8] to-[#818cf8] text-[#060913] font-semibold rounded-xl inline-flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] transition-all duration-300 text-sm"
              >
                View Projects
                <ArrowRight size={16} />
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 glass border border-white/15 text-gray-200 font-semibold rounded-xl hover:border-[#00f2fe]/60 transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Download size={16} />
                Download Resume
              </motion.button>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 glass border border-white/10 text-gray-300 font-semibold rounded-xl hover:border-white/30 transition-all duration-300 text-sm"
              >
                Contact Me
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-4">
              {(profile.socialLinks ?? []).map((social: any) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return Icon ? (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== "Email" && social.platform !== "Phone" ? "_blank" : undefined}
                    rel={social.platform !== "Email" && social.platform !== "Phone" ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.1 }}
                    className="p-4 glass border border-white/10 rounded-full hover:border-[#00f2fe]/50 hover:text-[#00f2fe] text-gray-400 transition-all duration-300 glow-hover-cyan"
                    aria-label={social.platform}
                  >
                    <Icon size={20} />
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
