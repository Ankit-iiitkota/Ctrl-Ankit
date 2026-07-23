import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Mail,
  Linkedin,
  Github,
  MessageCircle,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { ConstellationBackground } from "../experience/ConstellationBackground";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must contain at least 2 characters." }),
  email: z.string().email({ message: "Provide a valid email address." }),
  subject: z
    .string()
    .min(3, { message: "Subject must contain at least 3 characters." }),
  message: z
    .string()
    .min(8, { message: "Message must contain at least 8 characters." }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: <Mail size={16} />,
    color: "#34d399",
    label: "Email",
    value: "ankitcloud005@gmail.com",
    href: "mailto:ankitcloud005@gmail.com",
  },
  {
    icon: <Linkedin size={16} />,
    color: "#22d3ee",
    label: "LinkedIn",
    value: "linkedin.com/in/ankitchaurasiya29",
    href: "https://www.linkedin.com/in/ankitchaurasiya29/",
  },
  {
    icon: <Github size={16} />,
    color: "#ec4899",
    label: "GitHub",
    value: "github.com/Ankit-iiitkota",
    href: "https://github.com/Ankit-iiitkota",
  },
];

export const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [mockMode, setMockMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmitForm = async (data: ContactFormData) => {
    setLoading(true);
    setSentStatus(null);
    setMockMode(false);

    // Check if EmailJS keys are provided
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    if (!serviceId || !templateId || !publicKey) {
      // Run mock sending animation for 1.8 seconds if keys are missing
      setTimeout(() => {
        setLoading(false);
        setSentStatus("success");
        setMockMode(true);
        reset();
      }, 1500);
      return;
    }

    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        reply_to: data.email,
        subject: data.subject,
        message: data.message,
      };

      const res = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey,
      );

      if (res.status === 200) {
        setLoading(false);
        setSentStatus("success");
        reset();
      } else {
        throw new Error("Non-200 response from EmailJS");
      }
    } catch (err) {
      console.error("EmailJS send failure", err);
      setLoading(false);
      setSentStatus("error");
    }
  };

  return (
    <section id="contact" className="relative w-full py-24 px-6 overflow-hidden">
      <ConstellationBackground />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-[0.35em] text-accent-400">
            09 &bull; Connectivity
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-display mt-4">
            Get in Touch
          </h2>
          <p className="max-w-2xl mt-4 text-sm text-slate-400">
            Send a message and let&apos;s discuss how we can bring your next premium digital experience to life.
          </p>
          <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-400 to-emerald-400 mt-6 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Send a Message */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-100 font-display mb-6">Send a Message</h3>

            <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-5 text-xs text-left">
              <div>
                <label className="block text-slate-400 mb-2 text-xs font-semibold">Your Name</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-transparent transition-all focus:border-cyan-400/50 focus:ring-cyan-400/20"
                />
                {errors.name && (
                  <span className="mt-2 block text-[11px] text-rose-400">{errors.name.message}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-2 text-xs font-semibold">Your Email</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-transparent transition-all focus:border-cyan-400/50 focus:ring-cyan-400/20"
                />
                {errors.email && (
                  <span className="mt-2 block text-[11px] text-rose-400">{errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-2 text-xs font-semibold">Subject</label>
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="Collaborative Opportunities"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-transparent transition-all focus:border-cyan-400/50 focus:ring-cyan-400/20"
                />
                {errors.subject && (
                  <span className="mt-2 block text-[11px] text-rose-400">{errors.subject.message}</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-2 text-xs font-semibold">Message</label>
                <textarea
                  rows={5}
                  {...register("message")}
                  placeholder="Your message here..."
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-transparent transition-all focus:border-cyan-400/50 focus:ring-cyan-400/20 resize-none"
                />
                {errors.message && (
                  <span className="mt-2 block text-[11px] text-rose-400">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(52,211,153,0.2)] transition-all hover:shadow-[0_20px_55px_rgba(52,211,153,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                data-cursor="SUBMIT"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>

            {sentStatus === "success" && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-sm text-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                  <div>
                    <div className="font-semibold">Message Delivered Successfully</div>
                    <p className="mt-1 text-slate-400 text-xs">Your transmission was processed. I will reply shortly.</p>
                  </div>
                </div>
                {mockMode && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
                    <AlertTriangle size={12} /> DEMO MOCK: Configure EmailJS env variables for live sending.
                  </div>
                )}
              </div>
            )}

            {sentStatus === "error" && (
              <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-950/30 p-4 text-sm text-slate-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 text-rose-400" />
                  <div>
                    <div className="font-semibold">Transmission Signal Error</div>
                    <p className="mt-1 text-slate-400 text-xs">
                      There was an issue processing EmailJS. Please contact direct email ankitcloud005@gmail.com.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column: Contact Info + Let's Connect */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-100 font-display mb-5">Contact Info</h3>
              <div className="flex flex-col gap-5">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group -m-2 p-2 rounded-xl transition-colors duration-300 hover:bg-white/[0.03]"
                    data-cursor="LINK"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
                      style={{
                        color: item.color,
                        backgroundColor: `${item.color}15`,
                        borderColor: `${item.color}25`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}40`
                        e.currentTarget.style.borderColor = `${item.color}70`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = `${item.color}25`
                      }}
                    >
                      {item.icon}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      <span className="block text-xs text-slate-400 group-hover:text-slate-200 transition-colors break-all">
                        {item.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-100 font-display mb-3 flex items-center gap-2">
                <MessageCircle size={18} className="text-cyan-400" />
                Let&apos;s Connect
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Interested in collaborating or have a project in mind? I&apos;m always open to discussing new
                opportunities and ideas.
              </p>
              <div className="flex items-center gap-3">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    data-cursor="LINK"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:text-white"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${item.color}70`
                      e.currentTarget.style.boxShadow = `0 10px 26px ${item.color}35`
                      e.currentTarget.style.backgroundColor = `${item.color}15`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = ''
                      e.currentTarget.style.boxShadow = ''
                      e.currentTarget.style.backgroundColor = ''
                    }}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactForm;
