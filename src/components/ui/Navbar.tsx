'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isSplashDone: boolean;
}

export default function Navbar({ isSplashDone }: NavbarProps) {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const ticking = useRef(false);
const requestRef = useRef<number | null>(null);

  // Optimized scroll logic with RAF
  useEffect(() => {
    let lastKnownScrollY = 0;

    const handleScroll = () => {
      lastKnownScrollY = window.scrollY;

      if (!ticking.current) {
        requestRef.current = requestAnimationFrame(() => {
          const currentScrollY = lastKnownScrollY;

          // Update scrolled state
          setIsScrolled(currentScrollY > 50);

          // Update visibility
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
            setIsMobileMenuOpen(false);
          } else {
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [lastScrollY]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Prevent navbar from rendering during splash
  if (!isSplashDone) return null;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'How We Work', href: '/How-We-Work' },
    // { name: 'Portfolio', href: '/portfolio' },
    { label: 'Invert', href: '/invert' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}
          animate-navbar-reveal
        `}
        style={{
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="max-w-[2000px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex items-center justify-between h-12 md:h-16">

            {/* Desktop Left Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navItems.slice(0, 2).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  className={`text-[11px] font-bold transition-all tracking-[0.2em] uppercase relative group ${
                    isActive(item.href) ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Logo */}
            <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <Link href="/" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/images/logo-full-light.png"
                  alt="Inversify"
                  width={140}
                  height={40}
                  priority
                  className="h-7 md:h-9 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Right Nav */}
            <div className="hidden lg:flex items-center gap-10">
              <Link
                href="/invert"
                prefetch={true}
                className={`text-[11px] font-bold transition-all tracking-[0.2em] uppercase relative group ${
                  isActive('/invert') ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Invert
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${
                    isActive('/invert') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>

              <Link
                href="/digitalization"
                prefetch={true}
                className={`px-6 py-2 text-[10px] font-black tracking-[0.2em] uppercase rounded-full transition-transform active:scale-95 ${
                  isActive('/digitalization')
                    ? 'bg-white text-black scale-105'
                    : 'bg-white/90 text-black hover:bg-white'
                }`}
              >
                Inversification
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-[10001] p-2 touch-manipulation active:scale-95"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-end">
                <span
                  className={`h-[2px] bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'w-6 translate-y-[9px] -rotate-45' : 'w-6'
                  }`}
                  style={{ willChange: 'transform' }}
                />
                <span
                  className={`h-[2px] bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'w-4'
                  }`}
                  style={{ willChange: 'opacity' }}
                />
                <span
                  className={`h-[2px] bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'w-6 -translate-y-[9px] rotate-45' : 'w-2'
                  }`}
                  style={{ willChange: 'transform' }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-3xl transition-all duration-500 ease-in-out lg:hidden z-[9999] ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          willChange: 'opacity, visibility',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-3xl md:text-4xl font-black tracking-tighter uppercase transition-all duration-300 transform ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${
                isActive(item.href)
                  ? 'text-white underline underline-offset-8'
                  : 'text-white/50 hover:text-white'
              }`}
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : '0ms',
                willChange: 'transform, opacity',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/digitalization"
            prefetch={true}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`mt-4 px-10 py-4 text-sm font-black uppercase rounded-full tracking-widest transition-all duration-300 active:scale-95 transform ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${
              isActive('/digitalization')
                ? 'bg-white text-black'
                : 'bg-white/20 text-white border border-white/20 hover:bg-white hover:text-black'
            }`}
            style={{ 
              transitionDelay: isMobileMenuOpen ? `${navItems.length * 50}ms` : '0ms',
              willChange: 'transform, opacity',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Digitalization
          </Link>
        </div>
      </div>

      {/* Custom Animation Style */}
      <style jsx global>{`
        @keyframes navbarReveal {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        .animate-navbar-reveal {
          animation: navbarReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}