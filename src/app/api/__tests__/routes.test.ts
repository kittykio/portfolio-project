/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET as search } from '@/app/api/search/route';
import { POST as analytics } from '@/app/api/analytics/route';
import { POST as askKiki } from '@/app/api/ask-kiki/route';
import { getAllPosts } from '@/lib/blogApi';
import { getAllProjects } from '@/lib/projectApi';
import connectToMongoDB from '@/lib/db';
import AnalyticsEvent from '@/models/analyticsEventModel';

const mockCreate = jest.fn();

jest.mock('@/lib/blogApi', () => ({ getAllPosts: jest.fn() }));
jest.mock('@/lib/projectApi', () => ({ getAllProjects: jest.fn() }));
jest.mock('@/lib/db', () => jest.fn());
jest.mock('@/models/analyticsEventModel', () => ({ create: jest.fn() }));
jest.mock('openai', () => ({ __esModule: true, default: jest.fn().mockImplementation(() => ({ responses: { create: mockCreate } })) }));

const request = (url: string, body?: unknown) => new NextRequest(url, body === undefined ? undefined : {
  method: 'POST',
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' },
});

describe('API routes', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.MONGODB_URI;
    delete process.env.OPENAI_API_KEY;
  });
  afterAll(() => { process.env = originalEnv; });

  it('builds localized search results', async () => {
    jest.mocked(getAllPosts).mockResolvedValue([{ title: '記事', slug: ['hello'] }] as never);
    jest.mocked(getAllProjects).mockResolvedValue([{ title: '作品', slug: 'work' }] as never);
    const response = await search(request('http://localhost/api/search?locale=ja'));
    expect(await response.json()).toEqual({
      posts: [{ label: '記事', href: '/ja/blog/post/hello', kind: 'Post' }],
      projects: [{ label: '作品', href: '/ja/projects/work', kind: 'Project' }],
    });
  });

  it('rejects unknown analytics events and accepts known events without a database', async () => {
    expect((await analytics(request('http://localhost/api/analytics', { name: 'unknown' }))).status).toBe(400);
    const response = await analytics(request('http://localhost/api/analytics', { name: 'share' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it('persists normalized analytics when a database is configured', async () => {
    process.env.MONGODB_URI = 'mongodb://test';
    const response = await analytics(request('http://localhost/api/analytics', { name: 'share', path: 4, label: 'Work', locale: 'ja' }));
    expect(response.status).toBe(200); expect(connectToMongoDB).toHaveBeenCalled();
    expect(AnalyticsEvent.create).toHaveBeenCalledWith({ name: 'share', path: '', label: 'Work', locale: 'ja' });
    expect((await analytics(new NextRequest('http://localhost/api/analytics', { method: 'POST', body: '{' }))).status).toBe(400);
  });

  it('validates Ask Kiki input and supplies a safe demo response without a key', async () => {
    expect((await askKiki(request('http://localhost/api/ask-kiki', { message: '  ' }))).status).toBe(400);
    const response = await askKiki(request('http://localhost/api/ask-kiki', { message: 'Help', locale: 'ja' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ demo: true });
  });

  it('answers Ask Kiki from the localized catalogue and handles provider errors', async () => {
    process.env.OPENAI_API_KEY = 'test-key'; process.env.OPENAI_MODEL = 'test-model';
    jest.mocked(getAllPosts).mockResolvedValue([{ title: 'Post', description: 'Writing', tags: ['TS'], slug: ['post'] }] as never);
    jest.mocked(getAllProjects).mockResolvedValue([{ title: 'Work', description: 'App', tags: ['React'] }] as never);
    mockCreate.mockResolvedValueOnce({ output_text: 'The answer' });
    const success = await askKiki(request('http://localhost/api/ask-kiki', { message: ' What? ', locale: 'en' }));
    expect(await success.json()).toEqual({ answer: 'The answer' });
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ model: 'test-model', input: expect.stringContaining('PROJECT | Work') }));
    mockCreate.mockRejectedValueOnce(new Error('provider')); const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect((await askKiki(request('http://localhost/api/ask-kiki', { message: 'Again' }))).status).toBe(502); error.mockRestore();
  });
});
