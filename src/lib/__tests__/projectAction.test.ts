import ProjectCollection from '@/models/projectLikeModel';
import connectToMongoDB from '@/lib/db';
import { buildLike, createNewLike, deleteLike, searchAllLike, searchLikeById, updateLike } from '@/lib/projectAction';

jest.mock('@/models/projectLikeModel', () => ({ create: jest.fn(), findById: jest.fn(), find: jest.fn(), findOneAndDelete: jest.fn(), findByIdAndUpdate: jest.fn() }));
jest.mock('@/lib/db', () => jest.fn());
const collection = jest.mocked(ProjectCollection); const failure = new Error('database failure');

describe('project like actions', () => {
  const originalUri = process.env.MONGODB_URI;
  beforeEach(() => { process.env.MONGODB_URI = 'mongodb://test'; jest.spyOn(console, 'error').mockImplementation(() => undefined); jest.spyOn(console, 'log').mockImplementation(() => undefined); });
  afterAll(() => { if (originalUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = originalUri; });

  it('creates, searches, lists, and deletes records', async () => {
    const doc = { _id: 1, like: 0 } as never; collection.create.mockResolvedValue(doc); collection.findById.mockResolvedValue(doc); collection.find.mockResolvedValue([doc]); collection.findOneAndDelete.mockResolvedValue(doc);
    await expect(createNewLike({ _id: 1 })).resolves.toBe(doc); expect(collection.create).toHaveBeenCalledWith({ _id: 1, like: 0 });
    await expect(searchLikeById({ _id: 1 })).resolves.toBe(doc); await expect(searchAllLike({ like: 0 })).resolves.toEqual([doc]); await expect(searchAllLike()).resolves.toEqual([doc]); await expect(deleteLike({ _id: 1 })).resolves.toBe(doc);
  });

  it('returns safe CRUD fallbacks', async () => {
    collection.create.mockRejectedValue(failure); collection.findById.mockRejectedValue(failure); collection.find.mockRejectedValue(failure); collection.findOneAndDelete.mockRejectedValue(failure);
    await expect(createNewLike({ _id: 1 })).resolves.toBeNull(); await expect(searchLikeById({ _id: 1 })).resolves.toBeNull(); await expect(searchAllLike()).resolves.toEqual([]); await expect(deleteLike({ _id: 1 })).resolves.toBeNull();
  });

  it.each([[0, 1], [2.8, 2], [20, 3]])('clamps update %s to %s', async (seconds, increment) => {
    collection.findByIdAndUpdate.mockResolvedValue({ like: 10 } as never); await expect(updateLike({ _id: 5, seconds })).resolves.toBe(10); expect(collection.findByIdAndUpdate).toHaveBeenCalledWith(5, { $inc: { like: increment } }, { new: true, upsert: true, setDefaultsOnInsert: true });
  });

  it('handles disabled storage, missing records, missing counts, and failures', async () => {
    delete process.env.MONGODB_URI; await expect(updateLike({ _id: 1, seconds: 1 })).resolves.toBe(0); process.env.MONGODB_URI = 'mongodb://test';
    jest.spyOn(console, 'warn').mockImplementation(() => undefined); collection.findByIdAndUpdate.mockResolvedValue(null); await expect(updateLike({ _id: 1, seconds: 1 })).resolves.toBe(0);
    collection.findByIdAndUpdate.mockResolvedValue({ like: undefined } as never); await expect(updateLike({ _id: 1, seconds: 1 })).resolves.toBe(0); jest.mocked(connectToMongoDB).mockRejectedValueOnce(failure); await expect(updateLike({ _id: 1, seconds: 1 })).resolves.toBe(0);
  });

  it('synchronizes deleted and newly introduced projects', async () => {
    collection.find.mockResolvedValue([{ _id: 1 }, { _id: 2 }] as never); collection.findOneAndDelete.mockResolvedValue({ _id: 1 } as never); collection.create.mockResolvedValue({ _id: 3 } as never);
    await buildLike([{ id: 2 }, { id: 3 }] as never); expect(collection.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 }); expect(collection.create).toHaveBeenCalledWith({ _id: 3, like: 0 });
  });

  it('handles synchronized and failed builds', async () => {
    collection.find.mockResolvedValue([{ _id: 2 }] as never); await buildLike([{ id: 2 }] as never); expect(collection.create).not.toHaveBeenCalled(); collection.find.mockRejectedValueOnce(failure); await expect(buildLike([])).resolves.toBeUndefined();
  });
});
