import Link from 'next/link';
import { colorPalette } from '@/constants/colorPalette';

type Detail = { title: string; body: string; points?: string[] };
type PageDetail = { route: string; title: string; body: string; features: string[] };

const English = {
  eyebrow: 'BEHIND THE PORTFOLIO',
  title: 'About this app',
  intro:
    'This is not a template with a new coat of paint. kittykio.com is a small, full-stack portfolio product: a home for case studies, technical writing, experiments, and thoughtful ways to start a conversation.',
  labels: {
    architecture: 'Architecture & stack',
    pages: 'The experience, page by page',
    content: 'Content, data & interaction',
    delivery: 'SEO, social previews & delivery',
    quality: 'Performance, privacy & accessibility',
    operations: 'Operations & configuration',
    made: 'How it is made',
  },
  stack: [
    {
      title: 'Framework',
      body: 'Next.js 14 App Router and React 18 provide server-rendered routes, route metadata, API routes, static generation where appropriate, and a clean client/server boundary.',
    },
    {
      title: 'Language & styling',
      body: 'TypeScript keeps content and feature contracts explicit. Tailwind CSS and Sass variables power the responsive layout and a shared palette: charcoal, warm grays, flame red, and lemon.',
    },
    {
      title: 'Motion & 3D',
      body: 'Framer Motion handles layout and interaction motion. React Three Fiber, Drei, Three.js, GSAP, Leva, and tsParticles support the interactive Now/lab experiments.',
    },
    {
      title: 'Writing',
      body: 'MDX files are compiled with next-mdx-remote. Remark and Rehype plugins add GFM, headings, a table of contents, and highlighted code blocks.',
    },
    {
      title: 'Data & requests',
      body: 'MongoDB with Mongoose stores likes, requests, and first-party analytics events. Resend can notify Kitty Kio by email whenever a visitor submits a request.',
    },
    {
      title: 'Hosting & observability',
      body: 'The app is ready for Vercel deployment, Vercel Analytics, optional Google Analytics, and a private first-party insights dashboard.',
    },
  ] satisfies Detail[],
  pages: [
    {
      route: '/',
      title: 'Home',
      body: 'The introduction is a creative developer version of the original art-led landing experience.',
      features: [
        'Letter-by-letter welcome motion with a playful hover scatter',
        'Animated section transitions, work highlights, experience, interests, and contact pathways',
        'Responsive layout that retains the visual personality without assuming a desktop viewport',
      ],
    },
    {
      route: '/projects',
      title: 'Projects',
      body: 'A curated case-file gallery for development work.',
      features: [
        'Tag filters are derived from project content and persist in the URL for shareable views',
        'Floating/tilting cards, pagination, likes, sorting, save-for-later, and copy/native sharing',
        'Each card can open its case-file interaction or a direct structured case-study route',
      ],
    },
    {
      route: '/blog',
      title: 'Blog',
      body: 'A technical writing library built around MDX rather than a CMS.',
      features: [
        'Multi-tag filtering, stable card stacking, three-column desktop layout, pagination, likes, saves, and sorting',
        'Estimated reading time, reading completion tracking, series suggestions, and previous/next reading',
        'MDX components, syntax-highlighted code, table of contents, images, and English/Japanese article variants',
      ],
    },
    {
      route: '/now',
      title: 'Now',
      body: 'The former lab is reframed as a living snapshot of current experiments and how the site behaves.',
      features: [
        'Interactive 3D sky and cloud controls, editable palette, motion play/pause, and experiment carousel',
        'Built-light panel that reports theme, image/motion approach, performance mode, and reduced-motion state',
        'Extra contextual writing that turns experiments into an honest “what I am exploring now” page',
      ],
    },
    {
      route: '/contact',
      title: 'Contact & requests',
      body: 'A deliberate alternative to a generic contact form.',
      features: [
        'Project, article, and contact request flows with scope, timeline, budget, and preferred contact method',
        'MongoDB request storage and optional Resend email notification to modularmanul@gmail.com',
        'Ask Kiki is intentionally a friendly coming-soon state until AI usage is enabled',
      ],
    },
    {
      route: '/saved',
      title: 'Saved',
      body: 'A small private reading and project library that lives entirely in the visitor’s browser.',
      features: [
        'Projects and posts are grouped separately in a distinctive library interface',
        'Saved entries use localStorage: no account, tracking profile, or server-side personal library',
        'Available from the header, footer, and command palette',
      ],
    },
    {
      route: '/resume',
      title: 'Résumé',
      body: 'A printable one-page professional overview.',
      features: [
        'Clear experience, skill, and contact snapshot',
        'Print-to-PDF action and a direct contact path',
        'Japanese route available alongside the English version',
      ],
    },
  ] satisfies PageDetail[],
  content: [
    {
      title: 'Content-first tags',
      body: 'Tags are the common language for projects and posts. They are read from content, deduplicated for filter controls, and reflected in shareable URLs instead of being managed in a separate admin panel.',
    },
    {
      title: 'Generated identities',
      body: 'Posts and projects receive stable generated identifiers from their content. New JSON project records and new MDX posts can participate without manual like IDs.',
    },
    {
      title: 'Likes with sensible limits',
      body: 'Likes are persisted in dedicated MongoDB collections and limited to ten expressive reactions per item, keeping the feature playful without becoming a noisy leaderboard.',
    },
    {
      title: 'Bilingual foundation',
      body: 'The route structure supports /ja equivalents, locale-aware navigation, translated interface text, and separate Japanese MDX sources. Language switching preserves the current route whenever there is an equivalent.',
    },
  ] satisfies Detail[],
  delivery: [
    {
      title: 'Metadata per route',
      body: 'The root layout supplies the baseline title, description, icons, keywords, Open Graph, and Twitter metadata. Post and project routes add their own canonical URL, title, description, article date where relevant, and social image.',
    },
    {
      title: 'Generated branded OG cards',
      body: 'Social previews are generated on demand at /api/og with Next’s ImageResponse. The cards use the portfolio palette, original cat logo, route type, title, and description—rather than falling back to an unrelated cover crop.',
    },
    {
      title: 'Search engine foundations',
      body: 'metadataBase is driven by NEXT_PUBLIC_SITE_URL. Dynamic sitemap.xml and robots.txt use the same site URL, and include the core routes plus post and project pages.',
    },
    {
      title: 'Sharing behaviour',
      body: 'Posts and projects expose native sharing on supported devices and a reliable copy-link fallback everywhere else, with analytics events for both paths.',
    },
  ] satisfies Detail[],
  quality: [
    {
      title: 'Responsive by design',
      body: 'Layouts adapt from compact phones through tablet to desktop: navigation collapses, grids reduce columns, controls wrap, and typography/spacing use breakpoints rather than a single fixed canvas.',
    },
    {
      title: 'Motion preferences',
      body: 'A visible motion control complements the operating system’s prefers-reduced-motion setting. It reduces decorative motion and 3D movement without hiding the underlying content.',
    },
    {
      title: 'Fast where it matters',
      body: 'Next image handling, lazy motion features, static generation for article paths, responsive card layouts, and modest visual effects aim to keep the art-led interface from feeling heavy.',
    },
    {
      title: 'Privacy-minded saving',
      body: 'Saved items stay in localStorage on the visitor’s device. The app does not require sign-in or send their saved library to MongoDB.',
    },
  ] satisfies Detail[],
  operations: [
    {
      title: 'Required production settings',
      body: 'NEXT_PUBLIC_SITE_URL is set to https://kittykio.com so canonical links, sitemap entries, robots.txt, and OG URLs consistently point to the production domain.',
    },
    {
      title: 'Data and email settings',
      body: 'MONGODB_URI connects likes, requests, and analytics to the portfolio-project database. RESEND_API_KEY and a verified sender/domain enable contact notification email.',
    },
    {
      title: 'Optional services',
      body: 'NEXT_PUBLIC_GA_ID enables Google Analytics. ANALYTICS_DASHBOARD_TOKEN protects /insights. An OpenAI key can later power Ask Kiki once usage credit is available; request modes do not depend on it.',
    },
    {
      title: 'Private insights',
      body: 'The /insights page is deliberately token-protected. First-party events include content views, opens, filters, saves, shares, copy-link actions, reading completion, contact activity, and command-palette searching as each integration is enabled.',
    },
  ] satisfies Detail[],
};

const Japanese = {
  eyebrow: 'このポートフォリオの裏側',
  title: 'このアプリについて',
  intro:
    'これは見た目だけを変えたテンプレートではありません。kittykio.com は、ケーススタディ、技術記事、実験、そして相談の入口をひとつにまとめた小さなフルスタック・ポートフォリオプロダクトです。',
  labels: {
    architecture: 'アーキテクチャとスタック',
    pages: 'ページごとの体験',
    content: 'コンテンツ・データ・インタラクション',
    delivery: 'SEO・ソーシャルプレビュー・配信',
    quality: 'パフォーマンス・プライバシー・アクセシビリティ',
    operations: '運用と設定',
    made: 'どのように作られているか',
  },
  stack: [
    {
      title: 'フレームワーク',
      body: 'Next.js 14 App Router と React 18 を採用。サーバーレンダリング、ルート単位のメタデータ、API ルート、必要に応じた静的生成を、クライアントとサーバーの明確な境界で実現します。',
    },
    {
      title: '言語とスタイリング',
      body: 'TypeScript でコンテンツと機能の契約を明確にし、Tailwind CSS と Sass 変数でレスポンシブなレイアウトと共通パレットを構成しています。基調色はチャコール、暖かなグレー、フレームレッド、レモンです。',
    },
    {
      title: 'モーションと3D',
      body: 'Framer Motion がレイアウトとインタラクションの動きを担当。React Three Fiber、Drei、Three.js、GSAP、Leva、tsParticles が Now/lab のインタラクティブな実験を支えます。',
    },
    {
      title: '文章',
      body: 'MDX ファイルを next-mdx-remote でコンパイル。Remark と Rehype のプラグインにより、GFM、見出し、目次、シンタックスハイライト付きコードブロックを追加しています。',
    },
    {
      title: 'データとリクエスト',
      body: 'MongoDB と Mongoose が「いいね」、依頼、ファーストパーティ分析イベントを保存します。Resend を有効にすると、送信された依頼をメールでも通知できます。',
    },
    {
      title: 'ホスティングと可観測性',
      body: 'Vercel へのデプロイ、Vercel Analytics、任意の Google Analytics、そして非公開のファーストパーティ分析ダッシュボードに対応しています。',
    },
  ] satisfies Detail[],
  pages: [
    {
      route: '/',
      title: 'ホーム',
      body: 'アート主導のランディング体験を、クリエイティブデベロッパー向けに再構成した導入ページです。',
      features: [
        '文字ごとの歓迎モーションと、ホバー時の遊び心ある散らばり表現',
        '作品、経験、興味、連絡先へつながるアニメーション付きセクション',
        'デスクトップ専用にせず、個性を保ったレスポンシブレイアウト',
      ],
    },
    {
      route: '/projects',
      title: 'プロジェクト',
      body: '開発作品をケースファイルのように見せる、選び抜いたギャラリーです。',
      features: [
        'タグはコンテンツから生成され、URL に保存されるため絞り込み結果を共有可能',
        '浮遊・チルトするカード、ページネーション、いいね、並べ替え、保存、共有',
        'カードのケースファイル表示に加え、構造化された詳細ページも用意',
      ],
    },
    {
      route: '/blog',
      title: 'ブログ',
      body: 'CMS ではなく MDX を中心に構築した技術記事ライブラリです。',
      features: [
        '複数タグの絞り込み、安定したカード配置、デスクトップ3列、ページネーション、いいね、保存、並べ替え',
        '推定読了時間、読了トラッキング、シリーズ提案、前後の記事ナビゲーション',
        'MDX コンポーネント、コードハイライト、目次、画像、英語・日本語の記事版',
      ],
    },
    {
      route: '/now',
      title: 'Now',
      body: '以前の lab を、現在取り組んでいる実験とサイトの状態を見せるページに再構成しました。',
      features: [
        '操作できる3D空と雲、編集可能なパレット、モーションの再生/停止、実験カルーセル',
        'テーマ、画像・モーション方針、パフォーマンスモード、モーション軽減状態を表示する Built light パネル',
        '実験を「今探索していること」として誠実に伝えるコンテキスト文章',
      ],
    },
    {
      route: '/contact',
      title: 'お問い合わせ・依頼',
      body: '一般的な問い合わせフォームではなく、相談のための意図的な入口です。',
      features: [
        'プロジェクト、記事、問い合わせの各依頼で、範囲・時期・予算・希望連絡方法を入力可能',
        'MongoDB への依頼保存と、任意の Resend によるメール通知',
        'Ask Kiki は、AI 利用を有効にするまで親しみやすい準備中表示',
      ],
    },
    {
      route: '/saved',
      title: '保存済み',
      body: '訪問者のブラウザだけに存在する、小さな読書・作品ライブラリです。',
      features: [
        'プロジェクトと記事を、特徴的なライブラリーUIで別々に整理',
        'localStorage を利用。アカウント、追跡プロフィール、サーバー側の個人ライブラリは不要',
        'ヘッダー、フッター、コマンドパレットからアクセス可能',
      ],
    },
    {
      route: '/resume',
      title: '履歴書',
      body: '印刷に適した、1ページの職務概要です。',
      features: [
        '経験、スキル、連絡先を分かりやすく要約',
        'PDF として保存できる印刷アクションと連絡先への導線',
        '英語版と並んで日本語ルートも用意',
      ],
    },
  ] satisfies PageDetail[],
  content: [
    {
      title: 'コンテンツから生まれるタグ',
      body: 'タグはプロジェクトと記事を結ぶ共通言語です。コンテンツから読み取り、フィルター用に重複を除き、別の管理画面で管理せず共有可能なURLにも反映します。',
    },
    {
      title: '生成されるID',
      body: '記事とプロジェクトには、コンテンツから安定したIDを生成します。新しい JSON プロジェクトや MDX 記事も、手動でいいねIDを指定せず参加できます。',
    },
    {
      title: '適度な上限のいいね',
      body: 'いいねは専用の MongoDB コレクションに保存され、各項目で表現豊かなリアクションを最大10個までに制限。遊び心を残しつつ、ノイジーなランキングにはしません。',
    },
    {
      title: '多言語の土台',
      body: '/ja のルート、ロケール対応ナビゲーション、翻訳済みのUIテキスト、独立した日本語MDXソースに対応。対応するページがあれば、言語切替時にも現在のルートを保ちます。',
    },
  ] satisfies Detail[],
  delivery: [
    {
      title: 'ルートごとのメタデータ',
      body: 'ルートレイアウトが基本のタイトル、説明、アイコン、キーワード、Open Graph、Twitter メタデータを提供します。記事とプロジェクトは固有の canonical URL、タイトル、説明、必要に応じた記事日付とソーシャル画像を追加します。',
    },
    {
      title: '生成されるブランドOGカード',
      body: 'ソーシャルプレビューは Next の ImageResponse で /api/og にてオンデマンド生成されます。共通パレット、オリジナルの猫ロゴ、ルート種別、タイトル、説明を使い、関係のないカバー画像への依存を避けます。',
    },
    {
      title: '検索エンジンの基盤',
      body: 'metadataBase は NEXT_PUBLIC_SITE_URL から設定されます。動的な sitemap.xml と robots.txt も同じURLを使い、主要ルート、記事、プロジェクトのページを含めます。',
    },
    {
      title: '共有の仕組み',
      body: '記事とプロジェクトでは、対応デバイスのネイティブ共有と、どの環境でも使えるリンクコピーの代替手段を提供。どちらも分析イベントとして記録できます。',
    },
  ] satisfies Detail[],
  quality: [
    {
      title: 'レスポンシブ設計',
      body: 'コンパクトなスマートフォンからタブレット、デスクトップまで対応。ナビゲーションは折りたたまれ、グリッドは列数を減らし、コントロールは折り返され、文字と余白は固定キャンバスではなくブレークポイントに合わせます。',
    },
    {
      title: 'モーション設定',
      body: '見える場所にあるモーション設定は、OS の prefers-reduced-motion と連動します。装飾的な動きと3Dの動きを抑えながら、コンテンツ自体は隠しません。',
    },
    {
      title: '必要な場所を軽く',
      body: 'Next の画像処理、LazyMotion、記事パスの静的生成、レスポンシブなカード、控えめな視覚効果によって、アート主導のUIが重く感じないようにしています。',
    },
    {
      title: 'プライバシーを意識した保存',
      body: '保存した項目は訪問者の端末の localStorage に残ります。ログインは不要で、保存ライブラリを MongoDB に送信することもありません。',
    },
  ] satisfies Detail[],
  operations: [
    {
      title: '本番環境で必要な設定',
      body: 'NEXT_PUBLIC_SITE_URL は https://kittykio.com に設定され、canonical link、sitemap、robots.txt、OG URL が一貫して本番ドメインを指すようになっています。',
    },
    {
      title: 'データとメールの設定',
      body: 'MONGODB_URI は、いいね、依頼、分析を portfolio-project データベースに接続します。RESEND_API_KEY と認証済みの送信元/ドメインで依頼メール通知を有効にできます。',
    },
    {
      title: '任意のサービス',
      body: 'NEXT_PUBLIC_GA_ID で Google Analytics を有効化。ANALYTICS_DASHBOARD_TOKEN は /insights を保護します。OpenAI キーは利用クレジットを用意した後に Ask Kiki を有効にするためのものです。依頼モードはこれに依存しません。',
    },
    {
      title: '非公開のインサイト',
      body: '/insights は意図的にトークンで保護されています。コンテンツ閲覧、開封、絞り込み、保存、共有、リンクコピー、読了、問い合わせ、コマンドパレット検索などのファーストパーティイベントを、各機能の有効化に応じて集計できます。',
    },
  ] satisfies Detail[],
};

const DetailGrid = ({ items }: { items: Detail[] }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {items.map((item) => (
      <article
        key={item.title}
        className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]"
      >
        <h3 className="font-heading text-2xl text-flame-500">{item.title}</h3>
        <p className="mt-3 leading-relaxed text-content">{item.body}</p>
        {item.points && (
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-content">
            {item.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-flame-500">●</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    ))}
  </div>
);

const palette = [
  {
    name: 'Lemon',
    hex: colorPalette.lemon,
    role: 'Primary accent: active states, bookmarks, and optimistic contrast',
    text: colorPalette.gray900,
    featured: true,
  },
  {
    name: 'Flame 500',
    hex: colorPalette.flame500,
    role: 'Primary action: calls to action, links, and shared hover states',
    text: colorPalette.white,
    featured: true,
  },
  {
    name: 'Flame 300',
    hex: colorPalette.flame300,
    role: 'Lighter flame accent for softer emphasis',
    text: colorPalette.gray900,
  },
  {
    name: 'Flame 700',
    hex: colorPalette.flame700,
    role: 'Pressed states and deeper accent contrast',
    text: colorPalette.white,
  },
  { name: 'Flame 900', hex: colorPalette.flame900, role: 'The darkest flame shade for depth', text: colorPalette.white },
  {
    name: 'White',
    hex: colorPalette.white,
    role: 'Light-mode canvas and high-contrast card surface',
    text: colorPalette.gray900,
  },
  {
    name: 'Gray 100',
    hex: colorPalette.gray100,
    role: 'Light cards, quiet surfaces, and separators',
    text: colorPalette.gray900,
  },
  {
    name: 'Gray 300',
    hex: colorPalette.gray300,
    role: 'Subtle borders and soft supporting surfaces',
    text: colorPalette.gray900,
  },
  { name: 'Gray 500', hex: colorPalette.gray500, role: 'Secondary text and supporting UI', text: colorPalette.white },
  {
    name: 'Gray 700',
    hex: colorPalette.gray700,
    role: 'Strong secondary text and dark separators',
    text: colorPalette.white,
  },
  {
    name: 'Charcoal',
    hex: colorPalette.gray900,
    role: 'Dark-mode canvas and primary dark text',
    text: colorPalette.white,
  },
  {
    name: 'Black',
    hex: colorPalette.black,
    role: 'Maximum contrast for icon and code details',
    text: colorPalette.white,
  },
  { name: 'Cocoa 700', hex: colorPalette.cocoa700, role: 'Dark-mode raised surface', text: colorPalette.white },
  { name: 'Cocoa 900', hex: colorPalette.cocoa900, role: 'Dark-mode canvas', text: colorPalette.white },
  { name: 'Lab sky', hex: colorPalette.labSky, role: 'The Now page sky base', text: colorPalette.gray900 },
  { name: 'Rainbow red', hex: colorPalette.rainbowRed, role: 'Experimental cloud highlight', text: colorPalette.gray900 },
  { name: 'Rainbow orange', hex: colorPalette.rainbowOrange, role: 'Experimental cloud highlight', text: colorPalette.gray900 },
  { name: 'Rainbow yellow', hex: colorPalette.rainbowYellow, role: 'Experimental cloud highlight', text: colorPalette.gray900 },
  { name: 'Rainbow green', hex: colorPalette.rainbowGreen, role: 'Experimental cloud highlight', text: colorPalette.gray900 },
  { name: 'Rainbow blue', hex: colorPalette.rainbowBlue, role: 'Experimental cloud highlight', text: colorPalette.gray900 },
  { name: 'Rainbow violet', hex: colorPalette.rainbowViolet, role: 'Experimental cloud highlight', text: colorPalette.gray900 },
];

export default function AboutThisAppContent({ locale = 'en' }: { locale?: 'en' | 'ja' }) {
  const ja = locale === 'ja';
  const copy = ja ? Japanese : English;

  return (
    <main className="mx-auto mt-24 w-full max-w-7xl px-4 pb-[42rem] sm:px-6">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 text-white shadow-[0_20px_45px_var(--shadow-strong)] sm:px-12 sm:py-16">
        <p className="font-bodyBold text-sm tracking-[0.25em] text-lemon">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-flashy text-5xl leading-none sm:text-7xl">
          {copy.title}
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-gray-100 sm:text-xl">
          {copy.intro}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-bodyBold">
          <span className="rounded-full bg-lemon px-4 py-2 text-gray-900">Next.js + TypeScript</span>
          <span className="rounded-full border border-white/40 px-4 py-2 text-white">MDX + MongoDB</span>
          <span className="rounded-full border border-white/40 px-4 py-2 text-white">
            {ja ? 'クリエイティブに、でも軽く' : 'Creative, but built light'}
          </span>
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">01</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.architecture}
        </h2>
        <div className="mt-8">
          <DetailGrid items={copy.stack} />
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">02</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.pages}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {copy.pages.map((page) => (
            <article key={page.route} className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)] sm:p-8">
              <p className="font-bodyBold text-sm text-flame-500">{page.route}</p>
              <h3 className="mt-2 font-heading text-3xl text-content">{page.title}</h3>
              <p className="mt-3 leading-relaxed text-content">{page.body}</p>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-content">
                {page.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-flame-500">→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">03</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {ja ? 'ビジュアルシステム' : 'Visual system'}
        </h2>
        <p className="mt-5 max-w-3xl leading-relaxed text-content">
          {ja
            ? '色、書体、形、余白、モーションは個別の装飾ではなく、ひとつのシステムとして扱っています。レモンとフレームレッドがこのサイトの二つの主役で、目線とアクションを導きます。読みやすさの土台にはニュートラルなグレーを置き、虹色は Now の実験だけに限定しています。'
            : 'Colour, type, shape, spacing, and motion are treated as one system rather than separate decoration. Lemon and flame red are the site’s two lead accents: they guide attention and action. Neutral grays carry reading, while rainbow colours are reserved for Now experiments.'}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {palette
            .filter((color) => color.featured)
            .map((color) => (
              <article
                key={color.name}
                className="overflow-hidden rounded-3xl border border-border-subtle bg-surface ring-2 ring-flame-500/30 shadow-[0_14px_32px_var(--shadow-flame)]"
              >
                <div
                  className={`${color.featured ? 'h-36' : 'h-28'} p-5`}
                  style={{ backgroundColor: color.hex, color: color.text }}
                >
                  {color.featured && (
                    <p className="mb-2 font-bodyBold text-xs tracking-[0.18em]">
                      {ja ? 'メインアクセント' : 'MAIN ACCENT'}
                    </p>
                  )}
                  <p className={`font-bodyBold ${color.featured ? 'text-3xl' : 'text-xl'}`}>
                    {color.name}
                  </p>
                  <p className="mt-1 font-spacey text-sm">{color.hex}</p>
                </div>
                <p className="p-5 text-sm leading-relaxed text-content">
                  {ja
                    ? {
                        Lemon: 'メインアクセント：選択状態、ブックマーク、前向きなコントラスト',
                        'Flame 500': 'メインアクション：CTA、リンク、共通ホバー状態',
                        'Flame 300': 'やわらかな強調のための明るいフレーム色',
                        'Flame 700': '押下状態と深いアクセントコントラスト',
                        'Flame 900': '奥行きのための最も濃いフレーム色',
                        White: 'ライトモードのキャンバスと高コントラストなカード面',
                        'Gray 100': 'ライトカード、静かな面、区切り',
                        'Gray 300': '控えめなボーダーとソフトな補助面',
                        'Gray 500': '補助テキストとサポートUI',
                        'Gray 700': '強い補助テキストとダークな区切り',
                        Charcoal: 'ダークモードのキャンバスと濃い本文色',
                        Black: 'アイコンとコード詳細の最大コントラスト',
                        'Lab sky': 'Now ページの空のベース',
                        'Rainbow red': '実験用の雲ハイライト',
                        'Rainbow orange': '実験用の雲ハイライト',
                        'Rainbow yellow': '実験用の雲ハイライト',
                        'Rainbow green': '実験用の雲ハイライト',
                        'Rainbow blue': '実験用の雲ハイライト',
                        'Rainbow violet': '実験用の雲ハイライト',
                      }[color.name] || color.role
                    : color.role}
                </p>
              </article>
            ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {palette
            .filter((color) => !color.featured)
            .map((color) => (
              <article
                key={color.name}
                className="overflow-hidden rounded-3xl border border-border-subtle bg-surface"
              >
                <div className="h-28 p-5" style={{ backgroundColor: color.hex, color: color.text }}>
                  <p className="font-bodyBold text-xl">{color.name}</p>
                  <p className="mt-1 font-spacey text-sm">{color.hex}</p>
                </div>
                <p className="p-5 text-sm leading-relaxed text-content">
                  {ja
                    ? {
                        'Flame 300': 'やわらかな強調のための明るいフレーム色',
                        'Flame 700': '押下状態と深いアクセントコントラスト',
                        'Flame 900': '奥行きのための最も濃いフレーム色',
                        White: 'ライトモードのキャンバスと高コントラストなカード面',
                        'Gray 100': 'ライトカード、静かな面、区切り',
                        'Gray 300': '控えめなボーダーとソフトな補助面',
                        'Gray 500': '補助テキストとサポートUI',
                        'Gray 700': '強い補助テキストとダークな区切り',
                        Charcoal: 'ダークモードのキャンバスと濃い本文色',
                        Black: 'アイコンとコード詳細の最大コントラスト',
                        'Lab sky': 'Now ページの空のベース',
                        'Rainbow red': '実験用の雲ハイライト',
                        'Rainbow orange': '実験用の雲ハイライト',
                        'Rainbow yellow': '実験用の雲ハイライト',
                        'Rainbow green': '実験用の雲ハイライト',
                        'Rainbow blue': '実験用の雲ハイライト',
                        'Rainbow violet': '実験用の雲ハイライト',
                      }[color.name] || color.role
                    : color.role}
                </p>
              </article>
            ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <p className="font-bodyBold text-sm tracking-[0.18em] text-flame-500">
              {ja ? '書体の役割' : 'Typography roles'}
            </p>
            <div className="mt-5 space-y-4 text-content">
              <p className="font-flashy text-4xl">
                Kitty Kio{' '}
                <span className="font-body text-base">
                  {ja ? '— ロゴ / 表示用' : '— brand display'}
                </span>
              </p>
              <p className="font-drool text-3xl uppercase">
                {ja ? 'セクション見出し' : 'Section heading'}
              </p>
              <p className="font-heading text-2xl">
                {ja ? 'ナビゲーションと見出し' : 'Navigation & headings'}
              </p>
              <p className="font-body text-lg">
                {ja
                  ? '本文は Sulphur Point。読みやすく、控えめで、人らしい。'
                  : 'Body copy uses Sulphur Point: readable, quiet, and human.'}
              </p>
              <p className="font-spacey text-sm">
                {ja
                  ? 'コードと技術的な注記には Sometype Mono。'
                  : 'Sometype Mono is reserved for code and technical notes.'}
              </p>
            </div>
          </article>
          <article className="rounded-3xl bg-ink p-6 text-white">
            <p className="font-bodyBold text-sm tracking-[0.18em] text-lemon">
              {ja ? '主なスタイル原則' : 'Main style principles'}
            </p>
            <ul className="mt-5 space-y-3 leading-relaxed text-gray-100">
              <li>
                <span className="text-lemon">01 — </span>
                {ja
                  ? '大きく丸いカードと、境界線より面で区切る階層。'
                  : 'Large rounded cards and surface-led hierarchy instead of heavy outlines.'}
              </li>
              <li>
                <span className="text-lemon">02 — </span>
                {ja
                  ? 'ライトは白と暖かなグレー、ダークはチャコール。両方で十分なコントラスト。'
                  : 'White/warm-gray light mode and charcoal dark mode, both with deliberate contrast.'}
              </li>
              <li>
                <span className="text-lemon">03 — </span>
                {ja
                  ? 'フレームレッドのホバー状態を共通化し、操作できる要素を一貫して示す。'
                  : 'Shared flame-red hover states make interactive elements consistently legible.'}
              </li>
              <li>
                <span className="text-lemon">04 — </span>
                {ja
                  ? 'モーションは意味を補助するもの。減らす設定でも体験の構造は保つ。'
                  : 'Motion supports meaning; reduced motion preserves the experience’s structure.'}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">04</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.content}
        </h2>
        <div className="mt-8">
          <DetailGrid items={copy.content} />
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">05</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.delivery}
        </h2>
        <div className="mt-8">
          <DetailGrid items={copy.delivery} />
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">06</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {ja ? 'OG画像の仕組みと確認方法' : 'OG images: how they work'}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <h3 className="font-heading text-2xl text-flame-500">
              {ja ? '生成方法' : 'Generated, not uploaded'}
            </h3>
            <p className="mt-3 leading-relaxed text-content">
              {ja
                ? 'OGカードは public フォルダの固定画像ではありません。Next.js の ImageResponse が /api/og でオンデマンド生成し、共通パレットとオリジナルの猫ロゴを使います。'
                : 'OG cards are not static uploads. Next.js ImageResponse generates them on demand at /api/og with the shared palette and original cat logo.'}
            </p>
          </article>
          <article className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <h3 className="font-heading text-2xl text-flame-500">
              {ja ? 'ページごとの内容' : 'Per-page content'}
            </h3>
            <p className="mt-3 leading-relaxed text-content">
              {ja
                ? 'ホーム、各プロジェクト、各記事は、それぞれのタイトル、説明、種類をOGルートへ渡します。投稿とプロジェクトを共有すると、内容に合ったブランドカードが表示されます。'
                : 'The home page, every project, and every post pass their own title, description, and type to the OG route, so shared links receive a relevant branded card.'}
            </p>
          </article>
          <article className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <h3 className="font-heading text-2xl text-flame-500">
              {ja ? '公開後の確認' : 'Verify after deploy'}
            </h3>
            <p className="mt-3 leading-relaxed text-content">
              {ja
                ? 'まず /api/og?type=site を開きます。次に記事またはプロジェクトURLを LinkedIn や Discord のデバッガーで再取得してください。古いプレビューはSNS側のキャッシュなので、再スクレイプが必要な場合があります。'
                : 'Open /api/og?type=site first. Then re-scrape a post or project URL with a LinkedIn/Discord debugger. Old previews are usually cached by the social network, not the app.'}
            </p>
          </article>
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">07</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.quality}
        </h2>
        <div className="mt-8">
          <DetailGrid items={copy.quality} />
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">08</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.operations}
        </h2>
        <div className="mt-8">
          <DetailGrid items={copy.operations} />
        </div>
      </section>

      <section className="mt-20">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">09</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {ja ? '分析とインサイトの設定' : 'Analytics & insights setup'}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-flame-500/30 bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <h3 className="font-heading text-2xl text-flame-500">
              {ja ? '何を計測するか' : 'What is measured'}
            </h3>
            <p className="mt-3 leading-relaxed text-content">
              {ja
                ? 'プロジェクトを開く、タグ絞り込み、記事閲覧と読了、保存、共有、リンクコピー、問い合わせ、コマンドパレット検索など、サイトの改善に役立つ操作だけをファーストパーティイベントとして保存します。'
                : 'First-party events capture useful product signals only: project opens, tag filters, post views and completion, saves, shares, copied links, contact activity, and command-palette searches.'}
            </p>
          </article>
          <article className="rounded-3xl border border-flame-500/30 bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <h3 className="font-heading text-2xl text-flame-500">
              {ja ? '有効化の手順' : 'How to enable it'}
            </h3>
            <p className="mt-3 leading-relaxed text-content">
              {ja
                ? 'Vercel と .env.local に MONGODB_URI と ANALYTICS_DASHBOARD_TOKEN を追加し、デプロイ後に /insights?token=YOUR_TOKEN を開きます。トークンは公開URLやコードに書かず、パスワードマネージャーに保管します。'
                : 'Add MONGODB_URI and ANALYTICS_DASHBOARD_TOKEN in Vercel and .env.local, then open /insights?token=YOUR_TOKEN after deployment. Never place the token in code or a public link; keep it in a password manager.'}
            </p>
          </article>
          <article className="rounded-3xl border border-flame-500/30 bg-surface p-6 shadow-[0_10px_24px_var(--shadow-soft)]">
            <h3 className="font-heading text-2xl text-flame-500">
              {ja ? '補足サービス' : 'Optional services'}
            </h3>
            <p className="mt-3 leading-relaxed text-content">
              {ja
                ? 'Vercel Analytics は追加のキーなしで利用できます。Google Analytics を使う場合だけ NEXT_PUBLIC_GA_ID を追加します。詳細な手順と公開前チェックは、リポジトリ内の DEPLOYMENT_CHECKLIST.md にまとめています。'
                : 'Vercel Analytics needs no additional key. Add NEXT_PUBLIC_GA_ID only if you want Google Analytics too. The repository’s DEPLOYMENT_CHECKLIST.md has the complete setup and launch checks.'}
            </p>
          </article>
        </div>
      </section>

      <section className="mt-20 rounded-[2.5rem] border border-flame-500/40 bg-surface p-8 shadow-[0_16px_38px_var(--shadow-soft)] sm:p-12">
        <p className="font-bodyBold tracking-[0.2em] text-flame-500">10</p>
        <h2 className="mt-2 font-drool text-4xl uppercase text-content sm:text-5xl">
          {copy.labels.made}
        </h2>
        <p className="mt-6 max-w-4xl text-lg leading-relaxed text-content">
          {ja ? (
            <>
              このアプリは、
              <a className="font-bodyBold text-flame-500 underline hover:text-flame-700" href="https://momoart.vercel.app/" rel="noreferrer" target="_blank">アートポートフォリオ</a>
              の表現豊かなUIと言葉の見せ方を土台に、
              <a className="font-bodyBold text-flame-500 underline hover:text-flame-700" href="https://meowmomo.vercel.app/" rel="noreferrer" target="_blank">dev portfolio</a>
              の軽さと実務的な導線を選んで組み合わせました。作品、文章、技術の証拠、連絡先をすばやく見つけられる構造と、作者らしさを感じられる表現の両方を大切にしています。
            </>
          ) : (
            <>
              The app began with the creative visual language and content affordances of the{' '}
              <a className="font-bodyBold text-flame-500 underline hover:text-flame-700" href="https://momoart.vercel.app/" rel="noreferrer" target="_blank">art portfolio</a>
              , then selectively brought over the speed-oriented patterns of the{' '}
              <a className="font-bodyBold text-flame-500 underline hover:text-flame-700" href="https://meowmomo.vercel.app/" rel="noreferrer" target="_blank">dev portfolio</a>
              . The result is intentionally hybrid: expressive enough to feel authored, structured enough to help a hiring manager or collaborator quickly find work, writing, proof of craft, and a way to reach out.
            </>
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={ja ? '/ja/projects' : '/projects'}
            className="rounded-full bg-flame-500 px-5 py-3 font-bodyBold text-white transition hover:bg-flame-700"
          >
            {ja ? 'プロジェクトを見る' : 'Explore projects'}
          </Link>
          <Link
            href={ja ? '/ja/contact' : '/contact'}
            className="rounded-full border border-border px-5 py-3 font-bodyBold text-content transition hover:border-flame-500 hover:text-flame-500 "
          >
            {ja ? '相談をはじめる' : 'Start a conversation'}
          </Link>
        </div>
      </section>
    </main>
  );
}
