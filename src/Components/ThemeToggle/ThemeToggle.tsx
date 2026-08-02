import { HalfMoon, SunLight } from 'iconoir-react';
import { useState } from 'react';

import { cn } from '@/Utils/cn';

import { IconSize } from './ThemeToggle.constants';
import { classes } from './ThemeToggle.styles';

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
    <button
      ref={ref}
      type="button"
      aria-pressed={currentTheme === 'dark'}
      aria-label={label}
      title={label}
      className={cn(classes.button, className)}
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
    </button>
  );
}
