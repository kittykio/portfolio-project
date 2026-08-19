/**
 * Declares the missing types for 'hast-util-has-property'.
 *
 * This module takes a hast node (Element) and a property name (string)
 * and returns a boolean.
 */
declare module 'hast-util-has-property' {
  import type { Element } from 'hast';
  const hasProperty: (node: Element, property: string) => boolean;
  export default hasProperty;
}
