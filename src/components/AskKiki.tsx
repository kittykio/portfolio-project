'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RiCloseLine, RiLightbulbFlashLine, RiSendPlane2Line } from 'react-icons/ri';
import { useLocale } from '@/components/LocaleContext';

type Mode = 'ask' | 'project' | 'article';

const AnswerText = ({ value }: { value: string }) => (
  <>
    {value.split(/(\[[^\]]+\]\([^\)]+\))/g).map((part, index) => {
      const match = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      return match ? <a key={index} href={match[2]} className="font-bodyBold text-flame-500 underline dark:text-lemon">{match[1]}</a> : part;
    })}
  </>
);

const AskKiki = () => {
  const { locale } = useLocale();
  const askEnabled = process.env.NEXT_PUBLIC_ASK_KIKI_ENABLED === 'true';
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('ask');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [contact, setContact] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const copy = locale === 'ja'
    ? {
        name: 'Kikiに聞く', ask: '聞く', project: 'プロジェクトをリクエスト', article: '記事をリクエスト', title: 'タイトル', details: 'アイデアや知りたいことを教えてください', contact: 'メールアドレス（任意）', send: '送信', sending: '送信中…', requestSent: 'リクエストを受け取りました。ありがとう！', error: 'もう一度試してください。', intro: '次につくってほしいものや、書いてほしい記事をリクエストできます。', close: '閉じる', comingSoonTitle: 'Ask Kikiは準備中です', comingSoon: 'ポートフォリオの作品や記事について答えるガイドを準備しています。今は、次に見たいプロジェクトや記事をリクエストしてください。',
      }
    : {
        name: 'Ask Kiki', ask: 'Ask', project: 'Request a project', article: 'Request an article', title: 'Title', details: 'Tell me about your idea or what you want to learn', contact: 'Email (optional)', send: 'Send request', sending: 'Sending…', requestSent: 'Request received — thank you!', error: 'Please try again.', intro: 'Request what I should build or write next.', close: 'Close', comingSoonTitle: 'Ask Kiki is coming soon', comingSoon: 'I’m preparing a guide that can answer questions about my work and writing. For now, tell me what you would like to see next.',
      };

  const switchMode = (next: Mode) => {
    setMode(next); setStatus('idle'); setMessage(''); setAnswer('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    try {
      if (mode === 'ask') {
        const response = await fetch('/api/ask-kiki', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, locale }) });
        const data = await response.json();
        if (!response.ok) throw new Error();
        setAnswer(data.answer); setStatus('idle');
      } else {
        const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: mode, title, details: message, contact, locale }) });
        if (!response.ok) throw new Error();
        setStatus('success'); setTitle(''); setMessage(''); setContact('');
      }
    } catch { setStatus('error'); }
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }} className="mb-4 w-[min(92vw,28rem)] rounded-3xl border border-border bg-canvas p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-flashy text-3xl text-flame-500 dark:text-lemon">{copy.name}</p><p className="mt-1 text-sm text-content-muted">{copy.intro}</p></div>
              <button type="button" onClick={() => setOpen(false)} aria-label={copy.close} className="text-2xl hover:text-flame-500"><RiCloseLine /></button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-surface-muted p-1 text-[10px] font-bodyBold leading-tight dark:bg-surface-inverse sm:gap-2 sm:text-xs">
              {(['ask', 'project', 'article'] as Mode[]).map((item) => <button key={item} type="button" onClick={() => switchMode(item)} className={`min-w-0 rounded-xl px-1 py-2 text-gray-900 transition dark:text-gray-900 sm:px-2 ${mode === item ? 'bg-flame-500 text-white dark:bg-lemon dark:text-black' : 'hover:text-flame-500 dark:hover:text-flame-500'}`}>{item === 'ask' ? copy.ask : item === 'project' ? copy.project : copy.article}</button>)}
            </div>
            {mode === 'ask' && !askEnabled ? <div className="mt-4 rounded-2xl bg-surface-muted p-5 text-sm leading-relaxed dark:bg-surface-inverse"><p className="font-bodyBold text-content">{copy.comingSoonTitle}</p><p className="mt-2 text-content-muted">{copy.comingSoon}</p></div> : <form onSubmit={submit} className="mt-4 space-y-3">{mode !== 'ask' && <><input value={title} onChange={(event) => setTitle(event.target.value)} required minLength={3} maxLength={140} placeholder={copy.title} className="w-full rounded-xl border border-border bg-canvas px-3 py-2 outline-none focus:border-flame-500" /><input value={contact} onChange={(event) => setContact(event.target.value)} type="email" maxLength={320} placeholder={copy.contact} className="w-full rounded-xl border border-border bg-canvas px-3 py-2 outline-none focus:border-flame-500" /></>}<textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={mode === 'ask' ? 1 : 10} maxLength={mode === 'ask' ? 1200 : 3000} rows={mode === 'ask' ? 3 : 5} placeholder={mode === 'ask' ? (locale === 'ja' ? '例：Three.jsを使った作品はどれ？' : 'For example: Which project uses Three.js?') : copy.details} className="w-full resize-none rounded-xl border border-border bg-canvas px-3 py-2 outline-none focus:border-flame-500" /><button disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-flame-500 px-4 py-3 font-bodyBold text-white transition hover:bg-flame-700 disabled:opacity-60 dark:bg-lemon dark:text-black"><RiSendPlane2Line />{status === 'loading' ? copy.sending : mode === 'ask' ? copy.ask : copy.send}</button></form>}
            {answer && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-surface-muted p-3 text-sm leading-relaxed dark:bg-surface-inverse"><AnswerText value={answer} /></p>}
            {status === 'success' && <p className="mt-4 rounded-xl bg-lemon/30 p-3 text-sm font-bodyBold">{copy.requestSent}</p>}
            {status === 'error' && <p className="mt-4 text-sm text-flame-500">{copy.error}</p>}
          </motion.section>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={copy.name} className="flex h-12 items-center gap-2 rounded-full bg-flame-500 px-4 font-bodyBold text-white shadow-lg transition hover:-translate-y-1 hover:bg-flame-700 sm:h-14 sm:px-5 dark:bg-lemon dark:text-black"><RiLightbulbFlashLine size={22} /><span className="hidden sm:inline">{copy.name}</span></button>
    </div>
  );
};

export default AskKiki;
