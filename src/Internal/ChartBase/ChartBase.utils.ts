import { DefaultColorPalette } from './ChartBase.constants';

/**
 * Prefers a series/slice's own color override; otherwise assigns from the palette by index,
 * wrapping around when there are more series than palette entries.
 */
export function resolveSeriesColor(
  index: number,
  override?: string,
  palette: readonly string[] = DefaultColorPalette,
): string {
  if (override) {
    return override;
  }

  return palette[index % palette.length];
}
