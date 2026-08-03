import type { BasicNavigationMenuProps } from '@/Components/BasicNavigationMenu';
import type { ComplexNavigationMenuProps } from '@/Components/ComplexNavigationMenu';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

export type NavigationBarProps = SncComponent<
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'id' | 'style' | 'children'> & {
    /** Rendered at the leading (left) edge of the bar. */
    brand: ReactNode;
    navigationMenu?:
      ReactElement<BasicNavigationMenuProps> | ReactElement<ComplexNavigationMenuProps>;
    /** Rendered at the trailing (right) edge of the bar — typically an `Avatar`. */
    actions?: ReactNode;
    ref?: Ref<HTMLElement>;
  }
>;
