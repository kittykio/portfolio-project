/** @jest-environment node */
const model = jest.fn((name: string) => ({ modelName: name })); const deleteModel = jest.fn();
class SchemaMock { static Types = { Mixed: 'Mixed' }; constructor(public definition: unknown, public options: unknown) {} }
jest.mock('mongoose', () => ({ __esModule: true, default: { models: {}, model, deleteModel }, Schema: SchemaMock }));

it('registers every persisted application model with mongoose', () => {
  jest.isolateModules(() => {
    expect(require('./analyticsEventModel').default.modelName).toBe('PortfolioAnalyticsEvent');
    expect(require('./blogLikeModel').default.modelName).toBe('PortfolioBlogLike');
    expect(require('./projectLikeModel').default.modelName).toBe('PortfolioProjectLike');
    expect(require('./requestModel').default.modelName).toBe('PortfolioRequest');
  });
  expect(model).toHaveBeenCalledTimes(4);
});

it('reuses models during hot reload and refreshes the request model in development', () => {
  const mongoose = require('mongoose').default;
  mongoose.models.PortfolioAnalyticsEvent = { modelName: 'PortfolioAnalyticsEvent' };
  mongoose.models.PortfolioBlogLike = { modelName: 'PortfolioBlogLike' };
  mongoose.models.PortfolioProjectLike = { modelName: 'PortfolioProjectLike' };
  mongoose.models.PortfolioRequest = { modelName: 'PortfolioRequest' };
  const original = process.env.NODE_ENV; Object.defineProperty(process.env, 'NODE_ENV', { configurable: true, value: 'development' });
  jest.isolateModules(() => {
    expect(require('./analyticsEventModel').default.modelName).toBe('PortfolioAnalyticsEvent');
    expect(require('./blogLikeModel').default.modelName).toBe('PortfolioBlogLike');
    expect(require('./projectLikeModel').default.modelName).toBe('PortfolioProjectLike');
    expect(require('./requestModel').default.modelName).toBe('PortfolioRequest');
  });
  expect(deleteModel).toHaveBeenCalledWith('PortfolioRequest');
  Object.defineProperty(process.env, 'NODE_ENV', { configurable: true, value: original });
});
