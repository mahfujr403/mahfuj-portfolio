import { Mail, Phone, Linkedin, Github, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { fetchProfile } from "../../services/profileApi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";






export default function Contact() {
  const [profile, setProfile] = useState<any>({ socialLinks: [] });

  useEffect(() => {
    let mounted = true;
    fetchProfile().then((p) => { if (mounted && p) setProfile(p); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const contactMethods = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: (profile.socialLinks ?? []).find((s: any) => s.platform === "LinkedIn")?.url || "#",
      href: (profile.socialLinks ?? []).find((s: any) => s.platform === "LinkedIn")?.url || "#"
    },
    {
      icon: Github,
      label: "GitHub",
      value: (profile.socialLinks ?? []).find((s: any) => s.platform === "GitHub")?.url || "#",
      href: (profile.socialLinks ?? []).find((s: any) => s.platform === "GitHub")?.url || "#"
    },
  ];

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitMessage = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !contactForm.name.trim() ||
    !contactForm.email.trim() ||
    !contactForm.subject.trim() ||
    !contactForm.message.trim()
  ) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    setSubmitting(true);
    const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/contact`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactForm),
    });

    if (!response.ok) {
  const error = await response.json();
  toast.error(error.detail?.[0]?.msg || "Failed to send message");
  return;
}

    toast.success("Message sent successfully!");

    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    toast.error("Failed to send message.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {profile.contactCTA}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Send a Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
              <Send className="text-[#00f2fe]" size={24} />
              Send a Message
            </h3>
            <Card className="glass border-white/10">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name <span className="text-[#00f2fe]">*</span>
                    </label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-[#00f2fe]">*</span>
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                    <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject <span className="text-[#00f2fe]">*</span>
                    </label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                      className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                     
                 
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message <span className="text-[#00f2fe]">*</span>
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Your message..."
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="bg-black/30 border-white/10 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Connect With Me */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
              <Mail className="text-[#00f2fe]" size={24} />
              Connect With Me
            </h3>
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="glass rounded-xl p-5 border border-white/10 glow-hover-cyan group"
                >
                  <a
                    href={method.href}
                    target={method.label === "LinkedIn" || method.label === "GitHub" ? "_blank" : undefined}
                    rel={method.label === "LinkedIn" || method.label === "GitHub" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 glass border border-[#00f2fe]/30 rounded-xl flex items-center justify-center group-hover:border-[#00f2fe] transition-all duration-300 flex-shrink-0">
                      <method.icon size={20} className="text-[#00f2fe]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-300 mb-1">{method.label}</p>
                      <p className="text-sm text-gray-400 break-all">{method.value}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
