'use client';

import { FormEvent, useState } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { useLocale } from '@/components/LocaleContext';
import { trackEvent } from '@/components/AnalyticsEvent';

export default function ContactPage() {
  const { locale } = useLocale();
  const ja = locale === 'ja';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ scope: '', details: '', timeline: '', budget: '', contact: '', preferredContact: 'email' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); trackEvent('contact_sent', form.scope); setStatus('sending');
    try {
      const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'contact', title: form.scope, details: form.details, timeline: form.timeline, budget: form.budget, contact: form.contact, preferredContact: form.preferredContact, locale }) });
      if (!response.ok) throw new Error();
      setStatus('sent'); setForm({ scope: '', details: '', timeline: '', budget: '', contact: '', preferredContact: 'email' });
    } catch { setStatus('error'); }
  };
  return <SectionWrapper title={ja ? '相談する' : 'Let’s make something'} subtitle={ja ? 'プロダクト、インターフェース、クリエイティブなウェブ体験について。まずは必要なことを教えてください。' : 'For products, interfaces, and creative web experiences. Tell me what you need, and we can find a thoughtful way forward.'} className="mx-auto mt-24 w-full max-w-4xl px-4 pb-[42rem]">
    <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-surface-glass p-6 shadow-[0_16px_40px_var(--shadow)] sm:grid-cols-2 sm:p-10">
      <label className="flex flex-col gap-2 font-bodyBold">{ja ? '相談したいこと' : 'What would you like to make?'}<input required minLength={3} value={form.scope} onChange={(e) => update('scope', e.target.value)} placeholder={ja ? '例：インタラクティブなポートフォリオ' : 'e.g. an interactive portfolio'} className="rounded-xl border border-border bg-canvas px-4 py-3 font-body outline-none focus:border-flame-500" /></label>
      <label className="flex flex-col gap-2 font-bodyBold">{ja ? '希望する時期' : 'Ideal timeline'}<input value={form.timeline} onChange={(e) => update('timeline', e.target.value)} placeholder={ja ? '例：2026年秋' : 'e.g. autumn 2026'} className="rounded-xl border border-border bg-canvas px-4 py-3 font-body outline-none focus:border-flame-500" /></label>
      <label className="flex flex-col gap-2 font-bodyBold">{ja ? '予算（任意）' : 'Budget range (optional)'}<input value={form.budget} onChange={(e) => update('budget', e.target.value)} placeholder={ja ? '例：相談して決めたい' : 'e.g. happy to discuss'} className="rounded-xl border border-border bg-canvas px-4 py-3 font-body outline-none focus:border-flame-500" /></label>
      <label className="flex flex-col gap-2 font-bodyBold">{ja ? '返信先' : 'Preferred contact'}<select value={form.preferredContact} onChange={(e) => update('preferredContact', e.target.value)} className="rounded-xl border border-border bg-canvas px-4 py-3 font-body outline-none focus:border-flame-500"><option value="email">Email</option><option value="github">GitHub</option><option value="other">Other</option></select></label>
      <label className="sm:col-span-2 flex flex-col gap-2 font-bodyBold">{ja ? 'プロジェクトの背景・相談内容' : 'Scope and context'}<textarea required minLength={10} maxLength={6000} rows={6} value={form.details} onChange={(e) => update('details', e.target.value)} placeholder={ja ? '目的、必要な機能、すでにあるものなどを教えてください。' : 'Tell me about the goal, needed features, and anything that already exists.'} className="resize-y rounded-xl border border-border bg-canvas px-4 py-3 font-body outline-none focus:border-flame-500" /></label>
      <label className="sm:col-span-2 flex flex-col gap-2 font-bodyBold">{ja ? 'メールアドレス / 連絡先' : 'Email or contact link'}<input required value={form.contact} onChange={(e) => update('contact', e.target.value)} type="text" placeholder="you@example.com" className="rounded-xl border border-border bg-canvas px-4 py-3 font-body outline-none focus:border-flame-500" /></label>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4"><button disabled={status === 'sending'} className="rounded-full bg-flame-500 px-6 py-3 font-bodyBold text-white transition hover:bg-flame-700 disabled:opacity-60 dark:bg-lemon dark:text-black">{status === 'sending' ? (ja ? '送信中…' : 'Sending…') : (ja ? '相談を送る' : 'Send inquiry')}</button>{status === 'sent' && <p className="font-bodyBold text-flame-500 dark:text-lemon">{ja ? '受け取りました。ありがとう！' : 'Received — thank you!'}</p>}{status === 'error' && <p className="text-flame-500">{ja ? 'もう一度試してください。' : 'Please try again.'}</p>}</div>
    </form>
  </SectionWrapper>;
}
