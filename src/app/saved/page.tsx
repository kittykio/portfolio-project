'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RiArticleLine, RiBookmarkFill, RiCodeBoxLine } from 'react-icons/ri';
type Saved = { id: string | number; title: string; href: string };
export default function SavedPage() {
  const [projects, setProjects] = useState<Saved[]>([]);
  const [posts, setPosts] = useState<Saved[]>([]);
  const read = (key: string) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value)
        ? value.filter(
            (item): item is Saved =>
              typeof item?.title === 'string' &&
              typeof item?.href === 'string' &&
              item.href.startsWith('/'),
          )
        : [];
    } catch {
      localStorage.removeItem(key);
      return [];
    }
  };
  useEffect(() => {
    setProjects(read('kiki-saved-project'));
    setPosts(read('kiki-saved-blog'));
  }, []);
  const group = (title: string, items: Saved[], icon: React.ReactNode, empty: string) => (
    <section className="rounded-[2rem] bg-surface-glass p-6 text-content shadow-lg dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-flame-500 p-3 text-white dark:bg-lemon dark:text-black">
            {icon}
          </span>
          <h2 className="font-heading text-3xl">{title}</h2>
        </div>
        <span className="rounded-full bg-canvas px-3 py-1">{items.length}</span>
      </div>
      <div className="mt-6 space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <Link
              key={`${item.href}-${item.id}`}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl bg-canvas p-4 font-bodyBold hover:text-flame-500"
            >
              <span className="font-flashy text-2xl text-flame-500">0{index + 1}</span>
              {item.title}
              <span className="ml-auto">→</span>
            </Link>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-gray-500 dark:text-gray-300">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
  return (
    <main className="mx-auto mt-28 max-w-5xl px-4 pb-[42rem]">
      <div className="rounded-[2.5rem] bg-surface-card p-8 text-content sm:p-12">
        <div className="flex justify-between gap-5">
          <div>
            <p className="font-heading uppercase tracking-[0.2em] text-flame-500 dark:text-lemon">
              Your local library
            </p>
            <h1 className="mt-3 font-flashy text-6xl">Saved</h1>
            <p className="mt-4 max-w-xl text-gray-600 dark:text-gray-300">
              Projects to revisit and posts to read later, kept private in this browser.
            </p>
          </div>
          <RiBookmarkFill className="text-5xl text-flame-500 dark:text-lemon" />
        </div>
        <p className="mt-8 inline-flex rounded-full bg-surface-inverse/10 px-4 py-2 font-bodyBold dark:bg-white/10">
          {projects.length + posts.length} saved items
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {group(
          'Projects',
          projects,
          <RiCodeBoxLine size={26} />,
          'Save a project from its case file to keep it here.',
        )}
        {group(
          'Posts',
          posts,
          <RiArticleLine size={26} />,
          'Save a post from a card or article page to read it later.',
        )}
      </div>
    </main>
  );
}
