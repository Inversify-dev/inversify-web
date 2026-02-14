'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function ConstellationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !svgRef.current) return;

    const paths = ['#path-fork-top', '#path-fork-bottom', '#path-main', '#path-final']
      .map(id => document.querySelector(id) as SVGPathElement)
      .filter(p => p !== null);

    paths.forEach(p => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.set(['#dot-top', '#dot-bottom'], { opacity: 1, scale: 1 });
    gsap.set('.milestone-node:not(#dot-top):not(#dot-bottom)', { opacity: 0, scale: 0 });

    const textElements = gsap.utils.toArray('.milestone-text-content');
    textElements.forEach((elem: any) => {
      const split = new SplitText(elem, { type: "words", wordsClass: "word" });
      gsap.set(split.words, { opacity: 0.35, color: "#888", y: 2 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1500%", 
        scrub: 1.5,
        pin: true,
      }
    });

    // ACT 1: Convergence
    tl.to(['#path-fork-top', '#path-fork-bottom'], { strokeDashoffset: 0, duration: 10, ease: "none" })
      .to(svgRef.current, { attr: { viewBox: "200 100 500 400" }, duration: 10 }, "<")
      .to('#dot-y-join', { opacity: 1, scale: 1, duration: 2 }, "-=2")
      .to(gsap.utils.toArray('#label-1 .word'), { opacity: 1, color: "#fff", stagger: 0.1 }, "-=1.5");

    // ACT 2: Main Path segments (P1 to P4)...
    // [Similar logic to our previous 1:1 scroll coordination]
    
    // Final Act: IDEA reveal
    tl.to('#dot-idea', { opacity: 1, scale: 1, duration: 4 })
      .to(gsap.utils.toArray('#label-idea .word'), { opacity: 1, color: "#fff" }, "-=2");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src="/images/DiveDeep.webp" className="w-full h-full object-cover opacity-40" alt="Space" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        <svg ref={svgRef} className="absolute inset-0 w-full h-full z-10" viewBox="200 100 500 400">
           {/* SVG content from our constellation logic goes here */}
           <path id="path-fork-top" d="M 250,150 L 450,250" stroke="white" strokeWidth="0.7" fill="none" opacity="0.6"/>
           <path id="path-fork-bottom" d="M 230,350 L 450,250" stroke="white" strokeWidth="0.7" fill="none" opacity="0.6"/>
           <path id="path-main" d="M 450,250 L 550,500 L 520,750 L 450,950 L 600,1350 L 350,1750" stroke="white" strokeWidth="0.7" fill="none" />
           <path id="path-final" d="M 150,1880 L 400,2200" stroke="white" strokeWidth="1.1" fill="none" />
           {/* ... add your dots and foreignObjects here ... */}
        </svg>
    </div>
  );
}