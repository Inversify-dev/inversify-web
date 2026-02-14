'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How We Work', href: '/How-We-Work' },
    { name: 'Invert', href: '/invert' },
    { name: 'Inversification', href: '/digitalization' },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/inversify',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      href: 'https://twitter.com/inversify',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/inversify',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden pt-16 pb-8 border-t border-white/10">
      
      {/* --- BACKGROUND EFFECTS (Subtle & Clean) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-purple-900/20 blur-[100px] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0 mix-blend-overlay" />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* MAIN GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* COLUMN 1: Call to Action / Contact (Spans 5 columns) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <h3 className="text-2xl font-light tracking-wide text-white mb-2">
                Let’s invert the <span className="text-purple-400 font-normal">ordinary.</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                From structure to system, we define the technical foundations of your future.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <a 
                href="mailto:hello.inversify@gmail.com" 
                className="group flex items-center gap-2 text-base text-gray-300 hover:text-white transition-all duration-300 w-fit"
              >
                <span className="group-hover:text-purple-400 transition-colors">hello.inversify@gmail.com</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a 
                href="tel:+94704621228" 
                className="group flex items-center gap-2 text-base text-gray-300 hover:text-white transition-all duration-300 w-fit"
              >
                <span className="group-hover:text-purple-400 transition-colors">+94 704 621 228</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2: Navigation (Spans 3 columns) */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Menu</h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Socials (Spans 4 columns) */}
          <div className="md:col-span-4 md:pl-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Connect</h4>
            
            {/* Social Icons Row */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 hover:bg-purple-900/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                    {social.icon}
                  </span>
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 border-t border-white/5">
  <p className="text-[11px] text-gray-600 tracking-wider text-center">
    © {currentYear} Inversify. All rights reserved.
  </p>
</div>


      </div>
    </footer>
  );
}