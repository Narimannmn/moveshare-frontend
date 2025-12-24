/**
 * Input Component Types
 *
 * Extracted from Figma design system SVG analysis
 * Design properties: State, Label, BG, Icon, Type
 */

/**
 * Input component state variants
 * Corresponds to Figma "State" property
 */
export type InputState = "default" | "error" | "focused" | "disabled";

/**
 * Icon position variants
 * Corresponds to Figma "Icon" property
 */
export type IconPosition = "none" | "left" | "right";

/**
 * Design tokens extracted from Figma SVG
 */
export const INPUT_DESIGN_TOKENS = {
  colors: {
    background: "#F1F4F9",
    borderDefault: "#D8D8D8",
    borderError: "#FF0000",
    borderFocused: "#60A5FA",
    text: "#202224",
    textMuted: "#A6A6A6",
    textPlaceholder: "#A6A6A6",
  },
  dimensions: {
    width: 399,
    height: 43,
    borderRadius: 7.5,
  },
  spacing: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    labelMarginBottom: 8,
    helperMarginTop: 6,
    iconSize: 20,
    iconSpacing: 12,
  },
} as const;

/**
 * Validation function type
 * Returns error message string or undefined if valid
 */
export type ValidationFunction = (value: string) => string | undefined;

/**
 * Common validation patterns
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/.+/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /.{8,}/,
} as const;

/**
 * Common validators
 */
export const VALIDATORS = {
  required: (fieldName: string): ValidationFunction =>
    (value) => !value ? `${fieldName} is required` : undefined,

  email: (): ValidationFunction =>
    (value) => !VALIDATION_PATTERNS.email.test(value) ? "Invalid email format" : undefined,

  minLength: (min: number): ValidationFunction =>
    (value) => value.length < min ? `Minimum ${min} characters required` : undefined,

  maxLength: (max: number): ValidationFunction =>
    (value) => value.length > max ? `Maximum ${max} characters allowed` : undefined,

  pattern: (pattern: RegExp, message: string): ValidationFunction =>
    (value) => !pattern.test(value) ? message : undefined,

  combine: (...validators: ValidationFunction[]): ValidationFunction =>
    (value) => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return undefined;
    },
} as const;
