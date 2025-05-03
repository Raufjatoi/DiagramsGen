import { useState, useEffect } from 'react';

// Custom hook to detect mobile devices and screen sizes
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Additional hooks for more specific breakpoints
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    xs: false,  // < 480px
    sm: false,  // >= 640px
    md: false,  // >= 768px
    lg: false,  // >= 1024px
    xl: false,  // >= 1280px
    '2xl': false // >= 1536px
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      setBreakpoint({
        xs: window.innerWidth < 480,
        sm: window.innerWidth >= 640,
        md: window.innerWidth >= 768,
        lg: window.innerWidth >= 1024,
        xl: window.innerWidth >= 1280,
        '2xl': window.innerWidth >= 1536
      });
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}