import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAllPosts } from '@/lib/blogApi';
import { getAllProjects } from '@/lib/projectApi';

export const dynamic = 'force-dynamic';

const makeContext = async (locale: 'en' | 'ja') => {
  const [posts, projects] = await Promise.all([getAllPosts(locale), getAllProjects(locale)]);
  const projectContext = projects.map((project) => `PROJECT | ${project.title} | ${project.description} | tags: ${project.tags.join(', ')} | link: /${locale === 'ja' ? 'ja/' : ''}projects`).join('\n');
  const postContext = posts.map((post) => `ARTICLE | ${post.title} | ${post.description} | tags: ${post.tags.join(', ')} | link: /${locale === 'ja' ? 'ja/' : ''}blog/post/${post.slug.join('/')}`).join('\n');
  return `${projectContext}\n${postContext}`.slice(0, 30000);
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 1200) : '';
  const locale = body?.locale === 'ja' ? 'ja' : 'en';
  if (!message) return NextResponse.json({ error: 'Please write a question.' }, { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      answer: locale === 'ja'
        ? 'Ask Kikiを有効にするには、環境変数 `OPENAI_API_KEY` を追加してください。リクエスト送信は引き続き利用できます。'
        : 'Add `OPENAI_API_KEY` to enable Ask Kiki. You can still submit a request below.',
      demo: true,
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const context = await makeContext(locale);
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      store: false,
      instructions: locale === 'ja'
        ? 'あなたはKikiのポートフォリオ案内役です。提供された作品・記事だけを根拠に、日本語で簡潔に答えてください。関連する場合は必ず相対リンクをMarkdown形式で提示してください。情報がなければ、分からないと正直に伝えてください。'
        : 'You are Kiki’s portfolio guide. Answer concisely using only the provided project and article catalogue. When relevant, include relative links in Markdown. If the catalogue does not contain the answer, say so clearly.',
      input: `CATALOGUE:\n${context}\n\nVISITOR QUESTION:\n${message}`,
    });

    return NextResponse.json({ answer: response.output_text });
  } catch (error) {
    console.error('Ask Kiki failed:', error);
    return NextResponse.json(
      {
        error: 'Ask Kiki is temporarily unavailable.',
        ...(process.env.NODE_ENV === 'development' && error instanceof Error ? { detail: error.message } : {}),
      },
      { status: 502 },
    );
  }
}
