"use client";

import { useEffect, useState } from "react";

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    ('ontouchstart' in window && window.innerWidth < 1024) ||
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    
    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isMounted };
};

export const isClient = typeof window !== 'undefined';