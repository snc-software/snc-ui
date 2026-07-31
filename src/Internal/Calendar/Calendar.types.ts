import type { SncComponent } from '@/Types/SncComponent';

export type CalendarProps = SncComponent<{
  /**
   * Highlighted day; also seeds the month/year initially displayed.
   */
  selectedDate?: Date;
  /**
   * Called when a day cell — including a leading/trailing adjacent-month day — is activated.
   */
  onSelect: (date: Date) => void;
  /**
   * Earliest year offered in the year selector.
   * @default currentYear - 20
   */
  minYear?: number;
  /**
   * Latest year offered in the year selector.
   * @default currentYear + 10
   */
  maxYear?: number;
}>;
