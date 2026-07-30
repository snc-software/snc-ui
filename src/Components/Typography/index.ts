// `export *` does not re-export a default binding, and each component's index.ts exports its component
// as the default (as component-standards.md requires). The barrel therefore has to bind those defaults
// to names, or nothing here is reachable from the library root.
export { default as Heading } from './Heading';
export type { HeadingProps } from './Heading';
export { default as Paragraph } from './Paragraph';
export type { ParagraphProps } from './Paragraph';
export { default as Link } from './Link';
export type { LinkProps } from './Link';
