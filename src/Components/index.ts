// Barrel export for all components.
//
// `export *` does not re-export a default binding, and each component's index.ts exports its component
// as the default (as component-standards.md requires). Each default is therefore bound to a name here,
// or nothing would be reachable from the library root.
export { default as Accordion } from './Accordion';
export type { AccordionItem, AccordionProps } from './Accordion';

export { default as Autocomplete } from './Autocomplete';
export type { AutocompleteOption, AutocompleteProps } from './Autocomplete';

export { default as Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

// `ChartSeries` is shared vocabulary with `LineChart`, so it's only re-exported here once rather
// than from both (re-exporting the same type name from two modules in one barrel would collide).
export { default as BarChart } from './BarChart';
export type { BarChartProps, ChartSeries } from './BarChart';

// `NavigationLink` is shared vocabulary with `ComplexNavigationMenu`, so it's only re-exported here
// once rather than from both.
export { default as BasicNavigationMenu } from './BasicNavigationMenu';
export type { BasicNavigationMenuProps, NavigationLink } from './BasicNavigationMenu';

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Card } from './Card';
export type { CardProps } from './Card';

export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { default as CmdK } from './CmdK';
export type { CmdKProps } from './CmdK';

export { default as ComplexNavigationMenu } from './ComplexNavigationMenu';
export type {
  ComplexNavigationMenuItem,
  ComplexNavigationMenuProps,
} from './ComplexNavigationMenu';

export { default as DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

export { default as DateRangePicker } from './DateRangePicker';
export type { DateRangePickerProps, DateRangePickerValue } from './DateRangePicker';

export { default as FileUpload } from './FileUpload';
export type { FileUploadProps, FileUploadRejection } from './FileUpload';

export { default as InformationPanel } from './InformationPanel';
export type { InformationPanelProps } from './InformationPanel';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as LineChart } from './LineChart';
export type { LineChartProps } from './LineChart';

export { default as MasterDetailsTable } from './MasterDetailsTable';
export type { MasterDetailsTablePanelProps, MasterDetailsTableProps } from './MasterDetailsTable';

export { default as MultiSelect } from './MultiSelect';
export type { MultiSelectProps } from './MultiSelect';

export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';

export { default as NavigationBar } from './NavigationBar';
export type { NavigationBarProps } from './NavigationBar';

// `Option`/`OptionItem`/`Options`/`OptionsCollection`/`OptionsGroup` are shared vocabulary that
// `CmdK` also consumes, so they're only re-exported here once rather than from both.
export { default as OptionsList } from './OptionsList';
export type {
  Option,
  OptionItem,
  Options,
  OptionsCollection,
  OptionsGroup,
  OptionsListProps,
  SearchOptions,
  SearchTermMatchOption,
} from './OptionsList';

export { default as PieChart } from './PieChart';
export type { PieChartDatum, PieChartProps } from './PieChart';

export { default as SearchInput } from './SearchInput';
export type { SearchInputOption, SearchInputProps } from './SearchInput';

export { default as Sidebar, useSidebar } from './Sidebar';
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './Sidebar';
export type {
  SidebarCollapsible,
  SidebarContentProps,
  SidebarContextValue,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInputProps,
  SidebarInsetProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarSide,
  SidebarState,
  SidebarTriggerProps,
  SidebarVariant,
} from './Sidebar';

export { default as Select } from './Select';
export type { SelectOption, SelectProps } from './Select';

export { default as Separator } from './Separator';
export type { SeparatorProps } from './Separator';

export { default as Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { default as StatusPill } from './StatusPill';
export type { StatusPillProps } from './StatusPill';

export { default as Switch } from './Switch';
export type { SwitchProps } from './Switch';

// Table's own index.ts already names its sub-components and public types, so `export *` picks those
// up; only its default needs binding.
export { default as Table } from './Table';
export * from './Table';

export { default as Tag } from './Tag';
export type { TagProps } from './Tag';

export { default as TextArea } from './TextArea';
export type { TextAreaProps } from './TextArea';

export { default as ThemeToggle } from './ThemeToggle';
export type { Theme, ThemeToggleProps } from './ThemeToggle';

export { default as Tooltip } from './Tooltip';
export type { TooltipPlacement, TooltipProps } from './Tooltip';

export * from './Typography';

export { default as Wizard } from './Wizard';
export type { WizardCompletionAction, WizardProps, WizardStep } from './Wizard';
