'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RiBookmarkLine } from 'react-icons/ri';
import { useLocale } from '@/components/LocaleContext';
import { getLocalePath } from '@/i18n/config';
export default function SavedLink() { const { locale } = useLocale(); const [count, setCount] = useState(0); useEffect(() => { const update = () => { try { setCount(['kiki-saved-project', 'kiki-saved-blog'].reduce((total, key) => total + JSON.parse(localStorage.getItem(key) || '[]').length, 0)); } catch { setCount(0); } }; update(); window.addEventListener('storage', update); window.addEventListener('focus', update); return () => { window.removeEventListener('storage', update); window.removeEventListener('focus', update); }; }, []); return <Link href={getLocalePath('/saved', locale)} aria-label={`Saved items${count ? ` (${count})` : ''}`} className="relative inline-flex rounded-full border border-border p-2 hover:border-flame-500 hover:text-flame-500"><RiBookmarkLine size={16} />{count > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-flame-500 font-sans text-[11px] font-bold leading-none tabular-nums text-white dark:bg-lemon dark:text-black">{count}</span>}</Link>; }
