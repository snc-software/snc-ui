import { useState } from 'react';

import { cn } from '@/Utils/cn';

import { Palette, Sizes } from './Avatar.constants';
import { classes } from './Avatar.styles';

import type { AvatarProps } from './Avatar.types';

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function getPaletteColour(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % Palette.length;
  }

  return Palette[hash];
}

export default function Avatar({ ref, src, name, size = 'md', className, ...rest }: AvatarProps) {
  const [hasImageErrored, setHasImageErrored] = useState(false);
  const showImage = src !== undefined && !hasImageErrored;

  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={cn(classes.root, Sizes[size], className)}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className={classes.image}
          onError={() => setHasImageErrored(true)}
        />
      ) : (
        <span aria-hidden="true" className={cn(classes.fallback, getPaletteColour(name))}>
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
