import { Github, Linkedin, Mail, Phone, Download, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../services/profileApi";
import { toast } from "sonner";
import { downloadAndOpen } from "../../utils/download";
import { Typewriter } from "./TypeWriter";

export default function Hero() {
  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    mail: Mail,
    phone: Phone,
    googleScholar: GraduationCap,
    scholar: GraduationCap,
  };

  const [profile, setProfile] = useState<any>({ socialLinks: [] });

  useEffect(() => {
    let mounted = true;
    fetchProfile()
      .then((p) => { if (mounted && p) setProfile(p); })
      .catch(() => {})
    return () => { mounted = false; };
  }, []);

  return (
    <section id="hero" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Hero-specific background effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0f1e] via-[#050814] to-transparent" />

      {/* Animated radial pulses */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]"
          style={{
            background: "radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, rgba(0, 242, 254, 0.02) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.02) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Floating particles specific to hero - reduced */}
      <div className="absolute inset-0 z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "rgba(0, 242, 254, 0.2)" : "rgba(139, 92, 246, 0.2)",
              boxShadow: i % 2 === 0
                ? "0 0 10px rgba(0, 242, 254, 0.4)"
                : "0 0 10px rgba(139, 92, 246, 0.4)",
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center order-2 lg:order-1"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              animate={{ y: [0, -8, 0] }}
            >
              {/* Rotating glow background - circular */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#00f2fe] via-[#8b5cf6] to-[#00f2fe] rounded-full blur-3xl opacity-20"
                animate={{ 
                  opacity: [0.15, 0.3, 0.15],
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              {/* Image container - circular */}
              <motion.div 
                className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden glass border-2 border-white/30 glow-cyan"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0, 242, 254, 0.3)",
                    "0 0 40px rgba(0, 242, 254, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 20px rgba(0, 242, 254, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right column: Text Content (2/3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 text-center lg:text-left max-w-3xl order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00f2fe]/30 mb-6"
            >
              <Sparkles className="text-[#00f2fe]" size={16} />
              <span className="text-sm text-gray-300">Assakamu Alaikum</span>
            </motion.div>

            {/* Name from database */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold mb-4 gradient-text leading-tight"
            >
              {profile.name || "Md. Mahfujur Rahman"}
            </motion.h2>

            {/* Tagline with infinite typewriter animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl lg:text-3xl font-semibold text-[#00f2fe] mb-6"
            >
              <Typewriter 
                text={profile.tagline || "AI Engineer & Researcher"} 
                speed={80}
                delay={400}
                infinite={true}
                deleteSpeed={40}
                deleteDelay={1500}
              />
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 text-2xl lg:text-3xl font-semibold leading-tight text-gray-300"
            >
              {profile.headline || "Transforming Complex Data into Intelligent Solutions"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg lg:text-xl text-gray-400 mb-8 leading-relaxed"
            >
              {profile.impactStatement}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold rounded-xl inline-flex items-center justify-center lg:justify-start gap-2 transition-all duration-300"
              >
                View Projects
                <ArrowRight size={18} />
              </motion.a>

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
                className="px-8 py-4 glass border border-[#00f2fe]/50 text-gray-200 font-semibold rounded-xl hover:border-[#00f2fe] transition-all duration-300 inline-flex items-center justify-center gap-2 glow-hover-cyan"
              >
                <Download size={18} />
                Download Resume
              </motion.button>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass border border-white/10 text-gray-300 font-semibold rounded-xl hover:border-white/30 transition-all duration-300"
              >
                Contact Me
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {(profile.socialLinks ?? []).map((social: any, index: number) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return Icon ? (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== "Email" && social.platform !== "Phone" ? "_blank" : undefined}
                    rel={social.platform !== "Email" && social.platform !== "Phone" ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    className="p-4 glass border border-white/10 rounded-full hover:border-[#00f2fe]/50 hover:text-[#00f2fe] text-gray-400 transition-all duration-300 glow-hover-cyan"
                    aria-label={social.platform}
                  >
                    <Icon size={20} />
                  </motion.a>
                ) : null;
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
