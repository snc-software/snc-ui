export type MiniDonutProps = {
  /**
   * 0-100.
   */
  value: number;
  color: string;
  /**
   * @default 'var(--snc-border)'
   */
  trackColor?: string;
  /**
   * @default 64
   */
  size?: number;
};
