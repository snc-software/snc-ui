export type NavigationLink = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  /** Consumer-supplied; this library has no router awareness. @default false */
  isActive?: boolean;
};
