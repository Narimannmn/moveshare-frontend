import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { apiClient } from "@/shared/api/client";
import { getJwtSubject } from "@/shared/utils/jwt/getJwtSubject";

import {
  type ChatUser,
  ConversationListSchema,
  type Conversation,
  MessageListSchema,
  type Message,
  MessageSchema,
  SendMessageRequestSchema,
} from "../schemas";

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get("/api/v1/chat/conversations");
    return ConversationListSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const getConversationById = async (id: string): Promise<Conversation | null> => {
  try {
    const conversations = await getConversations();
    return conversations.find((conversation) => conversation.id === id) ?? null;
  } catch (error) {
    console.error(`Error fetching conversation ${id}:`, error);
    throw error;
  }
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const response = await apiClient.get(`/api/v1/chat/conversations/${conversationId}/messages`);
    return MessageListSchema.parse(response.data);
  } catch (error) {
    console.error(`Error fetching messages for conversation ${conversationId}:`, error);
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<ChatUser[]> => {
  try {
    const conversations = await getConversations();
    const accessToken = useAuthStore.getState().accessToken;
    const currentUserId = getJwtSubject(accessToken);

    const usersMap = new Map<string, ChatUser>();
    for (const conversation of conversations) {
      for (const participant of conversation.participants) {
        if (currentUserId && participant.id === currentUserId) continue;
        usersMap.set(participant.id, participant);
      }
    }

    const users = Array.from(usersMap.values());
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return users;

    return users.filter((user) => user.name.toLowerCase().includes(trimmed));
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  try {
    const validated = SendMessageRequestSchema.parse({ content });
    const response = await apiClient.post(`/api/v1/chat/conversations/${conversationId}/messages`, validated);
    return MessageSchema.parse(response.data);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
