// Barrel export for all components.
//
// `export *` does not re-export a default binding, and each component's index.ts exports its component
// as the default (as component-standards.md requires). Each default is therefore bound to a name here,
// or nothing would be reachable from the library root.
export { default as Accordion } from './Accordion';
export type { AccordionItem, AccordionProps } from './Accordion';

export { default as Autocomplete } from './Autocomplete';
export type { AutocompleteOption, AutocompleteProps } from './Autocomplete';

// `ChartSeries` is shared vocabulary with `LineChart`, so it's only re-exported here once rather
// than from both (re-exporting the same type name from two modules in one barrel would collide).
export { default as BarChart } from './BarChart';
export type { BarChartProps, ChartSeries } from './BarChart';

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

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

export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';

export { default as PieChart } from './PieChart';
export type { PieChartDatum, PieChartProps } from './PieChart';

export { default as SearchInput } from './SearchInput';
export type { SearchInputOption, SearchInputProps } from './SearchInput';

export { default as Select } from './Select';
export type { SelectOption, SelectProps } from './Select';

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

export * from './Typography';

export { default as Wizard } from './Wizard';
export type { WizardCompletionAction, WizardProps, WizardStep } from './Wizard';
