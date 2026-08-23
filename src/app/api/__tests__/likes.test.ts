/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/likes/route';
import connectToMongoDB from '@/lib/db';
import ProjectLikes from '@/models/projectLikeModel';
import BlogLikes from '@/models/blogLikeModel';

jest.mock('@/lib/db', () => jest.fn());
jest.mock('@/models/projectLikeModel', () => ({ find: jest.fn() }));
jest.mock('@/models/blogLikeModel', () => ({ find: jest.fn() }));

const request = (query = '') => new NextRequest(`http://localhost/api/likes${query}`);
const leanResult = (value: unknown) => ({ lean: jest.fn().mockResolvedValue(value) });

describe('likes API', () => {
  const originalUri = process.env.MONGODB_URI;
  afterAll(() => { if (originalUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = originalUri; });
  beforeEach(() => { delete process.env.MONGODB_URI; });

  it('returns an empty map when storage is disabled', async () => {
    expect(await (await GET(request('?type=project&ids=1'))).json()).toEqual({ likes: {} });
    expect(connectToMongoDB).not.toHaveBeenCalled();
  });

  it.each(['?type=unknown&ids=1', '?type=blog', '?type=blog&ids=0,-1,nope'])('rejects invalid query %s', async (query) => {
    process.env.MONGODB_URI = 'mongodb://test';
    expect(await (await GET(request(query))).json()).toEqual({ likes: {} });
  });

  it.each([
    ['project', ProjectLikes, [{ _id: 1, like: 4 }]],
    ['blog', BlogLikes, [{ _id: 2, like: 7 }]],
  ] as const)('reads %s likes and disables caching', async (type, model, documents) => {
    process.env.MONGODB_URI = 'mongodb://test';
    jest.mocked(model.find).mockReturnValue(leanResult(documents) as never);
    const response = await GET(request(`?type=${type}&ids=1,2,invalid,-1`));
    expect(connectToMongoDB).toHaveBeenCalled();
    expect(model.find).toHaveBeenCalledWith({ _id: { $in: [1, 2] } });
    expect(await response.json()).toEqual({ likes: { [documents[0]._id]: documents[0].like } });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('caps the number of IDs at one hundred', async () => {
    process.env.MONGODB_URI = 'mongodb://test';
    jest.mocked(ProjectLikes.find).mockReturnValue(leanResult([]) as never);
    const ids = Array.from({ length: 120 }, (_, index) => index + 1).join(',');
    await GET(request(`?type=project&ids=${ids}`));
    const calls = jest.mocked(ProjectLikes.find).mock.calls as unknown as Array<[{ _id: { $in: number[] } }]>;
    const filter = calls[0][0];
    expect(filter._id.$in).toHaveLength(100);
  });
});
