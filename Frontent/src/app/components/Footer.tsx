import { Link } from "react-router";
import { Github, Linkedin, Mail, Phone, ArrowUp, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../services/profileApi";

export default function Footer() {
  const [profile, setProfile] = useState<any>({ socialLinks: [] });

  useEffect(() => {
    let mounted = true;
    fetchProfile()
      .then((p) => { if (mounted && p) setProfile(p); })
      .catch(() => {})
    return () => { mounted = false; };
  }, []);

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
    <footer className="relative pt-12 pb-6 mt-16 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#050814] to-transparent" />

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f2fe] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00f2fe]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="mb-6">
          {/* Top Section - Name and Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h3 className="font-bold text-2xl mb-2 gradient-text flex items-center gap-2 justify-center">
              <Sparkles size={20} className="text-[#00f2fe]" />
              {profile.name}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-1 text-sm">{profile.tagline}</p>
            <p className="text-xs text-gray-500 italic">Powered by AI & Innovation</p>
          </motion.div>

          {/* Middle Section - Others Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h4 className="font-semibold mb-3 text-gray-200 text-center text-sm">Others</h4>
            <div className="flex flex-wrap items-center justify-center gap-5 max-w-3xl mx-auto">
              {otherLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  {link.href.startsWith("/#") ? (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#00f2fe] transition-all duration-300 text-sm font-medium relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] group-hover:w-full transition-all duration-300" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-[#00f2fe] transition-all duration-300 text-sm font-medium relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Section - Social and Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex flex-wrap gap-2.5 justify-center">
              {(profile.socialLinks ?? []).map((social: any) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return Icon ? (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== "Email" && social.platform !== "Phone" ? "_blank" : undefined}
                    rel={social.platform !== "Email" && social.platform !== "Phone" ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="p-2 glass border border-white/10 rounded-lg hover:border-[#00f2fe]/50 text-gray-400 hover:text-[#00f2fe] transition-all duration-300 glow-hover-cyan"
                    aria-label={social.platform}
                  >
                    <Icon size={16} />
                  </motion.a>
                ) : null;
              })}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <Mail size={12} className="text-[#00f2fe]" />
                {profile.email}
              </p>
              <span className="text-gray-600">•</span>
              <p className="flex items-center gap-2">
                <Phone size={12} className="text-[#00f2fe]" />
                {profile.phone}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-xs"
            >
              &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
            </motion.p>

            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 glass border border-white/10 rounded-lg text-gray-400 hover:text-[#00f2fe] hover:border-[#00f2fe]/50 transition-all duration-300 flex items-center gap-1.5 text-xs glow-hover-cyan"
            >
              <ArrowUp size={12} />
              Back to Top
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
