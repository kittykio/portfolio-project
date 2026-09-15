import { staticMetadata } from '@/lib/seo';
export const metadata = staticMetadata('/about-this-app', 'en');
import AboutThisAppContent from './AboutThisAppContent';



export default function AboutThisAppPage() {
  return <AboutThisAppContent locale="en" />;
}
