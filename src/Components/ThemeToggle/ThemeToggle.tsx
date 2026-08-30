import { HalfMoon, SunLight } from 'iconoir-react';
import { useState } from 'react';

import IconButton from '@/Components/IconButton';

import { IconSize } from './ThemeToggle.constants';

import type { ThemeToggleProps } from './ThemeToggle.types';

export default function ThemeToggle({
  ref,
  theme,
  defaultTheme = 'light',
  onToggle,
  label = 'Toggle theme',
  onClick,
  className,
  ...rest
}: ThemeToggleProps) {
  const [uncontrolledTheme, setUncontrolledTheme] = useState(defaultTheme);
  const currentTheme = theme ?? uncontrolledTheme;
  const Icon = currentTheme === 'dark' ? HalfMoon : SunLight;

  return (
    <IconButton
      ref={ref}
      aria-pressed={currentTheme === 'dark'}
      label={label}
      className={className}
      onClick={(event) => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (theme === undefined) {
          setUncontrolledTheme(nextTheme);
        }

        onToggle?.(nextTheme);
        onClick?.(event);
      }}
      {...rest}
    >
      <Icon width={IconSize} height={IconSize} />
    </IconButton>
  );
}
