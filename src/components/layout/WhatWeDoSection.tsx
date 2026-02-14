'use client';

import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

// ─── MODULE-LEVEL CONSTANTS ───────────────────────────────────────────────────
const IS_MOBILE_BREAKPOINT =
  typeof window !== 'undefined' && window.innerWidth < 1024;

const IS_MOBILE_UA =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Register GSAP plugins once at module scope — never inside component body
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Stable spring config — allocated once, never re-created
const SCROLL_SPRING = {
  damping: 20,
  stiffness: 100,
  mass: 0.5,
  restDelta: 0.001,
} as const;

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────
interface ServiceCardProps {
  title: string;
  description: string;
  index: number;
  className?: string;
  isStatic?: boolean; // true on mobile — strips all transition CSS
}

const ServiceCard = memo<ServiceCardProps>(({
  title,
  description,
  index,
  className = '',
  isStatic = false,
}) => (
  <div
    className={`
      service-card-item relative group rounded-xl lg:rounded-2xl
      bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden
      flex flex-col justify-center
      px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6
      ${isStatic ? '' : 'transition-all duration-500 hover:border-purple-500/50'}
      ${className}
    `}
    style={
      isStatic
        ? undefined
        : {
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
          }
    }
  >
    <div className="relative z-10">
      <h3 className="text-[13px] sm:text-[15px] lg:text-[17px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-[13px] sm:text-[14px] lg:text-[16px] leading-relaxed font-light">
        {description}
      </p>
    </div>

    <div className="absolute top-2 right-3 text-white/5 font-black text-3xl sm:text-4xl lg:text-6xl pointer-events-none group-hover:text-purple-500/10 transition-colors">
      {index + 1}
    </div>

    {!isStatic && (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    )}
  </div>
));

ServiceCard.displayName = 'ServiceCard';

// ─── SERVICE DATA ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: 'WEB DEVELOPMENT',
    description: 'High-performance web platforms built for speed, security, and precision.',
  },
  {
    title: 'ECOMMERCE',
    description: 'Conversion-driven stores with scalable infrastructure and seamless checkout logic.',
  },
  {
    title: 'CREATIVE',
    description: 'Purposeful visual storytelling — built to support the system, not distract from it.',
  },
  {
    title: 'IDENTITY',
    description: 'Strategic brand architecture designed for recognition and consistency.',
  },
  {
    title: 'GROWTH',
    description: 'Digital foundations structured to compound over time.',
  },
] as const;

// ─── SHARED GRID LAYOUT ───────────────────────────────────────────────────────
function ServicesGrid({ isStatic }: { isStatic: boolean }) {
  return (
    <div
      className="
        services-grid w-full flex-1 min-h-0
        grid gap-3 sm:gap-4 lg:gap-5
        grid-cols-1 lg:grid-cols-12
      "
      style={isStatic ? undefined : { contain: 'layout style' }}
    >
      {/* BOX 1 — full left column */}
      <div className="lg:col-span-4 flex min-h-0">
        <ServiceCard
          index={0}
          title={SERVICES[0].title}
          description={SERVICES[0].description}
          className="w-full h-full backdrop-blur-lg"
          isStatic={isStatic}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-8 grid grid-cols-1 gap-3 sm:gap-4 lg:gap-5 lg:grid-rows-2 min-h-0">
        {/* BOX 2 */}
        <div className="flex min-h-0">
          <ServiceCard
            index={1}
            title={SERVICES[1].title}
            description={SERVICES[1].description}
            className="w-full h-full backdrop-blur-lg"
            isStatic={isStatic}
          />
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 min-h-0">
          {SERVICES.slice(2).map((s, i) => (
            <ServiceCard
              key={s.title}
              index={i + 2}
              title={s.title}
              description={s.description}
              className="h-full backdrop-blur-lg"
              isStatic={isStatic}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function WhatWeDoSection() {
  const prefersReducedMotion = useReducedMotion();
  const skipAnimations = IS_MOBILE_BREAKPOINT || IS_MOBILE_UA || !!prefersReducedMotion;

  const sectionRef    = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const ctxRef        = useRef<gsap.Context | null>(null);
  const [isMobile, setIsMobile]       = useState(IS_MOBILE_BREAKPOINT);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible]     = useState(false);

  // ── Scroll tracking — unconditional (Rules of Hooks) ─────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, SCROLL_SPRING);
  // Motion value only attached to DOM on desktop branch
  const bgY = useTransform(smoothScroll, [0, 1], ['-8%', '8%']);

  // ── IntersectionObserver ──────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '150px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Mobile detection — rAF-debounced, passive ─────────────────────────────
  useEffect(() => {
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 1024);
        if (!skipAnimations) ScrollTrigger.refresh(true);
      });
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [skipAnimations]);

  // ── GSAP animations — DESKTOP ONLY ───────────────────────────────────────
  useEffect(() => {
    if (skipAnimations || !isVisible || !sectionRef.current) return;

    ctxRef.current?.revert();
    ctxRef.current = null;

    const setupTimer = setTimeout(() => {
      ctxRef.current = gsap.context(() => {
        ScrollTrigger.config({ limitCallbacks: true, syncInterval: 150 });

        // Title split — desktop only (isMobile is the lg breakpoint guard)
        if (titleRef.current && !isMobile) {
          const titleSplit = new SplitText(titleRef.current, {
            type: 'chars',
            charsClass: 'char',
          });

          gsap.set(titleSplit.chars, {
            opacity: 0, y: 20, rotateX: -90, force3D: true,
          });

          gsap.to(titleSplit.chars, {
            opacity: 1, y: 0, rotateX: 0,
            stagger: 0.01, duration: 0.55,
            ease: 'power4.out', force3D: true,
            overwrite: 'auto',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 92%',
              invalidateOnRefresh: true,
              fastScrollEnd: true,
            },
          });
        }

        // Service cards stagger reveal
        gsap.set('.service-card-item', { opacity: 0, y: 25, force3D: true });

        gsap.to('.service-card-item', {
          opacity: 1, y: 0,
          stagger: 0.05, duration: 0.55,
          ease: 'power3.out', force3D: true,
          overwrite: 'auto',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 88%',
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        // Double rAF — ensures layout is fully painted before measuring
        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh());
        });
      }, sectionRef);
    }, 50);

    return () => {
      clearTimeout(setupTimer);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [isMobile, isVisible, skipAnimations]);

  // ── Image load handler — stable ref, never re-created ────────────────────
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE RENDER — zero motion overhead
  // ─────────────────────────────────────────────────────────────────────────
  if (skipAnimations) {
    return (
      <section
        ref={sectionRef}
        className="
          relative w-full bg-black overflow-hidden flex flex-col
          h-screen pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8
        "
        style={{ contain: 'layout style paint' }}
      >
        {/* Static background */}
        <div className="absolute inset-0 w-full h-full z-0" style={{ contain: 'strict' }}>
          <Image
            src="/images/whatwedo5.webp"
            alt="What We Do Background"
            fill
            quality={75}
            priority
            className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="100vw"
            onLoad={handleImageLoad}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-[1]" />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black z-[1]" />
          )}
        </div>

        {/* Static ambient glow */}
        <div className="absolute inset-0 z-[2] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-20 flex flex-col min-h-0">
          <div className="mb-5 sm:mb-7 lg:mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 shrink-0">
            <h2
              ref={titleRef}
              className="
                font-black text-white tracking-tighter leading-none
                text-[clamp(30px,5vw,80px)]
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
              "
            >
              WHAT <span className="text-white/40 italic font-serif">WE</span> DO?
            </h2>

            <p className="
              max-w-xl lg:max-w-md lg:text-right text-gray-300 font-light
              text-[clamp(12px,1.2vw,16px)] leading-relaxed
              drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]
            ">
              Scalable systems engineered for clarity, performance, and long-term growth.
            </p>
          </div>

          <ServicesGrid isStatic={true} />

          <div className="mt-5 sm:mt-7 lg:mt-8 shrink-0 flex justify-between items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DESKTOP RENDER — full GSAP + Framer Motion animations
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="
        relative w-full bg-black overflow-hidden flex flex-col
        h-screen pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8
      "
      style={{ contain: 'layout style paint' }}
    >
      {/* GPU-Accelerated Background */}
      <div className="absolute inset-0 w-full h-full z-0" style={{ contain: 'strict' }}>
        <Image
          src="/images/whatwedo5.webp"
          alt="What We Do Background"
          fill
          quality={90}
          priority
          className={`object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="100vw"
          onLoad={handleImageLoad}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            willChange: 'opacity',
            transform: 'translate3d(0,0,0)',
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-[1]"
          style={{ contain: 'strict' }}
        />
        {!imageLoaded && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black z-[1]"
            style={{ contain: 'strict' }}
          />
        )}
      </div>

      {/* Parallax Ambient Glow */}
      <motion.div
        style={{
          y: bgY,
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
        className="absolute inset-0 z-[2] opacity-10 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)]" />
      </motion.div>

      {/* Content */}
      <div
        className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-20 flex flex-col min-h-0"
        style={{ contain: 'layout style' }}
      >
        {/* HEADER */}
        <div className="mb-5 sm:mb-7 lg:mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 shrink-0">
          <h2
            ref={titleRef}
            className="
              font-black text-white tracking-tighter leading-none
              text-[clamp(30px,5vw,80px)]
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
            "
            style={{ willChange: 'transform, opacity', perspective: '1000px' }}
          >
            WHAT <span className="text-white/40 italic font-serif">WE</span> DO?
          </h2>

          <p className="
            max-w-xl lg:max-w-md lg:text-right text-gray-300 font-light
            text-[clamp(12px,1.2vw,16px)] leading-relaxed
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]
          ">
            Scalable systems engineered for clarity, performance, and long-term growth.
          </p>
        </div>

        <ServicesGrid isStatic={false} />

        {/* BOTTOM LINE */}
        <div className="mt-5 sm:mt-7 lg:mt-8 shrink-0 flex justify-between items-center">
          <div
            className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]"
            style={{ contain: 'strict' }}
          />
        </div>
      </div>
    </section>
  );
}