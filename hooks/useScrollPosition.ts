import { useState, useEffect, useRef } from 'react';

export interface ScrollPosition {
  scrollY: number;
  direction: 'up' | 'down' | null;
  isAtTop: boolean;
  isScrolled: boolean;
}

/**
 * Reusable custom hook untuk mendeteksi posisi dan arah scroll window dengan performa tinggi
 * @param threshold Jarak scroll dalam px untuk menandai status isScrolled (default: 50)
 */
export function useScrollPosition(threshold: number = 50): ScrollPosition {
  const [scrollInfo, setScrollInfo] = useState<ScrollPosition>({
    scrollY: 0,
    direction: null,
    isAtTop: true,
    isScrolled: false,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const direction =
            currentScrollY > lastScrollY.current
              ? 'down'
              : currentScrollY < lastScrollY.current
              ? 'up'
              : null;

          setScrollInfo({
            scrollY: currentScrollY,
            direction,
            isAtTop: currentScrollY < 10,
            isScrolled: currentScrollY > threshold,
          });

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollInfo;
}
