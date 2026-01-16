import {
  type ChatUser,
  type Conversation,
  ConversationListSchema,
  type Message,
  MessageListSchema,
} from "../schemas";
import { mockConversations, mockMessages, mockUsers } from "./mockData";

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    await delay(300); // Simulate network delay

    // Validate with Zod
    const validated = ConversationListSchema.parse(mockConversations);
    return validated;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const getConversationById = async (id: string): Promise<Conversation | null> => {
  try {
    await delay(200);

    const conversation = mockConversations.find((conv) => conv.id === id);
    return conversation || null;
  } catch (error) {
    console.error(`Error fetching conversation ${id}:`, error);
    throw error;
  }
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    await delay(400);

    const messages = mockMessages[conversationId] || [];

    // Validate with Zod
    const validated = MessageListSchema.parse(messages);
    return validated;
  } catch (error) {
    console.error(`Error fetching messages for conversation ${conversationId}:`, error);
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<ChatUser[]> => {
  try {
    await delay(200);

    if (!query.trim()) {
      return mockUsers.filter((user) => user.id !== "1"); // Exclude current user
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = mockUsers.filter(
      (user) =>
        user.id !== "1" && // Exclude current user
        user.name.toLowerCase().includes(lowercaseQuery)
    );

    return filtered;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Mock send message (will be replaced with WebSocket)
export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  try {
    await delay(300);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "1", // Current user
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Add to mock data
    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    // Update conversation's last message
    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = {
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        senderId: newMessage.senderId,
      };
      conversation.updatedAt = newMessage.createdAt;
    }

    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
