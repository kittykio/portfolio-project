import { staticMetadata } from '@/lib/seo';
export const metadata = staticMetadata('/now', 'ja');
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
