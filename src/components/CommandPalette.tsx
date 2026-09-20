'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/components/LocaleContext';
import { getLocalePath } from '@/i18n/config';

type SearchItem = { label: string; href: string; kind: string };

export default function CommandPalette() {
  const router = useRouter();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [content, setContent] = useState<SearchItem[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const resultsId = useId();
  const actions = useMemo(() => (
    [['Home', '/'], ['Projects', '/projects'], ['Blog', '/blog'], ['Now', '/now'], ['Saved', '/saved'], ['Résumé', '/resume'], ['Contact / Hire me', '/contact']]
      .map(([label, href]) => ({ label, href: getLocalePath(href, locale), kind: 'Page' }))
  ), [locale]);
  const results = [...actions, ...content].filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 12);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open || content.length) return;
    void fetch(`/api/search?locale=${locale}`).then((response) => response.json()).then((data) => setContent([...data.projects, ...data.posts])).catch(() => undefined);
  }, [open, locale, content.length]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen((value) => !value); }
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) { window.setTimeout(() => inputRef.current?.focus(), 0); return; }
    triggerRef.current?.focus();
  }, [open]);

  return <>
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="rounded-full border border-border px-2 py-1 text-[10px] font-bodyBold hover:border-flame-500 hover:text-flame-500" aria-label="Open command palette" aria-haspopup="dialog"><span aria-hidden>⌘K</span></button>
    {open && <div className="fixed inset-0 z-[70] flex items-start justify-center bg-surface-inverse/40 p-4 pt-28" role="presentation" onMouseDown={close}>
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-xl rounded-3xl bg-canvas p-4 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-4"><h2 id={titleId} className="font-bodyBold text-lg">Command palette</h2><button type="button" onClick={close} className="rounded-lg px-2 py-1 text-sm hover:text-flame-500" aria-label="Close command palette">Close</button></div>
        <label className="sr-only" htmlFor="command-palette-search">Search projects, posts, and pages</label>
        <input ref={inputRef} id="command-palette-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, posts, and pages…" aria-controls={resultsId} className="w-full rounded-2xl border border-border bg-canvas px-4 py-3" />
        <div id={resultsId} className="mt-3 space-y-1" aria-label="Search results">
          {results.map((item) => <button key={`${item.kind}-${item.href}`} type="button" onClick={() => { router.push(item.href); close(); }} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-surface-muted"><span>{item.label}</span><span className="text-xs text-content-muted">{item.kind}</span></button>)}
          {!results.length && <p className="p-4 text-sm text-content-muted" role="status">No matching item.</p>}
        </div>
      </section>
    </div>}
  </>;
}
