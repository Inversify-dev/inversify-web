'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const securityFeatures = [
  {
    icon: '🔐',
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption for data at rest and in transit',
  },
  {
    icon: '📝',
    title: 'Immutable Audit Logs',
    description: 'Blockchain-verified access logs that can never be altered',
  },
  {
    icon: '✓',
    title: 'Cryptographic Verification',
    description: 'Every query result is cryptographically signed and verifiable',
  },
  {
    icon: '🏢',
    title: 'SOC 2 Type II Certified',
    description: 'Enterprise-grade compliance for the most demanding industries',
  },
  {
    icon: '🌍',
    title: 'Global Distribution',
    description: 'Data replicated across multiple continents for resilience',
  },
  {
    icon: '⚡',
    title: 'Zero-Knowledge Architecture',
    description: 'We can never access your data—only you hold the keys',
  },
];

export default function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal with clip-path
      gsap.fromTo(
        titleRef.current,
        {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );

      // Security feature cards - staggered fade and slide
      const cards = gridRef.current?.querySelectorAll('.security-card');
      if (cards) {
        cards.forEach((card, index) => {
          // Clip-path reveal
          gsap.fromTo(
            card,
            {
              clipPath: 'inset(0 0 100% 0)',
              opacity: 0,
            },
            {
              clipPath: 'inset(0 0 0% 0)',
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 55%',
                scrub: 1,
              },
            }
          );

          // Icon animation
          const icon = card.querySelector('.security-icon');
          if (icon) {
            gsap.fromTo(
              icon,
              {
                scale: 0,
                rotation: -180,
              },
              {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(2)',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-container py-32 relative"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute inset-0 noise-texture" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl font-black text-white mb-6 gpu-accelerated"
          >
            Security &{' '}
            <span className="text-gradient-purple glow-purple">Trust</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light max-w-3xl mx-auto">
            Your data is protected by military-grade security and cryptographic guarantees
          </p>
        </div>

        {/* Security Features Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="security-card glass-card p-8 group hover:scale-105 transition-transform duration-300 gpu-accelerated"
            >
              {/* Icon */}
              <div className="security-icon text-5xl mb-4">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-gradient-purple transition-all duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-base leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Accent line */}
              <div className="mt-6 h-0.5 bg-gradient-to-r from-inversify-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-24 text-center">
          <div className="inline-block glass-card px-8 py-4">
            <p className="text-sm md:text-base text-white/70 uppercase tracking-widest">
              Trusted by enterprises worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-1 h-64 bg-gradient-to-b from-transparent via-inversify-purple to-transparent opacity-30" />
      <div className="absolute top-1/4 right-0 w-1 h-64 bg-gradient-to-b from-transparent via-inversify-purple to-transparent opacity-30" />
    </section>
  );
}