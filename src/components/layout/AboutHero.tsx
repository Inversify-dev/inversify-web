'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

// Module-level constants
const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const locationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const subtextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Deterministic particles
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: `${((i * 17 + 7) % 97) + 1}%`,
  left: `${((i * 23 + 11) % 97) + 1}%`,
  delay: `${((i * 0.37) % 5).toFixed(2)}s`,
}));

export default function AboutHero() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    setMounted(true);
  }, []);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  const animate = mounted && !isMobile && !prefersReducedMotion;

  const staticContent = (
    <>
      <h1
        className="text-white text-7xl md:text-[160px] font-serif leading-none tracking-tighter mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
About{" "}
<span className="italic font-serif font-light text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
  Us
</span>
      </h1>

      <div className="flex flex-col items-center gap-4 mb-12">
        <p className="text-white/70 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold">
          Headquarters in Sri Lanka <br /> Working Worldwide
        </p>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/80 via-white/40 to-transparent" />
      </div>

      <p className="text-white/90 text-sm md:text-lg max-w-xl leading-relaxed font-light px-4 drop-shadow-md">
        Inversify operates as an infrastructure layer - where{' '}
        <br className="hidden md:block" />
        <span className="text-white font-medium">strategy, design, and technology</span>{' '}
        <br className="hidden md:block" />
        intersect to build systems that evolve without breaking.
      </p>
    </>
  );

  return (
    <section
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ contain: 'layout style paint' }}
    >
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" style={{ contain: 'strict' }}>
        <Image
          src="/images/whatwedo5.webp"
          alt="Cinematic Purple Planet"
          fill
          priority
          quality={90}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          style={{
            filter: 'brightness(0.9) contrast(1.1)',
            transform: 'translate3d(0,0,0) scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-[1]" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-[1]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ contain: 'layout style' }}>
        {animate ? (
          <>
<motion.h1
  initial="hidden"
  animate="visible"
  variants={titleVariants}
  className="text-white text-7xl md:text-[160px] font-serif leading-none tracking-tighter mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
  style={{ fontFamily: "'Playfair Display', serif" }}
>
  About{" "}
  <span className="italic font-serif font-light text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
    Us
  </span>
</motion.h1>


            <motion.div
              initial="hidden"
              animate="visible"
              variants={locationVariants}
              className="flex flex-col items-center gap-4 mb-12"
            >
              <p className="text-white/70 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold">
                Headquarters in Sri Lanka <br /> Working Worldwide
              </p>
              <div className="w-[1px] h-16 bg-gradient-to-b from-white/80 via-white/40 to-transparent" />
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={subtextVariants}
              className="text-white/90 text-sm md:text-lg max-w-xl leading-relaxed font-light px-4 drop-shadow-md"
            >
              Inversify operates as an infrastructure layer - where{' '}
              <br className="hidden md:block" />
              <span className="text-white font-medium">strategy, design, and technology</span>{' '}
              <br className="hidden md:block" />
              intersect to build systems that evolve without breaking.
            </motion.p>
          </>
        ) : (
          staticContent
        )}
      </div>

      {mounted && (
        <div className="absolute inset-0 pointer-events-none opacity-40 z-[5]" style={{ contain: 'strict' }}>
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}