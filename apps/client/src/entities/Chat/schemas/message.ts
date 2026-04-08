import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  isRead: z.boolean(),
});

export const MessageListSchema = z.array(MessageSchema);

export const SendMessageRequestSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

export type Message = z.infer<typeof MessageSchema>;
export type MessageList = z.infer<typeof MessageListSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
