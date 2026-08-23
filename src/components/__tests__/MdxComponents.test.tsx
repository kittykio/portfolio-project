import { fireEvent, render, screen } from '@testing-library/react';
import * as MDX from '@/components/MdxComponents';

describe('MDX components', () => {
  it('renders semantic prose elements with their content', () => {
    const { container } = render(<>
      <MDX.Img src="/cat.png" alt="Cat" width={10} height={10} />
      <MDX.h1>H1</MDX.h1><MDX.h2>H2</MDX.h2><MDX.h3>H3</MDX.h3>
      <MDX.h4>H4</MDX.h4><MDX.h5>H5</MDX.h5><MDX.h6>H6</MDX.h6>
      <MDX.p>Paragraph</MDX.p><MDX.a href="/work">Anchor</MDX.a>
      <MDX.blockquote>Quote</MDX.blockquote><MDX.strong>Strong</MDX.strong>
      <MDX.em>Emphasis</MDX.em><MDX.del>Deleted</MDX.del>
      <MDX.ul><MDX.li>Bullet</MDX.li></MDX.ul><MDX.ol><MDX.li>Number</MDX.li></MDX.ol>
      <MDX.pre>code</MDX.pre><MDX.Divider />
    </>);
    expect(screen.getByRole('img', { name: 'Cat' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(6);
    expect(screen.getByRole('link', { name: 'Anchor' })).toHaveAttribute('href', '/work');
    expect(container.querySelector('blockquote')).toHaveTextContent('Quote');
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders table and input variants', () => {
    const { container } = render(<>
      <MDX.table><MDX.thead><MDX.tr><MDX.th>Head</MDX.th></MDX.tr></MDX.thead>
        <MDX.tbody><MDX.tr><MDX.td>Cell</MDX.td></MDX.tr></MDX.tbody></MDX.table>
      <MDX.input type="checkbox" aria-label="Done" /><MDX.input type="text" aria-label="Name" />
    </>);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveClass('accent-flame-500');
    expect(screen.getByRole('textbox')).not.toHaveClass('accent-flame-500');
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('renders downloadable file labels and fallback names', () => {
    render(<><MDX.FileLink name="/files/report.pdf" label="Report" /><MDX.FileLink name="/files/data.csv" /></>);
    expect(screen.getByRole('link', { name: 'Report' })).toHaveAttribute('download');
    expect(screen.getByRole('link', { name: 'data.csv' })).toHaveAttribute('href', '/files/data.csv');
  });

  it.each([
    ['Awkward', MDX.Awkward], ['Spacey', MDX.Spacey], ['Playful', MDX.Playful],
    ['Saucy', MDX.Saucy], ['Loud', MDX.Loud], ['Sparkly', MDX.Sparkly],
  ] as const)('renders %s inline and as a block', (_name, Component) => {
    const { rerender } = render(<Component>Words</Component>);
    expect(screen.getByText('Words').tagName).toBe('SPAN');
    rerender(<Component block>Words</Component>);
    expect(screen.getByText('Words').tagName).toBe('DIV');
  });

  it('renders underline and highlight styles in inline and block modes', () => {
    const { rerender } = render(<><MDX.Underline>Under</MDX.Underline><MDX.Highlight>Default</MDX.Highlight><MDX.Highlight color="flame" block>Flame</MDX.Highlight></>);
    expect(screen.getByText('Under')).toHaveClass('underline');
    expect(screen.getByText('Default')).toHaveClass('bg-lemon');
    expect(screen.getByText('Flame').tagName).toBe('DIV');
    rerender(<MDX.RainbowHighlight>Rainbow</MDX.RainbowHighlight>);
    expect(screen.getByText('Rainbow')).toHaveStyle({ backgroundImage: expect.stringContaining('linear-gradient') });
    rerender(<MDX.RainbowHighlight block>Rainbow</MDX.RainbowHighlight>);
    expect(screen.getByText('Rainbow')).toHaveClass('inline-block');
  });

  it('renders custom and preset file trees and reports file selection', () => {
    const onFileClick = jest.fn();
    const { rerender } = render(<MDX.MDXFileTree tree={[{ id: 'readme', name: 'README.md', type: 'file' }]} onFileClick={onFileClick} />);
    fireEvent.click(screen.getByText('README.md'));
    expect(onFileClick).toHaveBeenCalledWith('readme');
    rerender(<MDX.MDXFileTree preset="authoringGuide" />);
    expect(screen.getByText('src')).toBeInTheDocument();
    rerender(<MDX.MDXFileTree />);
    expect(screen.queryByText('src')).not.toBeInTheDocument();
  });
});
