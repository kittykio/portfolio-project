import fs from 'node:fs';
import { dateToTimestampString, formatDate, getCreatedDate, getModifiedDate } from '@/utils/getDate';

jest.mock('node:fs');
const mockedStat = jest.mocked(fs.statSync);

describe('date utilities', () => {
  it('reads created and modified dates from file stats', () => {
    const birthtime = new Date('2024-01-02T03:04:05Z');
    const mtime = new Date('2025-02-03T04:05:06Z');
    mockedStat.mockReturnValue({ birthtime, mtime } as fs.Stats);
    expect(getCreatedDate('/article.mdx')).toBe(birthtime);
    expect(getModifiedDate('/article.mdx')).toBe(mtime);
  });

  it('wraps file-system errors with a useful message', () => {
    mockedStat.mockImplementation(() => { throw new Error('missing'); });
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => getCreatedDate('/missing')).toThrow('Failed to get file stats for: /missing');
    expect(() => getModifiedDate('/missing')).toThrow('Failed to get file stats for: /missing');
  });

  it('formats display dates and sortable timestamps', () => {
    const date = new Date(2025, 0, 2, 3, 4, 5, 6);
    expect(formatDate(date, 'en-CA')).toBe(date.toLocaleDateString('en-CA'));
    expect(dateToTimestampString(date)).toBe('20250102030405006');
  });
});
