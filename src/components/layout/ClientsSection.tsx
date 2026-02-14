'use client';

import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';

// Optimized spring config
const SPRING_CONFIG = { damping: 25, stiffness: 150, mass: 0.3, restDelta: 0.001 };

// Memoized StatCard component
const StatCard = memo<{ stat: { value: string; label: string }; index: number }>(
  ({ stat, index }) => (
    <motion.div
      className="stat-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/15 hover:border-purple-400/40 transition-all duration-300 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {stat.value}
          </div>
          <div className="text-xs sm:text-sm md:text-base text-white/80 font-medium">
            {stat.label}
          </div>
        </div>
      </div>
    </motion.div>
  )
);

StatCard.displayName = 'StatCard';

// Memoized ClientCard component
const ClientCard = memo<{ client: { name: string; logo: string }; index: number }>(
  ({ client, index }) => (
    <motion.div
      className="flex-shrink-0 group"
      whileHover={{ scale: 1.08, y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl bg-white/[0.1] backdrop-blur-md border border-white/20 hover:border-purple-400/60 transition-all duration-300 shadow-xl hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/15 group-hover:to-blue-500/15 transition-all duration-500 rounded-xl sm:rounded-2xl" />

        <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 md:p-5">
          <div className="relative w-full h-[65%] flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
            <div className="relative w-full h-full max-w-[85%]">
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                loading="lazy"
                quality={85}
              />
            </div>
          </div>

          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 text-center">
            <div className="text-xs sm:text-sm md:text-base text-white/80 font-medium group-hover:text-white transition-colors">
              {client.name}
            </div>
          </div>
        </div>

        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-3 h-3 border-t border-l border-purple-400/40 rounded-tl" />
        <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-3 h-3 border-b border-r border-purple-400/40 rounded-br" />
      </div>
    </motion.div>
  )
);

ClientCard.displayName = 'ClientCard';

// Memoized Particle component
const Particle = memo<{ index: number }>(({ index }) => {
  const position = useMemo(
    () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 2.5 + 2,
      delay: Math.random() * 1,
    }),
    [index]
  );

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white/20 rounded-full"
      style={{
        left: position.left,
        top: position.top,
        willChange: 'transform, opacity',
        transform: 'translate3d(0,0,0)',
      }}
      animate={{
        opacity: [0.1, 0.25, 0.1],
        scale: [0.8, 1.1, 0.8],
      }}
      transition={{
        duration: position.duration,
        repeat: Infinity,
        delay: position.delay,
        ease: 'linear',
      }}
    />
  );
});

Particle.displayName = 'Particle';

export default function ClientsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Memoized client data
  const clients = useMemo(
    () => [
      { name: 'JerseyCloud', logo: '/images/clients/logo.png' },
      { name: 'Qreate', logo: '/images/clients/white-version.png' },
      { name: 'Neatline', logo: '/images/clients/logo.jpg' },
    ],
    []
  );

  const duplicatedClients = useMemo(
    () => [...clients, ...clients, ...clients, ...clients],
    [clients]
  );

  const stats = useMemo(
    () => [
      { value: '10+', label: 'Clients Served' },
      { value: '30+', label: 'Projects Completed' },
      { value: '20+', label: 'Systems Build' },
    ],
    []
  );

  // Memoized particles
  const particles = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  // Optimized IntersectionObserver
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: '50px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Ultra-optimized carousel with CSS animation
  useEffect(() => {
    if (!isVisible || !carouselRef.current) return;

    const carousel = carouselRef.current;
    const items = carousel.children;

    if (items.length === 0) return;

    // Calculate total width for seamless loop
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = window.innerWidth < 640 ? 16 : window.innerWidth < 768 ? 24 : window.innerWidth < 1024 ? 32 : 40;
    const totalWidth = (itemWidth + gap) * clients.length;

    // Create optimized CSS animation
    const styleId = 'carousel-animation-style';
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      @keyframes infiniteCarousel {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-${totalWidth}px, 0, 0); }
      }
      .infinite-carousel {
        animation: infiniteCarousel 28s linear infinite;
        will-change: transform;
      }
      .infinite-carousel:hover {
        animation-play-state: paused;
      }
    `;

    carousel.classList.add('infinite-carousel');

    return () => {
      carousel.classList.remove('infinite-carousel');
    };
  }, [isVisible, clients.length]);

  // Optimized GSAP animations with GPU acceleration
  useEffect(() => {
    if (!isVisible || !sectionRef.current) return;

    // Kill existing context
    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    const setupTimer = setTimeout(() => {
      ctxRef.current = gsap.context(() => {
        // Stats cards animation - GPU accelerated
        gsap.fromTo(
          '.stat-card',
          {
            y: 35,
            opacity: 0,
            scale: 0.92,
            force3D: true,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            force3D: true,
          }
        );

        // Title animation - GPU accelerated
        gsap.fromTo(
          '.client-title',
          {
            y: 35,
            opacity: 0,
            force3D: true,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.15,
            ease: 'power3.out',
            force3D: true,
          }
        );

        // Subtitle animation - GPU accelerated
        gsap.fromTo(
          '.client-subtitle',
          {
            y: 25,
            opacity: 0,
            force3D: true,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.3,
            ease: 'power3.out',
            force3D: true,
          }
        );
      }, sectionRef);
    }, 50);

    return () => {
      clearTimeout(setupTimer);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [isVisible]);

  // Memoized background load handler
  const handleBgLoad = useCallback(() => {
    setBgLoaded(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden py-6 sm:py-10 md:py-14 lg:py-20"
      style={{ contain: 'layout style paint' }}
    >
      {/* OPTIMIZED BACKGROUND - GPU Accelerated */}
      <div className="absolute inset-0 z-0" style={{ contain: 'strict' }}>
        {/* Fallback gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/60 to-gray-900"
          style={{ contain: 'strict' }}
        />

        {/* Optimized Background Image with Next.js Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/clientsSection.webp"
            alt="Clients Section Background"
            fill
            quality={85}
            priority={false}
            className={`object-cover transition-opacity duration-700 ${
              bgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="100vw"
            onLoad={handleBgLoad}
            style={{
              willChange: 'opacity',
              transform: 'translate3d(0,0,0)',
            }}
          />
        </div>

        {/* Overlays */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-purple-900/60 to-gray-900/80"
          style={{ contain: 'strict' }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_80%)]"
          style={{ contain: 'strict' }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{ contain: 'strict' }}
        />
      </div>

      {/* Optimized Particles - Conditional Render */}
      {isVisible && (
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ contain: 'strict' }}
        >
          {particles.map((i) => (
            <Particle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Main Content - GPU Optimized */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
        style={{ contain: 'layout style' }}
      >
        <div className="flex flex-col gap-6 sm:gap-10 md:gap-14 lg:gap-20">
          {/* Stats Cards */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-3xl sm:max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-3 sm:space-y-5 md:space-y-7">
            <h2 
              className="client-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight sm:leading-tight"
              style={{ willChange: 'transform, opacity' }}
            >
              OUR CLIENTS
            </h2>

            <p 
              className="client-subtitle text-sm sm:text-base md:text-lg lg:text-xl text-white/85 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed sm:leading-relaxed px-2 sm:px-0"
              style={{ willChange: 'transform, opacity' }}
            >
              We collaborate with startups, founders, and growing businesses who value{' '}
              <span className="text-purple-300 font-semibold">Structure</span> before scale.
            </p>
          </div>

          {/* OPTIMIZED EDGE-TO-EDGE CAROUSEL - GPU Accelerated */}
          <div 
            className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden z-20 py-4 sm:py-6 md:py-8"
            style={{ contain: 'layout style' }}
          >
            <div
              ref={carouselRef}
              className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10"
              style={{
                width: 'max-content',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
            >
              {duplicatedClients.map((client, index) => (
                <ClientCard key={`${client.name}-${index}`} client={client} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}