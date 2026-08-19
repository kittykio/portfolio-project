'use client';

import { useEffect, useState } from 'react';
import { RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import { trackEvent } from '@/components/AnalyticsEvent';

export default function SaveButton({ type, id, title, href }: { type: 'blog' | 'project'; id: string | number; title: string; href: string }) {
  const key = `kiki-saved-${type}`;
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(JSON.parse(localStorage.getItem(key) || '[]').some((item: { id: string | number }) => String(item.id) === String(id))); }, [id, key]);
  const toggle = () => { const current = JSON.parse(localStorage.getItem(key) || '[]'); const exists = current.some((item: { id: string | number }) => String(item.id) === String(id)); const next = exists ? current.filter((item: { id: string | number }) => String(item.id) !== String(id)) : [...current, { id, title, href }]; localStorage.setItem(key, JSON.stringify(next)); setSaved(!exists); if (!exists) trackEvent('saved', title); };
  return <button type="button" onClick={toggle} aria-pressed={saved} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-bodyBold hover:border-flame-500 hover:text-flame-500">{saved ? <RiBookmarkFill /> : <RiBookmarkLine />}{saved ? 'Saved' : 'Save'}</button>;
}
