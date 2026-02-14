"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circleBurstRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const masterTL = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete?.();
        },
      });

      // Reset all elements properly
      gsap.set(
        [
          logoRef.current,
          titleRef.current,
          taglineRef.current,
          progressBarRef.current,
        ],
        {
          opacity: 0,
        }
      );

      gsap.set(logoRef.current, { scale: 0, rotation: -180 });
      gsap.set(circleBurstRef.current, { scale: 0, opacity: 1 });

      gsap.set(progressFillRef.current, { scaleX: 0, transformOrigin: "left" });

      // PHASE 1: Circle Burst + Logo
      masterTL
        .to(
          circleBurstRef.current,
          {
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          0
        )
        .to(
          circleBurstRef.current,
          {
            scale: 15,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
          },
          0.5
        )
        .to(
          logoRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)",
          },
          0.6
        );

      // PHASE 2: Text Animation
const titleChars = titleRef.current?.querySelectorAll(".char") ?? [];
      masterTL
        .to(titleRef.current, { opacity: 1, duration: 0.1 }, 1.5)
        .to(
          titleChars,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.4,
            ease: "power2.out",
          },
          1.6
        );

const taglineWords = taglineRef.current?.querySelectorAll(".word") ?? [];
      masterTL
        .to(taglineRef.current, { opacity: 1, duration: 0.1 }, 2.3)
        .to(
          taglineWords,
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          2.4
        );

      // PHASE 3: Progress bar
      masterTL
        .to(progressBarRef.current, { opacity: 1, duration: 0.3 }, 3)
        .to(
          progressFillRef.current,
          {
            scaleX: 1,
            duration: 1.3,
            ease: "power2.inOut",
          },
          3.2
        );

      // PHASE 4: Exit animation
      masterTL
        .to(
          [
            logoRef.current,
            titleRef.current,
            taglineRef.current,
            progressBarRef.current,
          ],
          {
            opacity: 0,
            y: -40,
            duration: 0.6,
            ease: "power4.in",
          },
          4.5
        )
        .to(
          splashRef.current,
          {
            yPercent: -100,
            duration: 0.8,
            ease: "expo.inOut",
          },
          4.9
        );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 opacity-15 md:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(147,51,234,0.2) 0%, rgba(0,0,0,0) 50%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 sm:px-8 md:px-12">
        {/* Logo section */}
        <div className="relative mb-10 sm:mb-12 md:mb-14">
          {/* Circle burst */}
          <div
            ref={circleBurstRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(147,51,234,1) 0%, rgba(147,51,234,0.8) 50%, rgba(147,51,234,0) 100%)",
              boxShadow:
                "0 0 40px rgba(147,51,234,1), 0 0 80px rgba(147,51,234,0.6)",
            }}
          />

          {/* Logo */}
          <div
            ref={logoRef}
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-0"
            style={{
              filter:
                "drop-shadow(0 0 25px rgba(147,51,234,0.6)) drop-shadow(0 0 50px rgba(147,51,234,0.3))",
            }}
          >
            <Image
              src="/images/logo-icon.png"
              alt="Inversify"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div ref={titleRef} className="text-center opacity-0 mb-4 sm:mb-5 md:mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.25em] sm:tracking-[0.3em] uppercase">
            {["I", "N", "V", "E", "R", "S", "I", "F", "Y"].map((char, i) => (
              <span
                key={i}
                className="char inline-block opacity-0 translate-y-6"
                style={{
                  color: "#ffffff",
                  textShadow: "0 0 30px rgba(255,255,255,0.3)",
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="text-center opacity-0 mb-12 sm:mb-14 md:mb-16 lg:mb-20"
        >
          <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase px-4">
            {[].map((word, i) => (
              <span
                key={i}
                className="word inline-block opacity-0 translate-y-3 mr-2 sm:mr-2.5 md:mr-3"
                style={{
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Progress Bar */}
        <div ref={progressBarRef} className="w-56 sm:w-64 md:w-80 lg:w-96 opacity-0">
          <div className="h-[1px] bg-white/8 rounded-full overflow-hidden relative">
            <div
              ref={progressFillRef}
              className="absolute inset-0"
              style={{
                transformOrigin: "left",
                background:
                  "linear-gradient(90deg, rgba(147,51,234,0.9) 0%, rgba(255,255,255,0.9) 100%)",
                boxShadow: "0 0 15px rgba(147,51,234,0.5)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
