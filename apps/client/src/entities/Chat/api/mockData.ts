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
    name: "NorthStar Movers",
    avatar: null,
    isOnline: false,
    lastSeen: "2025-01-25T10:30:00Z",
  },
  {
    id: "3",
    name: "Peak Movers",
    avatar: null,
    isOnline: true,
  },
  {
    id: "4",
    name: "TransAtlantic Logistics",
    avatar: null,
    isOnline: false,
    lastSeen: "2025-01-19T20:00:00Z",
  },
  {
    id: "5",
    name: "Summit Freight",
    avatar: null,
    isOnline: true,
  },
  {
    id: "6",
    name: "Pacific Haulers",
    avatar: null,
    isOnline: false,
    lastSeen: "2025-01-21T08:15:00Z",
  },
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [mockUsers[0], mockUsers[1]], // You + NorthStar Movers
    lastMessage: {
      content: "Do you have the bill of lading ready?",
      createdAt: "2025-01-25T10:30:00Z",
      senderId: "2",
    },
    unreadCount: 0,
    updatedAt: "2025-01-25T10:30:00Z",
  },
  {
    id: "2",
    participants: [mockUsers[0], mockUsers[2]], // You + Peak Movers
    lastMessage: {
      content: "Can we reschedule for Friday instead?",
      createdAt: "2025-01-24T14:30:00Z",
      senderId: "3",
    },
    unreadCount: 0,
    updatedAt: "2025-01-24T14:30:00Z",
  },
  {
    id: "3",
    participants: [mockUsers[0], mockUsers[3]], // You + TransAtlantic Logistics
    lastMessage: {
      content: "Can we reschedule for Friday?",
      createdAt: "2025-07-28T18:20:00Z",
      senderId: "4",
    },
    unreadCount: 5,
    updatedAt: "2025-07-28T18:20:00Z",
  },
  {
    id: "4",
    participants: [mockUsers[0], mockUsers[4]], // You + Summit Freight
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
      senderId: "2",
      content:
        "Hi there! We're interested in claiming your Chicago to Indianapolis job. Can you confirm the exact dimensions?",
      createdAt: "2025-01-25T18:30:00Z",
      isRead: true,
    },
    {
      id: "msg-1-2",
      conversationId: "1",
      senderId: "1",
      content:
        "Hi there! We're interested in claiming your Chicago to Indianapolis job. Can you confirm the exact dimensions?",
      createdAt: "2025-01-25T18:30:00Z",
      isRead: true,
    },
    {
      id: "msg-1-3",
      conversationId: "1",
      senderId: "2",
      content:
        "Perfect! We have a 40' trailer returning empty on that route. We can offer $1,850 for the job.",
      createdAt: "2025-01-25T18:30:00Z",
      isRead: true,
    },
    {
      id: "msg-1-4",
      conversationId: "1",
      senderId: "1",
      content:
        "That works for us. I'll mark it as claimed in the system. The pickup details are all in the job listing - let me know if you need anything else.",
      createdAt: "2025-01-25T18:30:00Z",
      isRead: true,
    },
    {
      id: "msg-1-5",
      conversationId: "1",
      senderId: "2",
      content:
        "Great! We'll send our driver info once the deposit clears. Looking forward to working with you.",
      createdAt: "2025-01-25T18:30:00Z",
      isRead: true,
    },
  ],
  "2": [
    {
      id: "msg-2-1",
      conversationId: "2",
      senderId: "3",
      content: "Hey! Do you have time to discuss the shipment details?",
      createdAt: "2025-01-24T13:00:00Z",
      isRead: true,
    },
    {
      id: "msg-2-2",
      conversationId: "2",
      senderId: "1",
      content: "Yes, I'm available. What do you need?",
      createdAt: "2025-01-24T13:15:00Z",
      isRead: true,
    },
    {
      id: "msg-2-3",
      conversationId: "2",
      senderId: "3",
      content: "Can we reschedule for Friday instead?",
      createdAt: "2025-01-24T14:30:00Z",
      isRead: true,
    },
  ],
  "3": [
    {
      id: "msg-3-1",
      conversationId: "3",
      senderId: "4",
      content:
        "Hi there! We're interested in claiming your Chicago to Indianapolis job. Can you confirm the exact dimensions?",
      createdAt: "2025-07-28T17:00:00Z",
      isRead: true,
    },
    {
      id: "msg-3-2",
      conversationId: "3",
      senderId: "1",
      content:
        "Hi there! We're interested in claiming your Chicago to Indianapolis job. Can you confirm the exact dimensions?",
      createdAt: "2025-07-28T17:30:00Z",
      isRead: true,
    },
    {
      id: "msg-3-3",
      conversationId: "3",
      senderId: "4",
      content:
        "Perfect! We have a 40' trailer returning empty on that route. We can offer $1,850 for the job.",
      createdAt: "2025-07-28T17:45:00Z",
      isRead: true,
    },
    {
      id: "msg-3-4",
      conversationId: "3",
      senderId: "1",
      content:
        "That works for us. I'll mark it as claimed in the system. The pickup details are all in the job listing - let me know if you need anything else.",
      createdAt: "2025-07-28T18:00:00Z",
      isRead: true,
    },
    {
      id: "msg-3-5",
      conversationId: "3",
      senderId: "4",
      content:
        "Great! We'll send our driver info once the deposit clears. Looking forward to working with you.",
      createdAt: "2025-07-28T18:20:00Z",
      isRead: false,
    },
  ],
  "4": [
    {
      id: "msg-4-1",
      conversationId: "4",
      senderId: "5",
      content: "Hey! We have capacity for your next load.",
      createdAt: "2025-01-24T11:00:00Z",
      isRead: true,
    },
    {
      id: "msg-4-2",
      conversationId: "4",
      senderId: "1",
      content: "Great! What routes are you covering?",
      createdAt: "2025-01-24T11:15:00Z",
      isRead: true,
    },
    {
      id: "msg-4-3",
      conversationId: "4",
      senderId: "5",
      content: "We run the Midwest corridor weekly.",
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
