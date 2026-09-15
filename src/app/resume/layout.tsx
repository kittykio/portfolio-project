import { staticMetadata } from '@/lib/seo';
export const metadata = staticMetadata('/resume', 'en');
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
