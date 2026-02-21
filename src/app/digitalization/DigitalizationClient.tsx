'use client';

import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, Instagram, Linkedin, Send } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxzdC0o7AHRqluoUM8DAmoCKH-wRh-8WHkQhdf2P1TbER9jSCG_lQ21HWaWxjhXiTdi/exec";

export default function DigitalizationClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const startedTextRef = useRef<HTMLSpanElement | null>(null);
  const formTitleRef = useRef<HTMLHeadingElement | null>(null);
  const arrowSvgRef = useRef<SVGSVGElement | null>(null);
  const arrowPathRef = useRef<SVGPathElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // ✅ Mount detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ GSAP ScrollTrigger initialization
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [mounted]);

  // ✅ Ensure native scroll behavior
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overscrollBehavior = 'auto';
    document.body.style.touchAction = 'pan-y';

    return () => {
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
    };
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    const form = e.currentTarget;

    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setFormState("success");
      form.reset();

      setTimeout(() => setFormState("idle"), 8000);

    } catch (err) {
      setFormState("idle");
      console.error("Unexpected error:", err);
    }
  };

  // Arrow animation
  useEffect(() => {
    if (
      !mounted ||
      isMobile ||
      hasAnimated ||
      !startedTextRef.current ||
      !formTitleRef.current ||
      !arrowSvgRef.current ||
      !arrowPathRef.current
    )
      return;

    const svg = arrowSvgRef.current;
    const path = arrowPathRef.current;

    const animateArrow = () => {
      const startedRect = startedTextRef.current!.getBoundingClientRect();
      const formRect = formTitleRef.current!.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      const startX = startedRect.left + startedRect.width * 1.05 - svgRect.left;
      const startY = startedRect.bottom - svgRect.top - 60;

      const endX = formRect.left + formRect.width * 0.5 - svgRect.left;
      const endY = formRect.top - svgRect.top - 100;

      const cp1X = startX + 520;
      const cp1Y = startY - 40;
      const cp2X = endX - 0;
      const cp2Y = endY + 0;

      const pathD = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      path.setAttribute("d", pathD);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const tl = gsap.timeline({
        delay: 0.8,
        onComplete: () => setHasAnimated(true),
      });

      tl.to(svg, { opacity: 1, duration: 0.2 }, 0)
        .to(path, { strokeDashoffset: 0, duration: 2.3, ease: "power2.inOut" }, 0)
        .fromTo(
          "#digitalization-arrow-icon",
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
          0
        )
        .to(
          "#digitalization-arrow-icon",
          {
            duration: 2.3,
            ease: "power2.inOut",
            motionPath: {
              path: path,
              align: path,
              autoRotate: true,
              alignOrigin: [0.5, 0.5],
            },
          },
          0
        );
    };

    const timer = setTimeout(animateArrow, 250);

    const handleResize = () => {
      setHasAnimated(false);
      gsap.killTweensOf([svg, path, "#digitalization-arrow-icon"]);
      svg.style.opacity = "0";
      setTimeout(() => animateArrow(), 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf([svg, path, "#digitalization-arrow-icon"]);
    };
  }, [mounted, isMobile, hasAnimated]);

  // ✅ Prevent FOUC
  if (!mounted) {
    return <div className="fixed inset-0 bg-[#05020a]" />;
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#05020a] text-white overflow-hidden relative selection:bg-purple-500/30"
      style={{ 
        touchAction: 'pan-y', 
        overscrollBehavior: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen scale-110"
          style={{ backgroundImage: `url('/images/clientsSection.webp')` }}
        />
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05020a]/30 via-transparent to-[#05020a]" />
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* FLOATING STARS */}
      <div className="absolute inset-0 z-0">
        {[...Array(28)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random(), scale: Math.random() }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              y: [0, -60, 0],
              x: [0, 25, 0],
            }}
            transition={{
              duration: Math.random() * 7 + 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* ARROW ANIMATION */}
      {!isMobile && (
        <svg
          ref={arrowSvgRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{ opacity: 0 }}
        >
          <path
            ref={arrowPathRef}
            stroke="rgba(192, 132, 252, 0.75)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <g id="digitalization-arrow-icon" opacity="0">
            <path
              d="M 0 -7 L 12 0 L 0 7 L 2 0 Z"
              fill="rgba(192, 132, 252, 0.95)"
              stroke="rgba(192, 132, 252, 0.95)"
              strokeWidth="1"
            />
          </g>
        </svg>
      )}

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24 flex flex-col lg:flex-row justify-between items-start gap-20">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[55px] sm:text-[75px] md:text-[95px] lg:text-[110px] font-black tracking-tighter leading-[0.9] uppercase">
              Let&apos;s Get{" "}
              <span
                ref={startedTextRef}
                className="italic font-serif font-light lowercase text-purple-200 drop-shadow-[0_0_20px_rgba(192,132,252,0.5)]"
              >
                Started
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-gray-300 text-base sm:text-lg leading-relaxed">
              Transform your business with modern digital solutions. We build
              premium websites, automation systems, and scalable platforms that
              make your brand unstoppable.
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6">
          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="group border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.55)] hover:bg-white/[0.08] transition-all duration-500"
          >
            <h3 className="text-[11px] uppercase tracking-[0.4em] text-purple-400 mb-8 font-bold">
              Reach Us
            </h3>

            <div className="space-y-6 text-base sm:text-lg font-medium text-gray-100">
              <a
                href="mailto:invert@inversify.lk"
                className="flex items-center gap-4 hover:text-purple-300 transition-colors cursor-pointer group/item"
              >
                <div className="p-3 bg-purple-500/10 rounded-2xl group-hover/item:bg-purple-500/20 transition-colors">
                  <Mail size={20} className="text-purple-400" />
                </div>
                <span className="break-all">invert@inversify.lk</span>
              </a>

              <a
                href="tel:+94704621228"
                className="flex items-center gap-4 hover:text-purple-300 transition-colors cursor-pointer group/item"
              >
                <div className="p-3 bg-purple-500/10 rounded-2xl group-hover/item:bg-purple-500/20 transition-colors">
                  <Phone size={20} className="text-purple-400" />
                </div>
                <span>+94 704 621 228</span>
              </a>
            </div>
          </motion.div>

          {/* Social Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.55)] hover:bg-white/[0.08] transition-all duration-500"
          >
            <h3 className="text-[11px] uppercase tracking-[0.4em] text-indigo-400 mb-8 font-bold">
              Follow Us
            </h3>

            <div className="flex gap-8">
              {[
                { Icon: Instagram, href: "https://instagram.com/inversify", label: "Instagram" },
                { Icon: Linkedin, href: "https://linkedin.com/company/inversify", label: "LinkedIn" },
                { Icon: FaTiktok, href: "https://tiktok.com/@inversify", label: "TikTok" },
              ].map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 hover:text-white cursor-pointer transition-all hover:scale-125 hover:-translate-y-1"
                >
                  <Icon size={26} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* FORM SECTION */}
      <section ref={formRef} className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-[2.8rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-10 sm:p-14"
        >
          <h2 ref={formTitleRef} className="text-4xl sm:text-5xl font-black tracking-tight">
            Reach Out & Say{" "}
            <span className="italic font-serif font-light text-purple-200">Hi</span>
          </h2>

          <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Have an idea brewing? We're all ears. Share your vision with us and we'll respond - no automated replies, just real conversations. Book a free 30-min strategy call or just say hi.
          </p>

          <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@company.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+94 70 123 4567"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-xs uppercase tracking-[0.35em] text-gray-400">
                What&apos;s This About?
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Website Redesign, New App, etc."
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="message" className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Tell Us More
              </label>
              <textarea
                rows={5}
                id="message"
                name="message"
                placeholder="Share your project goals, timeline, budget — or just tell us what's on your mind. The more details, the better we can help."
                required
                className="w-full resize-none bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex flex-col items-start gap-4">
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-xs uppercase tracking-[0.35em] font-black text-gray-200 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {formState === 'submitting' ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Your Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Success Message */}
              {formState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4 mt-2"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">
                        Message Delivered!
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Your message just landed in our inbox. We&apos;re on it and will get back to you. Check your email - we&apos;ll be in touch soon!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}