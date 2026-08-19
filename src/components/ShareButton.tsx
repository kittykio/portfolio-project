'use client';

import { useState } from 'react';
import { RiShareLine, RiFileCopyLine } from 'react-icons/ri';
import { trackEvent } from '@/components/AnalyticsEvent';

export default function ShareButton({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window === 'undefined' ? (url ?? '') : (url ? new URL(url, window.location.origin).href : window.location.href);
  const copy = async () => { await navigator.clipboard?.writeText(shareUrl); trackEvent('copy_link', title); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title, url: shareUrl }); trackEvent('share', title); return; } catch { return; } }
    await copy();
  };
  return <div className="flex items-center gap-2"><button type="button" onClick={share} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-bodyBold hover:border-flame-500 hover:text-flame-500"><RiShareLine />Share</button><button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-bodyBold hover:border-flame-500 hover:text-flame-500"><RiFileCopyLine />{copied ? 'Copied' : 'Copy link'}</button></div>;
}
