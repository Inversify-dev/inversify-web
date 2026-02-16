'use client';

import { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Link from 'next/link';

// Register GSAP plugins only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

// Ultra-optimized dust particles - reduced count for mobile
const AmbientDust = memo(({ isMobile }: { isMobile: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: isMobile ? 3 : 6 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 2.5 + 2,
      delay: Math.random() * 2,
    })), [isMobile]
  );

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ contain: 'strict' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-[1px] h-[1px] rounded-full bg-purple-300/20"
          style={{ 
            left: p.left, 
            top: p.top,
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)',
          }}
          animate={{ 
            y: [0, -50, 0], 
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ 
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity, 
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

AmbientDust.displayName = 'AmbientDust';

// Hyper-optimized spring configs
const SPRING_CONFIG = { damping: 30, stiffness: 150, mass: 0.3, restDelta: 0.001 };
const CURSOR_SPRING = { damping: 15, stiffness: 250, mass: 0.2, restDelta: 0.001 };
const SCROLL_SPRING = { damping: 20, stiffness: 100, mass: 0.5 };
const MOBILE_SPRING = { damping: 25, stiffness: 120, mass: 0.4 };

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const arrowPathRef = useRef<SVGPathElement>(null);
  const digitalTextRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Optimized motion values with minimal overhead
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorXRaw = useMotionValue(-100);
  const cursorYRaw = useMotionValue(-100);

  // Pre-configured spring values - use mobile config on mobile
  const springConfig = useMemo(() => isMobile ? MOBILE_SPRING : SPRING_CONFIG, [isMobile]);
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  const cursorX = useSpring(cursorXRaw, CURSOR_SPRING);
  const cursorY = useSpring(cursorYRaw, CURSOR_SPRING);

  // Optimized scroll with smooth spring
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  
  const smoothScrollProgress = useSpring(scrollYProgress, SCROLL_SPRING);

  // Memoized transform values - simplified for mobile
  const line1X = useTransform(smoothScrollProgress, [0, 1], isMobile ? ['0%', '-40%'] : ['0%', '-60%']);
  const line2X = useTransform(smoothScrollProgress, [0, 1], isMobile ? ['0%', '40%'] : ['0%', '60%']);
  const contentOpacity = useTransform(smoothScrollProgress, [0, 0.35], [1, 0]);
  const bgScale = useTransform(smoothScrollProgress, [0, 1], isMobile ? [1.02, 1.15] : [1.05, 1.25]);

  // Optimized glow with memoized template - disabled on mobile for performance
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['25%', '75%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['25%', '75%']);
  const liveGlow = useMotionTemplate`radial-gradient(circle 450px at ${glowX} ${glowY}, rgba(147, 51, 234, 0.18), transparent 65%)`;

  // Parallax values - reduced for mobile
  const bgParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], isMobile ? ['0%', '0%'] : ['-1%', '1%']);
  const bgParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], isMobile ? ['0%', '0%'] : ['-1%', '1%']);
  const gridParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], isMobile ? [0, 0] : [-15, 15]);
  const gridParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], isMobile ? [0, 0] : [-15, 15]);
  const gridScale = useTransform(smoothScrollProgress, [0, 1], isMobile ? [1, 1.2] : [1, 1.5]);

  // IntersectionObserver for visibility optimization
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Optimized mobile detection with debounce
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Ultra-optimized GSAP Arrow Animation - desktop only
  useEffect(() => {
    if (!arrowRef.current || !arrowPathRef.current || hasAnimated || isMobile || !isVisible) return;
    if (!digitalTextRef.current || !buttonRef.current) return;

    const arrow = arrowRef.current;
    const path = arrowPathRef.current;
    const digitalText = digitalTextRef.current;
    const button = buttonRef.current;

    const animateArrow = () => {
      const digitalRect = digitalText.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const svgRect = arrow.getBoundingClientRect();

      const startX = (digitalRect.right - svgRect.left) + 30;
      const startY = (digitalRect.top + digitalRect.height / 2) - svgRect.top;
      const endX = (buttonRect.left - svgRect.left) + 250;
      const endY = (buttonRect.top + buttonRect.height / 2) - svgRect.top;

      const cp1X = startX + 480;
      const cp1Y = startY + 80;
      const cp2X = startX + 500;
      const cp2Y = startY + 280;
      const cp3X = endX + 380;
      const cp3Y = endY + 160;
      const cp4X = endX + 120;
      const cp4Y = endY + 30;

      const pathD = `M ${startX} ${startY} 
              C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${(cp2X + cp3X) / 2} ${(cp2Y + cp3Y) / 2}
              C ${cp3X} ${cp3Y}, ${cp4X} ${cp4Y}, ${endX} ${endY}`;
      
      path.setAttribute('d', pathD);
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = `${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;

      const tl = gsap.timeline({
        delay: 1.5,
        onComplete: () => setHasAnimated(true)
      });

      tl.to(arrow, { opacity: 1, duration: 0.25 }, 0)
        .to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
        }, 0)
        .fromTo('#animated-arrow-icon',
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' },
          0
        )
        .to('#animated-arrow-icon', {
          duration: 1.8,
          ease: 'power2.inOut',
          motionPath: {
            path: path,
            align: path,
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
          },
        }, 0);
    };

    const timer = setTimeout(animateArrow, 200);
    return () => {
      clearTimeout(timer);
      gsap.killTweensOf([arrow, path, '#animated-arrow-icon']);
    };
  }, [hasAnimated, isMobile, isVisible]);

  // Hyper-optimized mouse tracking with RAF throttle - desktop only
  useEffect(() => {
    if (!isVisible || isMobile) return;

    let rafId: number | null = null;
    let ticking = false;
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          
          const rect = sectionRef.current.getBoundingClientRect();
          const x = (lastX - rect.left) / rect.width - 0.5;
          const y = (lastY - rect.top) / rect.height - 0.5;

          mouseX.set(x);
          mouseY.set(y);
          cursorXRaw.set(lastX - 16);
          cursorYRaw.set(lastY - 16);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, cursorXRaw, cursorYRaw, isVisible, isMobile]);

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      cursorXRaw.set(-100);
      cursorYRaw.set(-100);
    };
  }, [cursorXRaw, cursorYRaw]);

  // Memoized handlers
  const handleButtonHoverStart = useCallback(() => setIsHovering(true), []);
  const handleButtonHoverEnd = useCallback(() => setIsHovering(false), []);

  return (
    <section 
      ref={sectionRef} 
      className={`relative w-full h-full bg-black overflow-hidden ${!isMobile ? 'lg:cursor-none' : ''}`}
      style={{ contain: 'layout style paint' }}
    >
      {/* OPTIMIZED BACKGROUND - GPU Accelerated */}
      <motion.div
        id="hero-bg-container"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          scale: bgScale,
          x: bgParallaxX,
          y: bgParallaxY,
          willChange: isMobile ? 'auto' : 'transform',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, #111827, rgba(88, 28, 135, 0.1), #000000)',
            contain: 'strict',
          }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
          style={{
            backgroundImage: "url('/images/hero3.webp')",
            filter: 'brightness(0.7) contrast(1.1)',
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
          }}
        />
        {!isMobile && (
          <motion.div 
            className="absolute inset-0 mix-blend-screen opacity-60" 
            style={{ 
              background: liveGlow,
              willChange: 'background',
            }} 
          />
        )}
        {isVisible && <AmbientDust isMobile={isMobile} />}
      </motion.div>

      {/* OPTIMIZED CURSOR - Desktop only */}
      {!isMobile && (
        <motion.div
          className="hidden lg:flex fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] items-center justify-center"
          style={{ 
            x: cursorX, 
            y: cursorY,
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
          }}
        >
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            animate={{ scale: isHovering ? 2 : 1 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform' }}
          >
            <div className="absolute inset-0 rounded-full border border-white/80" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      )}

      {/* ANIMATED ARROW - Desktop only */}
      {!isMobile && isVisible && (
        <svg
          ref={arrowRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{ 
            opacity: 0,
            willChange: 'opacity',
          }}
        >
          <path
            ref={arrowPathRef}
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <g id="animated-arrow-icon" opacity="0">
            <path
              d="M 0 -7 L 12 0 L 0 7 L 2 0 Z"
              fill="rgba(255, 255, 255, 0.95)"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth="1"
            />
          </g>
        </svg>
      )}

      {/* CONTENT - Optimized Transforms */}
      <div 
        id="hero-content" 
        className="relative z-10 h-full w-full flex flex-col justify-center"
        style={{ contain: 'layout style' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative">          
          <div className="mb-6 md:mb-10 w-full flex flex-col items-center md:items-start md:pl-[8%] lg:pl-[12%]">
            <motion.div 
              style={{ 
                x: line1X, 
                opacity: contentOpacity,
                willChange: isMobile ? 'auto' : 'transform, opacity',
                transform: 'translate3d(0,0,0)',
              }} 
              className="w-full text-center md:text-left whitespace-nowrap ml-0 md:ml-20"
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  fontSize: 'clamp(2.8rem, 8.5vw, 110px)',
                  willChange: 'transform, opacity',
                }}
                className="font-extrabold text-white leading-none tracking-tighter drop-shadow-xl"
              >
                Going <span ref={digitalTextRef} className="italic font-serif font-light text-white/95">Digital</span>
              </motion.h1>
            </motion.div>

            <motion.div 
              style={{ 
                x: line2X, 
                opacity: contentOpacity,
                willChange: isMobile ? 'auto' : 'transform, opacity',
                transform: 'translate3d(0,0,0)',
              }} 
              className="w-full text-center md:text-left mt-2 md:mt-4 md:ml-28 lg:ml-80 whitespace-nowrap"
            >
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  fontSize: 'clamp(2.8rem, 8.5vw, 110px)',
                  willChange: 'transform, opacity',
                }}
                className="font-extrabold text-white leading-none tracking-tighter drop-shadow-xl"
              >
                Takes <span className="italic font-serif font-light text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">Nerves.</span>
              </motion.h1>
            </motion.div>
          </div>

          <motion.div 
            className="max-w-xl mx-auto md:mx-0 text-center md:text-left mt-8 md:ml-4 relative overflow-visible z-[999]" 
            style={{ 
              opacity: contentOpacity,
              willChange: 'opacity',
            }}
          >
            <p className="text-gray-200 text-base md:text-lg lg:text-xl leading-relaxed mb-8 font-light drop-shadow border-l-0 md:border-l-2 border-purple-500/40 md:pl-6">
              We <i><b>partner</b></i> with <b>ambitious brands</b> to design and develop digital products that <i><b>solve problems</b></i>, drive growth, and create meaningful connections with users.
            </p>

        
          <Link href="/digitalization">
            <motion.button
              ref={buttonRef}
              id="hero-cta-button"
              onHoverStart={!isMobile ? handleButtonHoverStart : undefined}
              onHoverEnd={!isMobile ? handleButtonHoverEnd : undefined}
              onTouchStart={isMobile ? handleButtonHoverStart : undefined}
              onTouchEnd={isMobile ? handleButtonHoverEnd : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              whileHover={!isMobile ? { 
                scale: 1.04, 
                backgroundColor: 'rgba(255,255,255,0.12)', 
                borderColor: 'rgba(255,255,255,0.4)',
              } : undefined}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: 'transform' }}
              className="px-10 py-4 border border-white/30 rounded-full bg-white/5 backdrop-blur-md text-white text-[11px] font-black tracking-[0.3em] uppercase transition-all shadow-lg hover:shadow-xl relative z-[1000] isolate active:scale-95"
            >
              Digitalization
            </motion.button>
          </Link>
          </motion.div>
        </div>
      </div>

      {/* OPTIMIZED BACKGROUND GRID - GPU Accelerated */}
      <motion.div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[5]"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,
          backgroundSize: isMobile ? '60px 60px' : '80px 80px',
          x: gridParallaxX,
          y: gridParallaxY,
          scale: gridScale,
          willChange: isMobile ? 'auto' : 'transform',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
      />
      
      {/* BOTTOM GRADIENT */}
      <div 
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none z-10"
        style={{ contain: 'strict' }}
      />
    </section>
  );
}
