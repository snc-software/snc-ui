// Internal by design: nothing here is exported from the library root. `NavigationLink` is shared
// vocabulary between `BasicNavigationMenu` and `ComplexNavigationMenu`, which each re-export it from
// their own `.types.ts` rather than declaring their own copy — same pattern as `ChartSeries`/`ChartBase`.
export type { NavigationLink } from './NavigationMenuBase.types';
