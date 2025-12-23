export const typographyConfig = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'monospace',
  },

  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Font sizes with line heights
  fontSize: {
    10: { size: '10px', lineHeight: 'auto' },
    12: { size: '12px', lineHeight: 'auto' },
    14: { size: '14px', lineHeight: 'auto' },
    16: { size: '16px', lineHeight: 'auto' },
    20: { size: '20px', lineHeight: 'auto' },
    24: { size: '24px', lineHeight: 'auto' },
  },

  // Typography variants matching your design
  variants: {
    // Regular variants
    regular_16: { weight: 400, size: '16px', lineHeight: 'auto' },
    regular_14: { weight: 400, size: '14px', lineHeight: 'auto' },
    regular_12: { weight: 400, size: '12px', lineHeight: 'auto' },
    regular_10: { weight: 400, size: '10px', lineHeight: 'auto' },

    // Medium variants
    medium_16: { weight: 500, size: '16px', lineHeight: 'auto' },

    // Bold variants
    bold_24: { weight: 700, size: '24px', lineHeight: 'auto' },
    bold_20: { weight: 700, size: '20px', lineHeight: 'auto' },
    bold_16: { weight: 700, size: '16px', lineHeight: 'auto' },
    bold_14: { weight: 700, size: '14px', lineHeight: 'auto' },
    bold_12: { weight: 700, size: '12px', lineHeight: 'auto' },
  },
} as const;

export type TypographyVariant = keyof typeof typographyConfig.variants;
export type FontWeight = keyof typeof typographyConfig.fontWeight;
export type FontSize = keyof typeof typographyConfig.fontSize;
