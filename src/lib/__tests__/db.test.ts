describe('database connection', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
    delete (globalThis as typeof globalThis & { mongoConnectionCache?: unknown }).mongoConnectionCache;
    process.env = { ...originalEnv };
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });
  afterAll(() => { process.env = originalEnv; });

  it('requires a MongoDB URI', async () => {
    delete process.env.MONGODB_URI;
    jest.doMock('mongoose', () => ({ __esModule: true, default: { connect: jest.fn() } }));
    const connect = (await import('@/lib/db')).default;
    await expect(connect()).rejects.toThrow('MONGODB_URI is required');
  });

  it('connects once with the configured database and reuses the connection', async () => {
    process.env.MONGODB_URI = 'mongodb://example'; process.env.MONGODB_DB_NAME = 'custom';
    const connection = { readyState: 1 }; const mongooseConnect = jest.fn().mockResolvedValue({ connection });
    jest.doMock('mongoose', () => ({ __esModule: true, default: { connect: mongooseConnect } }));
    const connect = (await import('@/lib/db')).default;
    await expect(connect()).resolves.toBe(connection);
    await expect(connect()).resolves.toBe(connection);
    expect(mongooseConnect).toHaveBeenCalledTimes(1);
    expect(mongooseConnect).toHaveBeenCalledWith('mongodb://example', {
      dbName: 'custom',
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30_000,
      serverSelectionTimeoutMS: 10_000,
    });
  });

  it('opens a new pool after the cached connection closes', async () => {
    process.env.MONGODB_URI = 'mongodb://example';
    const firstConnection = { readyState: 1 };
    const secondConnection = { readyState: 1 };
    const mongooseConnect = jest
      .fn()
      .mockResolvedValueOnce({ connection: firstConnection })
      .mockResolvedValueOnce({ connection: secondConnection });
    jest.doMock('mongoose', () => ({ __esModule: true, default: { connect: mongooseConnect } }));
    const connect = (await import('@/lib/db')).default;

    await expect(connect()).resolves.toBe(firstConnection);
    firstConnection.readyState = 0;
    await expect(connect()).resolves.toBe(secondConnection);

    expect(mongooseConnect).toHaveBeenCalledTimes(2);
  });

  it('uses the default database name and rethrows connection failures', async () => {
    process.env.MONGODB_URI = 'mongodb://example'; delete process.env.MONGODB_DB_NAME;
    const failure = new Error('offline'); const mongooseConnect = jest.fn().mockRejectedValue(failure);
    jest.doMock('mongoose', () => ({ __esModule: true, default: { connect: mongooseConnect } }));
    const connect = (await import('@/lib/db')).default;
    await expect(connect()).rejects.toBe(failure);
    expect(mongooseConnect).toHaveBeenCalledWith('mongodb://example', {
      dbName: 'portfolio-project',
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30_000,
      serverSelectionTimeoutMS: 10_000,
    });
  });
});
