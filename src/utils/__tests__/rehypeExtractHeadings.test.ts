import rehypeExtractHeadings from '@/utils/rehypeExtractHeadings';
import type { Element, Root } from 'hast';

jest.mock('hast-util-heading-rank', () => ({ headingRank: (node: Element) => /^h[1-6]$/.test(node.tagName) ? Number(node.tagName[1]) : undefined }));
jest.mock('hast-util-to-string', () => ({ toString: (node: Element) => {
  const read = (child: Element['children'][number]): string => child.type === 'text' ? child.value : child.type === 'element' ? child.children.map(read).join('') : '';
  return node.children.map(read).join('');
} }));
jest.mock('hast-util-has-property', () => (node: Element, name: string) => Object.prototype.hasOwnProperty.call(node.properties, name));
jest.mock('unist-util-visit', () => ({ visit: (tree: Root, _type: string, callback: (node: Element) => void) => {
  const walk = (node: Root | Element) => node.children.forEach((child) => {
    if (child.type === 'element') { callback(child); walk(child); }
  });
  walk(tree);
} }));

describe('rehypeExtractHeadings', () => {
  it('extracts identified headings through the configured rank', () => {
    const headings: Array<{ title: string; id: string; depth: number }> = [];
    const tree: Root = { type: 'root', children: [
      { type: 'element', tagName: 'h1', properties: { id: 'intro' }, children: [{ type: 'text', value: 'Hello ' }, { type: 'element', tagName: 'em', properties: {}, children: [{ type: 'text', value: 'world' }] }] },
      { type: 'element', tagName: 'h2', properties: { id: ['details'] }, children: [{ type: 'text', value: 'Details' }] },
      { type: 'element', tagName: 'h3', properties: { id: 'deep' }, children: [{ type: 'text', value: 'Deep' }] },
      { type: 'element', tagName: 'h2', properties: {}, children: [{ type: 'text', value: 'No link' }] },
      { type: 'element', tagName: 'p', properties: { id: 'copy' }, children: [{ type: 'text', value: 'Copy' }] },
    ] };
    const plugin = rehypeExtractHeadings as unknown as (options: { rank: number; headings: typeof headings }) => (tree: Root) => void;
    plugin({ rank: 2, headings })(tree);
    expect(headings).toEqual([
      { title: 'Hello world', id: 'intro', depth: 1 },
      { title: 'Details', id: 'details', depth: 2 },
    ]);
  });
});
