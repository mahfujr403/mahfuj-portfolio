import { Mail, Phone, Linkedin, Github, Send, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { submitContact } from "../../services/contactApi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";

export default function Contact({ profile: propProfile }: { profile?: any }) {
  const { data: hookProfile } = useProfile();
  const profile = propProfile ?? hookProfile ?? { socialLinks: [] };

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
      await submitContact(contactForm);

      toast.success("Message sent successfully!");

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again or reach out via email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-primary uppercase tracking-wider mb-3">
            <MessageSquare size={13} />
            Transmission Channel
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight mb-3">
            Initiate Contact
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {profile.contactCTA || "Have a research idea, engineering collaboration, or consultation inquiry? Reach out below."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7"
          >
            <Card className="bg-card border-border shadow-xs">
              <CardContent className="pt-6 sm:p-7">
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="contact-name"
                        type="text"
                        placeholder="e.g., Md. Mahfujur Rahman"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="e.g., mahfujr403@gmail.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Subject Matter <span className="text-primary">*</span>
                    </label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="e.g., Interested in hiring you / ML Engineering & Research Collaboration"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Detailed Message <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Hello Mahfujur, I would like to discuss an opportunity, hiring inquiry, or research collaboration regarding..."
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all py-2.5 shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                        <span>Transmitting Message...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={15} />
                        <span>Send Transmission</span>
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Direct Handles & Channels */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-3"
          >
            <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold mb-3">
              Direct Channels & Networks
            </h3>
            {contactMethods.map((method) => {
              const MethodIcon = method.icon;
              return (
                <div
                  key={method.label}
                  className="rounded-xl p-4 bg-card border border-border hover:border-primary/40 transition-all duration-200 group shadow-xs"
                >
                  <a
                    href={method.href}
                    target={method.label === "LinkedIn" || method.label === "GitHub" ? "_blank" : undefined}
                    rel={method.label === "LinkedIn" || method.label === "GitHub" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/80 border border-border flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all shrink-0">
                      <MethodIcon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted-foreground uppercase">{method.label}</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {method.value}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
