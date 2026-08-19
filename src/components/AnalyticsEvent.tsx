'use client';
export const trackEvent = (name: string, label = '') => { void fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, label, path: location.pathname, locale: location.pathname.startsWith('/ja') ? 'ja' : 'en' }) }); };
