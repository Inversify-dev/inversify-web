'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Cpu,
  Zap,
  Shield,
  Globe,
  Layers,
  Code,
  Palette,
  Smartphone,
  BarChart,
  Cloud,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: 0,
      icon: Cpu,
      title: 'Modern Tech Stack',
      description: 'Built with cutting-edge technologies like Next.js 14, TypeScript, and Tailwind CSS',
      details: [
        'Server-side rendering for optimal performance',
        'Type-safe development experience',
        'Responsive design system',
        'Optimized bundle sizes'
      ],
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200'
    },
    {
      id: 1,
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that users love',
      details: [
        'User-centered design approach',
        'Interactive animations and transitions',
        'Accessibility-first development',
        'Design system implementation'
      ],
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200'
    },
    {
      id: 2,
      icon: Zap,
      title: 'Performance',
      description: 'Lightning-fast applications with optimal loading',
      details: [
        'Code splitting and lazy loading',
        'Image optimization',
        'Caching strategies',
        'Performance monitoring'
      ],
      color: 'from-yellow-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200'
    },
    {
      id: 3,
      icon: Shield,
      title: 'Security',
      description: 'Enterprise-grade security for peace of mind',
      details: [
        'Encrypted data transmission',
        'Authentication & authorization',
        'Regular security audits',
        'Compliance standards'
      ],
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create a horizontal scroll within this section
      const scrollTween = gsap.to(containerRef.current, {
        x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${containerRef.current!.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update active feature based on scroll progress
            const progress = self.progress;
            const featureIndex = Math.floor(progress * features.length);
            if (featureIndex !== activeFeature) {
              setActiveFeature(featureIndex);
            }
          }
        }
      });

      // Animate content entrance
      gsap.fromTo(leftContentRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate image entrance
      gsap.fromTo('.feature-image',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse"
          }
        }
      );

      return () => {
        scrollTween.scrollTrigger?.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`,
          }} />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
        </div>
      </div>

      {/* Content Container */}
      <div ref={containerRef} className="flex h-screen">
        {features.map((feature, index) => (
          <div key={feature.id} className="flex-shrink-0 w-screen h-screen flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left Content - Text */}
                <div ref={leftContentRef} className="space-y-8">
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                    <span className="text-sm text-white/70">Feature {index + 1}</span>
                  </motion.div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                      {feature.title}
                    </h2>
                  </div>

                  <p className="text-xl text-white/60 mb-8">
                    {feature.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {feature.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
                        <span className="text-white/80">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 bg-gradient-to-r ${feature.color} text-white font-semibold rounded-xl hover:shadow-xl transition-all`}
                  >
                    Learn More
                  </motion.button>
                </div>

                {/* Right Content - Image/Visual */}
                <div className="relative">
                  <motion.div
                    className="feature-image relative rounded-3xl overflow-hidden"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Image placeholder with gradient */}
                    <div className="aspect-video rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-8xl opacity-20 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 blur-2xl" />
                  </motion.div>

                  {/* Stats overlay */}
                  <motion.div
                    className="absolute -bottom-6 right-0 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { value: '99.9%', label: 'Uptime' },
                        { value: '<1s', label: 'Load Time' },
                        { value: 'A+', label: 'Security' },
                        { value: '100%', label: 'Satisfaction' },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm text-white/50">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeFeature === index
                  ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 right-8 z-20"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <span>Scroll</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </section>
  );
}