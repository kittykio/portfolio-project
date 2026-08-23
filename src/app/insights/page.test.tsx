import { render, screen } from '@testing-library/react';
import Insights from './page';

const redirect = jest.fn(); const connect = jest.fn();
const countDocuments = jest.fn(); const aggregate = jest.fn();
jest.mock('next/navigation', () => ({ redirect: (...args: unknown[]) => redirect(...args) }));
jest.mock('@/lib/db', () => () => connect());
jest.mock('@/models/analyticsEventModel', () => ({ countDocuments: () => countDocuments(), aggregate: (...args: unknown[]) => aggregate(...args) }));

it('protects and renders aggregated analytics insights', async () => {
  const original = process.env.ANALYTICS_DASHBOARD_TOKEN; process.env.ANALYTICS_DASHBOARD_TOKEN = 'secret';
  redirect.mockImplementation(() => { throw new Error('redirect'); });
  await expect(Insights({ searchParams: { token: 'wrong' } })).rejects.toThrow('redirect'); expect(redirect).toHaveBeenCalledWith('/');
  countDocuments.mockResolvedValue(4); aggregate.mockResolvedValueOnce([{ _id: 'share', count: 2 }]).mockResolvedValueOnce([{ _id: 'post', count: 1 }]).mockResolvedValueOnce([{ _id: '2026-01-01', count: 4 }]);
  render(await Insights({ searchParams: { token: 'secret' } })); expect(screen.getByText('4 meaningful events')).toBeInTheDocument(); expect(screen.getByText('share')).toBeInTheDocument(); expect(connect).toHaveBeenCalled();
  process.env.ANALYTICS_DASHBOARD_TOKEN = original;
});
