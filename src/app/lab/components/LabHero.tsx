'use client';
/* eslint-disable react/no-unknown-property */

import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Clouds, OrbitControls, Sky, Stars } from '@react-three/drei';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Leva, useControls } from 'leva';
import { useTheme } from 'next-themes';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { colorPalette } from '@/constants/colorPalette';

function LightSky() {
  const group = useRef<THREE.Group>(null!);
  const leadingCloud = useRef<THREE.Group>(null!);
  const {
    x,
    y,
    z,
    focalCloud,
    eastCloud,
    westCloud,
    depthCloud,
    foregroundCloud,
    atmosphereCloud,
    skyTurbidity,
    skyRayleigh,
    skyMieCoefficient,
    skyMieDirectionalG,
    ...cloudProps
  } = useControls('Light palette', {
    seed: { value: 1, min: 1, max: 100, step: 1 },
    segments: { value: 20, min: 1, max: 80, step: 1 },
    volume: { value: 6, min: 0, max: 100, step: 0.1 },
    opacity: { value: 0.8, min: 0, max: 1, step: 0.01 },
    fade: { value: 10, min: 0, max: 400, step: 1 },
    growth: { value: 4, min: 0, max: 20, step: 1 },
    speed: { value: 0.1, min: 0, max: 1, step: 0.01 },
    x: { value: 6, min: 0, max: 100, step: 1 },
    y: { value: 1, min: 0, max: 100, step: 1 },
    z: { value: 1, min: 0, max: 100, step: 1 },
    focalCloud: colorPalette.rainbowRed,
    eastCloud: colorPalette.rainbowOrange,
    westCloud: colorPalette.rainbowYellow,
    depthCloud: colorPalette.rainbowGreen,
    foregroundCloud: colorPalette.rainbowBlue,
    atmosphereCloud: colorPalette.rainbowViolet,
    skyTurbidity: { value: 10, min: 0, max: 20, step: 0.1 },
    skyRayleigh: { value: 3, min: 0, max: 10, step: 0.1 },
    skyMieCoefficient: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
    skyMieDirectionalG: { value: 0.8, min: 0, max: 1, step: 0.01 },
  }, { collapsed: false });

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.cos(state.clock.elapsedTime / 2) / 2;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2;
    }
    if (leadingCloud.current) leadingCloud.current.rotation.y -= delta;
  });

  return (
    <>
      <Sky
        turbidity={skyTurbidity}
        rayleigh={skyRayleigh}
        mieCoefficient={skyMieCoefficient}
        mieDirectionalG={skyMieDirectionalG}
      />
      <group ref={group}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400}>
          <Cloud ref={leadingCloud} {...cloudProps} bounds={[x, y, z]} color={focalCloud} />
          <Cloud {...cloudProps} bounds={[x, y, z]} color={eastCloud} seed={2} position={[15, 0, 0]} />
          <Cloud {...cloudProps} bounds={[x, y, z]} color={westCloud} seed={3} position={[-15, 0, 0]} />
          <Cloud {...cloudProps} bounds={[x, y, z]} color={depthCloud} seed={4} position={[0, 0, -12]} />
          <Cloud {...cloudProps} bounds={[x, y, z]} color={foregroundCloud} seed={5} position={[0, 0, 12]} />
        </Clouds>
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud concentrate="outside" growth={100} color={atmosphereCloud} opacity={1.25} seed={0.3} bounds={200} volume={200} />
        </Clouds>
      </group>
    </>
  );
}

function DarkSky() {
  const group = useRef<THREE.Group>(null!);
  const { cloudGray, cloudLight, cloudDark, cloudGlow, cloudLemon, cloudScale, cloudOpacity, starSaturation } = useControls('Dark palette', {
    cloudGray: colorPalette.gray500,
    cloudLight: colorPalette.gray100,
    cloudDark: colorPalette.gray900,
    cloudGlow: colorPalette.flame500,
    cloudLemon: colorPalette.lemon,
    cloudScale: { value: 1, min: 0.5, max: 2, step: 0.05 },
    cloudOpacity: { value: 0.72, min: 0.1, max: 1, step: 0.01 },
    starSaturation: { value: 0, min: 0, max: 1, step: 0.01 },
  }, { collapsed: false });

  useFrame(() => {
    if (group.current) group.current.rotation.y -= 0.0003;
  });

  return (
    <group ref={group}>
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={40} bounds={[18 * cloudScale, 4 * cloudScale, 4 * cloudScale]} volume={10 * cloudScale} fade={12} growth={6} opacity={cloudOpacity} color={cloudGray} position={[0, 1, -8]} />
        <Cloud segments={36} bounds={[14 * cloudScale, 3 * cloudScale, 3 * cloudScale]} volume={8 * cloudScale} fade={10} growth={5} opacity={cloudOpacity} color={cloudLight} seed={2} position={[-18, 3, -12]} />
        <Cloud segments={36} bounds={[16 * cloudScale, 4 * cloudScale, 3 * cloudScale]} volume={9 * cloudScale} fade={10} growth={5} opacity={cloudOpacity} color={cloudDark} seed={3} position={[18, -1, -15]} />
        <Cloud segments={30} bounds={[9 * cloudScale, 2 * cloudScale, 2 * cloudScale]} volume={5 * cloudScale} fade={8} growth={4} opacity={cloudOpacity} color={cloudLemon} seed={4} position={[6, 8, -10]} />
        <Cloud concentrate="outside" growth={100} color={cloudGlow} opacity={0.55} seed={0.3} bounds={200} volume={200} />
      </Clouds>
      <Stars radius={100} depth={70} count={7000} factor={4} saturation={starSaturation} fade speed={3} />
    </group>
  );
}

type LabHeroProps = {
  paused?: boolean;
  eyebrow?: string;
  description?: string;
  performanceMode?: 'light' | 'standard';
};

export default function LabHero({ paused = false, eyebrow = 'Hi, I\'m', description = 'A creative developer exploring interfaces, interaction, and small visual worlds on the web.', performanceMode = 'standard' }: LabHeroProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const name = 'kiki'.split('');
  const { skyTint, skyTintStrength } = useControls('Sky tint', {
    skyTint: colorPalette.labSky,
    skyTintStrength: { value: 0, min: 0, max: 0.8, step: 0.01 },
  }, { collapsed: false });

  return (
    <section className="relative isolate h-[calc(100svh-4rem)] min-h-[520px] overflow-hidden bg-canvas sm:min-h-[620px]">
      <div className="absolute inset-0" aria-hidden="true">
        <Canvas
          frameloop={paused ? 'never' : 'always'}
          dpr={performanceMode === 'light' ? 1 : [1, 1.5]}
          camera={isDark ? { position: [0, 1, 5], fov: 50 } : { position: [0, -10, 10], fov: 75 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <OrbitControls enableZoom={false} />
            {isDark ? (
              <DarkSky />
            ) : (
              <>
                <LightSky />
                <ambientLight intensity={Math.PI / 1.5} />
                <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={100} />
                <spotLight position={[-20, 0, 10]} color="red" angle={0.15} decay={0} penumbra={-1} intensity={30} />
                <spotLight position={[20, -10, 10]} color="red" angle={0.2} decay={0} penumbra={-1} intensity={20} />
              </>
            )}
          </Suspense>
        </Canvas>
      </div>
      {!isDark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-color"
          style={{ backgroundColor: skyTint, opacity: skyTintStrength }}
        />
      )}
      <Leva
        collapsed={false}
        titleBar={{ title: 'Lab controls', position: { x: 0, y: 112 } }}
      />

      <LazyMotion features={domAnimation} strict>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-content pointer-events-none">
          <m.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-heading text-2xl sm:text-3xl md:text-5xl">
            {eyebrow}
          </m.p>
          <m.h1 initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }} className="mt-2 flex font-flashy text-6xl leading-none sm:text-7xl md:text-10xl">
            {name.map((letter, index) => (
              <m.span key={`${letter}-${index}`} variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 15, mass: 2 } } }} className="inline-block">
                {letter}
              </m.span>
            ))}
          </m.h1>
          <p className="mt-8 max-w-xl text-base font-bodyBold sm:text-lg md:mt-10 md:text-2xl">{description}</p>
        </div>
      </LazyMotion>
    </section>
  );
}
