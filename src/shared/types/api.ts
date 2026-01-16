import { z } from "zod";

export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
});

export const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema).optional(),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type HTTPValidationError = z.infer<typeof HTTPValidationErrorSchema>;
