import fs from 'node:fs';
import path from 'node:path';

export function hasJapanesePost(slug: string[]) {
  if (!slug.length || slug.some(part => !part || part === '.' || part === '..' || /[\\/]/.test(part))) return false;
  return fs.existsSync(path.join(process.cwd(), 'blog', 'ja', `${slug.join('/')}.mdx`));
}
