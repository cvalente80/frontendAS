import { useEffect, useState } from 'react';

// Simple responsive detector using matchMedia
export function useIsMobile(breakpointPx: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches);

    // Initial state
    setIsMobile(mq.matches);
    // Subscribe
    mq.addEventListener?.('change', onChange as (ev: Event) => void);
    // Fallback for Safari < 14
    // @ts-ignore
    mq.addListener?.(onChange);

    return () => {
      mq.removeEventListener?.('change', onChange as (ev: Event) => void);
      // @ts-ignore
      mq.removeListener?.(onChange);
    };
  }, [breakpointPx]);

  return isMobile;
}
