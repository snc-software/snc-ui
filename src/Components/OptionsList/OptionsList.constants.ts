/**
 * `design-tokens.json` defines no spacing/space scale — every existing component's Tailwind classes
 * use Tailwind's own default spacing utilities instead of a custom token. Per-level indent needs a
 * dynamically computed pixel value (not a static utility class), so this keeps the legacy library's
 * own literal 20px-per-level step rather than inventing a design-system token that doesn't exist.
 */
export const INDENT_STEP_PX = 20;

/**
 * Left-inset applied to every row/heading at `indent={0}`, matching the `pr-4` (1rem) already on
 * `OptionItem`/`OptionsGroup.Button`'s row classes so left/right breathing room is symmetric.
 */
export const BASE_PADDING_PX = 16;
