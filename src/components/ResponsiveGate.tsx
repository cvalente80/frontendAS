import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

/**
 * ResponsiveGate renders different children depending on the screen size.
 * Use it to swap layouts or route users to mobile/desktop specific experiences.
 */
export function ResponsiveGate({
  mobile,
  desktop,
  breakpoint = 768,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  breakpoint?: number;
}) {
  const isMobile = useIsMobile(breakpoint);
  return <>{isMobile ? mobile : desktop}</>;
}
