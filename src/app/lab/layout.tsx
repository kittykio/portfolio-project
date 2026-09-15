import { staticMetadata } from '@/lib/seo';
export const metadata = staticMetadata('/lab', 'en');
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
