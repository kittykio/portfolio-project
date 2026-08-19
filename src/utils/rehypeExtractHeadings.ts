import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import * as hast from 'hast';
import hasProperty from 'hast-util-has-property';
import { Plugin } from 'unified'; // Import the standard Unified plugin type
import { Heading } from '@/types/HeadingType';

// --- Plugin Configuration Type ---

/**
 * Configuration for the rehype plugin.
 * @property rank - The maximum heading rank (e.g., 2 for <h2>) to extract.
 * @property headings - The array reference where extracted headings will be pushed.
 */
export type ExtractHeadingsConfig = {
  rank: number;
  headings: Heading[];
};

// --- Plugin Implementation ---

/**
 * A rehype plugin to traverse the HTML AST (hast) and extract headings
 * (h1 through h[rank]) that possess an 'id' attribute, typically used
 * for generating a Table of Contents (ToC).
 *
 * @param config - The plugin configuration, including max rank and the target array.
 * @returns A transformer function that operates on the HAST.
 */
const rehypeExtractHeadings: Plugin<[ExtractHeadingsConfig], hast.Root> = ({
  rank = 2,
  headings,
}: ExtractHeadingsConfig) => {
  // The transformer function is what the unified processor executes.
  return (tree: hast.Root) => {
    // Traverse the HAST for elements.
    visit(tree, 'element', (node: hast.Element) => {
      const depth = headingRank(node);

      // Check 1: Is it a heading element (h1-h6)? (depth > 0)
      // Check 2: Is its depth within the configured rank limit?
      // Check 3: Does it have an 'id' property? (Required for linking/ToC)
      if (depth && depth <= rank && hasProperty(node, 'id')) {
        // The hast.Element properties are now safely accessed since hasProperty checked for 'id'.
        const idValue = node.properties.id;

        // Ensure idValue is treated as a string array or single string, as properties can be complex.
        const id = Array.isArray(idValue) ? String(idValue[0]) : String(idValue);

        // Push the extracted heading data to the external array reference.
        headings.push({
          title: toString(node), // Get the text content of the heading.
          id: id,
          depth,
        });
      }
    });
  };
};

export default rehypeExtractHeadings;
