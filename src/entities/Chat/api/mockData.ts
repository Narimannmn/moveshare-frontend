import type { ChatUser, Conversation, Message } from "../schemas";

// Mock users for search and conversations
export const mockUsers: ChatUser[] = [
  {
    id: "1",
    name: "You (Current User)",
    avatar: null,
    isOnline: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: null,
    isOnline: false,
    lastSeen: "2025-01-20T10:30:00Z",
  },
  {
    id: "3",
    name: "Alice Johnson",
    avatar: null,
    isOnline: true,
  },
  {
    id: "4",
    name: "Bob Wilson",
    avatar: null,
    isOnline: false,
    lastSeen: "2025-01-19T20:00:00Z",
  },
  {
    id: "5",
    name: "Charlie Brown",
    avatar: null,
    isOnline: true,
  },
  {
    id: "6",
    name: "Diana Prince",
    avatar: null,
    isOnline: false,
    lastSeen: "2025-01-21T08:15:00Z",
  },
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [mockUsers[0], mockUsers[1]], // You + Jane
    lastMessage: {
      content: "Hey, how are you?",
      createdAt: "2025-01-25T15:45:00Z",
      senderId: "2",
    },
    unreadCount: 2,
    updatedAt: "2025-01-25T15:45:00Z",
  },
  {
    id: "2",
    participants: [mockUsers[0], mockUsers[2]], // You + Alice
    lastMessage: {
      content: "Let's meet tomorrow at 3 PM",
      createdAt: "2025-01-25T14:30:00Z",
      senderId: "1",
    },
    unreadCount: 0,
    updatedAt: "2025-01-25T14:30:00Z",
  },
  {
    id: "3",
    participants: [mockUsers[0], mockUsers[3]], // You + Bob
    lastMessage: {
      content: "Thanks for your help!",
      createdAt: "2025-01-24T18:20:00Z",
      senderId: "4",
    },
    unreadCount: 1,
    updatedAt: "2025-01-24T18:20:00Z",
  },
  {
    id: "4",
    participants: [mockUsers[0], mockUsers[4]], // You + Charlie
    lastMessage: {
      content: "See you soon!",
      createdAt: "2025-01-24T12:00:00Z",
      senderId: "1",
    },
    unreadCount: 0,
    updatedAt: "2025-01-24T12:00:00Z",
  },
];

// Mock messages by conversation ID
export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "msg-1-1",
      conversationId: "1",
      senderId: "1",
      content: "Hello Jane!",
      createdAt: "2025-01-25T14:30:00Z",
      isRead: true,
    },
    {
      id: "msg-1-2",
      conversationId: "1",
      senderId: "2",
      content: "Hi! How are you doing?",
      createdAt: "2025-01-25T14:35:00Z",
      isRead: true,
    },
    {
      id: "msg-1-3",
      conversationId: "1",
      senderId: "1",
      content: "I'm good, thanks! Just working on a new project.",
      createdAt: "2025-01-25T14:40:00Z",
      isRead: true,
    },
    {
      id: "msg-1-4",
      conversationId: "1",
      senderId: "2",
      content: "That's great! What are you working on?",
      createdAt: "2025-01-25T15:30:00Z",
      isRead: false,
    },
    {
      id: "msg-1-5",
      conversationId: "1",
      senderId: "2",
      content: "Hey, how are you?",
      createdAt: "2025-01-25T15:45:00Z",
      isRead: false,
    },
  ],
  "2": [
    {
      id: "msg-2-1",
      conversationId: "2",
      senderId: "3",
      content: "Hey! Do you have time tomorrow?",
      createdAt: "2025-01-25T13:00:00Z",
      isRead: true,
    },
    {
      id: "msg-2-2",
      conversationId: "2",
      senderId: "1",
      content: "Yes, I'm free after 2 PM",
      createdAt: "2025-01-25T13:15:00Z",
      isRead: true,
    },
    {
      id: "msg-2-3",
      conversationId: "2",
      senderId: "3",
      content: "Perfect! How about 3 PM at the coffee shop?",
      createdAt: "2025-01-25T13:20:00Z",
      isRead: true,
    },
    {
      id: "msg-2-4",
      conversationId: "2",
      senderId: "1",
      content: "Let's meet tomorrow at 3 PM",
      createdAt: "2025-01-25T14:30:00Z",
      isRead: true,
    },
  ],
  "3": [
    {
      id: "msg-3-1",
      conversationId: "3",
      senderId: "1",
      content: "Bob, can you help me with the deployment?",
      createdAt: "2025-01-24T17:00:00Z",
      isRead: true,
    },
    {
      id: "msg-3-2",
      conversationId: "3",
      senderId: "4",
      content: "Sure! What do you need?",
      createdAt: "2025-01-24T17:15:00Z",
      isRead: true,
    },
    {
      id: "msg-3-3",
      conversationId: "3",
      senderId: "1",
      content: "I'm getting an error with the build process",
      createdAt: "2025-01-24T17:20:00Z",
      isRead: true,
    },
    {
      id: "msg-3-4",
      conversationId: "3",
      senderId: "4",
      content: "Thanks for your help!",
      createdAt: "2025-01-24T18:20:00Z",
      isRead: false,
    },
  ],
  "4": [
    {
      id: "msg-4-1",
      conversationId: "4",
      senderId: "5",
      content: "Hey! Want to grab lunch?",
      createdAt: "2025-01-24T11:00:00Z",
      isRead: true,
    },
    {
      id: "msg-4-2",
      conversationId: "4",
      senderId: "1",
      content: "Yes! Where do you want to go?",
      createdAt: "2025-01-24T11:15:00Z",
      isRead: true,
    },
    {
      id: "msg-4-3",
      conversationId: "4",
      senderId: "5",
      content: "How about the new Italian place?",
      createdAt: "2025-01-24T11:30:00Z",
      isRead: true,
    },
    {
      id: "msg-4-4",
      conversationId: "4",
      senderId: "1",
      content: "See you soon!",
      createdAt: "2025-01-24T12:00:00Z",
      isRead: true,
    },
  ],
};
