'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Connect',
    description: 'Initialize your data warehouse with a single SDK call.',
  },
  {
    number: '02',
    title: 'Upload',
    description: 'Stream data directly to decentralized storage nodes.',
  },
  {
    number: '03',
    title: 'Query',
    description: 'Run SQL queries across distributed infrastructure.',
  },
  {
    number: '04',
    title: 'Scale',
    description: 'Watch your warehouse grow infinitely without limits.',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );

      // Horizontal scroll animation
      const cards = containerRef.current?.children || [];
      
      gsap.fromTo(
        cards,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-black py-20 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black" />
        <div className="absolute inset-0 opacity-[0.015] grid-minimal" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.15em] text-white uppercase mb-4">
            How It Works
          </h2>
          <p className="text-sm md:text-base text-white/40 tracking-wide">
            Four steps to infinite scale
          </p>
        </div>

        {/* Steps container */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="glass-card p-8 md:p-10 h-full flex flex-col hover:border-purple-500/30 transition-all duration-300">
                {/* Number */}
                <div className="text-6xl md:text-7xl font-light text-purple-500/20 mb-6 group-hover:text-purple-500/40 transition-colors duration-300">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-light tracking-wide text-white mb-4 uppercase">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gradient-to-r from-purple-500/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}