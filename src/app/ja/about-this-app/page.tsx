import { staticMetadata } from '@/lib/seo';
export const metadata = staticMetadata('/about-this-app', 'ja');
import AboutThisAppContent from '@/app/about-this-app/AboutThisAppContent';



export default function JapaneseAboutThisAppPage() {
  return <AboutThisAppContent locale="ja" />;
}
