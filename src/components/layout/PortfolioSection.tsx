'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ExternalLink,
  Github,
  ChevronRight,
  Eye,
  Star,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: 0,
      title: 'E-Commerce Platform',
      category: 'Web Development',
      description: 'A modern e-commerce solution with real-time inventory management, AI-powered recommendations, and seamless checkout experience.',
      image: '/api/placeholder/800/600',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'PostgreSQL'],
      metrics: [
        { icon: TrendingUp, value: '+250%', label: 'Revenue Growth' },
        { icon: Users, value: '50K+', label: 'Active Users' },
        { icon: Zap, value: '<1s', label: 'Load Time' },
        { icon: Star, value: '4.9/5', label: 'Rating' }
      ],
      features: ['AI Recommendations', 'Real-time Inventory', 'Multi-language', 'Mobile First'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 1,
      title: 'SaaS Dashboard',
      category: 'UI/UX Design',
      description: 'Enterprise analytics dashboard with interactive data visualization, custom reporting, and team collaboration features.',
      image: '/api/placeholder/800/600',
      tech: ['React', 'D3.js', 'Framer Motion', 'Chart.js', 'Supabase'],
      metrics: [
        { icon: TrendingUp, value: '95%', label: 'Satisfaction' },
        { icon: Users, value: '2K+', label: 'Teams' },
        { icon: Zap, value: '10x', label: 'Efficiency' },
        { icon: Star, value: '4.8/5', label: 'Rating' }
      ],
      features: ['Real-time Analytics', 'Custom Reports', 'Team Collaboration', 'API Integration'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Mobile Banking',
      category: 'Mobile Development',
      description: 'Secure banking application with biometric authentication, instant transfers, and financial planning tools.',
      image: '/api/placeholder/800/600',
      tech: ['React Native', 'TypeScript', 'Firebase', 'Face ID', 'Biometrics'],
      metrics: [
        { icon: TrendingUp, value: '99.9%', label: 'Security' },
        { icon: Users, value: '100K+', label: 'Downloads' },
        { icon: Zap, value: 'Instant', label: 'Transfers' },
        { icon: Star, value: '4.7/5', label: 'Rating' }
      ],
      features: ['Biometric Auth', 'Instant Transfers', 'Budget Tracking', 'Bill Pay'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'AI Content Platform',
      category: 'AI Integration',
      description: 'AI-powered content generation and optimization platform with SEO analysis and performance tracking.',
      image: '/api/placeholder/800/600',
      tech: ['Python', 'Next.js', 'OpenAI', 'PostgreSQL', 'Redis'],
      metrics: [
        { icon: TrendingUp, value: '10x', label: 'Productivity' },
        { icon: Users, value: '5K+', label: 'Content Creators' },
        { icon: Zap, value: 'Real-time', label: 'Generation' },
        { icon: Star, value: '4.9/5', label: 'Rating' }
      ],
      features: ['AI Writing', 'SEO Optimization', 'Content Analysis', 'Team Collaboration'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll for portfolio
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
            const progress = self.progress;
            const projectIndex = Math.floor(progress * projects.length);
            if (projectIndex !== activeProject) {
              setActiveProject(projectIndex);
            }
          }
        }
      });

      // Animate project cards
      gsap.fromTo('.project-card',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate project details
      gsap.fromTo('.project-details',
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
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

  const activeProjectData = projects[activeProject];

  return (
    <section ref={sectionRef} className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
            `,
          }} />
        </div>
      </div>

      {/* Container for horizontal scroll */}
      <div ref={containerRef} className="flex h-screen">
        {projects.map((project) => (
          <div key={project.id} className="flex-shrink-0 w-screen h-screen flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left - Project Visual */}
                <motion.div
                  className="project-card relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Project Image/Visual */}
                  <div className="relative rounded-3xl overflow-hidden border border-white/10">
                    <div className={`aspect-video bg-gradient-to-br ${project.color} opacity-20`} />
                    
                    {/* Tech stack overlay */}
                    <div className="absolute top-6 left-6">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 3).map((tech, i) => (
                          <div
                            key={i}
                            className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm border border-white/10"
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project number */}
                    <div className="absolute bottom-6 right-6">
                      <div className="text-6xl font-bold text-white/10">
                        0{project.id + 1}
                      </div>
                    </div>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {project.metrics.map((metric, i) => {
                      const Icon = metric.icon;
                      return (
                        <motion.div
                          key={i}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-white">{metric.value}</div>
                              <div className="text-sm text-white/50">{metric.label}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Right - Project Details */}
                <div className="project-details space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm text-white/70">{project.category}</span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                      {project.title}
                    </h2>
                    
                    <p className="text-xl text-white/60 mb-6">
                      {project.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Key Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {project.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          <span className="text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg flex items-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      View Live Demo
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg flex items-center gap-2"
                    >
                      <Github className="w-5 h-5" />
                      View Code
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(index)}
              className="flex items-center gap-2 group"
            >
              <div className={`w-2 h-2 rounded-full transition-all ${
                activeProject === index
                  ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'bg-white/20 group-hover:bg-white/40'
              }`} />
              <span className={`text-sm transition-colors ${
                activeProject === index ? 'text-white' : 'text-white/40 group-hover:text-white/60'
              }`}>
                0{index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveProject(prev => Math.max(0, prev - 1))}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white rotate-180" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveProject(prev => Math.min(projects.length - 1, prev + 1))}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/30 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}