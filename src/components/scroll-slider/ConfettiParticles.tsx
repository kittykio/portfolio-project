'use client';

import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type {
  Container,
  ISourceOptions,
  Engine,
  IShapeDrawer,
  IShapeDrawData,
  Particle,
} from '@tsparticles/engine';
import { getStyleFromHsl, getStyleFromRgb } from '@tsparticles/engine';
import { colorPalette } from '@/constants/colorPalette';

// Determines the stroke color for a particle based on its fill color, handling both HSL and RGB formats.
const getStrokeStyle = (particle: Particle): string => {
  const fillColor = particle.getFillColor();
  // Returns white as a fallback if no fill color is found.
  if (!fillColor) return colorPalette.white;

  // Converts color object to CSS style string.
  return 'h' in fillColor ? getStyleFromHsl(fillColor) : getStyleFromRgb(fillColor);
};

// Custom shape drawer for a circular design with internal cross and circle.
export const circleDrawer: IShapeDrawer<Particle> = {
  // Specifies the shape type name for configuration.
  validTypes: ['customCircle'],
  // The drawing function executed for each particle.
  draw: ({ context, radius, particle }: IShapeDrawData<Particle>) => {
    context.save();
    context.strokeStyle = getStrokeStyle(particle);
    context.lineWidth = 2;

    // Draws the outer circle.
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.stroke();

    // Draws the inner circle (half size).
    context.beginPath();
    context.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
    context.stroke();

    // Draws the cross lines.
    context.beginPath();
    context.moveTo(-radius, 0);
    context.lineTo(radius, 0);
    context.moveTo(0, -radius);
    context.lineTo(0, radius);
    context.stroke();

    context.restore();
  },
};

// Custom shape drawer for a 5-pointed star with a small inner circle.
export const starDrawer: IShapeDrawer<Particle> = {
  // Specifies the shape type name for configuration.
  validTypes: ['customStar'],
  // The drawing function executed for each particle.
  draw: ({ context, radius, particle }: IShapeDrawData<Particle>) => {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.45;

    context.save();
    context.strokeStyle = getStrokeStyle(particle);
    context.lineWidth = 2;

    // Draws the 5-pointed star outline.
    context.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();

    // Draws the small circle in the center.
    context.beginPath();
    context.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  },
};

// Custom shape drawer for two nested triangles rotated relative to each other.
export const triangleDrawer: IShapeDrawer<Particle> = {
  // Specifies the shape type name for configuration.
  validTypes: ['customTriangle'],
  // The drawing function executed for each particle.
  draw: ({ context, radius, particle }: IShapeDrawData<Particle>) => {
    const sides = 3;
    const step = (Math.PI * 2) / sides;

    context.save();
    context.strokeStyle = getStrokeStyle(particle);
    context.lineWidth = 2;

    // Draws the outer triangle.
    context.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = i * step - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();

    // Draws the inner, smaller, and rotated triangle.
    context.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = i * step - Math.PI / 2 + step / 2;
      const x = Math.cos(angle) * (radius * 0.5);
      const y = Math.sin(angle) * (radius * 0.5);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();

    context.restore();
  },
};

// Custom shape drawer for a snowflake/star-like pattern.
export const flakeDrawer: IShapeDrawer<Particle> = {
  // Specifies the shape type name for configuration.
  validTypes: ['customFlake'],
  // The drawing function executed for each particle.
  draw: ({ context, radius, particle }: IShapeDrawData<Particle>) => {
    const arms = 6;
    const armLength = radius * 1.2;
    const inner = radius * 0.4;
    const outer = radius * 0.8;

    context.save();
    context.lineWidth = 2.5;
    context.strokeStyle = getStrokeStyle(particle);

    for (let i = 0; i < arms; i++) {
      const angle = (i * Math.PI * 2) / arms;
      const x = Math.cos(angle) * armLength;
      const y = Math.sin(angle) * armLength;

      // Draws the main arm line.
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(x, y);
      context.stroke();

      // Draws a small dot closer to the center.
      const ix = Math.cos(angle) * inner;
      const iy = Math.sin(angle) * inner;
      context.beginPath();
      context.arc(ix, iy, 2.5, 0, Math.PI * 2);
      context.fillStyle = context.strokeStyle;
      context.fill();

      // Calculates and draws the two branches near the tip of the arm.
      const bx = Math.cos(angle) * outer;
      const by = Math.sin(angle) * outer;
      const branchOffset = Math.PI / 6;
      const bx1 = bx + Math.cos(angle + branchOffset) * (radius * 0.4);
      const by1 = by + Math.sin(angle + branchOffset) * (radius * 0.4);
      const bx2 = bx + Math.cos(angle - branchOffset) * (radius * 0.4);
      const by2 = by + Math.sin(angle - branchOffset) * (radius * 0.4);

      context.beginPath();
      context.moveTo(bx, by);
      context.lineTo(bx1, by1);
      context.moveTo(bx, by);
      context.lineTo(bx2, by2);
      context.stroke();
    }

    context.restore();
  },
};

// The main component that renders the animated confetti/firework particles.
export const ConfettiParticles = () => {
  // State to track if the particles engine has been initialized.
  const [init, setInit] = useState(false);

  // Utility function to safely get a CSS variable value.
  const getCssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // Memoizes the array of colors pulled from CSS variables for the particles.
  const colors = useMemo(
    () => [
      getCssVar('--flame-500'),
      getCssVar('--surface-muted'),
      getCssVar('--surface-subtle'),
      getCssVar('--content'),
      getCssVar('--content-muted'),
    ],
    [],
  );

  // Initializes the particles engine and registers all custom shape drawers.
  useEffect(() => {
    void initParticlesEngine(async (engine: Engine) => {
      // Loads the full set of features for tsparticles.
      await loadFull(engine);
      // Registers all custom shape drawers.
      await engine.addShape(circleDrawer);
      await engine.addShape(starDrawer);
      await engine.addShape(triangleDrawer);
      await engine.addShape(flakeDrawer);
    })
      // Sets init to true upon successful initialization.
      .then(() => setInit(true))
      // Logs an error if initialization fails.
      .catch((err) => console.error('Particles init failed', err));
  }, []);

  // Callback function executed when particles are fully loaded.
  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log('Particles loaded:', container);
    return Promise.resolve();
  };

  // Memoizes the configuration options for the particles system.
  const options: ISourceOptions = useMemo(
    () => ({
      // Enables full screen rendering for the canvas.
      fullScreen: { enable: true },
      detectRetina: true,
      fpsLimit: 60,
      // Configuration for the emitter, simulating a firework launcher at the bottom center.
      emitters: {
        direction: 'top',
        position: { y: 100, x: 50 },
        rate: { delay: 0.03, quantity: 1 },
        // Emitter only runs once and then stops.
        life: { count: 1, duration: 10, delay: 0.5 },
        size: { width: 100, height: 0 },
        particles: {
          number: { value: 0 },
          color: {
            value: colors,
            random: { enable: true },
          },
          // Defines the "explosion" when a particle dies.
          destroy: {
            mode: 'split',
            split: {
              rate: { value: 10 },
              particles: {
                color: {
                  value: colors,
                  random: { enable: true },
                },
                // Fades out the confetti pieces.
                opacity: {
                  value: 1,
                  animation: {
                    enable: true,
                    speed: 0.2,
                    minimumValue: 0.1,
                    startValue: 'max',
                    destroy: 'min',
                  },
                },
                // Uses the custom shapes for the confetti.
                shape: {
                  type: ['customCircle', 'customStar', 'customTriangle', 'customFlake'],
                },
                size: { value: { min: 8, max: 16 } },
                life: {
                  count: 1,
                  duration: { value: { min: 1, max: 2 } },
                },
                move: {
                  enable: true,
                  speed: { min: 1, max: 3 },
                  direction: 'none',
                  outModes: { default: 'destroy' },
                },
              },
            },
          },
          // Main "rocket" particle that explodes.
          life: { count: 1 },
          shape: { type: 'line' },
          size: {
            value: { min: 1, max: 100 },
            animation: {
              enable: true,
              sync: true,
              speed: 150,
              startValue: 'random',
              destroy: 'min',
            },
          },
          rotate: { path: true },
          // Movement of the main "rocket" particle.
          move: {
            enable: true,
            gravity: {
              acceleration: 15,
              enable: true,
              inverse: true,
              maxSpeed: 100,
            },
            speed: { min: 10, max: 20 },
            outModes: { default: 'destroy' },
            trail: { enable: true, length: 10 },
          },
        },
      },
    }),
    [colors],
  );

  // Renders nothing until the engine is initialized.
  if (!init) return null;

  return <Particles id="ts-firework" particlesLoaded={particlesLoaded} options={options} />;
};
