'use client';

import React, {
  useMemo, useRef, useState, useEffect, useCallback, memo,
} from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Suspense } from 'react';
import Image from 'next/image';

// ─── MODULE-LEVEL CONSTANTS ───────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Stable data — allocated once, never re-created
const SECTIONS = [
  {
    title: 'Web Design &',
    subtitle: 'Development',
    description:
      'Premium web experiences with cinematic UI, smooth motion, and modern frameworks built for speed and trust.',
  },
  {
    title: 'E-Commerce',
    subtitle: 'Platform',
    description:
      'Conversion-driven online stores with powerful checkout journeys, performance tuning, and scalable infrastructure.',
  },
  {
    title: 'Brand',
    subtitle: 'Identity',
    description:
      'A complete identity system crafted to feel premium, memorable, and built for long-term growth and recognition.',
  },
] as const;

// Target rotations per section — outside component, never re-allocated
const TARGET_ANGLES = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];

// ─── STAR SHADER ─────────────────────────────────────────────────────────────
// Factory function — each instance gets its own `uniforms` object.
// Sharing a single object causes uniform state bleed if component remounts.
const createStarShaderMaterial = () => ({
  uniforms: {
    uTime:       { value: 0 },
    uPixelRatio: { value: typeof window !== 'undefined' ? window.devicePixelRatio : 1 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uPixelRatio;
    attribute float aScale;
    attribute float aSpeed;
    varying float vAlpha;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      float blink = sin(uTime * aSpeed + aScale * 100.0);
      vAlpha = 0.5 + 0.5 * (blink + 1.0);
      gl_PointSize = aScale * uPixelRatio * (450.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      float glow = pow(1.0 - (r * 2.0), 1.5);
      gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * glow);
    }
  `,
});

// ─── THREE.JS SUB-COMPONENTS ──────────────────────────────────────────────────

// Memoized — re-renders only when isMobile changes
const TwinklingStars = memo(function TwinklingStars({ isMobile }: { isMobile: boolean }) {
  const pointsRef   = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const shaderDef   = useMemo(() => createStarShaderMaterial(), []); // Own uniforms object

  const geometry = useMemo(() => {
    const count     = isMobile ? 5000 : 12000;
    const positions = new Float32Array(count * 3);
    const scales    = new Float32Array(count);
    const speeds    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 80 + Math.random() * 150;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      scales[i] = Math.random() * 0.8 + 0.4;
      speeds[i] = 1.0 + Math.random() * 3.0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale',   new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, [isMobile]);

  // Clean up geometry on unmount
  useEffect(() => () => { geometry.dispose(); }, [geometry]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[shaderDef]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Memoized planet — stable refs prevent re-renders from parent scroll updates
const CinematicPlanet = memo(function CinematicPlanet({
  scrollProgress,
  activeIndex,
  isMobile,
}: {
  scrollProgress: React.MutableRefObject<number>;
  activeIndex:    React.MutableRefObject<number>;
  isMobile:       boolean;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const colorMap = useLoader(TextureLoader, '/images/planet1.png');

  useEffect(() => {
    if (!colorMap) return;
    colorMap.wrapS  = THREE.MirroredRepeatWrapping;
    colorMap.wrapT  = THREE.ClampToEdgeWrapping;
    colorMap.repeat.set(2, 1);
    if (isMobile) {
      colorMap.minFilter = THREE.LinearFilter;
      colorMap.magFilter = THREE.LinearFilter;
    }
  }, [colorMap, isMobile]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const target    = TARGET_ANGLES[activeIndex.current] ?? 0;
    const lerpSpeed = isMobile ? 0.06 : 0.04;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      target + scrollProgress.current * 0.4,
      lerpSpeed
    );
    const floatIntensity = isMobile ? 0.05 : 0.1;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * floatIntensity;
  });

  const segments   = isMobile ? 64 : 128;
  const planetSize = isMobile ? 2.8 : 3.2;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[planetSize, segments, segments]} />
      <meshStandardMaterial
        map={colorMap}
        roughness={0.8}
        metalness={0.2}
        emissiveMap={colorMap}
        emissive="#331144"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
});

// Low-end fallback — no texture load, no shader
const SimplePlanetFallback = memo(function SimplePlanetFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.8, 32, 32]} />
      <meshStandardMaterial
        color="#5533ff"
        roughness={0.8}
        metalness={0.2}
        emissive="#331144"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
});

// ─── SHARED CANVAS ────────────────────────────────────────────────────────────
// Extracted to avoid JSX duplication between mobile/desktop paths
function PlanetCanvas({
  scrollProgress,
  activeIndex,
  isMobile,
  isLowEnd,
}: {
  scrollProgress: React.MutableRefObject<number>;
  activeIndex:    React.MutableRefObject<number>;
  isMobile:       boolean;
  isLowEnd:       boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, isMobile ? 13 : 11], fov: isMobile ? 42 : 38 }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias:       !isMobile,
        powerPreference: 'high-performance',
        alpha:           false,
      }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#7c3aed" />
        {isLowEnd ? (
          <SimplePlanetFallback />
        ) : (
          <CinematicPlanet
            scrollProgress={scrollProgress}
            activeIndex={activeIndex}
            isMobile={isMobile}
          />
        )}
        <TwinklingStars isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PlanetScroll() {
  const containerRef      = useRef<HTMLDivElement>(null);
  const planetSectionRef  = useRef<HTMLDivElement>(null);
  const contentRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgress    = useRef(0);
  const activeIndex       = useRef(0);

  // ── Hydration-safe state — always false on first render ─────────────────
  const [isMobile, setIsMobile]     = useState(false);
  const [isLowEnd, setIsLowEnd]     = useState(false);
  const [isVisible, setIsVisible]   = useState(false);
  const [bgLoaded, setBgLoaded]     = useState(false);

  const handleBgLoad = useCallback(() => setBgLoaded(true), []);

  // ── Device detection — after mount only ──────────────────────────────────
  useEffect(() => {
    const ua      = navigator.userAgent.toLowerCase();
    const isMobUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth < 768;
    setIsMobile(isMobUA || isTouch || isNarrow);

    const memory    = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores     = navigator.hardwareConcurrency ?? 4;
    setIsLowEnd(memory < 4 || cores < 4);
  }, []);

  // ── rAF-debounced resize ─────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsMobile(window.innerWidth < 768));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── IntersectionObserver — lazy-load 3D ──────────────────────────────────
  useEffect(() => {
    const el = planetSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.01, rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── GSAP — DESKTOP ONLY ───────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!isVisible || isMobile) return;

      const totalScroll = SECTIONS.length * 500;
      const scrubSpeed  = 2.5;

      ScrollTrigger.create({
        trigger:          planetSectionRef.current,
        start:            'top top',
        end:              `+=${totalScroll}px`,
        pin:              true,
        scrub:            scrubSpeed,
        anticipatePin:    1,
        fastScrollEnd:    true,
        invalidateOnRefresh: true,
        id:               'planet-scroll',
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          activeIndex.current = Math.min(
            SECTIONS.length - 1,
            Math.floor(self.progress * SECTIONS.length)
          );
        },
      });

      contentRefs.current.forEach((el, index) => {
        if (!el) return;

        gsap.set(el, { opacity: 0, y: 100, filter: 'blur(20px)' });

        const segment    = 1 / SECTIONS.length;
        const start      = index * segment;
        const end        = (index + 1) * segment;
        const revealStart = start + segment * 0.1;
        const revealEnd   = start + segment * 0.4;
        const fadeStart   = end - segment * 0.3;
        const fadeEnd     = end - segment * 0.05;

        ScrollTrigger.create({
          trigger:          planetSectionRef.current,
          start:            'top top',
          end:              `+=${totalScroll}px`,
          scrub:            1.2,
          fastScrollEnd:    true,
          id:               `planet-content-${index}`,
          onUpdate: (self) => {
            const p = self.progress;
            let opacity = 0, y = 100, blur = 20, scale = 0.95;

            if (p >= revealStart && p <= revealEnd) {
              const t = (p - revealStart) / (revealEnd - revealStart);
              opacity = t; y = 100 * (1 - t); blur = 20 * (1 - t); scale = 0.95 + t * 0.05;
            } else if (p > revealEnd && p < fadeStart) {
              opacity = 1; y = 0; blur = 0; scale = 1;
            } else if (p >= fadeStart && p <= fadeEnd) {
              const t = (p - fadeStart) / (fadeEnd - fadeStart);
              opacity = 1 - t; y = -60 * t; blur = 20 * t; scale = 1 - t * 0.03;
            }

            gsap.set(el, {
              opacity,
              y,
              scale,
              filter:        `blur(${blur}px)`,
              pointerEvents: opacity > 0.8 ? 'auto' : 'none',
              visibility:    opacity === 0 ? 'hidden' : 'visible',
              force3D:       true,
            });
          },
        });
      });
    },
    { scope: containerRef, dependencies: [isVisible, isMobile] }
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE RENDER — static layout, no GSAP scroll animation
  // ═══════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div ref={containerRef} className="bg-black">
        {/* Static planet — no scroll pinning, auto-rotates via useFrame */}
        <div className="relative h-[55vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

          {isVisible && (
            <div className="absolute inset-0 z-0">
              <PlanetCanvas
                scrollProgress={scrollProgress}
                activeIndex={activeIndex}
                isMobile={true}
                isLowEnd={isLowEnd}
              />
            </div>
          )}

          {!isVisible && (
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-black to-black" />
          )}

          {/* Trigger visibility */}
          <div
            ref={planetSectionRef}
            className="absolute inset-0 pointer-events-none"
          />
        </div>

        {/* Static service cards — no transitions */}
        <div className="px-6 py-12 space-y-16 max-w-lg mx-auto">
          {SECTIONS.map((section, index) => (
            <div
              key={index}
              className={`${index % 2 === 0 ? 'text-left' : 'text-right'}`}
            >
              <div className={`h-[1px] w-16 bg-white/40 mb-6 ${index % 2 === 0 ? '' : 'ml-auto'}`} />
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                {section.title}
              </h2>
              <h3 className="text-5xl font-serif italic text-white/90 lowercase leading-none -mt-1">
                {section.subtitle}
              </h3>
              <p className={`mt-6 text-base text-white/50 font-light leading-relaxed ${index % 2 === 0 ? '' : 'ml-auto'}`}>
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DESKTOP RENDER — full GSAP scroll-driven animations
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div ref={containerRef} className="bg-black">
      <div ref={planetSectionRef} className="h-screen w-full relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

        {/* 3D Canvas — lazy mounted via IntersectionObserver */}
        {isVisible ? (
          <div className="absolute inset-0 z-0">
            <PlanetCanvas
              scrollProgress={scrollProgress}
              activeIndex={activeIndex}
              isMobile={false}
              isLowEnd={isLowEnd}
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-radial from-purple-900/30 via-black to-black" />
        )}

        {/* Content Overlay — GSAP drives opacity/blur/y */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {SECTIONS.map((service, index) => (
            <div
              key={index}
              ref={(el) => { contentRefs.current[index] = el; }}
              className={`absolute inset-0 flex items-center px-6 sm:px-10 md:px-24`}
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              <div className={`w-full max-w-7xl mx-auto flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-2xl ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <div className={`h-[1px] w-16 md:w-24 bg-white/40 mb-6 md:mb-10 ${index % 2 === 0 ? '' : 'ml-auto'}`} />
                  <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                    {service.title}
                  </h2>
                  <h3 className="text-5xl sm:text-6xl md:text-8xl lg:text-[130px] font-serif italic text-white/90 lowercase leading-none -mt-1 md:-mt-2">
                    {service.subtitle}
                  </h3>
                  <p className={`mt-6 md:mt-10 text-base sm:text-lg md:text-xl lg:text-2xl text-white/50 font-light leading-relaxed max-w-lg ${index % 2 === 0 ? '' : 'ml-auto'}`}>
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator — desktop only */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-3 opacity-20">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}