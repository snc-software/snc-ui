// Barrel export for all components.
//
// `export *` does not re-export a default binding, and each component's index.ts exports its component
// as the default (as component-standards.md requires). Each default is therefore bound to a name here,
// or nothing would be reachable from the library root.
export { default as Autocomplete } from './Autocomplete';
export type { AutocompleteOption, AutocompleteProps } from './Autocomplete';

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { default as DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

export { default as FileUpload } from './FileUpload';
export type { FileUploadProps, FileUploadRejection } from './FileUpload';

export { default as InformationPanel } from './InformationPanel';
export type { InformationPanelProps } from './InformationPanel';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';

export { default as Select } from './Select';
export type { SelectOption, SelectProps } from './Select';

export { default as Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { default as StatusPill } from './StatusPill';
export type { StatusPillProps } from './StatusPill';

// Table's own index.ts already names its sub-components and public types, so `export *` picks those
// up; only its default needs binding.
export { default as Table } from './Table';
export * from './Table';

export { default as Tag } from './Tag';
export type { TagProps } from './Tag';

export { default as TextArea } from './TextArea';
export type { TextAreaProps } from './TextArea';

export * from './Typography';
