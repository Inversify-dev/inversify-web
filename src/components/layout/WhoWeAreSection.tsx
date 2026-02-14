'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// ─── MODULE-LEVEL CONSTANTS ───────────────────────────────────────────────────
const IS_MOBILE =
  typeof window !== 'undefined' && window.innerWidth < 768;

const IS_MOBILE_UA =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Register GSAP plugins ONCE globally — never in component body
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Stable spring config — defined outside component, never re-allocated
const SCROLL_SPRING = {
  damping: 20,
  stiffness: 100,
  mass: 0.5,
  restDelta: 0.001,
} as const;

// ─── STATIC MOTION VALUES (mobile) ───────────────────────────────────────────
// On mobile these are never fed to transforms — we skip Framer entirely.
// Defining them here avoids conditional hook calls (Rules of Hooks).
const ZERO_PX = '0%';

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function WhoWeAreSection() {
  const prefersReducedMotion = useReducedMotion();
  const skipAnimations = IS_MOBILE || IS_MOBILE_UA || !!prefersReducedMotion;

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // ── Scroll tracking — always called (Rules of Hooks) but values only used on desktop ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Spring — no-op cost on mobile since we never subscribe to it
  const smoothScroll = useSpring(scrollYProgress, SCROLL_SPRING);

  // All transforms declared unconditionally — but only applied to DOM on desktop
  const bgY           = useTransform(smoothScroll, [0, 1], ['-10%', '10%']);
  const bgScale       = useTransform(smoothScroll, [0, 0.5, 1], [1.15, 1, 1.15]);
  const opacityAnim   = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0.15, 1, 1, 0.15]);
  const blurValue     = useTransform(smoothScroll, [0, 0.18], [12, 0]);
  const blurFilter    = useMotionTemplate`blur(${blurValue}px)`;
  const floatY1       = useTransform(smoothScroll, [0, 1], [0, -120]);
  const floatY2       = useTransform(smoothScroll, [0, 1], [0, 80]);
  const rotateGlow    = useTransform(smoothScroll, [0, 1], [0, 180]);
  const gridX         = useTransform(smoothScroll, [0, 1], [0, -30]);
  const gridY         = useTransform(smoothScroll, [0, 1], [0, 30]);

  // ── Particles — only computed on desktop ──────────────────────────────────
  const particles = useMemo(() => {
    if (skipAnimations) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 3.5 + 2.5,
      delay: Math.random() * 1.5,
    }));
  }, [skipAnimations]);

  // ── IntersectionObserver — shared for both modes ──────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── GSAP animations — DESKTOP ONLY ───────────────────────────────────────
  useEffect(() => {
    if (skipAnimations || !isVisible || !sectionRef.current) return;

    // Kill any lingering context before rebuilding
    ctxRef.current?.revert();
    ctxRef.current = null;

    const setupTimer = setTimeout(() => {
      ctxRef.current = gsap.context(() => {
        ScrollTrigger.config({ limitCallbacks: true, syncInterval: 150 });

        // ── 1) TITLE SPLIT ────────────────────────────────────────────────
        if (titleRef.current) {
          const split = new SplitText(titleRef.current, {
            type: 'chars,words',
            charsClass: 'char',
            wordsClass: 'word',
          });

          gsap.set(split.chars, {
            opacity: 0, y: 80, rotateX: -90,
            transformOrigin: 'top center', force3D: true,
          });

          ScrollTrigger.create({
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
            onEnter: () =>
              gsap.to(split.chars, {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.7, stagger: 0.025,
                ease: 'back.out(1.1)', force3D: true,
              }),
            onLeaveBack: () =>
              gsap.to(split.chars, {
                opacity: 0, y: 80, rotateX: -90,
                duration: 0.25, stagger: 0.008,
                ease: 'power2.in', force3D: true,
              }),
          });
        }

        // ── 2) PARAGRAPH 1 ────────────────────────────────────────────────
        if (para1Ref.current) {
          const split = new SplitText(para1Ref.current, {
            type: 'words', wordsClass: 'word-anim',
          });

          gsap.set(split.words, {
            opacity: 0, y: 25, filter: 'blur(8px)', force3D: true,
          });

          ScrollTrigger.create({
            trigger: para1Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
            onEnter: () =>
              gsap.to(split.words, {
                opacity: 1, y: 0, filter: 'blur(0px)',
                duration: 0.45, stagger: 0.035,
                ease: 'power2.out', delay: 0.4, force3D: true,
              }),
            onLeaveBack: () =>
              gsap.to(split.words, {
                opacity: 0, y: 25, filter: 'blur(8px)',
                duration: 0.25, stagger: 0.008,
                ease: 'power2.in', force3D: true,
              }),
          });
        }

        // ── 3) PARAGRAPH 2 ────────────────────────────────────────────────
        if (para2Ref.current) {
          const split = new SplitText(para2Ref.current, {
            type: 'words', wordsClass: 'word-anim',
          });

          gsap.set(split.words, {
            opacity: 0, y: 35, rotateY: 40, force3D: true,
          });

          ScrollTrigger.create({
            trigger: para2Ref.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
            onEnter: () =>
              gsap.to(split.words, {
                opacity: 1, y: 0, rotateY: 0,
                duration: 0.55, stagger: 0.03,
                ease: 'power3.out', delay: 0.6, force3D: true,
              }),
            onLeaveBack: () =>
              gsap.to(split.words, {
                opacity: 0, y: 35, rotateY: 40,
                duration: 0.25, stagger: 0.008,
                ease: 'power2.in', force3D: true,
              }),
          });
        }

        // ── 4) ACCENT BAR ─────────────────────────────────────────────────
        ScrollTrigger.create({
          trigger: '.purple-accent-bar',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
          onEnter: () =>
            gsap.to('.purple-accent-bar', {
              scaleY: 1, duration: 0.9, ease: 'power3.inOut', force3D: true,
            }),
          onLeaveBack: () =>
            gsap.to('.purple-accent-bar', {
              scaleY: 0, duration: 0.4, ease: 'power3.in', force3D: true,
            }),
        });

        // ── 5) ORB CONTINUOUS MOTION ──────────────────────────────────────
        gsap.to('.glow-orb-1', {
          x: 'random(-40, 40)', y: 'random(-40, 40)',
          duration: 7, repeat: -1, yoyo: true,
          ease: 'sine.inOut', force3D: true,
        });

        gsap.to('.glow-orb-2', {
          x: 'random(-35, 35)', y: 'random(-35, 35)',
          duration: 9, repeat: -1, yoyo: true,
          ease: 'sine.inOut', force3D: true,
        });

        ScrollTrigger.refresh();
      }, sectionRef);
    }, 50);

    return () => {
      clearTimeout(setupTimer);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [isVisible, skipAnimations]);

  // ── Resize — rAF-debounced, passive, desktop only ─────────────────────────
  useEffect(() => {
    if (skipAnimations) return;

    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [skipAnimations]);

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE RENDER — zero JS animation overhead
  // ═══════════════════════════════════════════════════════════════════════════
  if (skipAnimations) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen bg-black overflow-hidden flex items-center py-20"
        style={{ contain: 'layout style paint' }}
      >
        {/* Static background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ contain: 'strict' }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: "url('/images/whoWeAre.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-black/10" />

          {/* Static orbs — no motion cost */}
          <div className="absolute top-1/4 left-0 w-[70vw] h-[70vw] bg-purple-900/15 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-indigo-900/10 blur-[120px] rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 -mt-10">
          <div className="mb-16 relative">
            <h2
              ref={titleRef}
              className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none"
            >
              WHO
              <span className="text-white/40 italic font-serif font-light">WE</span>
              <span> ARE?</span>
            </h2>
            <div
              className="purple-accent-bar absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 via-purple-600 to-transparent"
              style={{ transformOrigin: 'top' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 items-start">
            <div className="md:col-start-1 md:col-span-5 pt-0 md:pt-20">
              <p
                ref={para1Ref}
                className="text-gray-300 text-lg md:text-xl lg:text-2xl font-light leading-relaxed"
              >
                We specialize in <b>web design and development</b> and helping{' '}
                <b>brands build their identity</b> - working closely with our clients
                to transform ideas into cohesive, user-focused solutions that
                strengthen brands and drive growth.
              </p>
            </div>

            <div className="md:col-start-7 md:col-span-5">
              <p
                ref={para2Ref}
                className="text-gray-300 text-lg md:text-xl lg:text-2xl font-light leading-relaxed"
              >
                We build digital infrastructure.&nbsp;
                <span className="text-purple-400 font-medium italic">
                  Not just websites. Not just brands.&nbsp;
                </span>
                Inversify is where <b>strategy</b>, <b>design</b>, and{' '}
                <b>technology</b> align to create systems that scale.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none"
          style={{ contain: 'strict' }}
        />

        {/* Static grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-[3]"
          style={{
            backgroundImage: `linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DESKTOP RENDER — full animations, GPU layers, parallax
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex items-center py-20 lg:py-32"
      style={{ contain: 'layout style paint' }}
    >
      {/* GPU-Accelerated Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ contain: 'strict' }}
      >
        <motion.div
          style={{
            y: bgY,
            scale: bgScale,
            filter: blurFilter,
            willChange: 'transform, filter',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-50"
            style={{
              backgroundImage: "url('/images/whoWeAre.webp')",
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        {/* Glow Orbs */}
        <motion.div
          className="glow-orb-1 absolute top-1/4 left-0 w-[70vw] h-[70vw] bg-purple-900/15 blur-[140px] rounded-full"
          style={{
            y: floatY1,
            rotate: rotateGlow,
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
          }}
        />

        <motion.div
          className="glow-orb-2 absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-indigo-900/10 blur-[120px] rounded-full"
          style={{
            y: floatY2,
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
          }}
        />

        {/* Particles — only when visible */}
        {isVisible && (
          <div className="absolute inset-0" style={{ contain: 'strict' }}>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                style={{
                  left: p.left,
                  top: p.top,
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0,0,0)',
                }}
                animate={{ y: [0, -180, 0], opacity: [0, 0.7, 0], scale: [0, 1.4, 0] }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <motion.div
        style={{
          opacity: opacityAnim,
          willChange: 'opacity',
        }}
        className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 -mt-10"
      >
        <div className="mb-16 lg:mb-28 relative">
          <h2
            ref={titleRef}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] font-black text-white tracking-tighter leading-none"
            style={{
              perspective: '1000px',
              willChange: 'transform, opacity',
            }}
          >
            WHO
            <span className="text-white/40 italic font-serif font-light">WE</span>
            <span> ARE?</span>
          </h2>

          <div
            className="purple-accent-bar absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 via-purple-600 to-transparent scale-y-0"
            style={{
              transformOrigin: 'top',
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 items-start">
          <div className="md:col-start-1 md:col-span-5 pt-0 md:pt-20">
            <p
              ref={para1Ref}
              className="text-gray-300 text-lg md:text-xl lg:text-2xl font-light leading-relaxed"
              style={{ willChange: 'transform, opacity' }}
            >
              We specialize in <b>web design and development</b> and helping{' '}
              <b>brands build their identity</b> - working closely with our clients
              to transform ideas into cohesive, user-focused solutions that
              strengthen brands and drive growth.
            </p>
          </div>

          <div className="md:col-start-7 md:col-span-5">
            <p
              ref={para2Ref}
              className="text-gray-300 text-lg md:text-xl lg:text-2xl font-light leading-relaxed"
              style={{ willChange: 'transform, opacity' }}
            >
              We build digital infrastructure.&nbsp;
              <span className="text-purple-400 font-medium italic">
                Not just websites. Not just brands.&nbsp;
              </span>
              Inversify is where <b>strategy</b>, <b>design</b>, and{' '}
              <b>technology</b> align to create systems that scale.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none"
        style={{ contain: 'strict' }}
      />

      {/* Parallax Grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[3]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          x: gridX,
          y: gridY,
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </section>
  );
}