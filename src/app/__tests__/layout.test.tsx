import { render, screen } from '@testing-library/react';
import RootLayout, { metadata, viewport } from '@/app/layout';

let requestLocale = 'en';
jest.mock('@/i18n/server', () => ({ getRequestLocale: () => requestLocale }));
jest.mock('@/constants/fonts', () => Object.fromEntries(['heading','body','bodyBold','flashy','drool','awkward','spacey','playful','saucy','loud'].map(key => [key, { variable: key }])));
jest.mock('@/components/header/Header', () => () => <header>Header</header>);
jest.mock('@/components/footer/Footer', () => () => <footer>Footer</footer>);
jest.mock('@/components/scroll-slider/ScrollSlider', () => ({ children }: React.PropsWithChildren) => <div>{children}</div>);
jest.mock('@/components/ThemeContext', () => ({ children }: React.PropsWithChildren) => <>{children}</>);
jest.mock('next-themes', () => ({ ThemeProvider: ({ children }: React.PropsWithChildren) => <>{children}</> }));
jest.mock('@/components/LocaleContext', () => ({ LocaleProvider: ({ children }: React.PropsWithChildren) => <>{children}</> }));
jest.mock('@/components/MotionPreference', () => ({ MotionPreferenceProvider: ({ children }: React.PropsWithChildren) => <>{children}</> }));
jest.mock('@/components/AskKiki', () => () => <div>Assistant</div>);
jest.mock('@vercel/analytics/next', () => ({ Analytics: () => <div>Analytics</div> }));
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => <div>Insights</div> }));
jest.mock('@next/third-parties/google', () => ({ GoogleAnalytics: ({ gaId }: { gaId: string }) => <div>{gaId}</div> }));

it('defines metadata and composes the localized application shell', async () => {
  expect(viewport).toContain('device-width'); expect(metadata.title).toContain('Kitty Kio');
  requestLocale = 'ja'; const shell = await RootLayout({ children: <p>Content</p> }); expect(shell.props.lang).toBe('ja'); render(shell);
  expect(screen.getByText('Content')).toBeInTheDocument();
  expect(screen.getByText('Header')).toBeInTheDocument(); expect(screen.getByText('Footer')).toBeInTheDocument();
});
