import { Xmark } from 'iconoir-react';
import { useState } from 'react';

import { cn } from '@/Utils/cn';

import { Variants } from './InformationPanel.constants';
import { classes } from './InformationPanel.styles';

import type { InformationPanelProps } from './InformationPanel.types';

export default function InformationPanel({
  ref,
  variant,
  heading,
  subtext,
  open,
  defaultOpen = true,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: InformationPanelProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  // Controlled as soon as `open` is supplied, as `Select`'s `value` prop behaves.
  const isOpen = open ?? uncontrolledOpen;

  const handleDismiss = () => {
    onDismiss?.();

    if (open === undefined) {
      setUncontrolledOpen(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="status"
      className={cn(classes.base, Variants[variant], className)}
      {...rest}
    >
      <div className={classes.content}>
        {heading && <div className={classes.heading}>{heading}</div>}
        {subtext && <div className={classes.subtext}>{subtext}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          className={classes.dismissButton}
          onClick={handleDismiss}
        >
          <Xmark width={14} height={14} />
        </button>
      )}
    </div>
  );
}
