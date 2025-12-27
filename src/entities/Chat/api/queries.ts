import { queryOptions } from "@tanstack/react-query";
import { chatKeys } from "./keys";
import { getConversations, getMessages } from "./services";

export const conversationsQueryOptions = () =>
  queryOptions({
    queryKey: chatKeys.conversationList(),
    queryFn: () => getConversations(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

export const messagesQueryOptions = (conversationId: string | null) =>
  queryOptions({
    queryKey: conversationId
      ? chatKeys.messageList(conversationId)
      : chatKeys.messages(),
    queryFn: () => {
      if (!conversationId) {
        return Promise.resolve([]);
      }
      return getMessages(conversationId);
    },
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000,
  });
