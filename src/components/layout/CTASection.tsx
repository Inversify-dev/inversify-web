'use client';

import { motion, useSpring, useTransform, useScroll } from 'framer-motion';
import { useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Optimized spring config
const SPRING_CONFIG = { damping: 25, stiffness: 150, mass: 0.3, restDelta: 0.001 };

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Optimized scroll for subtle parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const bgY = useTransform(smoothScrollProgress, [0, 1], ['-5%', '5%']);
  const bgScale = useTransform(smoothScrollProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  // Memoized animation variants
  const titleVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 25 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }),
    []
  );

  const subtitleVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }),
    []
  );

  const buttonVariants = useMemo(
    () => ({
      hidden: { scale: 0.85, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.5,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }),
    []
  );

  // Memoized callback for image load
  const handleBgLoad = useCallback(() => {
    setBgLoaded(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden"
      style={{ contain: 'layout style paint' }}
    >
      {/* OPTIMIZED BACKGROUND - GPU Accelerated */}
      <div className="absolute inset-0 z-0" style={{ contain: 'strict' }}>
        {/* Fallback gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black"
          style={{ contain: 'strict' }}
        />

        {/* Optimized Background with Next.js Image + Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: bgY,
            scale: bgScale,
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <Image
            src="/images/DiveDeep.webp"
            alt="CTA Background"
            fill
            quality={85}
            priority={false}
            className={`object-cover transition-opacity duration-700 ${
              bgLoaded ? 'opacity-40' : 'opacity-0'
            }`}
            sizes="100vw"
            onLoad={handleBgLoad}
            style={{
              willChange: 'opacity',
              transform: 'translate3d(0,0,0)',
            }}
          />
        </motion.div>

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"
          style={{ contain: 'strict' }}
        />

        {/* Vignette effect */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]"
          style={{ contain: 'strict' }}
        />
      </div>

      {/* MAIN CONTENT - GPU Optimized */}
      <div
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6"
        style={{ contain: 'layout style' }}
      >
        <div className="text-center">
          {/* Title Animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px', amount: 0.3 }}
            variants={titleVariants}
            className="mb-8 sm:mb-10"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              GOT THE
            </div>
            <div className="text-gray-300 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              GUTS?
            </div>
          </motion.div>

          {/* Subtitle Animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={subtitleVariants}
            className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-10 sm:mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            style={{
              willChange: 'opacity',
            }}
          >
            Welcome to Inversify
          </motion.div>

          {/* Button Animation */}
          <Link href="/digitalization">
          <motion.button
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={buttonVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }}
            whileTap={{
              scale: 0.96,
              transition: { duration: 0.1 },
            }}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-black text-sm sm:text-base font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            style={{
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
            }}
          >
            Let&apos;s Build Something Epic
          </motion.button>
          </Link>
        </div>
      </div>

      {/* Subtle ambient particles (optional enhancement) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
        style={{ contain: 'strict' }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/15 rounded-full"
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + i * 15}%`,
              willChange: 'transform, opacity',
              transform: 'translate3d(0,0,0)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none"
        style={{ contain: 'strict' }}
      />
    </section>
  );
}