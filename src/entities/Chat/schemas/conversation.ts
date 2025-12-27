import { z } from "zod";
import { ChatUserSchema } from "./user";

export const LastMessageSchema = z.object({
  content: z.string(),
  createdAt: z.string().datetime(),
  senderId: z.string(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  participants: z.array(ChatUserSchema),
  lastMessage: LastMessageSchema.nullable().optional(),
  unreadCount: z.number().default(0),
  updatedAt: z.string().datetime(),
});

export const ConversationListSchema = z.array(ConversationSchema);

export type LastMessage = z.infer<typeof LastMessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type ConversationList = z.infer<typeof ConversationListSchema>;
