import { useEffect, useState } from 'react';

/**
 * Hook to detect device capabilities and performance metrics
 * Returns configuration for rendering heavy effects
 */
export const useDeviceCapability = () => {
  const [capability, setCapability] = useState({
    isMobile: false,
    isLowPower: false,
    isTablet: false,
    pixelRatio: 1,
    maxFPS: 60,
    supportsWebGL2: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    // Check if mobile/tablet
    const isMobile = /iPhone|iPad|iPod|Android|Mobile|Tablet/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    
    // Check if low power mode (iOS)
    const isLowPower = navigator.getBattery ? true : false;
    
    // Get pixel ratio
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    
    // Check WebGL2 support
    const canvas = document.createElement('canvas');
    const supportsWebGL2 = !!canvas.getContext('webgl2');
    
    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Estimate FPS based on device
    let maxFPS = 60;
    if (isMobile || isTablet) maxFPS = 30;
    if (isLowPower) maxFPS = 24;

    setCapability({
      isMobile,
      isLowPower,
      isTablet,
      pixelRatio,
      maxFPS,
      supportsWebGL2,
      prefersReducedMotion,
    });
  }, []);

  return capability;
};
