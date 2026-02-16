'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register GSAP plugins once at module scope
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RoadmapJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const initializedRef = useRef(false);
  
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const handleBgLoad = useCallback(() => setBgLoaded(true), []);

  // Mobile detection - runs once
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth < 768;
    setIsMobileDevice(isMobileUA || isTouch || isNarrow);
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // GSAP animation - runs ONCE when visible
  useEffect(() => {
    if (!containerRef.current || !svgRef.current || !isVisible || initializedRef.current) return;

    initializedRef.current = true;

    const ctx = gsap.context(() => {
      ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: isMobileDevice ? 150 : 100,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isTablet: '(min-width: 768px) and (max-width: 1023px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isMobile, isTablet } = context.conditions as { 
            isMobile: boolean; 
            isTablet: boolean; 
            isDesktop: boolean 
          };

          if (!isMobile) {
            const paths = ['#path-fork-top', '#path-fork-bottom', '#path-main', '#path-final']
              .map((id) => document.querySelector<SVGPathElement>(id))
              .filter((p): p is SVGPathElement => p !== null);

            paths.forEach((p) => {
              const len = p.getTotalLength();
              gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            });

            gsap.set(['#dot-top', '#dot-bottom'], { opacity: 1, scale: 1 });
            gsap.set('.milestone-node:not(#dot-top):not(#dot-bottom)', { opacity: 0, scale: 0.5 });
            gsap.set('.milestone-text-content', { opacity: 0.35 });
            gsap.set('#label-1 .milestone-text-content', { opacity: 1 });

            // Reduce scroll duration slightly to make swipes feel more responsive
            const scrollDuration = isTablet ? '1500%' : '1800%';
            const scrubValue = 1; // Tighter scrub for better snap feel
            const baseDuration = isTablet ? 18 : 25;
            const pathDuration = isTablet ? 25 : 35;

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: `+=${scrollDuration}`,
                scrub: scrubValue,
                pin: true,
                anticipatePin: 1,
                fastScrollEnd: true,
                preventOverlaps: true,
                invalidateOnRefresh: true,
                // --- SNAP CONFIGURATION ---
                snap: {
                  snapTo: "labels", // Snaps to the closest label defined in the timeline
                  duration: { min: 0.3, max: 0.8 }, // Animation duration for the snap
                  delay: 0.1, // Wait 0.1s after scrolling stops before snapping
                  ease: "power2.inOut", // Smooth ease into the slot
                }
              },
            });

            // Add start label
            tl.addLabel("start");

            // ACT 1: CONVERGENCE
            tl.to(['#path-fork-top', '#path-fork-bottom'], { strokeDashoffset: 0, duration: baseDuration, ease: 'none' }, 0)
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '180 90 550 450' : '200 100 500 400' },
                duration: baseDuration,
                ease: 'power1.inOut',
              }, 0)
              .to('#dot-y-join', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, baseDuration - 1);
            
            // SNAP POINT 1
            tl.addLabel("stage-1");

            const animateText = (selector: string, position: string | number) => {
              if (selector === '#label-1') return;
              tl.to(`${selector} .milestone-text-content`, {
                opacity: 1,
                duration: 3,
                ease: 'power1.inOut',
              }, position);
            };

            // ACT 2: MAIN JOURNEY
            const mainPath = paths[2];
            const mainLen = mainPath.getTotalLength();

            // P1 - 02 Architect
            tl.to(mainPath, { strokeDashoffset: mainLen * 0.835, duration: pathDuration, ease: 'none' })
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '280 340 550 450' : '300 350 500 400' },
                duration: pathDuration,
                ease: 'power1.inOut',
              }, '<')
              .to('#dot-p1', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '>-0.5');
            animateText('#label-2', '>');
            
            // SNAP POINT 2
            tl.addLabel("stage-2");

            // P2 - 03 Translate
            tl.to(mainPath, { strokeDashoffset: mainLen * 0.68, duration: pathDuration, ease: 'none' })
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '260 590 550 450' : '280 600 500 400' },
                duration: pathDuration,
                ease: 'power1.inOut',
              }, '<')
              .to('#dot-p2', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '>-0.5');
            animateText('#label-3', '>');

            // SNAP POINT 3
            tl.addLabel("stage-3");

            // P3 - 04 Build
            tl.to(mainPath, { strokeDashoffset: mainLen * 0.55, duration: pathDuration, ease: 'none' })
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '130 840 550 450' : '150 850 500 400' },
                duration: pathDuration,
                ease: 'power1.inOut',
              }, '<')
              .to('#dot-p3', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '>-0.5');
            animateText('#label-4', '>');

            // SNAP POINT 4
            tl.addLabel("stage-4");

            // P4 - 05 Validate
            tl.to(mainPath, { strokeDashoffset: mainLen * 0.29, duration: pathDuration, ease: 'none' })
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '230 1190 550 450' : '250 1200 500 400' },
                duration: pathDuration,
                ease: 'power1.inOut',
              }, '<')
              .to('#dot-p4', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '>-0.5');
            animateText('#label-5', '>');

            // SNAP POINT 5
            tl.addLabel("stage-5");

            // P5 - 06 Scale
            tl.to(mainPath, { strokeDashoffset: 0, duration: pathDuration, ease: 'none' })
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '-50 1450 600 500' : '-30 1450 550 450' },
                duration: pathDuration,
                ease: 'power1.inOut',
              }, '<')
              .to('#dot-p5', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '>-0.5');
            animateText('#label-6', '>');

            // SNAP POINT 6
            tl.addLabel("stage-6");

            // ACT 3: THE GAP
            const gapDuration = isTablet ? 25 : 30;
            tl.to(svgRef.current, {
              attr: { viewBox: isTablet ? '-120 1590 650 500' : '-100 1600 600 450' },
              duration: gapDuration,
              ease: 'power2.inOut',
            });
            animateText('#label-gap-text', `<+=${gapDuration * 0.2}`);

            // ACT 4: IDEA
            tl.to('#dot-idea', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
            animateText('#label-idea', '>');
            
            // SNAP POINT 7 (The Idea)
            tl.addLabel("stage-idea");

            // ACT 5: FINAL LANDING
            tl.to('#path-final', { strokeDashoffset: 0, duration: pathDuration, ease: 'none' })
              .to(svgRef.current, {
                attr: { viewBox: isTablet ? '-30 1840 700 600' : '0 1850 650 550' },
                duration: pathDuration,
                ease: 'power1.inOut',
              }, '<')
              .to('#dot-final', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '>-0.5');
            animateText('#label-final', '>');

            // SNAP POINT FINAL
            tl.addLabel("stage-final");

          } else {
            // MOBILE: Static (unchanged)
            gsap.set(['#dot-top', '#dot-bottom', '.milestone-node'], { opacity: 1, scale: 1 });
            const paths = ['#path-fork-top', '#path-fork-bottom', '#path-main', '#path-final']
              .map((id) => document.querySelector<SVGPathElement>(id))
              .filter((p): p is SVGPathElement => p !== null);
            paths.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
            gsap.set('.milestone-text-content', { opacity: 1 });
          }
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isVisible, isMobileDevice]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden font-sans lg:h-screen"
      style={{ contain: 'layout style paint' }}
    >
      <div className="absolute inset-0 z-0" style={{ contain: 'strict' }}>
        <Image
          src="/images/DiveDeep.webp"
          alt="Starry Background"
          fill
          quality={85}
          priority={false}
          loading="lazy"
          className={`object-cover transition-opacity duration-500 ${bgLoaded ? 'opacity-60' : 'opacity-0'}`}
          sizes="100vw"
          onLoad={handleBgLoad}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* DESKTOP SVG */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full z-10 touch-none hidden lg:block"
        viewBox="200 100 500 400"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.7" fill="none">
          <path d="M 250,150 L 450,250" />
          <path d="M 230,350 L 450,250" />
          <path d="M 450,250 L 550,500 L 520,750 L 450,950 L 600,1350 L 350,1750" strokeLinejoin="round" />
          <path d="M 175,1920 L 400,2200" strokeWidth="1.1" />
        </g>

        <g stroke="white" strokeWidth="0.7" fill="none" opacity="0.85">
          <path id="path-fork-top" d="M 250,150 L 450,250" />
          <path id="path-fork-bottom" d="M 230,350 L 450,250" />
          <path id="path-main" d="M 450,250 L 550,500 L 520,750 L 450,950 L 600,1350 L 350,1750" strokeLinejoin="round" />
          <path id="path-final" d="M 175,1920 L 400,2200" strokeWidth="1.1" />
        </g>

        <g fill="white">
          <circle id="dot-top" cx="250" cy="150" r="3" filter="url(#starGlow)" />
          <circle id="dot-bottom" cx="230" cy="350" r="3" filter="url(#starGlow)" />
          <circle id="dot-y-join" cx="450" cy="250" r="4" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-p1" cx="550" cy="500" r="4" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-p2" cx="520" cy="750" r="4" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-p3" cx="450" cy="950" r="4" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-p4" cx="600" cy="1350" r="4" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-p5" cx="350" cy="1750" r="4" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-idea" cx="175" cy="1920" r="7" className="milestone-node" filter="url(#starGlow)" />
          <circle id="dot-final" cx="400" cy="2200" r="5" className="milestone-node" filter="url(#starGlow)" />
        </g>

        <foreignObject id="label-1" x="160" y="220" width="240" height="160" className="milestone-text">
          <div>
            <div className="milestone-text-content text-white text-[20px] font-bold tracking-tight uppercase leading-tight mb-2">
              01 - Understand
            </div>
            <div className="milestone-text-content text-white/80 text-[11px] font-light leading-relaxed max-w-[220px]">
              We study your business, audience, and direction.
            </div>
          </div>
        </foreignObject>

        <foreignObject id="label-2" x="575" y="450" width="260" height="200" className="milestone-text">
          <div>
            <div className="milestone-text-content text-white text-[20px] font-bold tracking-tight uppercase leading-tight mb-2">
              02 - Architect
            </div>
            <div className="milestone-text-content text-white/80 text-[11px] font-light leading-relaxed max-w-[240px]">
              We define structure - from information architecture to technical foundations.
            </div>
          </div>
        </foreignObject>

        <foreignObject id="label-3" x="540" y="710" width="240" height="180" className="milestone-text">
          <div>
            <div className="milestone-text-content text-white text-[20px] font-bold tracking-tight uppercase leading-tight mb-2">
              03 - Translate
            </div>
            <div className="milestone-text-content text-white/80 text-[11px] font-light leading-relaxed max-w-[220px]">
              Strategy becomes concept. Concept becomes system.
            </div>
          </div>
        </foreignObject>

        <foreignObject id="label-4" x="170" y="900" width="260" height="180" className="milestone-text">
          <div className="text-right">
            <div className="milestone-text-content text-white text-[20px] font-bold tracking-tight uppercase leading-tight mb-2">
              04 - Build
            </div>
            <div className="milestone-text-content text-white/80 text-[11px] font-light leading-relaxed max-w-[240px] ml-auto">
              Design and development move together - never in isolation.
            </div>
          </div>
        </foreignObject>

        <foreignObject id="label-5" x="360" y="1300" width="260" height="180" className="milestone-text">
          <div>
            <div className="milestone-text-content text-white text-[20px] font-bold tracking-tight uppercase leading-tight mb-2">
              05 - Validate
            </div>
            <div className="milestone-text-content text-white/80 text-[11px] font-light leading-relaxed max-w-[240px]">
              Performance, usability, and scalability are tested and refined.
            </div>
          </div>
        </foreignObject>

        <foreignObject id="label-6" x="90" y="1700" width="240" height="180" className="milestone-text">
          <div className="text-right">
            <div className="milestone-text-content text-white text-[20px] font-bold tracking-tight uppercase leading-tight mb-2">
              06 - Scale
            </div>
            <div className="milestone-text-content text-white/80 text-[11px] font-light leading-relaxed max-w-[220px] ml-auto">
              The system expands without losing coherence.
            </div>
          </div>
        </foreignObject>

        <foreignObject id="label-gap-text" x="100" y="1820" width="380" height="140" className="milestone-text">
          <div className="milestone-text-content text-white/40 text-[9px] text-center leading-relaxed uppercase tracking-[0.25em] px-4">
            Every system reaches this point - the gap between execution and breakthrough.
          </div>
        </foreignObject>

        <foreignObject id="label-idea" x="40" y="1870" width="120" height="120" className="milestone-text">
          <div className="milestone-text-content text-white font-black text-[44px] tracking-tighter opacity-90 text-right pr-3 leading-none">
            IDEA
          </div>
        </foreignObject>

<foreignObject id="label-final" x="340" y="2150" width="360" height="160" className="milestone-text">
  <div className="flex items-center justify-center h-full w-full">
    <a
      href="/digitalization"
      className="group relative inline-flex items-center justify-center px-8 py-3 bg-white/95 text-black border border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:bg-black hover:text-white hover:border-white hover:scale-110 pointer-events-auto shadow-lg shadow-white/10 backdrop-blur-sm"
    >
      <span className="relative z-10 font-semibold text-sm tracking-[0.15em] uppercase">Inversification</span>
    </a>
  </div>
</foreignObject>
      </svg>

      {/* MOBILE LAYOUT */}
      <div className="relative z-10 lg:hidden py-20 px-6">
        <div className="max-w-md mx-auto space-y-20">
          {[
            { num: '01', title: 'Understand', desc: 'We study your business, audience, and direction.' },
            { num: '02', title: 'Architect', desc: 'We define structure - from information architecture to technical foundations.' },
            { num: '03', title: 'Translate', desc: 'Strategy becomes concept. Concept becomes system.' },
            { num: '04', title: 'Build', desc: 'Design and development move together - never in isolation.' },
            { num: '05', title: 'Validate', desc: 'Performance, usability, and scalability are tested and refined.' },
            { num: '06', title: 'Scale', desc: 'The system expands without losing coherence.' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50" />
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/40 to-transparent" />
              </div>
              <h3 className="text-white text-2xl font-bold tracking-tight uppercase">
                {num} - {title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}

          <div className="pt-12 pb-8 space-y-12">
            <div className="flex items-center justify-center">
              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            <div className="text-center space-y-6">
              <div className="w-2 h-2 rounded-full bg-white/40 mx-auto" />
              <h2 className="text-white/90 font-light text-sm uppercase tracking-[0.3em] leading-relaxed px-8">
                Every breakthrough begins with a single
              </h2>
              <h3 className="text-white font-black text-8xl tracking-tighter leading-none">IDEA</h3>
            </div>
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <div className="h-[1px] w-16 bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </div>
            <div className="text-center space-y-6">
              <p className="text-white/50 text-xs uppercase tracking-widest">Ready to begin?</p>
              <a
                href="#"
                className="inline-flex items-center justify-center px-14 py-6 bg-white text-black border-2 border-white rounded-full transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-2xl shadow-white/20"
              >
                <span className="font-bold text-lg tracking-[0.25em] uppercase">Inversification</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}