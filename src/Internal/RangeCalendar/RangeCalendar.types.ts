import type { SncComponent } from '@/Types/SncComponent';

export type RangeCalendarProps = SncComponent<{
  /**
   * Committed or pending start of the range; also seeds which two months are initially displayed.
   */
  rangeStart?: Date;
  /**
   * Committed end of the range. Left `undefined` while a selection is in progress so a hovered day
   * can preview the band instead.
   */
  rangeEnd?: Date;
  /**
   * Called when a day cell — in either month — is activated.
   */
  onSelect: (date: Date) => void;
  /**
   * Earliest year offered across both months.
   * @default currentYear - 20
   */
  minYear?: number;
  /**
   * Latest year offered across both months.
   * @default currentYear + 10
   */
  maxYear?: number;
}>;
