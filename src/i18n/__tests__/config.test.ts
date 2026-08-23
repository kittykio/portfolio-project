import { getLocalePath, isLocale } from '@/i18n/config';

describe('locale configuration', () => {
  it.each([['en', true], ['ja', true], ['fr', false], [null, false], [undefined, false]] as const)(
    'recognizes %s', (value, expected) => expect(isLocale(value)).toBe(expected),
  );
  it.each([
    ['/projects', 'ja', '/ja/projects'], ['/ja/projects', 'en', '/projects'],
    ['/ja', 'en', '/'], ['/', 'ja', '/ja/'],
  ] as const)('maps %s to %s', (path, locale, expected) => expect(getLocalePath(path, locale)).toBe(expected));
});
