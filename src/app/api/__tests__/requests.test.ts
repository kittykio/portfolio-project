/** @jest-environment node */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/requests/route';
import connectToMongoDB from '@/lib/db';
import RequestModel from '@/models/requestModel';

const send = jest.fn();
jest.mock('@/lib/db', () => jest.fn());
jest.mock('@/models/requestModel', () => ({ create: jest.fn() }));
jest.mock('resend', () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send } })) }));

const request = (body: unknown, raw = false) => new NextRequest('http://localhost/api/requests', {
  method: 'POST', body: raw ? String(body) : JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
});

describe('request submission API', () => {
  const originalEnv = process.env;
  beforeEach(() => { process.env = { ...originalEnv }; delete process.env.MONGODB_URI; delete process.env.RESEND_API_KEY; delete process.env.RESEND_FROM_EMAIL; });
  afterAll(() => { process.env = originalEnv; });

  it.each([
    [{ kind: 'wrong', title: 'Valid', details: 'Enough detail here' }],
    [{ kind: 'project', title: 'x', details: 'Enough detail here' }],
    [{ kind: 'project', title: 'Valid', details: 'short' }],
    [{ kind: 'project', title: 'Valid', details: 'x'.repeat(6001) }],
  ])('rejects invalid input', async (body) => expect((await POST(request(body))).status).toBe(400));

  it('rejects malformed JSON and missing storage', async () => {
    expect((await POST(request('{', true))).status).toBe(400);
    expect((await POST(request({ kind: 'contact', title: 'Hello', details: 'Enough details here.' }))).status).toBe(503);
  });

  it('trims, normalizes, and stores a request without sending email', async () => {
    process.env.MONGODB_URI = 'mongodb://test';
    jest.mocked(RequestModel.create).mockResolvedValue({ id: 'abc', status: 'new' } as never);
    const response = await POST(request({ kind: 'project', title: '  Build it  ', details: '  A sufficiently detailed request.  ', contact: '', timeline: ' Soon ', budget: ' 100 ', preferredContact: ' Email ', locale: 'ja' }));
    expect(connectToMongoDB).toHaveBeenCalled();
    expect(RequestModel.create).toHaveBeenCalledWith({ kind: 'project', title: 'Build it', details: 'A sufficiently detailed request.', contact: undefined, timeline: 'Soon', budget: '100', preferredContact: 'Email', locale: 'ja' });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 'abc', status: 'new', notificationSent: false });
  });

  it('sends a notification when email is configured', async () => {
    Object.assign(process.env, { MONGODB_URI: 'mongodb://test', RESEND_API_KEY: 'key', RESEND_FROM_EMAIL: 'from@example.com' });
    jest.mocked(RequestModel.create).mockResolvedValue({ id: '1', status: 'new' } as never);
    send.mockResolvedValue({ id: 'mail' });
    const response = await POST(request({ kind: 'article', title: 'Article idea', details: 'Write a detailed article please.', contact: 'me@example.com' }));
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ from: 'from@example.com', subject: expect.stringContaining('Article idea'), text: expect.stringContaining('me@example.com') }));
    expect(await response.json()).toMatchObject({ notificationSent: true });
  });

  it('still creates the request when notification fails', async () => {
    Object.assign(process.env, { MONGODB_URI: 'mongodb://test', RESEND_API_KEY: 'key', RESEND_FROM_EMAIL: 'from@example.com' });
    jest.mocked(RequestModel.create).mockResolvedValue({ id: '1', status: 'new' } as never);
    send.mockRejectedValue(new Error('mail down'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = await POST(request({ kind: 'contact', title: 'Say hello', details: 'This contains enough detail.' }));
    expect(await response.json()).toMatchObject({ notificationSent: false });
  });
});
