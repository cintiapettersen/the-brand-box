'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * useScaleToFit
 *
 * Returns { wrapperRef, wrapperStyle, innerStyle, scale }
 *
 * Usage:
 *   const { wrapperRef, wrapperStyle, innerStyle } = useScaleToFit(NATURAL_WIDTH);
 *   <div ref={wrapperRef} style={wrapperStyle}>
 *     <div style={innerStyle}>  ← put fixed-width content here
 *       ...
 *     </div>
 *   </div>
 *
 * The outer div (wrapperRef) grows/shrinks freely with the layout.
 * The inner div is transformed so the fixed-width content fits inside.
 */
export function useScaleToFit(naturalWidth, naturalHeight = null) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;

    const update = () => {
      const parentW = el.getBoundingClientRect().width;
      if (!parentW || !naturalWidth) return;
      const newScale = parentW < naturalWidth ? parentW / naturalWidth : 1;
      setScale(prev => Math.abs(prev - newScale) < 0.005 ? prev : newScale);
    };

    update();
    
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
      }
      return;
    }

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalWidth]);

  // The outer wrapper collapses to the scaled height so it doesn't leave empty space
  const scaledHeight = naturalHeight !== null ? Math.round(naturalHeight * scale) : undefined;

  const wrapperStyle = {
    width: '100%',
    ...(scaledHeight !== undefined ? { height: scaledHeight } : {}),
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  };

  const innerStyle = {
    transformOrigin: 'top center',
    transform: scaledHeight !== undefined ? `translateX(-50%) scale(${scale})` : `scale(${scale})`,
    width: naturalWidth,
    ...(naturalHeight !== null ? { height: naturalHeight } : {}),
    position: scaledHeight !== undefined ? 'absolute' : 'relative',
    left: scaledHeight !== undefined ? '50%' : 'auto',
  };

  return { wrapperRef, wrapperStyle, innerStyle, scale };
}
