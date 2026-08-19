import { ImageResponse } from 'next/og';
import { colorPalette } from '@/constants/colorPalette';

export const runtime = 'edge';

const labels = {
  en: { site: 'CREATIVE DEVELOPER', project: 'PROJECT CASE STUDY', post: 'TECHNICAL WRITING' },
  ja: { site: 'クリエイティブデベロッパー', project: 'プロジェクトケーススタディ', post: 'テクニカルライティング' },
};

const truncate = (value: string, length: number) =>
  value.length > length ? `${value.slice(0, length - 1).trimEnd()}…` : value;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const logoUrl = new URL('/kitty-kio-logo.png', request.url).toString();
  const locale = searchParams.get('locale') === 'ja' ? 'ja' : 'en';
  const typeParam = searchParams.get('type');
  const type = typeParam === 'project' || typeParam === 'post' ? typeParam : 'site';
  const title = truncate(searchParams.get('title') || 'Kitty Kio — creative developer & artist', 82);
  const description = truncate(
    searchParams.get('description') || 'Useful, human, and memorable web experiences.',
    138,
  );

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'stretch',
          background: colorPalette.gray900,
          color: colorPalette.white,
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          padding: 44,
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            background: colorPalette.lemon,
            borderRadius: 999,
            height: 520,
            position: 'absolute',
            right: -115,
            top: -230,
            width: 520,
          }}
        />
        <div
          style={{
            background: colorPalette.flame500,
            borderRadius: 999,
            bottom: -195,
            height: 390,
            left: 575,
            position: 'absolute',
            width: 390,
          }}
        />
        <div
          style={{
            border: `3px solid ${colorPalette.lemon}`,
            borderRadius: 36,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            padding: '42px 48px',
            position: 'relative',
            width: '100%',
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ color: colorPalette.lemon, display: 'flex', fontSize: 25, fontWeight: 800, letterSpacing: 5 }}>
              {labels[locale][type]}
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
              <img
                alt=""
                height="64"
                src={logoUrl}
                style={{ height: 64, objectFit: 'contain', width: 64 }}
                width="64"
              />
              <div style={{ color: colorPalette.gray900, display: 'flex', fontSize: 31, fontWeight: 800, letterSpacing: -1 }}>Kitty Kio</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 880 }}>
            <div style={{ display: 'flex', fontSize: title.length > 52 ? 58 : 72, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05 }}>
              {title}
            </div>
            <div style={{ color: colorPalette.gray100, display: 'flex', fontSize: 28, lineHeight: 1.32, marginTop: 24 }}>
              {description}
            </div>
          </div>

          <div style={{ alignItems: 'center', color: colorPalette.gray100, display: 'flex', fontSize: 22, justifyContent: 'space-between' }}>
            <span>full-stack developer · creative code · thoughtful systems</span>
            <span style={{ color: colorPalette.lemon, fontWeight: 800, letterSpacing: 2 }}>KITTY KIO</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
