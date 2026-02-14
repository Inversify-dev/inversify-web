'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Sparkles, Quote, Star } from 'lucide-react';

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: "Inversify transformed our digital presence completely. The attention to detail and innovative approach exceeded all expectations.",
      author: "Sarah Johnson",
      role: "CEO, TechCorp",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      quote: "Working with Inversify was a game-changer. They delivered a stunning website that perfectly captures our brand essence.",
      author: "Michael Chen",
      role: "Founder, StartupX",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      quote: "The team's expertise and professionalism are unmatched. Our conversion rates increased by 300% after the redesign.",
      author: "Emily Rodriguez",
      role: "Marketing Director, GrowthCo",
      avatar: "👩‍💻",
      rating: 5
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-card',
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'left 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-black to-pink-950/20" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-pink-300">TESTIMONIALS</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block mb-2">What Our</span>
            <span className="text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text">
              Clients Say
            </span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="testimonial-card">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-pink-500/20" />
            
            <div className="relative space-y-6">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-light">
                "{testimonials[activeIndex].quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="text-5xl">
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">
                    {testimonials[activeIndex].author}
                  </h4>
                  <p className="text-white/60">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeIndex === index
                  ? 'w-8 bg-gradient-to-r from-pink-600 to-purple-600'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}