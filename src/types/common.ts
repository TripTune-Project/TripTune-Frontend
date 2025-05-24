export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithOnClick {
  onClick?: () => void;
}

export interface WithDisabled {
  disabled?: boolean;
}

export interface WithLoading {
  isLoading?: boolean;
}

export interface WithError {
  error?: string;
}

export interface WithSuccess {
  success?: string;
}

export interface WithId {
  id: string;
}

export interface WithName {
  name: string;
}

export interface WithValue<T> {
  value: T;
}

export interface WithOnChange<T> {
  onChange: (value: T) => void;
}

export interface WithPlaceholder {
  placeholder?: string;
}

export interface WithLabel {
  label: string;
}

export interface WithRequired {
  required?: boolean;
}

export interface WithMaxLength {
  maxLength?: number;
}

export interface WithMinLength {
  minLength?: number;
}

export interface WithPattern {
  pattern?: string;
}

export interface WithTitle {
  title: string;
}

export interface WithDescription {
  description?: string;
}

export interface WithIcon {
  icon?: React.ReactNode;
}

export interface WithBadge {
  badge?: number | string;
}

export interface WithTooltip {
  tooltip?: string;
}

export interface WithAriaLabel {
  'aria-label': string;
}

export interface WithAriaDescribedBy {
  'aria-describedby'?: string;
}

export interface WithAriaControls {
  'aria-controls'?: string;
}

export interface WithAriaExpanded {
  'aria-expanded'?: boolean;
}

export interface WithAriaHidden {
  'aria-hidden'?: boolean;
}

export interface WithAriaLive {
  'aria-live'?: 'off' | 'polite' | 'assertive';
}

export interface WithAriaRelevant {
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
}

export interface WithAriaAtomic {
  'aria-atomic'?: boolean;
}

export interface WithAriaBusy {
  'aria-busy'?: boolean;
}

export interface WithAriaCurrent {
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
}

export interface WithAriaHaspopup {
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}

export interface WithAriaLevel {
  'aria-level'?: number;
}

export interface WithAriaModal {
  'aria-modal'?: boolean;
}

export interface WithAriaMultiline {
  'aria-multiline'?: boolean;
}

export interface WithAriaMultiselectable {
  'aria-multiselectable'?: boolean;
}

export interface WithAriaOrientation {
  'aria-orientation'?: 'horizontal' | 'vertical';
}

export interface WithAriaPressed {
  'aria-pressed'?: boolean | 'mixed';
}

export interface WithAriaReadonly {
  'aria-readonly'?: boolean;
}

export interface WithAriaRequired {
  'aria-required'?: boolean;
}

export interface WithAriaSelected {
  'aria-selected'?: boolean;
}

export interface WithAriaSetsize {
  'aria-setsize'?: number;
}

export interface WithAriaSort {
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
}

export interface WithAriaValuemax {
  'aria-valuemax'?: number;
}

export interface WithAriaValuemin {
  'aria-valuemin'?: number;
}

export interface WithAriaValuenow {
  'aria-valuenow'?: number;
}

export interface WithAriaValuetext {
  'aria-valuetext'?: string;
} 