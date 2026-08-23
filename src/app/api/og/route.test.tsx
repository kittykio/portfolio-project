const imageResponse = jest.fn((element, options) => ({ element, options }));
jest.mock('next/og', () => ({ ImageResponse: function (element: unknown, options: unknown) { return imageResponse(element, options); } }));
import { GET } from './route';

describe('GET /api/og', () => {
  beforeEach(() => imageResponse.mockClear());
  it('creates a localized project card and truncates long copy', async () => {
    const result = await GET({ url: `https://example.com/api/og?locale=ja&type=project&title=${'x'.repeat(100)}&description=${'y'.repeat(160)}` } as Request);
    expect(result).toEqual(expect.objectContaining({ options: expect.objectContaining({ width: 1200, height: 630 }) }));
    expect(JSON.stringify(imageResponse.mock.calls[0][0])).toContain('プロジェクトケーススタディ');
    expect(JSON.stringify(imageResponse.mock.calls[0][0])).toContain('…');
  });
  it('uses site defaults for invalid parameters', async () => {
    await GET({ url: 'https://example.com/api/og?locale=xx&type=nope' } as Request);
    const rendered = JSON.stringify(imageResponse.mock.calls[0][0]);
    expect(rendered).toContain('CREATIVE DEVELOPER'); expect(rendered).toContain('creative developer');
  });
});
