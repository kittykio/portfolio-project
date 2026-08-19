'use client';

import { MotionConfig } from 'framer-motion';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocale } from '@/components/LocaleContext';

type MotionPreference = 'system' | 'reduce';
type MotionContextValue = { preference: MotionPreference; shouldReduceMotion: boolean; toggleMotionPreference: () => void };
const MotionPreferenceContext = createContext<MotionContextValue>({ preference: 'system', shouldReduceMotion: false, toggleMotionPreference: () => undefined });

export const MotionPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<MotionPreference>('system');
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    const stored = window.localStorage.getItem('kiki-motion-preference');
    if (stored === 'reduce') setPreference('reduce');
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const shouldReduceMotion = preference === 'reduce' || systemReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = shouldReduceMotion ? 'reduce' : 'full';
  }, [shouldReduceMotion]);

  const toggleMotionPreference = () => setPreference((current) => {
    const next = current === 'reduce' ? 'system' : 'reduce';
    window.localStorage.setItem('kiki-motion-preference', next);
    return next;
  });

  return <MotionPreferenceContext.Provider value={{ preference, shouldReduceMotion, toggleMotionPreference }}><MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>{children}</MotionConfig></MotionPreferenceContext.Provider>;
};

export const useMotionPreference = () => useContext(MotionPreferenceContext);

export const MotionToggle = ({ compact = false }: { compact?: boolean }) => {
  const { locale } = useLocale();
  const { preference, shouldReduceMotion, toggleMotionPreference } = useMotionPreference();
  const label = shouldReduceMotion ? (locale === 'ja' ? '動きを減らす：オン' : 'Reduce motion: on') : (locale === 'ja' ? '動きを減らす' : 'Reduce motion');
  const hint = locale === 'ja'
    ? '動きを減らし、OSの「視差効果を減らす」設定も尊重します。もう一度押すとOSの設定に戻ります。'
    : 'Reduces non-essential animation and honours your device preference. Select again to return to your system setting.';
  return <div className="group relative inline-flex"><button type="button" onClick={toggleMotionPreference} aria-pressed={preference === 'reduce'} aria-describedby="motion-preference-hint" className={`rounded-full border border-border font-bodyBold transition hover:border-flame-500 hover:text-flame-500 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-xs'}`}>{compact ? (shouldReduceMotion ? '◼' : '↝') : label}</button><span id="motion-preference-hint" role="tooltip" className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-surface-inverse px-3 py-2 font-sans text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-surface-muted dark:text-content">{hint}</span></div>;
};
