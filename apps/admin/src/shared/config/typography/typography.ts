export const typographyConfig = {
  // Font families
  fontFamily: {
    sans: "Onest, system-ui, -apple-system, sans-serif",
    mono: "monospace",
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
    10: { size: "10px", lineHeight: "12px" },
    12: { size: "12px", lineHeight: "16px" },
    14: { size: "14px", lineHeight: "18px" },
    16: { size: "16px", lineHeight: "20px" },
    20: { size: "20px", lineHeight: "24px" },
    24: { size: "24px", lineHeight: "28px" },
  },

  // Typography variants matching your design
  variants: {
    // Regular variants
    regular_16: { weight: 400, size: "16px", lineHeight: "20px" },
    regular_14: { weight: 400, size: "14px", lineHeight: "18px" },
    regular_12: { weight: 400, size: "12px", lineHeight: "16px" },
    regular_10: { weight: 400, size: "10px", lineHeight: "12px" },

    // Medium variants
    medium_16: { weight: 500, size: "16px", lineHeight: "20px" },

    // Bold variants
    bold_24: { weight: 700, size: "24px", lineHeight: "28px" },
    bold_20: { weight: 700, size: "20px", lineHeight: "24px" },
    bold_16: { weight: 700, size: "16px", lineHeight: "20px" },
    bold_14: { weight: 700, size: "14px", lineHeight: "18px" },
    bold_12: { weight: 700, size: "12px", lineHeight: "16px" },
  },
} as const;

export type TypographyVariant = keyof typeof typographyConfig.variants;
export type FontWeight = keyof typeof typographyConfig.fontWeight;
export type FontSize = keyof typeof typographyConfig.fontSize;
