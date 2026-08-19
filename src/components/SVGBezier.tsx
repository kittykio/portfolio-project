'use client';
import { useRef, useEffect } from 'react';
import React from 'react';

// Defines the props for the SVGBezier component.
interface SVGBezierProps {
  // Tailwind class for vertical padding of the wrapper div.
  paddingY?: string;
  // Desired height of the SVG element in pixels.
  svgHeight?: number;
}

/**
 * An interactive component that renders a quadratic Bezier curve which deforms
 * based on pointer movement (mouse or touch) and animates back to flat on pointer leave.
 */
const SVGBezier: React.FC<SVGBezierProps> = ({ paddingY = 'py-4', svgHeight = 100 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  // State refs for animation control.
  const progressRef = useRef(0); // Vertical displacement of the control point (y-axis).
  const xRef = useRef(0.5); // Horizontal position of the control point (0 to 1).
  const timeRef = useRef(Math.PI / 2); // Used for the sine wave decay during animateOut.
  const reqIdRef = useRef<number | null>(null); // Stores the requestAnimationFrame ID.
  const lastYRef = useRef<number | null>(null); // Stores the last pointer Y position for delta calculation.

  /**
   * Calculates the path 'd' attribute based on current progress (vertical offset) and X position.
   */
  const setPath = (progress: number) => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    // Use current bounding box to ensure responsiveness
    const rect = svg.getBoundingClientRect();
    const w = Math.max(200, Math.round(rect.width));
    const h = Math.max(80, Math.round(rect.height));

    // Ensure viewBox matches the actual rendered size for proper scaling.
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const centerY = h / 2;
    // The vertical position of the control point, offset by `progress`.
    const ctrlY = centerY + progress;

    // Quadratic Bezier Curve (Q): M0 centerY Q controlX ctrlY w centerY
    // The control point is set by w * xRef.current.
    path.setAttribute('d', `M0 ${centerY} Q ${w * xRef.current} ${ctrlY} ${w} ${centerY}`);
  };

  // Lifecycle for initial setup and cleanup.
  useEffect(() => {
    // Initialize the path.
    setPath(progressRef.current);

    const onResize = () => setPath(progressRef.current);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  /**
   * Linear interpolation function for smooth easing.
   */
  const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

  /**
   * Stops the decay animation when the pointer enters the interactive area.
   */
  const handlePointerEnter = (e: React.PointerEvent) => {
    lastYRef.current = e.clientY;
    if (reqIdRef.current) {
      cancelAnimationFrame(reqIdRef.current);
      reqIdRef.current = null;
    }
  };

  /**
   * Updates the curve based on pointer position and movement.
   */
  const handlePointerMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    // 1. Update horizontal position of control point (xRef).
    xRef.current = (e.clientX - rect.left) / rect.width;

    // 2. Update vertical offset (progressRef) based on deltaY.
    const lastY = lastYRef.current ?? e.clientY;
    const deltaY = e.clientY - lastY;
    lastYRef.current = e.clientY;

    // Damping the effect by multiplying deltaY.
    progressRef.current += deltaY * 0.6;
    setPath(progressRef.current);
  };

  /**
   * Animation loop to smoothly decay the curve back to a flat line.
   */
  const animateOut = () => {
    const p = progressRef.current;
    const t = timeRef.current;

    // Use sine wave decay for a slightly bouncy effect, scaled by current progress.
    const newProgress = p * Math.sin(t);

    // Slowly interpolate the actual progress toward 0.
    progressRef.current = lerp(p, 0, 0.05);
    timeRef.current += 0.2;

    setPath(newProgress);

    // Continue animation until the actual progress is close to 0.
    if (Math.abs(progressRef.current) > 0.75) {
      reqIdRef.current = requestAnimationFrame(animateOut);
    } else {
      // Reset state for the next interaction.
      timeRef.current = Math.PI / 2;
      progressRef.current = 0;
      reqIdRef.current = null;
      setPath(0); // Final state is a flat line.
    }
  };

  /**
   * Starts the decay animation when the pointer leaves the interactive area.
   */
  const handlePointerLeave = () => {
    lastYRef.current = null;
    if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    reqIdRef.current = requestAnimationFrame(animateOut);
  };

  return (
    <div className={`w-full ${paddingY} flex justify-center`}>
      <div className="w-full max-w-7xl relative">
        <svg
          ref={svgRef}
          // Fix: Use inline style for dynamic height, as Tailwind classes cannot use dynamic variables directly in string concatenation like this.
          style={{ height: svgHeight }}
          className="w-full"
          viewBox={`0 0 1000 ${svgHeight}`}
          preserveAspectRatio="none"
        >
          <path ref={pathRef} className="stroke-content-muted stroke-[1px] fill-none" />
        </svg>
        {/* Invisible overlay for capturing pointer events */}
        <div
          onPointerDown={handlePointerEnter} // Pointerdown instead of pointerenter for touch start
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerLeave} // Pointerup instead of pointerleave for reliable touch end
          onPointerLeave={handlePointerLeave}
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ touchAction: 'none' }} // Prevents browser scrolling/panning on touch devices
        />
      </div>
    </div>
  );
};

export default SVGBezier;
