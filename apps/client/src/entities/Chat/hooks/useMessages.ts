import { useQuery } from "@tanstack/react-query";

import { messagesQueryOptions } from "../api";

export const useMessages = (conversationId: string | null) => {
  return useQuery(messagesQueryOptions(conversationId));
};
