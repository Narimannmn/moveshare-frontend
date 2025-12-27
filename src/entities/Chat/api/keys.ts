export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversationList: (filters?: string) =>
    [...chatKeys.conversations(), filters] as const,
  conversationDetail: (id: string) =>
    [...chatKeys.conversations(), "detail", id] as const,
  messages: () => [...chatKeys.all, "messages"] as const,
  messageList: (conversationId: string) =>
    [...chatKeys.messages(), "list", conversationId] as const,
  userSearch: () => [...chatKeys.all, "user-search"] as const,
  searchUsers: (query: string) => [...chatKeys.userSearch(), query] as const,
} as const;
