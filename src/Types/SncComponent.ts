export type SncComponent<Props = object> = Props & {
  /**
   * Additional CSS classnames
   */
  className?: string;
  /**
   * Component Identifier
   */
  id?: string;
  /**
   * Optional in-line style properties
   */
  style?: React.CSSProperties;
  /**
   * Add data- attributes
   */
  [key: `data-${string}`]: unknown;
};

export type SncComponentWithChildren<Props = object> = SncComponent<Props> & {
  /**
   * Component Children
   */
  children?: React.ReactNode | undefined;
};
