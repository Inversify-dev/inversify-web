'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layers,
  Zap,
  Shield,
  Globe,
  Code,
  Smartphone,
  Cloud,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      id: 'digital-transformation',
      title: 'Digital Transformation',
      icon: Layers,
      description: 'Comprehensive digital strategy and implementation',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Strategic consulting',
        'Project management',
        'Change management',
        'Performance analytics'
      ],
      benefits: [
        'Increased operational efficiency',
        'Improved customer experience',
        'Competitive advantage',
        'Scalable growth'
      ]
    },
    {
      id: 'ai-ml',
      title: 'AI & ML Solutions',
      icon: Zap,
      description: 'Intelligent systems that learn and adapt',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Machine learning',
        'Artificial intelligence',
        'Data analytics',
        'Predictive modeling'
      ],
      benefits: [
        'Data-driven decisions',
        'Automated processes',
        'Enhanced insights',
        'Future-proof solutions'
      ]
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      icon: Cloud,
      description: 'Scalable infrastructure for growth',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Infrastructure as a service',
        'Platform as a service',
        'Software as a service',
        'DevOps implementation'
      ],
      benefits: [
        'Reduced costs',
        'Increased flexibility',
        'Improved security',
        'Global scalability'
      ]
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate tabs
      gsap.fromTo('.service-tab',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate content
      gsap.fromTo('.service-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeService = services[activeTab];

  return (
    <section 
      ref={sectionRef}
      className="relative w-screen min-h-screen bg-black py-20 md:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/10 to-blue-950/10" />
        
        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239933ea' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">SERVICES</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="block">Specialized</span>
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text">
              Expertise
            </span>
          </h2>

          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            We offer deep expertise in cutting-edge technologies and methodologies 
            to deliver exceptional results for your business.
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              onClick={() => setActiveTab(index)}
              className={`service-tab px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <service.icon className="w-5 h-5" />
                {service.title}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active Service Content */}
        <div className="service-content">
          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeService.color} p-4`}>
                    <activeService.icon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{activeService.title}</h3>
                    <p className="text-white/60">{activeService.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Key Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Benefits */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Business Benefits</h4>
                  <div className="space-y-4">
                    {activeService.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 mt-2" />
                        <p className="text-white/70">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20">
                  <p className="text-white/80 mb-4">
                    Ready to implement {activeService.title.toLowerCase()} in your business?
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full px-6 py-3 bg-gradient-to-r ${activeService.color} text-white font-semibold rounded-xl flex items-center justify-center gap-3`}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: '95%', label: 'Project Success Rate' },
            { value: '24/7', label: 'Support Available' },
            { value: '99.9%', label: 'Uptime Guarantee' },
            { value: '30+', label: 'Technology Partners' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}