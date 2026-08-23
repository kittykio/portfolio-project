import BlogCollection from '@/models/blogLikeModel';
import connectToMongoDB from '@/lib/db';
import { buildLike, createNewLike, deleteLike, searchAllLike, searchLikeById, updateLike } from '@/lib/blogAction';

jest.mock('@/models/blogLikeModel', () => ({ create: jest.fn(), findById: jest.fn(), find: jest.fn(), findOneAndDelete: jest.fn(), findByIdAndUpdate: jest.fn() }));
jest.mock('@/lib/db', () => jest.fn());

const collection = jest.mocked(BlogCollection);
const error = new Error('database failure');

describe('blog like actions', () => {
  const originalUri = process.env.MONGODB_URI;
  beforeEach(() => { process.env.MONGODB_URI = 'mongodb://test'; jest.spyOn(console, 'error').mockImplementation(() => undefined); jest.spyOn(console, 'log').mockImplementation(() => undefined); });
  afterAll(() => { if (originalUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = originalUri; });

  it('creates, searches, lists, and deletes likes', async () => {
    const doc = { _id: 1, like: 0 } as never;
    collection.create.mockResolvedValue(doc);
    collection.findById.mockResolvedValue(doc);
    collection.find.mockResolvedValue([doc]);
    collection.findOneAndDelete.mockResolvedValue(doc);
    await expect(createNewLike({ _id: 1 })).resolves.toBe(doc);
    expect(collection.create).toHaveBeenCalledWith({ _id: 1, like: 0 });
    await expect(searchLikeById({ _id: 1 })).resolves.toBe(doc);
    await expect(searchAllLike({ like: 0 })).resolves.toEqual([doc]);
    expect(collection.find).toHaveBeenCalledWith({ like: 0 });
    await expect(searchAllLike()).resolves.toEqual([doc]);
    expect(collection.find).toHaveBeenLastCalledWith({});
    await expect(deleteLike({ _id: 1 })).resolves.toBe(doc);
  });

  it('returns safe fallbacks when CRUD calls fail', async () => {
    collection.create.mockRejectedValue(error); collection.findById.mockRejectedValue(error);
    collection.find.mockRejectedValue(error); collection.findOneAndDelete.mockRejectedValue(error);
    await expect(createNewLike({ _id: 1 })).resolves.toBeNull();
    await expect(searchLikeById({ _id: 1 })).resolves.toBeNull();
    await expect(searchAllLike()).resolves.toEqual([]);
    await expect(deleteLike({ _id: 1 })).resolves.toBeNull();
  });

  it.each([[0, 1], [1.9, 1], [3, 3], [99, 3]])('clamps update increment %s to %s', async (seconds, increment) => {
    collection.findByIdAndUpdate.mockResolvedValue({ like: 12 } as never);
    await expect(updateLike({ _id: 4, seconds })).resolves.toBe(12);
    expect(connectToMongoDB).toHaveBeenCalled();
    expect(collection.findByIdAndUpdate).toHaveBeenCalledWith(4, { $inc: { like: increment } }, { new: true, upsert: true, setDefaultsOnInsert: true });
  });

  it('skips updates without configuration and handles empty/error results', async () => {
    delete process.env.MONGODB_URI;
    await expect(updateLike({ _id: 1, seconds: 2 })).resolves.toBe(0);
    process.env.MONGODB_URI = 'mongodb://test';
    collection.findByIdAndUpdate.mockResolvedValue(null);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await expect(updateLike({ _id: 1, seconds: 2 })).resolves.toBe(0);
    collection.findByIdAndUpdate.mockResolvedValue({ like: undefined } as never);
    await expect(updateLike({ _id: 1, seconds: 2 })).resolves.toBe(0);
    jest.mocked(connectToMongoDB).mockRejectedValueOnce(error);
    await expect(updateLike({ _id: 1, seconds: 2 })).resolves.toBe(0);
  });

  it('synchronizes removed and new like records', async () => {
    collection.find.mockResolvedValue([{ _id: 1 }, { _id: 2 }] as never);
    collection.findOneAndDelete.mockResolvedValue({ _id: 1 } as never);
    collection.create.mockResolvedValue({ _id: 3 } as never);
    await buildLike([{ id: 2 }, { id: 3 }] as never);
    expect(collection.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 });
    expect(collection.create).toHaveBeenCalledWith({ _id: 3, like: 0 });
  });

  it('handles an already synchronized collection and unexpected sync failure', async () => {
    collection.find.mockResolvedValue([{ _id: 2 }] as never);
    await buildLike([{ id: 2 }] as never);
    expect(collection.create).not.toHaveBeenCalled();
    collection.find.mockRejectedValueOnce(error);
    await expect(buildLike([])).resolves.toBeUndefined();
  });
});
