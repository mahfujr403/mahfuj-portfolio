import { Mail, Phone, Linkedin, Github, Send, MapPin, GraduationCap, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { submitContact } from "../../services/contactApi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export default function Contact({ profile: propProfile }: { profile?: any }) {
  const { data: hookProfile } = useProfile();
  const profile = propProfile ?? hookProfile ?? { socialLinks: [] };

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email.trim())) {
      toast.error("Please enter a valid email address");
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
      toast.error("Unable to deliver message right now. You can email directly.", {
        action: {
          label: "Email Directly",
          onClick: () => {
            const recipient = profile.email || "mahfujr403@gmail.com";
            window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(contactForm.message)}`;
          },
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "google scholar":
      case "scholar":
        return GraduationCap;
      default:
        return ArrowUpRight;
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Context & Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            {/* Editorial Section Header */}
            <div>
              {/* Section Index Marker */}
              <div className="flex items-center gap-2 mb-4 select-none" aria-hidden="true">
                <span className="text-xs font-mono tracking-widest text-primary font-semibold">06</span>
                <span className="text-xs text-border-active">/</span>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Contact</span>
              </div>

              {/* Section Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-foreground tracking-tight leading-[1.15] mb-4">
                Contact
              </h2>

              {/* Factual Context */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
                {profile.contactCTA || "Have a research idea, engineering collaboration, or consultation inquiry? Reach out below."}
              </p>
            </div>

            {/* Direct Contact Ledger */}
            <div className="space-y-6 pt-2 border-t border-border-subtle">
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Direct Contact
                </h3>

                <div className="space-y-2.5 sm:space-y-3.5">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3.5 text-sm text-foreground/90 hover:text-primary transition-colors group focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-lg p-2.5 sm:p-3 bg-[#111620] border border-border hover:border-border-active"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#18202E] border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors shrink-0">
                        <Mail size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground block">Email</span>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate block text-xs sm:text-sm">
                          {profile.email}
                        </span>
                      </div>
                    </a>
                  )}

                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-3.5 text-sm text-foreground/90 hover:text-primary transition-colors group focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] rounded-lg p-2.5 sm:p-3 bg-[#111620] border border-border hover:border-border-active"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#18202E] border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors shrink-0">
                        <Phone size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground block">Phone</span>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate block text-xs sm:text-sm">
                          {profile.phone}
                        </span>
                      </div>
                    </a>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-3.5 text-sm text-foreground/90 rounded-lg p-2.5 sm:p-3 bg-[#111620] border border-border">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#18202E] border border-border flex items-center justify-center text-muted-foreground shrink-0">
                        <MapPin size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground block">Location</span>
                        <span className="font-medium text-foreground truncate block text-xs sm:text-sm">
                          {profile.location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profiles & Networks */}
              {profile.socialLinks && profile.socialLinks.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border/60">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Profiles &amp; Networks
                  </h3>

                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {profile.socialLinks.map((social: any) => {
                      const Icon = getSocialIcon(social.platform);
                      const platformLabel = social.platform?.toLowerCase() === "google scholar" ? "Scholar" : social.platform;
                      return (
                        <a
                          key={social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[6px] border border-border bg-[#111620] hover:bg-[#18202E] hover:border-border-active text-xs font-medium text-foreground/90 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px] flex-1 min-w-[95px]"
                        >
                          <Icon size={14} className="text-muted-foreground shrink-0" />
                          <span>{platformLabel}</span>
                          <ArrowUpRight size={12} className="text-muted-foreground/60 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#111620] border border-border rounded-[10px] p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold font-display text-foreground leading-snug">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Reach out directly for engineering collaborations, research discussions, or technical inquiries.
                </p>
              </div>

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
                    placeholder="e.g., ML Engineering & Research Collaboration"
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

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-[#2563EB] disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:ring-[2px]"
                  >
                    {submitting ? (
                      <>
                        <span className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} className="shrink-0" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
