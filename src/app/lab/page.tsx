'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import LabHero from './components/LabHero';
import { useLocale } from '@/components/LocaleContext';
import { useThemeContext } from '@/components/ThemeContext';
import { useMotionPreference } from '@/components/MotionPreference';

const experiments = [
  ['Building a calmer portfolio', 'Refining the case studies, content system, and responsive details that make this site easy to explore.'],
  ['Making motion feel useful', 'Keeping expressive interactions while making each transition clear, light, and considerate of reduced-motion preferences.'],
  ['Writing across languages', 'Growing a bilingual collection of practical notes on frontend work, creative code, and the decisions behind them.'],
  ['Protecting the performance budget', 'Letting 3D and playful details earn their place without making the rest of the site wait.'],
];

export default function LabPage() {
  const { locale } = useLocale();
  const { resolvedTheme } = useThemeContext();
  const { shouldReduceMotion } = useMotionPreference();
  const copy = locale === 'ja'
    ? {
        title: 'いま', subtitle: 'Kikiが現在つくっていること、学んでいること、そして少しずつ育てているもののスナップショット。', carousel: 'いま取り組んでいること',
        resume: 'モーションを再開', pause: 'モーションを停止', drag: '左右にドラッグして見てみる', notesLabel: '進行中のメモ',
        heading: 'このページは完成報告ではなく、いまの方向性を残すための更新ノートです。', exploring: 'これから育てたいこと',
        closing: '表現は豊かに、でもウェブ全体を待たせない。', closingBody: 'ここには、インタラクションの研究、ビジュアルプロトタイプ、そして良いUIを記憶に残るものへ変える小さな実装を集めていきます。',
        eyebrow: 'いま、私は', hero: 'kiki', heroDescription: 'インターフェース、インタラクション、そしてウェブ上の小さな視覚世界を育てているクリエイティブデベロッパーです。', statusLabel: '現在のスナップショット', updated: '最終更新：2026年8月',
        experiments: [['より落ち着いたポートフォリオをつくる', 'ケーススタディ、コンテンツ設計、レスポンシブな細部を磨き、サイトを心地よく探索できるようにしています。'], ['役に立つモーションにする', '表現豊かな操作感を保ちながら、一つひとつの遷移をわかりやすく、軽く、動きを減らす設定にも配慮したものにします。'], ['言語をまたいで書く', 'フロントエンド、クリエイティブコード、その背景にある決断について、実用的な二言語の記録を育てています。'], ['パフォーマンス予算を守る', '3Dや遊び心あるディテールが、サイト全体を待たせることなく価値を持てるようにします。']],
        notes: [['目的のあるモーション', '小さな遷移も、変化を説明し、注意を導き、UIをより直接的に感じさせるものに。'], ['ビジュアルシステム', '色、書体、奥行き、操作をまとめて試し、アイデアに一貫した視点を与えます。'], ['パフォーマンスの境界', '遊び心あるシーンにも予算を設定。遅延読み込み、動きを減らす設定、自然なフォールバックを最優先します。']],
        status: [['つくっていること', 'このポートフォリオのケーススタディ、リクエスト機能、細かなレスポンシブ改善。'], ['学んでいること', '3Dシーンの構成、意図のあるモーション、長く使えるコンテンツシステム。'], ['書いていること', '実装の決断、パフォーマンス、創造的なフロントエンドについての二言語MDX記事。'], ['オープンなこと', '思慮深いUI、フロントエンドシステム、クリエイティブウェブのコラボレーション。']],
      }
    : null;
  const activeExperiments = copy?.experiments ?? experiments;
  const notes = copy?.notes ?? [['Motion with purpose', 'Small transitions should explain a change, guide attention, or make an interface feel more direct.'], ['Visual systems', 'I test color, type, depth, and interaction together so an idea has a consistent point of view.'], ['Performance boundaries', 'Every playful scene gets a budget: lazy loading, reduced motion, and graceful fallbacks come first.']];
  const nowStatus = copy?.status ?? [['Building', 'Case studies, request tools, and the responsive details that make this portfolio more useful to explore.'], ['Learning', '3D scene composition, intentional motion, and content systems that can keep growing.'], ['Writing', 'Bilingual MDX notes about implementation decisions, performance, and creative frontend work.'], ['Open to', 'Thoughtful UI, frontend systems, and creative-web collaborations.']];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<'light' | 'standard'>('standard');

  useEffect(() => {
    const navigatorWithHints = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const constrained = navigatorWithHints.connection?.saveData || (navigator.hardwareConcurrency ?? 8) <= 4 || (navigatorWithHints.deviceMemory ?? 8) <= 4;
    setPerformanceMode(constrained ? 'light' : 'standard');
  }, []);

  const moveSlide = useCallback((nextDirection: number) => {
    setDirection(nextDirection);
    setActive((current) => (current + nextDirection + activeExperiments.length) % activeExperiments.length);
  }, [activeExperiments.length]);

  useEffect(() => {
    if (paused || shouldReduceMotion || isDragging) return;
    const interval = window.setInterval(
      () => moveSlide(1),
      4500,
    );
    return () => window.clearInterval(interval);
  }, [paused, shouldReduceMotion, isDragging, moveSlide]);

  const slideVariants = {
    enter: (slideDirection: number) => ({ x: slideDirection > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (slideDirection: number) => ({ x: slideDirection > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <SectionWrapper className="w-full mt-16" title={copy?.title ?? 'Now'} subtitle={copy?.subtitle ?? 'A living snapshot of what Kiki is building, learning, and slowly growing.'}>
      <LabHero paused={paused || shouldReduceMotion} performanceMode={performanceMode} eyebrow={copy?.eyebrow ?? "Right now, I’m"} description={copy?.heroDescription ?? 'A creative developer refining expressive interfaces, useful interactions, and small visual worlds for the web.'} />

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-14 sm:grid-cols-2 sm:gap-6 sm:py-20">
        <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-heading uppercase tracking-[0.2em] text-flame-500 dark:text-lemon">{copy?.statusLabel ?? 'Current snapshot'}</p>
          <p className="text-sm text-content-muted">{copy?.updated ?? 'Updated August 2026'}</p>
        </div>
        {nowStatus.map(([title, description], index) => (
          <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} className="rounded-3xl bg-surface-glass p-6 shadow-[0_12px_30px_var(--shadow-soft)]">
            <p className="font-flashy text-3xl text-flame-500 dark:text-lemon">0{index + 1}</p>
            <h2 className="mt-3 font-heading text-2xl text-content">{title}</h2>
            <p className="mt-3 leading-relaxed text-content-muted">{description}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-8">
        <div className="rounded-3xl bg-surface-inverse p-6 text-gray-100 dark:bg-surface-glass sm:p-8">
          <div className="group relative inline-flex">
            <p tabIndex={0} aria-describedby="built-light-hint" className="cursor-help font-heading uppercase tracking-[0.2em] text-flame-300 outline-none dark:text-lemon">{locale === 'ja' ? '軽量につくる' : 'Built light'}</p>
            <span id="built-light-hint" role="tooltip" className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-xl bg-surface-muted px-3 py-2 font-sans text-xs font-normal leading-relaxed text-content opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-surface-inverse ">
              {locale === 'ja' ? 'このページは、画像最適化、動きの設定、テーマ、端末に合わせた3D描画の軽量化を確認できるようにつくられています。' : 'A quick, honest snapshot of the image, motion, theme, and device-aware choices that keep this page expressive without being unnecessarily heavy.'}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[[locale === 'ja' ? '画像' : 'Images', locale === 'ja' ? 'Next Imageで最適化' : 'Optimized with Next Image'], [locale === 'ja' ? 'モーション' : 'Motion', shouldReduceMotion ? (locale === 'ja' ? '減らす設定を適用中' : 'Reduced by preference') : (locale === 'ja' ? '通常設定' : 'Full, with an opt-out')], [locale === 'ja' ? 'テーマ' : 'Theme', resolvedTheme === 'dark' ? (locale === 'ja' ? 'ダーク' : 'Dark') : (locale === 'ja' ? 'ライト' : 'Light')], [locale === 'ja' ? 'デバイスモード' : 'Device mode', performanceMode === 'light' ? (locale === 'ja' ? '軽量シーン（DPR 1×）' : 'Light scene (1× DPR)') : (locale === 'ja' ? '標準シーン（最大 1.5× DPR）' : 'Standard scene (up to 1.5× DPR)')]].map(([label, value]) => <div key={label} className="rounded-2xl bg-canvas/10 p-4"><p className="text-xs uppercase tracking-[0.14em] text-gray-300">{label}</p><p className="mt-2 font-bodyBold">{value}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-heading text-3xl text-content sm:text-4xl ">{copy?.carousel ?? 'Experiment carousel'}</h2>
          <div className="group relative inline-flex">
            <button type="button" onClick={() => setPaused((value) => !value)} aria-describedby="experiment-motion-hint" className="rounded-full bg-canvas px-4 py-2 text-sm font-bodyBold text-flame-500 shadow-[0_8px_20px_var(--shadow)] transition hover:bg-flame-500 hover:text-gray-100 dark:text-lemon dark:hover:bg-lemon dark:hover:text-black">
              {paused ? (copy?.resume ?? 'Resume motion') : (copy?.pause ?? 'Pause motion')}
            </button>
            <span id="experiment-motion-hint" role="tooltip" className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-60 rounded-xl bg-surface-inverse px-3 py-2 font-sans text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-surface-muted dark:text-content">
              {locale === 'ja' ? 'カルーセルの自動送りと、上の3Dヒーローの動きを一緒に停止または再開します。' : 'Pauses or resumes the carousel’s auto-slide and the 3D hero animation above.'}
            </span>
          </div>
        </div>
        <div className="min-h-72 overflow-hidden rounded-3xl bg-canvas p-6 shadow-[0_16px_40px_var(--shadow-strong)] sm:p-8 md:p-12">
          <div className="relative min-h-48 touch-pan-y">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.article
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  if (info.offset.x < -60 || info.velocity.x < -500) moveSlide(1);
                  if (info.offset.x > 60 || info.velocity.x > 500) moveSlide(-1);
                }}
                className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
              >
                <p className="font-flashy text-4xl text-flame-500 sm:text-5xl dark:text-lemon">0{active + 1}</p>
                <h3 className="mt-4 font-heading text-3xl text-content sm:text-4xl ">{activeExperiments[active][0]}</h3>
                <p className="mt-4 max-w-2xl text-base text-content-muted sm:text-xl dark:text-gray-300">{activeExperiments[active][1]}</p>
                <p className="mt-8 text-sm uppercase tracking-[0.18em] text-flame-500 dark:text-lemon">{copy?.drag ?? 'Drag left or right to explore'}</p>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center justify-between gap-2 sm:gap-4">
            <button type="button" aria-label="Previous experiment" onClick={() => moveSlide(-1)} className="rounded-full border border-flame-500 px-4 py-2 font-bodyBold text-flame-500 transition hover:bg-flame-500 hover:text-gray-100 dark:border-lemon dark:text-lemon dark:hover:bg-lemon dark:hover:text-black">←</button>
            <div className="flex flex-wrap justify-center gap-2">
              {activeExperiments.map(([title], index) => <button key={title} type="button" aria-label={title} onClick={() => { setDirection(index > active ? 1 : -1); setActive(index); }} className={`h-3 w-6 rounded-full transition sm:w-10 ${active === index ? 'bg-flame-500 dark:bg-lemon' : 'bg-surface-subtle dark:bg-surface-inverse'}`} />)}
            </div>
            <button type="button" aria-label="Next experiment" onClick={() => moveSlide(1)} className="rounded-full border border-flame-500 px-4 py-2 font-bodyBold text-flame-500 transition hover:bg-flame-500 hover:text-gray-100 dark:border-lemon dark:text-lemon dark:hover:bg-lemon dark:hover:text-black">→</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <p className="font-heading uppercase tracking-[0.2em] text-flame-500 dark:text-lemon">
          {copy?.notesLabel ?? 'Lab notes'}
        </p>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl text-content sm:text-4xl ">
          {copy?.heading ?? 'Experiments are how I test ideas before they become products.'}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {notes.map(([title, description], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl bg-surface-glass p-6 shadow-[0_12px_30px_var(--shadow-soft)]"
            >
              <p className="font-flashy text-3xl text-flame-500 dark:text-lemon">0{index + 1}</p>
              <h3 className="mt-4 font-heading text-2xl text-content">{title}</h3>
              <p className="mt-3 leading-relaxed text-content-muted">{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-[42rem] pt-12">
        <div className="rounded-[2rem] bg-surface-inverse p-6 text-gray-100 sm:p-8 dark:bg-surface-glass md:p-12">
          <p className="font-heading uppercase tracking-[0.2em] text-flame-300 dark:text-lemon">{copy?.exploring ?? 'Currently exploring'}</p>
          <p className="mt-5 max-w-3xl font-heading text-3xl leading-tight md:text-5xl">
            {copy?.closing ?? 'Creative code that feels expressive without making the rest of the web wait.'}
          </p>
          <p className="mt-6 max-w-2xl text-gray-100/80 dark:text-gray-300">
            {copy?.closingBody ?? 'This page is a living notebook for interaction studies, visual prototypes, and the tiny implementation details that turn a good interface into a memorable one.'}
          </p>
        </div>
      </section>
    </SectionWrapper>
  );
}
