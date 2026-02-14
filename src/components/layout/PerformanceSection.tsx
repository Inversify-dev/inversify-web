'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    value: 99.99,
    suffix: '%',
    label: 'Uptime',
  },
  {
    value: 10,
    suffix: 'ms',
    label: 'Avg Query Time',
  },
  {
    value: 1000,
    suffix: '+',
    label: 'Nodes',
  },
  {
    value: 500,
    suffix: 'PB',
    label: 'Data Stored',
  },
];

export default function PerformanceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState(metrics.map(() => 0));

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

      // Metrics fade in
      const metricCards = metricsRef.current?.children || [];
      gsap.fromTo(
        metricCards,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: metricsRef.current,
            start: 'top 70%',
            onEnter: () => {
              // Animate counters
              metrics.forEach((metric, index) => {
                gsap.to(
                  { value: 0 },
                  {
                    value: metric.value,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                      setCounters((prev) => {
                        const newCounters = [...prev];
                        newCounters[index] = Math.floor(this.targets()[0].value);
                        return newCounters;
                      });
                    },
                  }
                );
              });
            },
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-black py-20 md:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015] grid-pattern-purple" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.15em] text-white uppercase mb-4">
            Performance
          </h2>
          <p className="text-sm md:text-base text-white/40 tracking-wide">
            Numbers that speak for themselves
          </p>
        </div>

        {/* Metrics grid */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative glass-card p-8 md:p-10 text-center hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Value */}
              <div className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                {index === 0 ? counters[index].toFixed(2) : counters[index]}
                <span className="text-purple-400">{metric.suffix}</span>
              </div>

              {/* Label */}
              <div className="text-xs md:text-sm text-white/40 uppercase tracking-[0.15em] font-light">
                {metric.label}
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-white/30 tracking-wide">
            Benchmarked across <span className="text-purple-400">1000+</span> production deployments
          </p>
        </div>
      </div>
    </section>
  );
}