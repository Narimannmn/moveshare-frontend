import { z } from "zod";

export const ChatUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  isOnline: z.boolean().optional(),
  lastSeen: z.string().datetime().nullable().optional(),
});

export type ChatUser = z.infer<typeof ChatUserSchema>;
